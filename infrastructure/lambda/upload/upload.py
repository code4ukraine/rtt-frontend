import base64
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal
from http import cookies
from io import BytesIO
import json
import logging
import logging.config
import os
import re
import time
import uuid

from exif import Image
from pythonjsonlogger import jsonlogger

COOKIE_NAME = 'uploader'
LOCATION_RE = re.compile('lat: (-?[0-9]*\.[0-9]*), lon: (-?[0-9]*\.[0-9]*)')
MAX_COOKIES = 3

class CookieError(Exception):
  pass

def lookup_cookie(cookies_table, passwords_table, cookie):
  '''
  Lookup the related password id for an uploader cookie.

  Raises a CookieError for an invalid cookie.
  '''
  logger = logging.getLogger()

  if cookie == '':
    raise CookieError('empty cookie')

  cookie_data = cookies_table.get_item(Key={ 'cookie': cookie })
  if 'Item' not in cookie_data:
    raise CookieError('not in database')

  cookie_item = cookie_data['Item']
  pass_data = passwords_table.query(
    IndexName='IdIndex',
    KeyConditionExpression=Key('id').eq(cookie_item['password_id']),
  )
  if pass_data['Count'] == 0:
    raise CookieError('found cookie but missing password')
  elif pass_data['Count'] > 1:
    raise CookieError('more than one password matched password_id')

  pass_item = pass_data['Items'][0]
  if not pass_item['enabled']:
    raise CookieError('password disabled')

  # TODO(fetep): log if we ever see a password entry with >MAX_COOKIES cookies?

  return cookie_item['password_id']

def decimal_coords(coords, ref):
  '''Turn degrees/minutes/seconds + direction into degrees'''
  decimal_degrees = coords[0] + coords[1] / 60 + coords[2] / 3600
  if ref == 'S' or ref == 'W':
    decimal_degrees = -decimal_degrees
  return str(round(decimal_degrees, 3))

def get_exif_lat_lon(encoded_data):
  '''Extract lat/lon from EXIF image data'''
  img = Image(BytesIO(base64.b64decode(encoded_data)))
  if not img.has_exif:
    return {}

  exif_keys = img.list_all()
  required = [
    'gps_latitude',
    'gps_latitude_ref',
    'gps_longitude',
    'gps_longitude_ref',
  ]
  # we need all 4 exif tags to calculate lat/lon
  res = {}
  for key in required:
    if key not in exif_keys:
      return {}
    res[key] = img[key]

  lat = decimal_coords(img.gps_latitude, img.gps_latitude_ref)
  lon = decimal_coords(img.gps_longitude, img.gps_longitude_ref)
  return {'lat': lat, 'lon': lon}

def response(code, message):
  return {
    'statusCode': code,
    'body': json.dumps({'message': message}),
  }

def lambda_handler(event, context):
  '''
  We expect a POST from a browser filling out a form.

  params:
    description (string)
    location (string)
    photo (data: URI with photo)
    sightings (map, string->int)
    time (free-form string)
  '''

  start = time.time()
  log_extra = {}

  logging.config.fileConfig('logging.ini')
  logger = logging.getLogger()

  data = json.loads(event['body'])

  # validate input
  required_keys = [
    'description',
    'location',
    'sightings',
    'time',
  ]
  for key in required_keys:
    if key not in data:
      return response(400, f'missing {key}')

  dynamo = boto3.resource('dynamodb')
  cookies_table = dynamo.Table(os.getenv('DYNAMO_COOKIES_TABLE'))
  passwords_table = dynamo.Table(os.getenv('DYNAMO_PASSWORDS_TABLE'))

  cookie_jar = cookies.SimpleCookie()
  if 'cookies' in event:
    for cookie in event['cookies']:
      cookie_jar.load(cookie)

  # if we don't have an uploader cookie, bail. User needs to hit upload-login first.
  if not cookie_jar.get(COOKIE_NAME):
    logger.warning('invalid cookie', extra={'cookie': '', 'reason': 'no cookie present'})
    return response(401, 'Not authorized')

  cookie = cookie_jar[COOKIE_NAME].value
  try:
    pass_id = lookup_cookie(cookies_table, passwords_table, cookie)
  except CookieError as e:
    logger.warning('invalid cookie', extra={'cookie': cookie, 'reason': str(e)})
    return response(401, 'Not authorized')

  # uuid for the dynamo entry and s3 file name
  _id = str(uuid.uuid4())

  # save metadata to dynamodb
  table = dynamo.Table(os.getenv('DYNAMO_UPLOADS_TABLE'))
  item = {
    'cookie': cookie,
    'created_at': Decimal(time.time()),
    'description': data['description'],
    'event_type': 'Sighting',
    'id': _id,
    'password_id': pass_id,
    'sightings': data['sightings'],
    'source': 'User Uploaded',
    'status': '',
    'timeStamp': data['time'],
  }

  # Location is a hash with three possible keys: lat, long, description.
  # If our input has a lat/long, populate those keys, else description.
  location = {}
  latlong = re.match(LOCATION_RE, data['location'])
  if latlong:
    location['lat'] = latlong[1]
    location['lon'] = latlong[2]
    location['description'] = ''
  else:
    location['lat'] = ''
    location['lon'] = ''
    location['description'] = data['location']

  item['location'] = location

  # save photo to s3
  if type(data['photo']) == str and data['photo'] != '':
    log_extra['photo'] = {}
    s3 = boto3.resource('s3')
    s3_path = f'{pass_id}/{_id}'
    img_hostname = os.getenv('IMG_HOSTNAME')
    photo_url = f'https://{img_hostname}/{s3_path}'

    # the photo should come as: data:image/jpeg;base64,<data>
    # validate we have a base64 encoded image.
    meta, content = data['photo'].split(';', 1)
    _, content_type = meta.split(':', 1)
    if not content_type.startswith('image/'):
      print(f'invalid photo mime type: {content_type}')
      return response(400, 'Invalid photo type')
    log_extra['photo']['content_type'] = content_type

    encoding, encoded_data = content.split(',', 1)
    if encoding != 'base64':
      print(f'invalid photo encoding: {encoding}')
      return response(400, 'Invalid photo encoding')

    try:
      item['photo_location'] = get_exif_lat_lon(encoded_data)
    except Exception as e:
      item['photo_location'] = {}
      print(f'failed to get exif data: {e}')

    photo_data = base64.b64decode(encoded_data)
    log_extra['photo']['size'] = len(photo_data)
    s3obj = s3.Object(os.getenv('S3_BUCKET'), s3_path)
    s3obj.put(
        Body=photo_data,
        ContentType=content_type,
        ContentDisposition="inline",
    )
    item['photo'] = photo_url
  else:
    item['photo'] = ''

  table.put_item(Item=item)

  log_extra['duration'] = time.time() - start
  log_extra['item'] = item

  logger.info('New upload saved', extra=log_extra)
  return {
    'statusCode': 200,
    'headers': {
      'Set-Cookie': '='.join([COOKIE_NAME, cookie_jar[COOKIE_NAME].value]),
    },
    'body': json.dumps({'item_id': _id}),
  }
