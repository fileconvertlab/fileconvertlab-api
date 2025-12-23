/**
 * FileConvertLab API - Node.js Example
 * https://fileconvertlab.com/developers/api
 */

const fs = require('fs');
const path = require('path');

const API_KEY = 'sk_live_your_api_key_here';
const BASE_URL = 'https://fileconvertlab.com/api/v1';

async function convertFile(inputPath, operation, outputPath) {
  const headers = { 'X-API-Key': API_KEY };

  // Create conversion job
  console.log(`Uploading ${inputPath}...`);

  const formData = new FormData();
  const fileBuffer = fs.readFileSync(inputPath);
  const blob = new Blob([fileBuffer]);
  formData.append('file', blob, path.basename(inputPath));
  formData.append('operation', operation);

  let response = await fetch(`${BASE_URL}/jobs`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (response.status !== 202) {
    const error = await response.json();
    console.error('Error:', error);
    return false;
  }

  let job = await response.json();
  console.log(`Job created: ${job.id}`);

  // Poll for completion
  process.stdout.write('Processing');
  while (job.status === 'pending' || job.status === 'processing') {
    await new Promise((r) => setTimeout(r, 1000));
    process.stdout.write('.');

    response = await fetch(`${BASE_URL}/jobs/${job.id}`, { headers });
    job = await response.json();
  }
  console.log();

  if (job.status === 'failed') {
    console.error(`Conversion failed: ${job.error || 'Unknown error'}`);
    return false;
  }

  // Download result
  console.log(`Downloading to ${outputPath}...`);
  response = await fetch(`${BASE_URL}${job.result.download_url}`, { headers });
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);

  console.log(`Done! Saved to ${outputPath}`);
  return true;
}

// CLI usage
const args = process.argv.slice(2);
if (args.length !== 3) {
  console.log('Usage: node convert.js <input_file> <operation> <output_file>');
  console.log('Example: node convert.js document.pdf pdf-to-word document.docx');
  process.exit(1);
}

convertFile(args[0], args[1], args[2]);
