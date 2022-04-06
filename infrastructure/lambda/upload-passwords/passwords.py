import boto3
import hashlib
import json
import os
import uuid

MAX_COOKIES = 3

def clear_cookies(cookies_table, passwords_table, salt, password):
  pass_item = get_password_item(passwords_table, salt, password)
  if not pass_item:
    return False

  cookies = get_cookies(cookies_table, pass_item['id'])
  if len(cookies) == 0:
    return False

  for cookie in cookies:
    cookies_table.delete_item(Key={ 'cookie': cookie })

  return True

def get_cookies(table, password_id):
  scan = table.scan(
      FilterExpression='password_id = :password_id',
      ExpressionAttributeValues={
        ':password_id': password_id,
      }
  )
  return [c['cookie'] for c in scan['Items']]

def get_password_item(table, salt, password):
  # no query necessary, password is the primary key
  pass_hash = hash_password(salt, password)
  pass_data = table.get_item(Key={ 'password': pass_hash })

  return pass_data.get('Item')

def get_secrets():
  sm = boto3.client('secretsmanager')
  secret_data = sm.get_secret_value(SecretId=os.getenv('SECRETS_ARN'))
  if 'SecretString' not in secret_data:
    return None

  return json.loads(secret_data['SecretString'])

def hash_password(salt, password):
  return hashlib.sha256(salt.encode('utf-8') + password.encode('utf-8')).hexdigest()

def new_password(table, salt, password):
  existing = get_password_item(table, salt, password)
  if existing:
    return False

  pass_item = {
    'enabled': True,
    'id': str(uuid.uuid4()),
    'password': hash_password(salt, password),
  }
  table.put_item(Item=pass_item)
  return True

def password_set_enabled(table, salt, password, enabled):
  pass_item = get_password_item(table, salt, password)
  if not pass_item:
    return False

  if pass_item['enabled'] == enabled:
    return False

  table.update_item(
    Key={ 'password': pass_item['password'] },
    UpdateExpression='set enabled = :e',
    ExpressionAttributeValues = { ':e': enabled },
  )
  return True

def lambda_handler(event, context):
  dynamo = boto3.resource('dynamodb')
  cookies_table = dynamo.Table(os.getenv('DYNAMO_COOKIES_TABLE'))
  passwords_table = dynamo.Table(os.getenv('DYNAMO_PASSWORDS_TABLE'))
  secrets = get_secrets()
  if not secrets:
    raise Exception('cannot fetch my secrets')
  salt = secrets['salt']

  res = {}
  for action, passwords in event.items():
    if type(passwords) != list:
      raise ValueError(f'action {action} must point to a list')

    if action == 'new':
      res['new'] = {'added': [], 'skipped': []}
      for password in passwords:
        if new_password(passwords_table, salt, password):
          res['new']['added'].append(password)
        else:
          res['new']['skipped'].append(password)

    elif action == 'disable':
      res['disable'] = {'disabled': [], 'skipped': []}
      for password in passwords:
        if password_set_enabled(passwords_table, salt, password, False):
          res['disable']['disabled'].append(password)
        else:
          res['disable']['skipped'].append(password)

    elif action == 'enable':
      res['enable'] = {'enabled': [], 'skipped': []}
      for password in passwords:
        if password_set_enabled(passwords_table, salt, password, True):
          res['enable']['enabled'].append(password)
        else:
          res['enable']['skipped'].append(password)

    elif action == 'get':
      res['get'] = {}
      for password in passwords:
        pass_item = get_password_item(passwords_table, salt, password)
        if pass_item:
          del pass_item['password']
          # look up related cookies
          pass_item['cookies'] = get_cookies(cookies_table, pass_item['id'])
        res['get'][password] = pass_item

    elif action == 'clear':
      res['clear'] = {'cleared': [], 'skipped': []}
      for password in passwords:
        if clear_cookies(cookies_table, passwords_table, salt, password):
          res['clear']['cleared'].append(password)
        else:
          res['clear']['skipped'].append(password)

    else:
      raise ValueError(f'unknown action {action}')

  return res
