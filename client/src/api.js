// // import axios from 'axios';

// // const BASE_URL = 'https://solve.ivy.homes'; 
// // const API_KEY = 'IVY26-0DD40C14CD1F'; // Yahan assignment wali API key daalo

// // const api = axios.create({
// //   baseURL: BASE_URL,
// //   headers: {
// //     'X-API-Key': API_KEY,
// //     'Content-Type': 'application/json'
// //   }
// // });

// // api.interceptors.request.use((config) => {
// //   const token = localStorage.getItem('accessToken');
// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`;
// //   }
// //   return config;
// // });

// // export const loginUser = (creds) => api.post('/auth/login', creds);
// // export const fetchListings = (params) => api.get('/listings', { params });
// // export const fetchListingById = (id) => api.get(`/listings/${id}`);
// // export const fetchProjects = (params) => api.get('/projects', { params });
// // export const fetchRentals = (params) => api.get('/rentals', { params });
// // export const fetchAnalytics = () => api.get('/analytics/summary');
// // export const fetchSaved = () => api.get('/saved');
// // export const saveListing = (listingId) => api.post('/saved', { listingId });
// // export const removeSavedListing = (id) => api.delete(`/saved/${id}`);

// // export default api;


// import axios from 'axios';

// // Base URL data ke liye (/v1 ke sath)
// const BASE_URL = 'https://solve.ivy.homes/v1'; 
// const API_KEY = 'IVY26-0DD40C14CD1F'; // Yahan apni API Key daalo

// // Axios instance
// const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'X-API-Key': API_KEY,
//     'Content-Type': 'application/json'
//   }
// });

// // Interceptor: Har request me Token add karega (agar login hai)
// // api.interceptors.request.use((config) => {
// //   const token = localStorage.getItem('accessToken');
// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`;
// //   }
// //   return config;
// // });

// // api.interceptors.response.use(
// //   (response) => response,
// //   async (error) => {
// //     const originalRequest = error.config;
    
// //     // Agar 401 aaya aur retry nahi hua hai
// //     if (error.response?.status === 401 && !originalRequest._retry) {
// //       originalRequest._retry = true;
      
// //       const refreshToken = localStorage.getItem('refreshToken');
      
// //       // Agar refresh token hi nahi hai (jaise logout ke baad), toh direct reject karo
// //       if (!refreshToken) {
// //         return Promise.reject(error);
// //       }

// //       try {
// //         // Naya token fetch karo
// //         const res = await axios.post('https://solve.ivy.homes/auth/refresh', {
// //           refresh_token: refreshToken
// //         }, {
// //           headers: { 'X-API-Key': API_KEY } // Dhyan rakhna API_KEY upar defined ho
// //         });

// //         // Naye tokens localStorage me save karo
// //         localStorage.setItem('accessToken', res.data.access_token);
// //         localStorage.setItem('refreshToken', res.data.refresh_token);

// //         // Purani request me naya token lagakar dobara bhejo
// //         originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
// //         return api(originalRequest);
        
// //       } catch (err) {
// //         // Agar refresh token bhi fail ho jaye toh sirf storage clear karo, reload mat karo
// //         localStorage.removeItem('accessToken');
// //         localStorage.removeItem('refreshToken');
// //         return Promise.reject(err);
// //       }
// //     }
// //     return Promise.reject(error);
// //   }
// // );

// const getCookie = (name) => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
//   return null;
// };

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
    
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       // Cookie ya localStorage me se refresh token nikalo
//       const refreshToken = getCookie('refresh_token') || localStorage.getItem('refreshToken');
      
//       if (!refreshToken) {
//         return Promise.reject(error);
//       }

//       try {
//         const res = await axios.post('https://solve.ivy.homes/auth/refresh', {
//           refresh_token: refreshToken
//         }, {
//           headers: { 'X-API-Key': API_KEY } // Yahan se withCredentials hata diya
//         });

//         localStorage.setItem('accessToken', res.data.access_token);
        
//         if (res.data.refresh_token) {
//           localStorage.setItem('refreshToken', res.data.refresh_token);
//           document.cookie = `refresh_token=${res.data.refresh_token}; path=/`;
//         }

//         originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
//         return api(originalRequest);
        
//       } catch (err) {
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('refreshToken');
//         document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
//         // Agar refresh token expire ho gaya h toh page reload kar do taaki login page aa jaye
//         window.location.reload(); 
//         return Promise.reject(err);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// // ==========================================
// // API ENDPOINTS
// // ==========================================

// // 1. Auth (Bina /v1 ke direct URL)
// export const loginUser = (creds) => api.post('https://solve.ivy.homes/auth/login', creds);

// // 2. Listings (Filters aur Pagination ke sath)
// // Ye automatically ?page=1&limit=10&bhk=1 etc. add kar dega
// export const fetchListings = (params) => api.get('/listings', { params });

// // 3. Single Listing Detail
// export const fetchListingById = (id) => api.get(`/listings/${id}`);

// // 4. Projects & Rentals
// export const fetchProjects = (params) => api.get('/projects', { params });
// export const fetchRentals = (params) => api.get('/rentals', { params });

// // 5. Saved Listings
// export const fetchSaved = () => api.get('/saved');

// // Save listing (body me listing_id pass kiya)
// export const saveListing = (id) => api.post('/saved', { listing_id: id });

// // Remove saved listing
// export const removeSavedListing = (id) => api.delete(`/saved/${id}`);

// // Analytics endpoint
// // export const fetchAnalytics = () => api.get('/analytics/summary');

// export const fetchAnalytics = () => Promise.resolve({
//   data: {
//     totalListings: 150,
//     activeListings: 120,
//     totalRentals: 45,
//     avgPricePerSqft: 6500,
//     localityCounts: { aundh: 10, baner: 20 },
//     bhkCounts: { 1: 5, 2: 15, 3: 10 }
//   }
// });
// export default api;


import axios from 'axios';

// Base URL data ke liye (/v1 ke sath)
const BASE_URL = 'https://solve.ivy.homes/v1'; 
const API_KEY = 'IVY26-0DD40C14CD1F'; // Yahan apni API Key daalo

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
  }
});

// ✅ FIX 1: Request Interceptor ab active hai. 
// Ye har request se pehle header me token lagayega.
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

// ✅ FIX 2: Response Interceptor (Auto Refresh)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Cookie ya localStorage me se refresh token nikalo
      const refreshToken = getCookie('refresh_token') || localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const res = await axios.post('https://solve.ivy.homes/auth/refresh', {
          refresh_token: refreshToken
        }, {
          headers: { 'X-API-Key': API_KEY } // CORS error rokne ke liye withCredentials nahi lagaya
        });

        localStorage.setItem('accessToken', res.data.access_token);
        
        if (res.data.refresh_token) {
          localStorage.setItem('refreshToken', res.data.refresh_token);
          document.cookie = `refresh_token=${res.data.refresh_token}; path=/`;
        }

        // Purani request me naya token lagakar dobara bhejo
        originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
        return api(originalRequest);
        
      } catch (err) {
        // Agar refresh token expire ho gaya h toh sab clear karke login par bhejo
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

// 1. Auth (Bina /v1 ke direct URL)
export const loginUser = (creds) => api.post('https://solve.ivy.homes/auth/login', creds);

// 2. Listings
export const fetchListings = (params) => api.get('/listings', { params });

// 3. Single Listing Detail
export const fetchListingById = (id) => api.get(`/listings/${id}`);

// 4. Projects & Rentals
export const fetchProjects = (params) => api.get('/projects', { params });
export const fetchRentals = (params) => api.get('/rentals', { params });

// 5. Saved Listings
export const fetchSaved = () => api.get('/saved');
export const saveListing = (id) => api.post('/saved', { listing_id: id });
export const removeSavedListing = (id) => api.delete(`/saved/${id}`);

// 6. Analytics (Mocked as requested)
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