// import { getLocalData } from '../services/ivyApiService.js';

// export const getListings = (req, res) => {
//   try {
//     let listings = getLocalData('listings');

//     const {
//       page = 1,
//       limit = 20,
//       locality,
//       bhk,
//       minPrice,
//       maxPrice,
//       search,
//       sortBy
//     } = req.query;

    
//     // Filters
//     if (locality) {
//       listings = listings.filter(
//         (l) => (l.locality || '').toLowerCase() === locality.toLowerCase()
//       );
//     }

//     if (bhk) {
//       listings = listings.filter((l) => String(l.bedroom) === String(bhk));
//     }

//     if (minPrice) {
//       listings = listings.filter((l) => Number(l.price) >= Number(minPrice));
//     }

//     if (maxPrice) {
//       listings = listings.filter((l) => Number(l.price) <= Number(maxPrice));
//     }

//     if (search) {
//       const q = search.toLowerCase();
//       listings = listings.filter(
//         (l) =>
//           (l.title && l.title.toLowerCase().includes(q)) ||
//           (l.locality && l.locality.toLowerCase().includes(q)) ||
//           (l.project_name && l.project_name.toLowerCase().includes(q))
//       );
//     }

//     // Sorting
//     if (sortBy === 'price_asc') {
//       listings.sort((a, b) => (a.price || 0) - (b.price || 0));
//     } else if (sortBy === 'price_desc') {
//       listings.sort((a, b) => (b.price || 0) - (a.price || 0));
//     } else if (sortBy === 'area_desc') {
//       listings.sort((a, b) => (b.carpet_area || 0) - (a.carpet_area || 0));
//     }

//     // Pagination
//     const pageNum = parseInt(page, 10);
//     const limitNum = parseInt(limit, 10);
//     const startIndex = (pageNum - 1) * limitNum;
//     const paginated = listings.slice(startIndex, startIndex + limitNum);

//     res.json({
//       total: listings.length,
//       page: pageNum,
//       totalPages: Math.ceil(listings.length / limitNum),
//       results: paginated
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch listings', details: err.message });
//   }
// };

// export const getListingById = (req, res) => {
//   try {
//     const { id } = req.params;
//     const listings = getLocalData('listings');
//     const item = listings.find((l) => l.listing_id === id);

//     if (!item) {
//       return res.status(404).json({ error: 'Listing not found' });
//     }

//     res.json(item);
//   } catch (err) {
//     res.status(500).json({ error: 'Error retrieving listing', details: err.message });
//   }
// };


import { getLocalData } from '../services/ivyApiService.js';

export const getListings = (req, res) => {
  try {
    let listings = getLocalData('listings');

    const {
      page = 1,
      limit = 20,
      locality,
      bhk,
      minPrice,
      maxPrice,
      search,
      sortBy
    } = req.query;

    // 1. Locality Filter
    if (locality) {
      listings = listings.filter(
        (l) => (l.locality || '').toLowerCase().includes(locality.toLowerCase())
      );
    }

    // 2. BHK Filter
    if (bhk) {
      listings = listings.filter((l) => String(l.bedroom) === String(bhk));
    }

    // 3. Price Filters
    if (minPrice) {
      listings = listings.filter((l) => Number(l.price) >= Number(minPrice));
    }

    if (maxPrice) {
      listings = listings.filter((l) => Number(l.price) <= Number(maxPrice));
    }

    // 4. Multi-Field Search (Apartment Name, Society, Title, Description, Locality)
    if (search) {
      const q = search.toLowerCase().trim();
      listings = listings.filter((l) => {
        const apartment = (l.apartment_name || '').toLowerCase();
        const society = (l.society_name || '').toLowerCase();
        const project = (l.project_name || '').toLowerCase();
        const title = (l.title || '').toLowerCase();
        const loc = (l.locality || '').toLowerCase();
        const desc = (l.description || '').toLowerCase();
        const propType = (l.property_type || '').toLowerCase();

        return (
          apartment.includes(q) ||
          society.includes(q) ||
          project.includes(q) ||
          title.includes(q) ||
          loc.includes(q) ||
          desc.includes(q) ||
          propType.includes(q)
        );
      });
    }

    // 5. Sorting
    if (sortBy === 'price_asc') {
      listings.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'price_desc') {
      listings.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === 'area_desc') {
      listings.sort(
        (a, b) =>
          (Number(b.carpet_area) || Number(b.super_built_up_area) || 0) -
          (Number(a.carpet_area) || Number(a.super_built_up_area) || 0)
      );
    }

    // 6. Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = listings.slice(startIndex, startIndex + limitNum);

    res.json({
      total: listings.length,
      page: pageNum,
      totalPages: Math.ceil(listings.length / limitNum),
      results: paginated
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings', details: err.message });
  }
};

export const getListingById = (req, res) => {
  try {
    const { id } = req.params;
    const listings = getLocalData('listings');
    const item = listings.find((l) => String(l.listing_id || l.id) === String(id));

    if (!item) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving listing', details: err.message });
  }
};