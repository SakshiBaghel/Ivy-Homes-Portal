import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

console.log('Script started...');

const BASE_URL = process.env.BASE_URL || 'https://solve.ivy.homes';
const API_KEY = process.env.API_KEY || 'IVY26-0DD40C14CD1F';

async function getAccessToken() {
  console.log('Logging in to get access token...');
  const res = await axios.post(
    `${BASE_URL}/auth/login`,
    { email: 'demo1@ivy.homes', password: '4611d91c22' },
    { headers: { 'X-API-Key': API_KEY } }
  );
  console.log('Login successful!');
  return res.data.access_token;
}

async function fetchAll(endpointName, token) {
  let allResults = [];
  let offset = 0;
  const limit = 200;
  let hasMore = true;

  console.log(`\nFetching ${endpointName}...`);

  while (hasMore) {
    const res = await axios.get(`${BASE_URL}/v1/${endpointName}`, {
      params: { limit, offset },
      headers: {
        'X-API-Key': API_KEY,
        Authorization: `Bearer ${token}`
      }
    });

    const data = res.data;
    const items = data.results || [];
    allResults.push(...items);

    console.log(`Fetched ${items.length} records. Total collected: ${allResults.length}/${data.total || 'unknown'}`);

    if (data.has_more === false || items.length === 0 || allResults.length >= data.total) {
      hasMore = false;
    } else {
      offset += items.length;
    }
  }

  fs.writeFileSync(`./data/${endpointName}.json`, JSON.stringify(allResults, null, 2));
  console.log(`Saved ${allResults.length} records to ./data/${endpointName}.json`);
  return allResults;
}

async function main() {
  try {
    if (!fs.existsSync('./data')) {
      fs.mkdirSync('./data');
    }
    const token = await getAccessToken();
    await fetchAll('listings', token);
    await fetchAll('rentals', token);
    await fetchAll('projects', token);
    console.log('\nAll 3 datasets downloaded successfully!');
  } catch (err) {
    console.error('Fatal Error:', err?.response?.data || err.message || err);
  }
}

main().catch(err => console.error('Unhandled Rejection:', err));