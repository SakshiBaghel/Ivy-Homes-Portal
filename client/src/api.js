import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const fetchAnalytics = () => API.get('/analytics/summary');
export const fetchListings = (params) => API.get('/listings', { params });
export const fetchSaved = () => API.get('/saved');
export const saveListing = (listing_id) => API.post('/saved', { listing_id });
export const removeSavedListing = (id) => API.delete(`/saved/${id}`);

export default API;