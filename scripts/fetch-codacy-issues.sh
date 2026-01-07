#!/usr/bin/env bash
set -euo pipefail

if [ ! -f .env ]; then
  echo "Missing .env file. Please create one with CODACY_ACCOUNT_TOKEN, CODACY_ORG, CODACY_REPO." >&2
  exit 1
fi

set -a
source .env
set +a

: "${CODACY_ACCOUNT_TOKEN:?Need CODACY_ACCOUNT_TOKEN in .env}"
: "${CODACY_ORG:?Need CODACY_ORG in .env}"
: "${CODACY_REPO:?Need CODACY_REPO in .env}"
CODACY_PROVIDER=${CODACY_PROVIDER:-gh}

# Note: Codacy API v3 uses cursor-based pagination. 
# This script fetches the first page of results.
# 'PAGE' argument is ignored as random access is not supported.
PER_PAGE=${2:-100}
OUTPUT=${3:-codacy-issues.json}

echo "Fetching Codacy issues for ${CODACY_PROVIDER}/${CODACY_ORG}/${CODACY_REPO} (limit ${PER_PAGE})..."
RESPONSE=$(mktemp)

HTTP_STATUS=$(curl -sSL \
  -X POST \
  -w '%{http_code}' \
  -H "api-token: ${CODACY_ACCOUNT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{}' \
  "https://app.codacy.com/api/v3/analysis/organizations/${CODACY_PROVIDER}/${CODACY_ORG}/repositories/${CODACY_REPO}/issues/search?limit=${PER_PAGE}" \
  -o "$RESPONSE")

if [ "$HTTP_STATUS" -ne 200 ]; then
  echo "Codacy API responded with HTTP $HTTP_STATUS" >&2
  echo "Response body:" >&2
  cat "$RESPONSE" >&2
  rm -f "$RESPONSE"
  exit 1
fi

mv "$RESPONSE" "$OUTPUT"
echo "Wrote issues to $OUTPUT"
