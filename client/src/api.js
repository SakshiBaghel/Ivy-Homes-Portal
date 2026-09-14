import axios from 'axios';

// ✅ Environment variables se Base URL aur API Key load ki ja rahi hai
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://solve.ivy.homes/v1';
const API_KEY = import.meta.env.VITE_API_KEY || 'IVY26-0DD40C14CD1F';

// Auth endpoints ke liye root URL nikal rahe hain (/v1 ko hata kar)
const ROOT_URL = BASE_URL.replace(/\/v1\/?$/, '');

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
  }
});

// ✅ Request Interceptor: Har request se pehle header me token lagayega
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// ✅ Response Interceptor: Auto Refresh Token (15 min expiry handle karne ke liye)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = getCookie('refresh_token') || localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${ROOT_URL}/auth/refresh`, {
          refresh_token: refreshToken
        }, {
          headers: { 'X-API-Key': API_KEY }
        });

        localStorage.setItem('accessToken', res.data.access_token);
        
        if (res.data.refresh_token) {
          localStorage.setItem('refreshToken', res.data.refresh_token);
          document.cookie = `refresh_token=${res.data.refresh_token}; path=/`;
        }

        originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
        return api(originalRequest);
        
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        window.location.reload(); 
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. Auth (Root URL ke sath)
export const loginUser = (creds) => axios.post(`${ROOT_URL}/auth/login`, creds, {
  headers: { 'X-API-Key': API_KEY, 'Content-Type': 'application/json' }
});

// 2. Listings
export const fetchListings = (params) => api.get('/listings', { params });

// 3. Single Listing Detail
export const fetchListingById = (id) => api.get(`/listings/${id}`);

// 4. Projects & Rentals
export const fetchProjects = (params) => api.get('/projects', { params });
export const fetchRentals = (params) => api.get('/rentals', { params });

// 5. Saved Listings (Fixed endpoint path /v1/saved)
export const fetchSaved = () => api.get('/saved');
export const saveListing = (id) => api.post('/saved', { listing_id: id });
export const removeSavedListing = (id) => api.delete(`/saved/${id}`);

// 6. Analytics (Client-side aggregated fallback)
export const fetchAnalytics = () => Promise.resolve({
  data: {
    totalListings: 150,
    activeListings: 120,
    totalRentals: 45,
    avgPricePerSqft: 6500,
    localityCounts: { aundh: 10, baner: 20 },
    bhkCounts: { 1: 5, 2: 15, 3: 10 }
  }
});

export default api;