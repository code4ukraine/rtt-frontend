import boto3
from decimal import Decimal
import hashlib
from http import cookies
import json
import logging
import logging.config
import os
import time
import uuid

from pythonjsonlogger import jsonlogger

COOKIE_EXPIRE = 'Thu, 01 Jan 2037 00:00:00 GMT'
HINT_COOKIE_NAME = 'SignedInHint'
LOGIN_COOKIE_NAME = 'uploader'
MAX_COOKIES = 3

class PasswordError(Exception): pass

def get_cookie(password_hash, cookie_jar):
  '''
  Check for a valid password, and return an authorized cookie.

  If an uploader cookie is present, see if it is a known cookie that is associated
  with the current (valid) password. If it's not, set a new cookie.
  '''

  dynamodb = boto3.resource('dynamodb')
  cookies_table = dynamodb.Table(os.getenv('DYNAMO_COOKIES_TABLE'))
  passwords_table = dynamodb.Table(os.getenv('DYNAMO_PASSWORDS_TABLE'))

  pass_data = passwords_table.get_item(Key={ 'password': password_hash })
  if 'Item' not in pass_data:
    raise PasswordError('invalid password')

  pass_item = pass_data['Item']
  if not pass_item['enabled']:
    raise PasswordError('disabled password')

  # If the existing cookie is valid and associated with the given password,
  # auth and re-issue the same cookie.
  if LOGIN_COOKIE_NAME in cookie_jar:
    cookie = cookie_jar[LOGIN_COOKIE_NAME].value
    cookie_data = cookies_table.get_item(Key={ 'cookie': cookie })
    if 'Item' in cookie_data:
      cookie_item = cookie_data['Item']
      if cookie_item['password_id'] == pass_item['id']:
        return cookie

  # if we got here, there is either no login cookie set or an invalid one
  cookie = str(uuid.uuid4())

  # don't exceed maximum number of cookies for a password
  # TODO(fetep): think about the race condition here, can we limit in put_item?
  scan = cookies_table.scan(
    FilterExpression='password_id = :password_id',
    ExpressionAttributeValues={
      ':password_id': pass_item['id'],
    },
  )
  if scan['Count'] >= MAX_COOKIES:
    raise PasswordError(f'already at the maximum number of cookies ({MAX_COOKIES})')

  # store our new cookie as authorized against this password
  cookies_table.put_item(Item={
    'cookie': cookie,
    'created_at': Decimal(time.time()),
    'password_id': pass_item['id'],
  })

  return cookie

def get_secrets():
  sm = boto3.client('secretsmanager')
  secret_data = sm.get_secret_value(SecretId=os.getenv('SECRETS_ARN'))
  if 'SecretString' not in secret_data:
    return None

  return json.loads(secret_data['SecretString'])

def response(code, message):
  return {
    'statusCode': code,
    'body': json.dumps({'message': message}),
  }

def lambda_handler(event, context):
  '''
  We expect a GET directly from a user logging in, and set a cookie associated
  with the provided password (if valid).

  URL params:
    password (string)
  '''

  logging.config.fileConfig('logging.ini')
  logger = logging.getLogger()

  zone = event['headers']['cf-worker']
  params = event.get('queryStringParameters', {})
  password = params.get('password', '')
  if password == '':
    logger.warning('login failed', extra={
      'password_hash': '',
      'reason': 'no password provided',
    })
    return response(401, 'Not authorized')

  secrets = get_secrets()
  if not secrets:
    raise Exception('cannot fetch my secrets')
  salt = secrets['salt']
  password_hash = hashlib.sha256(salt.encode('utf-8') +
                                 password.encode('utf-8')).hexdigest()

  cookie_jar = cookies.SimpleCookie()
  if 'cookies' in event:
    for cookie in event['cookies']:
      cookie_jar.load(cookie)

  try:
    cookie = get_cookie(password_hash, cookie_jar)
  except PasswordError as e:
    logger.warning('login failed', extra={
      'password_hash': password_hash,
      'reason': str(e),
    })
    return response(401, 'Not authorized')

  logging.info('successful login', extra={
    'cookie': cookie,
    'password_hash': password_hash,
  })

  return {
    'statusCode': 302,
    'cookies': [
      f'{LOGIN_COOKIE_NAME}={cookie}; Secure; HttpOnly; Expires={COOKIE_EXPIRE}',
      f'{HINT_COOKIE_NAME}=1; Secure; domain={zone}; Expires={COOKIE_EXPIRE}',
    ],
    'headers': {
      'Location': f'https://{zone}/',
    },
    'body': '{}',
  }
