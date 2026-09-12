import { ivyClient, getLocalData } from '../services/ivyApiService.js';

export const getSavedListings = async (req, res) => {
  try {
    const client = await ivyClient();
    const response = await client.get('/v1/saved');
    
    // Saved IDs ko local listings details ke sath enrich kar sakte hain
    const savedItems = response.data.results || response.data || [];
    const allListings = getLocalData('listings');

    const enriched = savedItems.map((s) => {
      const details = allListings.find((l) => l.listing_id === (s.listing_id || s.id));
      return details ? { ...details, saved_id: s.id } : s;
    });

    res.json({ results: enriched });
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: 'Failed to fetch saved listings',
      details: err.response?.data || err.message
    });
  }
};

export const saveListing = async (req, res) => {
  try {
    const { listing_id } = req.body;
    if (!listing_id) {
      return res.status(400).json({ error: 'listing_id is required' });
    }

    const client = await ivyClient();
    const response = await client.post('/v1/saved', { listing_id });
    res.status(201).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: 'Failed to save listing',
      details: err.response?.data || err.message
    });
  }
};

export const removeSavedListing = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await ivyClient();
    const response = await client.delete(`/v1/saved/${id}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: 'Failed to delete saved listing',
      details: err.response?.data || err.message
    });
  }
};