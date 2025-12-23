# Examples

Code examples for [FileConvertLab API](https://fileconvertlab.com/developers/api).

## Setup

1. Get your API key from [FileConvertLab](https://fileconvertlab.com/developers/pricing)
2. Replace `sk_live_your_api_key_here` with your actual API key

## Python

```bash
pip install requests
python convert.py document.pdf pdf-to-word document.docx
```

## Node.js

```bash
node convert.js document.pdf pdf-to-word document.docx
```

Requires Node.js 18+ (native fetch support).

## Bash/cURL

```bash
chmod +x convert.sh
./convert.sh document.pdf pdf-to-word document.docx
```

## Supported Operations

- `pdf-to-word` — PDF to DOCX
- `pdf-to-excel` — PDF to XLSX
- `pdf-to-ppt` — PDF to PPTX
- `pdf-to-png` — PDF to PNG
- `pdf-to-jpeg` — PDF to JPEG
- `word-to-pdf` — DOCX to PDF
- `excel-to-pdf` — XLSX to PDF
- `ppt-to-pdf` — PPTX to PDF
- `ocr-pdf` — Make scanned PDF searchable
- `ocr-to-word` — OCR to Word
- `compress-pdf` — Compress PDF

See [full documentation](https://fileconvertlab.com/developers/api) for all operations.
