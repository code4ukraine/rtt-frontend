# Upload Login Flow

- User hits https://upload.example.com/user-login?password=$password (GET)
-- password must exist in passwords table
-- password must be enabled
-- password must not already have MAX_COOKIES (3) cookies set
-- failures will generate a 401
-- if a cookie is passed in and valid, that cookie is re-used (no new one generated)
-- if no existing cookie, generate a new login cookie value (uuid4)
-- store in cookies table associated with password
-- `uploader` host cookie set to a token, this cookie is associated with the password
-- `SignedInHint` domain cookie set to `1`

- User hits https://example.com/
-- `SignedInHint` cookie forces a red banner at the top inviting the user to contribute
-- form POSTs to https://upload.example.com/user-upload
-- user-upload lambda verifies `uploader` cookie exists in cookies table
-- user-upload lambda verifies the linked password is marked as enabled
-- failures will generate a 401
-- if cookie is valid and the rest of the body is valid, persist report to dynamodb,
   store picture in s3 if provided, and return a 200
