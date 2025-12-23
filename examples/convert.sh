#!/bin/bash
#
# FileConvertLab API - Bash/cURL Example
# https://fileconvertlab.com/developers/api
#

API_KEY="sk_live_your_api_key_here"
BASE_URL="https://fileconvertlab.com/api/v1"

if [ $# -ne 3 ]; then
    echo "Usage: ./convert.sh <input_file> <operation> <output_file>"
    echo "Example: ./convert.sh document.pdf pdf-to-word document.docx"
    exit 1
fi

INPUT_FILE="$1"
OPERATION="$2"
OUTPUT_FILE="$3"

# Create conversion job
echo "Uploading $INPUT_FILE..."
RESPONSE=$(curl -s -X POST "$BASE_URL/jobs" \
    -H "X-API-Key: $API_KEY" \
    -F "file=@$INPUT_FILE" \
    -F "operation=$OPERATION")

JOB_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$JOB_ID" ]; then
    echo "Error: $RESPONSE"
    exit 1
fi

echo "Job created: $JOB_ID"

# Poll for completion
echo -n "Processing"
STATUS="processing"
while [ "$STATUS" = "processing" ] || [ "$STATUS" = "pending" ]; do
    sleep 1
    echo -n "."
    RESPONSE=$(curl -s "$BASE_URL/jobs/$JOB_ID" -H "X-API-Key: $API_KEY")
    STATUS=$(echo "$RESPONSE" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
done
echo ""

if [ "$STATUS" = "failed" ]; then
    echo "Conversion failed"
    exit 1
fi

# Download result
DOWNLOAD_URL=$(echo "$RESPONSE" | grep -o '"download_url":"[^"]*"' | cut -d'"' -f4)
echo "Downloading to $OUTPUT_FILE..."
curl -s -o "$OUTPUT_FILE" "$BASE_URL$DOWNLOAD_URL" -H "X-API-Key: $API_KEY"

echo "Done! Saved to $OUTPUT_FILE"
