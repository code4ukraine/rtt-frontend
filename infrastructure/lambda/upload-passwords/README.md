# Managing User Upload Passwords

Passwords are managed by two lambdas: `dev-upload-passwords` and `prod-upload-passwords`.

The lambda is intended to be invoked using awscli. The payload should be a json object,
where keys are the action name and values are a list of passwords to operate on. The
response body will be a json object where keys are the action name and values are hashmaps
of the action results.

## Actions

### clear

Clear all known cookies associated with a password.

### disable

Set enabled=false on the password entry to disable uploads.

### enable

Set enabled=false on the password entry to disable uploads.

### get

Return a copy of the password record (without the hashed password). Useful to debug
a cookie issue.

### new

Create new passwords.

## Example Usage

Add two new passwords, and disable an existing one:

```console
$ cat pw.json
{
  "new": ["newpw1", "newpw2"],
  "disable": ["oldpw1"]
}

$ aws lambda invoke --function-name dev-upload-passwords --payload "$(cat pw.json)" --cli-binary-format raw-in-base64-out /dev/stdout
{"new": {"added": ["newpw1", "newpw2"], "skipped": []}, "disable": {"disabled": ["oldpw1"], "skipped": []}}{
    "StatusCode": 200,
    "ExecutedVersion": "$LATEST"
}


```
