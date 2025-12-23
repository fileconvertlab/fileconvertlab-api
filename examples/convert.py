"""
FileConvertLab API - Python Example
https://fileconvertlab.com/developers/api
"""

import requests
import time
import sys

API_KEY = 'sk_live_your_api_key_here'
BASE_URL = 'https://fileconvertlab.com/api/v1'


def convert_file(input_path: str, operation: str, output_path: str):
    """
    Convert a file using FileConvertLab API.

    Args:
        input_path: Path to the input file
        operation: Conversion operation (e.g., 'pdf-to-word', 'word-to-pdf')
        output_path: Path to save the converted file
    """
    headers = {'X-API-Key': API_KEY}

    # Create conversion job
    print(f'Uploading {input_path}...')
    with open(input_path, 'rb') as f:
        response = requests.post(
            f'{BASE_URL}/jobs',
            headers=headers,
            files={'file': f},
            data={'operation': operation}
        )

    if response.status_code != 202:
        print(f'Error: {response.json()}')
        return False

    job = response.json()
    print(f'Job created: {job["id"]}')

    # Poll for completion
    print('Processing', end='', flush=True)
    while job['status'] in ('pending', 'processing'):
        time.sleep(1)
        print('.', end='', flush=True)
        response = requests.get(
            f'{BASE_URL}/jobs/{job["id"]}',
            headers=headers
        )
        job = response.json()

    print()

    if job['status'] == 'failed':
        print(f'Conversion failed: {job.get("error", "Unknown error")}')
        return False

    # Download result
    print(f'Downloading to {output_path}...')
    response = requests.get(
        f'{BASE_URL}{job["result"]["download_url"]}',
        headers=headers
    )

    with open(output_path, 'wb') as f:
        f.write(response.content)

    print(f'Done! Saved to {output_path}')
    return True


if __name__ == '__main__':
    if len(sys.argv) != 4:
        print('Usage: python convert.py <input_file> <operation> <output_file>')
        print('Example: python convert.py document.pdf pdf-to-word document.docx')
        sys.exit(1)

    convert_file(sys.argv[1], sys.argv[2], sys.argv[3])
