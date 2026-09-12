import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL || 'https://solve.ivy.homes';
const API_KEY = process.env.API_KEY || 'IVY26-0DD40C14CD1F';

// Load local JSON datasets
const dataDir = path.resolve('data');

export const getLocalData = (type) => {
  const filePath = path.join(dataDir, `${type}.json`);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
};

// Ivy API Token Helper
export const getApiToken = async () => {
  const res = await axios.post(
    `${BASE_URL}/auth/login`,
    { email: 'demo1@ivy.homes', password: '4611d91c22' },
    { headers: { 'X-API-Key': API_KEY } }
  );
  return res.data.access_token;
};

// Direct API Proxy helper
export const ivyClient = async () => {
  const token = await getApiToken();
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'X-API-Key': API_KEY,
      Authorization: `Bearer ${token}`
    }
  });
};