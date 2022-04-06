# Github Secrets

## Cloudflare

### CLOUDFLARE_API_TOKEN_*

- CLOUDFLARE_API_TOKEN_DEV (dev acct: )
- CLOUDFLARE_API_TOKEN_PROD (prod acct: )

Create an API token in the relevant Cloudflare account.

Token name in Cloudflare: GitHub (dev|prod)

Permissions:
  - Account / Access: Organizations, Identity Providers, and Groups / Edit
  - Account / Workers Scripts / Edit
  - Zone / Cache Purge / Purge
  - Zone / DNS / Edit
  - Zone / Page Rules / Edit
  - Zone / Workers Routes / Edit
  - Zone / Zone / Edit
  - Zone / Zone Settings / Edit

Account resources:
  - Include / <dev or prod acct>

Zone resources:
  - Include / All zones

### CLOUDFLARE_ZONE_ID_*

- CLOUDFLARE_ZONE_ID_DEV (dev acct: )
- CLOUDFLARE_ZONE_ID_PROD (prod acct: )

Populate with the zone ID (find on the main "Websites" -> domain page on the bottom right)
