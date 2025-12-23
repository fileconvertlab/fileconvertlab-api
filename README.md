# FileConvertLab API

REST API for document conversion: PDF, Word, Excel, PowerPoint, images, audio, video, archives, and OCR.

**[Documentation](https://fileconvertlab.com/developers/api)** | **[Get API Key](https://fileconvertlab.com/developers/pricing)**

## Features

- **PDF Conversions** — PDF to Word, Excel, PowerPoint, PNG, JPEG
- **Office to PDF** — Word, Excel, PowerPoint to PDF
- **OCR** — Extract text from scanned documents (19 languages)
- **Image Conversions** — PNG, JPEG, WebP, SVG, HEIC
- **Compression** — Reduce PDF file size
- **Async Processing** — Job-based workflow with webhooks

## Quick Start

### Authentication

All requests require an API key in the `X-API-Key` header:

```bash
X-API-Key: sk_live_your_api_key_here
```

### Base URL

```
https://fileconvertlab.com/api/v1
```

## Code Examples

### cURL

```bash
# Create conversion job
curl -X POST https://fileconvertlab.com/api/v1/jobs \
  -H "X-API-Key: sk_live_abc123" \
  -F "file=@document.pdf" \
  -F "operation=pdf-to-word"

# Check job status
curl https://fileconvertlab.com/api/v1/jobs/job_abc123 \
  -H "X-API-Key: sk_live_abc123"

# Download result
curl -O https://fileconvertlab.com/api/v1/jobs/job_abc123/download \
  -H "X-API-Key: sk_live_abc123"
```

### Python

```python
import requests
import time

API_KEY = 'sk_live_abc123'
BASE_URL = 'https://fileconvertlab.com/api/v1'
headers = {'X-API-Key': API_KEY}

# Create job
with open('document.pdf', 'rb') as f:
    response = requests.post(
        f'{BASE_URL}/jobs',
        headers=headers,
        files={'file': f},
        data={'operation': 'pdf-to-word'}
    )
job = response.json()

# Poll until complete
while job['status'] == 'processing':
    time.sleep(1)
    response = requests.get(
        f"{BASE_URL}/jobs/{job['id']}",
        headers=headers
    )
    job = response.json()

# Download result
if job['status'] == 'completed':
    response = requests.get(
        f"{BASE_URL}{job['result']['download_url']}",
        headers=headers
    )
    with open('document.docx', 'wb') as f:
        f.write(response.content)
```

### JavaScript

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('operation', 'pdf-to-word');

// Create job
const response = await fetch('https://fileconvertlab.com/api/v1/jobs', {
  method: 'POST',
  headers: { 'X-API-Key': 'sk_live_abc123' },
  body: formData
});
let job = await response.json();

// Poll until complete
while (job.status === 'processing') {
  await new Promise(r => setTimeout(r, 1000));
  const res = await fetch(`https://fileconvertlab.com/api/v1/jobs/${job.id}`, {
    headers: { 'X-API-Key': 'sk_live_abc123' }
  });
  job = await res.json();
}

// Download result
if (job.status === 'completed') {
  window.location.href = `https://fileconvertlab.com${job.result.download_url}`;
}
```

## Supported Operations

### PDF Conversions
| Operation | Input | Output |
|-----------|-------|--------|
| `pdf-to-word` | PDF | DOCX |
| `pdf-to-excel` | PDF | XLSX |
| `pdf-to-ppt` | PDF | PPTX |
| `pdf-to-png` | PDF | PNG/ZIP |
| `pdf-to-jpeg` | PDF | JPEG/ZIP |

### Office to PDF
| Operation | Input | Output |
|-----------|-------|--------|
| `word-to-pdf` | DOCX, DOC | PDF |
| `excel-to-pdf` | XLSX, XLS | PDF |
| `ppt-to-pdf` | PPTX, PPT | PDF |

### OCR
| Operation | Input | Output |
|-----------|-------|--------|
| `ocr-pdf` | Scanned PDF | Searchable PDF |
| `ocr-to-word` | PDF, Image | DOCX |

Supported OCR languages: `eng`, `deu`, `fra`, `spa`, `por`, `rus`, `chi_sim`, `chi_tra`, `jpn`, `kor`, and more.

### Image Conversions
| Operation | Input | Output |
|-----------|-------|--------|
| `png-to-pdf` | PNG | PDF |
| `jpeg-to-pdf` | JPEG | PDF |
| `png-to-jpeg` | PNG | JPEG |
| `jpeg-to-png` | JPEG | PNG |
| `webp-to-png` | WebP | PNG |
| `heic-to-jpeg` | HEIC | JPEG |

### Utilities
| Operation | Description |
|-----------|-------------|
| `compress-pdf` | Reduce PDF file size |

## Response Format

### Create Job (POST /v1/jobs)

```json
{
  "id": "job_abc123xyz",
  "status": "processing",
  "operation": "pdf-to-word",
  "created_at": "2025-12-07T10:30:00Z",
  "estimated_seconds": 15,
  "file": {
    "name": "document.pdf",
    "size": 1048576,
    "mime_type": "application/pdf"
  }
}
```

### Job Status (GET /v1/jobs/{job_id})

```json
{
  "id": "job_abc123xyz",
  "status": "completed",
  "operation": "pdf-to-word",
  "progress": 100,
  "created_at": "2025-12-07T10:30:00Z",
  "completed_at": "2025-12-07T10:30:12Z",
  "result": {
    "download_url": "/v1/jobs/job_abc123xyz/download",
    "expires_at": "2025-12-07T11:30:12Z",
    "file_name": "document.docx",
    "file_size": 524288
  }
}
```

## Rate Limits

| Plan | Requests/min | Requests/day | Max File Size |
|------|--------------|--------------|---------------|
| Pro | 50 | 1,000 | 500 MB |

Rate limit headers included in every response:
```
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1701962400
```

## Error Handling

```json
{
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Expected PDF file, got image/png",
    "details": {
      "expected": ["application/pdf"],
      "received": "image/png"
    }
  }
}
```

| HTTP | Code | Description |
|------|------|-------------|
| 400 | `INVALID_FILE_TYPE` | Wrong file format |
| 400 | `FILE_TOO_LARGE` | File exceeds limit |
| 400 | `INVALID_OPERATION` | Unknown operation |
| 401 | `UNAUTHORIZED` | Invalid API key |
| 404 | `JOB_NOT_FOUND` | Job doesn't exist |
| 410 | `JOB_EXPIRED` | Result was deleted |
| 429 | `RATE_LIMITED` | Too many requests |

## Links

- [Full API Documentation](https://fileconvertlab.com/developers/api)
- [Get API Key](https://fileconvertlab.com/developers/pricing)
- [FileConvertLab](https://fileconvertlab.com)

## License

MIT
