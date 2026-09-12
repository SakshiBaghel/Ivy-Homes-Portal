import { getLocalData } from '../services/ivyApiService.js';

export const getAnalyticsSummary = (req, res) => {
  try {
    const listings = getLocalData('listings');
    const rentals = getLocalData('rentals');
    const projects = getLocalData('projects');

    // Total counts
    const totalListings = listings.length;
    const activeListings = listings.filter((l) => l.is_live).length;

    // Localities breakdown
    const localityCounts = {};
    listings.forEach((l) => {
      if (l.locality) {
        localityCounts[l.locality] = (localityCounts[l.locality] || 0) + 1;
      }
    });

    // BHK distribution
    const bhkCounts = {};
    listings.forEach((l) => {
      const bhk = l.bedroom || 'Other';
      bhkCounts[bhk] = (bhkCounts[bhk] || 0) + 1;
    });

    // Price per sqft calculation
    let totalRate = 0;
    let validRateCount = 0;
    listings.forEach((l) => {
      if (l.price && l.carpet_area && l.carpet_area > 0) {
        totalRate += l.price / l.carpet_area;
        validRateCount++;
      }
    });
    const avgPricePerSqft = validRateCount ? Math.round(totalRate / validRateCount) : 0;

    // Posted by distribution
    const postedByCounts = {};
    listings.forEach((l) => {
      const role = l.posted_by || 'Unknown';
      postedByCounts[role] = (postedByCounts[role] || 0) + 1;
    });

    res.json({
      totalListings,
      activeListings,
      totalRentals: rentals.length,
      totalProjects: projects.length,
      avgPricePerSqft,
      bhkCounts,
      localityCounts,
      postedByCounts
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute analytics', details: err.message });
  }
};