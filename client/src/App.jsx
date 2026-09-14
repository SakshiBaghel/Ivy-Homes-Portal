// import { useState, useEffect } from 'react';
// import Navbar from './components/Navbar';
// import ListingCard from './components/ListingCard';
// import PropertyModal from './components/PropertyModal';
// import AnalyticsCharts from './components/AnalyticsCharts';
// import LoginModal from './components/LoginModal';
// import { useAuth } from './context/AuthContext';

// import {
//   fetchListings,
//   fetchListingById,
//   fetchProjects,
//   fetchRentals,
//   fetchAnalytics,
//   fetchSaved,
//   saveListing,
//   removeSavedListing
// } from './api';

// export default function App() {
//   const { user, logout } = useAuth();
//   const [activeTab, setActiveTab] = useState('listings');
//   const [showLoginModal, setShowLoginModal] = useState(false);

//   // Listings data & pagination
//   const [listings, setListings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // Strict Filters (Requirement 2)
//   const [searchTerm, setSearchTerm] = useState('');
//   const [locality, setLocality] = useState('');
//   const [bhk, setBhk] = useState('');
//   const [furnishing, setFurnishing] = useState('');
//   const [priceRange, setPriceRange] = useState('');
//   const [localitiesList, setLocalitiesList] = useState([]);
//   const [bhkList, setBhkList] = useState([]);

//   // Projects & Rentals (Requirement 5)
//   const [projects, setProjects] = useState([]);
//   const [rentals, setRentals] = useState([]);
//   const [rentalsLoading, setRentalsLoading] = useState(false);

//   // Insights & Saved (Requirement 4 & 6)
//   const [analytics, setAnalytics] = useState(null);
//   const [saved, setSaved] = useState([]);
//   const [selectedListing, setSelectedListing] = useState(null);
//   const [toast, setToast] = useState(null);

//   const showToast = (message, type = 'success') => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   // Requirement 3: Direct URL route support (/listings/:id)
//   // useEffect(() => {
//   //   const path = window.location.pathname;
//   //   if (path.startsWith('/listings/')) {
//   //     const id = path.split('/listings/')[1];
//   //     if (id) {
//   //       fetchListingById(id)
//   //         .then((res) => setSelectedListing(res.data))
//   //         .catch(() => showToast('Could not find listing', 'error'));
//   //     }
//   //   }
//   // }, []);

//   useEffect(() => {
//     if (user) {
//       // Login hone par hi data load hoga
//       loadListings();
//       loadAnalytics();
//       loadSaved();
//     } else {
//       // Logout hote hi screen se saara data turant uda do (clear state)
//       setListings([]);
//       setSaved([]);
//       setAnalytics(null);
//       setProjects([]);
//       setRentals([]);
//       setActiveTab('listings'); // Wapas home tab par bhej do
//     }
//   }, [user]);

//   // Browse Listings with robust filtering fallback
//   const loadListings = async (customParams = {}) => {
//     setLoading(true);
//     try {
//       const activeLoc = customParams.locality !== undefined ? customParams.locality : locality;
//       const activeBhk = customParams.bhk !== undefined ? customParams.bhk : bhk;
//       const activeFurn = customParams.furnishing !== undefined ? customParams.furnishing : furnishing;
//       const activeRange = customParams.priceRange !== undefined ? customParams.priceRange : priceRange;
//       const activeSearch = customParams.search !== undefined ? customParams.search : searchTerm;
//       const activePage = customParams.page !== undefined ? customParams.page : page;

//       let minPrice, maxPrice;
//       if (activeRange === 'under_50l') maxPrice = 5000000;
//       else if (activeRange === '50l_1cr') { minPrice = 5000000; maxPrice = 10000000; }
//       else if (activeRange === 'above_1cr') minPrice = 10000000;

//       const params = {
//         page: activePage,
//         limit: 12,
//         ...(activeLoc && { locality: activeLoc }),
//         ...(activeBhk && { bhk: activeBhk }),
//         ...(activeFurn && { furnishing: activeFurn }),
//         ...(minPrice && { minPrice }),
//         ...(maxPrice && { maxPrice }),
//         ...(activeSearch && { search: activeSearch })
//       };

//       const res = await fetchListings(params);
//       let results = res.data.results || [];

//       // Client-side fallback filter safety net
//       if (activeFurn) {
//         results = results.filter((item) => (item.furnishing || '').toLowerCase() === activeFurn.toLowerCase());
//       }
//       if (minPrice) {
//         results = results.filter((item) => Number(item.price) >= minPrice);
//       }
//       if (maxPrice) {
//         results = results.filter((item) => Number(item.price) <= maxPrice);
//       }

//       setListings(results);
//       setTotalPages(res.data.totalPages || 1);
//       if (customParams.page !== undefined) setPage(customParams.page);
//     } catch (err) {
//       console.error(err);
//       showToast('Failed to load listings', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadRentalsAndProjects = async () => {
//     setRentalsLoading(true);
//     try {
//       const [projRes, rentRes] = await Promise.all([fetchProjects(), fetchRentals()]);
//       setProjects(projRes.data.results || projRes.data || []);
//       setRentals(rentRes.data.results || rentRes.data || []);
//     } catch (err) {
//       console.error('Error fetching rentals/projects', err);
//     } finally {
//       setRentalsLoading(false);
//     }
//   };

//   const loadAnalytics = async () => {
//     try {
//       const res = await fetchAnalytics();
//       setAnalytics(res.data);
//       if (res.data?.localityCounts) {
//         setLocalitiesList(Object.keys(res.data.localityCounts).sort());
//       }
//       if (res.data?.bhkCounts) {
//         setBhkList(
//           Object.keys(res.data.bhkCounts)
//             .map(Number)
//             .filter((n) => !isNaN(n) && n > 0)
//             .sort((a, b) => a - b)
//         );
//       }
//     } catch (err) {
//       console.error('Failed to load analytics', err);
//     }
//   };

//   const loadSaved = async () => {
//     if (!user) {
//       setSaved([]);
//       return;
//     }
//     try {
//       const res = await fetchSaved();
//       setSaved(res.data.results || res.data || []);
//     } catch (err) {
//       console.error('Failed to load saved listings', err);
//     }
//   };

//   const handleToggleSave = async (item) => {
//     if (!user) {
//       setShowLoginModal(true);
//       return;
//     }
//     const targetId = item.listing_id || item.id;
//     const existing = saved.find((s) => (s.listing_id || s.id) === targetId || s.saved_id === targetId);

//     try {
//       if (existing) {
//         const deleteId = existing.saved_id || existing.id || targetId;
//         await removeSavedListing(deleteId);
//         setSaved((prev) => prev.filter((s) => (s.listing_id || s.id) !== targetId && s.saved_id !== deleteId));
//         showToast('Removed from Saved', 'info');
//       } else {
//         const res = await saveListing(targetId);
//         setSaved((prev) => [...prev, { ...item, saved_id: res.data?.id || targetId }]);
//         showToast('Saved to your collection!', 'success');
//       }
//     } catch (err) {
//       showToast('Action failed', 'error');
//     }
//   };

//   useEffect(() => {
//     loadListings();
//     loadAnalytics();
//     if (user) loadSaved();
//   }, [user]);

//   const handleOpenDetail = (item) => {
//     setSelectedListing(item);
//     window.history.pushState({}, '', `/listings/${item.listing_id || item.id}`);
//   };

//   const handleCloseDetail = () => {
//     setSelectedListing(null);
//     window.history.pushState({}, '', '/');
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-800">
//       {/* Toast Notification */}
//       {toast && (
//         <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
//           <div className="px-4 py-2 rounded-lg shadow-lg text-sm font-semibold bg-slate-900 text-white">
//             {toast.message}
//           </div>
//         </div>
//       )}

//       {showLoginModal && (
//         <LoginModal
//           onSuccess={() => {
//             setShowLoginModal(false);
//             loadSaved();
//           }}
//         />
//       )}

//       <Navbar
//         activeTab={activeTab}
//         setActiveTab={(tab) => {
//           setActiveTab(tab);
//           if (tab === 'rentals' && rentals.length === 0) loadRentalsAndProjects();
//         }}
//         savedCount={saved.length}
//         user={user}
//         onLoginClick={() => setShowLoginModal(true)}
//         onLogoutClick={logout}
//       />

//       <main className="max-w-7xl mx-auto px-4 py-8">
//         {/* TAB 1: LISTINGS (Requirement 2) */}
//         {/* {activeTab === 'listings' && (
//           <div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-6 bg-white p-4 rounded-xl border border-slate-200">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && loadListings({ page: 1, search: searchTerm })}
//                 className="border rounded-lg px-3 py-2 text-sm"
//               />

//               <select
//                 value={locality}
//                 onChange={(e) => {
//                   setLocality(e.target.value);
//                   loadListings({ page: 1, locality: e.target.value });
//                 }}
//                 className="border rounded-lg px-3 py-2 text-sm capitalize"
//               >
//                 <option value="">All Localities ({localitiesList.length})</option>
//                 {localitiesList.map((loc) => (
//                   <option key={loc} value={loc} className="capitalize">{loc}</option>
//                 ))}
//               </select>

//               <select
//                 value={bhk}
//                 onChange={(e) => {
//                   setBhk(e.target.value);
//                   loadListings({ page: 1, bhk: e.target.value });
//                 }}
//                 className="border rounded-lg px-3 py-2 text-sm"
//               >
//                 <option value="">All Bedrooms</option>
//                 {bhkList.map((val) => (
//                   <option key={val} value={val}>{val} BHK</option>
//                 ))}
//               </select>

//               <select
//                 value={furnishing}
//                 onChange={(e) => {
//                   setFurnishing(e.target.value);
//                   loadListings({ page: 1, furnishing: e.target.value });
//                 }}
//                 className="border rounded-lg px-3 py-2 text-sm"
//               >
//                 <option value="">All Furnishing</option>
//                 <option value="Unfurnished">Unfurnished</option>
//                 <option value="Semi-Furnished">Semi-Furnished</option>
//                 <option value="Fully-Furnished">Fully-Furnished</option>
//               </select>

//               <select
//                 value={priceRange}
//                 onChange={(e) => {
//                   setPriceRange(e.target.value);
//                   loadListings({ page: 1, priceRange: e.target.value });
//                 }}
//                 className="border rounded-lg px-3 py-2 text-sm"
//               >
//                 <option value="">All Prices</option>
//                 <option value="under_50l">Under ₹50 Lakh</option>
//                 <option value="50l_1cr">₹50L - ₹1 Crore</option>
//                 <option value="above_1cr">Above ₹1 Crore</option>
//               </select>
//             </div>

//             {loading ? (
//               <p className="text-center py-12 text-slate-500">Loading listings...</p>
//             ) : listings.length === 0 ? (
//               <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
//                 <p>No listings matched your strict filters.</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {listings.map((item) => (
//                   <ListingCard
//                     key={item.listing_id || item.id}
//                     item={item}
//                     isSaved={saved.some((s) => (s.listing_id || s.id) === (item.listing_id || item.id))}
//                     onToggleSave={handleToggleSave}
//                     onSelect={() => handleOpenDetail(item)}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         )} */}

//         {activeTab === 'listings' && (
//           <div>
//             {!user ? (
//               <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
//                 <p className="text-slate-600 mb-4">Please sign in to view and search properties.</p>
//                 <button
//                   onClick={() => setShowLoginModal(true)}
//                   className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium transition hover:bg-emerald-600"
//                 >
//                   Sign In
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-6 bg-white p-4 rounded-xl border border-slate-200">
//                   <input
//                     type="text"
//                     placeholder="Search..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && loadListings({ page: 1, search: searchTerm })}
//                     className="border rounded-lg px-3 py-2 text-sm"
//                   />

//                   <select
//                     value={locality}
//                     onChange={(e) => {
//                       setLocality(e.target.value);
//                       loadListings({ page: 1, locality: e.target.value });
//                     }}
//                     className="border rounded-lg px-3 py-2 text-sm capitalize"
//                   >
//                     <option value="">All Localities ({localitiesList.length})</option>
//                     {localitiesList.map((loc) => (
//                       <option key={loc} value={loc} className="capitalize">{loc}</option>
//                     ))}
//                   </select>

//                   <select
//                     value={bhk}
//                     onChange={(e) => {
//                       setBhk(e.target.value);
//                       loadListings({ page: 1, bhk: e.target.value });
//                     }}
//                     className="border rounded-lg px-3 py-2 text-sm"
//                   >
//                     <option value="">All Bedrooms</option>
//                     {bhkList.map((val) => (
//                       <option key={val} value={val}>{val} BHK</option>
//                     ))}
//                   </select>

//                   <select
//                     value={furnishing}
//                     onChange={(e) => {
//                       setFurnishing(e.target.value);
//                       loadListings({ page: 1, furnishing: e.target.value });
//                     }}
//                     className="border rounded-lg px-3 py-2 text-sm"
//                   >
//                     <option value="">All Furnishing</option>
//                     <option value="Unfurnished">Unfurnished</option>
//                     <option value="Semi-Furnished">Semi-Furnished</option>
//                     <option value="Fully-Furnished">Fully-Furnished</option>
//                   </select>

//                   <select
//                     value={priceRange}
//                     onChange={(e) => {
//                       setPriceRange(e.target.value);
//                       loadListings({ page: 1, priceRange: e.target.value });
//                     }}
//                     className="border rounded-lg px-3 py-2 text-sm"
//                   >
//                     <option value="">All Prices</option>
//                     <option value="under_50l">Under ₹50 Lakh</option>
//                     <option value="50l_1cr">₹50L - ₹1 Crore</option>
//                     <option value="above_1cr">Above ₹1 Crore</option>
//                   </select>
//                 </div>

//                 {loading ? (
//                   <p className="text-center py-12 text-slate-500">Loading listings...</p>
//                 ) : listings.length === 0 ? (
//                   <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
//                     <p>No listings matched your strict filters.</p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                     {listings.map((item) => (
//                       <ListingCard
//                         key={item.listing_id || item.id}
//                         item={item}
//                         isSaved={saved.some((s) => (s.listing_id || s.id) === (item.listing_id || item.id))}
//                         onToggleSave={handleToggleSave}
//                         onSelect={() => handleOpenDetail(item)}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         )}
        
//         {/* TAB 2: RENTALS */}
//         {activeTab === 'rentals' && (
//           <section>
//             <h2 className="text-xl font-bold text-slate-900 mb-6">Rental Properties</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {rentals.map((r) => (
//                 <div 
//                   key={r.id || r.rental_id || r.listing_id} 
//                   onClick={() => window.open(r.listing_url, '_blank')}
//                   className="bg-white p-5 rounded-xl border border-slate-200 cursor-pointer hover:shadow-lg transition-shadow"
//                 >
//                   <h3 className="font-semibold text-slate-800 text-lg">{r.title || `${r.bhk} BHK Rental in ${r.locality}`}</h3>
//                   <p className="text-sm text-slate-500 capitalize">{r.apartment_name} • {r.locality}</p>
//                   <div className="mt-4 flex justify-between items-baseline">
//                     <span className="text-xl font-bold text-emerald-600">₹{r.price?.toLocaleString()}/mo</span>
//                     <span className="text-sm font-medium text-slate-600">{r.carpet_area || r.super_builtup_area} sq.ft</span>
//                   </div>
//                   {r.deposit && <p className="text-xs text-slate-400 mt-1">Deposit: ₹{r.deposit.toLocaleString()}</p>}
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* TAB 3: PROJECTS */}
//         {activeTab === 'projects' && (
//           <section>
//             <h2 className="text-xl font-bold text-slate-900 mb-6">Upcoming & Ongoing Projects</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {projects.map((p) => (
//                 <div 
//                   key={p.id || p.project_id} 
//                   onClick={() => window.open(p.project_url, '_blank')}
//                   className="bg-white p-5 rounded-xl border border-slate-200 cursor-pointer hover:shadow-lg transition-shadow relative"
//                 >
//                   <span className="absolute top-4 right-4 text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
//                     {p.project_status || 'Active'}
//                   </span>
//                   <h3 className="font-bold text-slate-800 text-lg pr-20">{p.apartment_name || p.title}</h3>
//                   <p className="text-sm text-slate-500 capitalize">By {p.developer_name}</p>
//                   <p className="text-sm text-slate-500 capitalize mt-1">{p.locality}</p>
                  
//                   <p className="text-xs text-slate-600 mt-3 font-medium">Area: {p.min_area_sqft} - {p.max_area_sqft} sq.ft</p>
//                   <p className="text-lg font-bold text-slate-900 mt-1">
//                     ₹{p.price_min}Cr - ₹{p.price_max}Cr
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}


//         {/* TAB 4: SAVED (Requirement 4) */}
//         {activeTab === 'saved' && (
//           <div>
//             {!user ? (
//               <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
//                 <p className="text-slate-600">Please sign in to access your saved properties.</p>
//                 <button
//                   onClick={() => setShowLoginModal(true)}
//                   className="mt-3 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm"
//                 >
//                   Sign In
//                 </button>
//               </div>
//             ) : saved.length === 0 ? (
//               <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
//                 <p className="text-slate-600">No properties saved yet.</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {saved.map((item) => (
//                   <ListingCard
//                     key={item.listing_id || item.id}
//                     item={item}
//                     isSaved={true}
//                     onToggleSave={handleToggleSave}
//                     onSelect={() => handleOpenDetail(item)}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* TAB 4: INSIGHTS (Requirement 6) */}
//         {activeTab === 'analytics' && analytics && (
//           <div>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//               <div className="bg-white p-5 rounded-xl border border-slate-200">
//                 <div className="text-xs text-slate-400 font-semibold uppercase">Total Listings</div>
//                 <div className="text-2xl font-bold mt-1">{analytics.totalListings}</div>
//               </div>
//               <div className="bg-white p-5 rounded-xl border border-slate-200">
//                 <div className="text-xs text-slate-400 font-semibold uppercase">Active Listings</div>
//                 <div className="text-2xl font-bold mt-1 text-emerald-600">{analytics.activeListings}</div>
//               </div>
//               <div className="bg-white p-5 rounded-xl border border-slate-200">
//                 <div className="text-xs text-slate-400 font-semibold uppercase">Rentals Tracked</div>
//                 <div className="text-2xl font-bold mt-1">{analytics.totalRentals}</div>
//               </div>
//               <div className="bg-white p-5 rounded-xl border border-slate-200">
//                 <div className="text-xs text-slate-400 font-semibold uppercase">Avg Rate / Sqft</div>
//                 <div className="text-2xl font-bold mt-1">₹{analytics.avgPricePerSqft}</div>
//               </div>
//             </div>
//             <AnalyticsCharts analytics={analytics} />
//           </div>
//         )}

//         {/* MODAL / DETAIL VIEW (Requirement 3) */}
//         {selectedListing && (
//           <PropertyModal item={selectedListing} onClose={handleCloseDetail} />
//         )}
//       </main>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ListingCard from './components/ListingCard';
import PropertyModal from './components/PropertyModal';
import AnalyticsCharts from './components/AnalyticsCharts';
import LoginModal from './components/LoginModal';
import { useAuth } from './context/AuthContext';

import {
  fetchListings,
  fetchListingById,
  fetchProjects,
  fetchRentals,
  fetchAnalytics,
  fetchSaved,
  saveListing,
  removeSavedListing
} from './api';

export default function App() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Listings data & pagination
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Strict Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [locality, setLocality] = useState('');
  const [bhk, setBhk] = useState('');
  const [furnishing, setFurnishing] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [localitiesList, setLocalitiesList] = useState([]);
  const [bhkList, setBhkList] = useState([]);

  // Projects & Rentals
  const [projects, setProjects] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [rentalsLoading, setRentalsLoading] = useState(false);

  // Insights & Saved
  const [analytics, setAnalytics] = useState(null);
  const [saved, setSaved] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // useEffect(() => {
  //   if (user) {
  //     loadListings();
  //     loadAnalytics();
  //     loadSaved();
  //   } else {
  //     setListings([]);
  //     setSaved([]);
  //     setAnalytics(null);
  //     setProjects([]);
  //     setRentals([]);
  //     setActiveTab('listings');
  //   }
  // }, [user]);


  useEffect(() => {
    if (user) {
      // 1. Initial data load
      loadListings();
      loadAnalytics(); 
      loadSaved();
      
      // 2. ✅ BULK FETCH: Sirf ek baar limit 100 ke sath call karke saari localities extract karna
      fetchListings({ page: 1, limit: 100 })
        .then((res) => {
          const allItems = res.data.results || res.data || [];
          
          // Saari unique localities nikal kar state me store kar do
          const uniqueLocalities = [...new Set(allItems.map(item => item.locality?.toLowerCase()).filter(Boolean))];
          setLocalitiesList(uniqueLocalities.sort());
          
          // BHK options fixed
          setBhkList([1, 2, 3, 4]);
        })
        .catch((err) => console.error("Failed to fetch localities", err));

    } else {
      // Logout par saara data aur filters clear kar do
      setListings([]);
      setSaved([]);
      setAnalytics(null);
      setProjects([]);
      setRentals([]);
      setLocalitiesList([]);
      setActiveTab('listings');
    }
  }, [user]);

  
  // Browse Listings with robust filtering fallback
  const loadListings = async (customParams = {}) => {
    setLoading(true);
    try {
      const activeLoc = customParams.locality !== undefined ? customParams.locality : locality;
      const activeBhk = customParams.bhk !== undefined ? customParams.bhk : bhk;
      const activeFurn = customParams.furnishing !== undefined ? customParams.furnishing : furnishing;
      const activeRange = customParams.priceRange !== undefined ? customParams.priceRange : priceRange;
      const activeSearch = customParams.search !== undefined ? customParams.search : searchTerm;
      const activePage = customParams.page !== undefined ? customParams.page : page;

      let minPrice, maxPrice;
      if (activeRange === 'under_50l') maxPrice = 5000000;
      else if (activeRange === '50l_1cr') { minPrice = 5000000; maxPrice = 10000000; }
      else if (activeRange === 'above_1cr') minPrice = 10000000;

      const params = {
        page: activePage,
        limit: 12,
        ...(activeLoc && { locality: activeLoc }),
        ...(activeBhk && { bhk: activeBhk }),
        ...(activeFurn && { furnishing: activeFurn.toLowerCase() }) // API might expect lowercase
      };

      const res = await fetchListings(params);
      let results = res.data.results || res.data || [];

      // Frontend Search Filter
      if (activeSearch) {
        const searchLower = activeSearch.toLowerCase();
        results = results.filter((item) =>
          (item.title?.toLowerCase().includes(searchLower)) ||
          (item.locality?.toLowerCase().includes(searchLower)) ||
          (item.apartment_name?.toLowerCase().includes(searchLower))
        );
      }

      // Frontend Price Filter
      if (minPrice) results = results.filter((item) => Number(item.price) >= minPrice);
      if (maxPrice) results = results.filter((item) => Number(item.price) <= maxPrice);

      setListings(results);
      setTotalPages(res.data.total_pages || res.data.totalPages || 1);
      if (customParams.page !== undefined) setPage(customParams.page);
    } catch (err) {
      console.error(err);
      showToast('Failed to load listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadRentalsAndProjects = async () => {
    setRentalsLoading(true);
    try {
      const [projRes, rentRes] = await Promise.all([fetchProjects(), fetchRentals()]);
      setProjects(projRes.data.results || projRes.data || []);
      setRentals(rentRes.data.results || rentRes.data || []);
    } catch (err) {
      console.error('Error fetching rentals/projects', err);
    } finally {
      setRentalsLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const res = await fetchAnalytics();
      setAnalytics(res.data);
      if (res.data?.localityCounts) {
        setLocalitiesList(Object.keys(res.data.localityCounts).sort());
      }
      if (res.data?.bhkCounts) {
        setBhkList(
          Object.keys(res.data.bhkCounts)
            .map(Number)
            .filter((n) => !isNaN(n) && n > 0)
            .sort((a, b) => a - b)
        );
      }
    } catch (err) {
      console.error('Failed to load analytics', err);
    }
  };

  const loadSaved = async () => {
    if (!user) {
      setSaved([]);
      return;
    }
    try {
      const res = await fetchSaved();
      setSaved(res.data.results || res.data || []);
    } catch (err) {
      console.error('Failed to load saved listings', err);
    }
  };

  const handleToggleSave = async (item) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    const targetId = item.listing_id || item.id;
    const existing = saved.find((s) => (s.listing_id || s.id) === targetId || s.saved_id === targetId);

    try {
      if (existing) {
        const deleteId = existing.saved_id || existing.id || targetId;
        await removeSavedListing(deleteId);
        setSaved((prev) => prev.filter((s) => (s.listing_id || s.id) !== targetId && s.saved_id !== deleteId));
        showToast('Removed from Saved', 'info');
      } else {
        const res = await saveListing(targetId);
        setSaved((prev) => [...prev, { ...item, saved_id: res.data?.id || targetId }]);
        showToast('Saved to your collection!', 'success');
      }
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleOpenDetail = (item) => {
    setSelectedListing(item);
    window.history.pushState({}, '', `/listings/${item.listing_id || item.id}`);
  };

  const handleCloseDetail = () => {
    setSelectedListing(null);
    window.history.pushState({}, '', '/');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
          <div className="px-4 py-2 rounded-lg shadow-lg text-sm font-semibold bg-slate-900 text-white">
            {toast.message}
          </div>
        </div>
      )}

      {showLoginModal && (
        <LoginModal
          onSuccess={() => {
            setShowLoginModal(false);
            loadSaved();
          }}
        />
      )}

      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if ((tab === 'rentals' || tab === 'projects') && rentals.length === 0) loadRentalsAndProjects();
        }}
        savedCount={saved.length}
        user={user}
        onLoginClick={() => setShowLoginModal(true)}
        onLogoutClick={logout}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* TAB 1: LISTINGS */}
        {activeTab === 'listings' && (
          <div>
            {!user ? (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-600 mb-4">Please sign in to view and search properties.</p>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium transition hover:bg-emerald-600"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-6 bg-white p-4 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    placeholder="Search title, locality..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadListings({ page: 1, search: searchTerm })}
                    className="border rounded-lg px-3 py-2 text-sm"
                  />

                  <select
                    value={locality}
                    onChange={(e) => {
                      setLocality(e.target.value);
                      loadListings({ page: 1, locality: e.target.value });
                    }}
                    className="border rounded-lg px-3 py-2 text-sm capitalize"
                  >
                    <option value="">All Localities ({localitiesList.length})</option>
                    {localitiesList.map((loc) => (
                      <option key={loc} value={loc} className="capitalize">{loc}</option>
                    ))}
                  </select>

                  <select
                    value={bhk}
                    onChange={(e) => {
                      setBhk(e.target.value);
                      loadListings({ page: 1, bhk: e.target.value });
                    }}
                    className="border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">All Bedrooms</option>
                    {bhkList.length > 0 ? (
                      bhkList.map((val) => <option key={val} value={val}>{val} BHK</option>)
                    ) : (
                      [1, 2, 3, 4].map((val) => <option key={val} value={val}>{val} BHK</option>)
                    )}
                  </select>

                  <select
                    value={furnishing}
                    onChange={(e) => {
                      setFurnishing(e.target.value);
                      loadListings({ page: 1, furnishing: e.target.value });
                    }}
                    className="border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">All Furnishing</option>
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Fully-Furnished">Fully-Furnished</option>
                  </select>

                  <select
                    value={priceRange}
                    onChange={(e) => {
                      setPriceRange(e.target.value);
                      loadListings({ page: 1, priceRange: e.target.value });
                    }}
                    className="border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">All Prices</option>
                    <option value="under_50l">Under ₹50 Lakh</option>
                    <option value="50l_1cr">₹50L - ₹1 Crore</option>
                    <option value="above_1cr">Above ₹1 Crore</option>
                  </select>
                </div>

                {loading ? (
                  <p className="text-center py-12 text-slate-500">Loading listings...</p>
                ) : listings.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <p>No listings matched your filters.</p>
                    <button 
                      onClick={() => {
                        setSearchTerm(''); setLocality(''); setBhk(''); setFurnishing(''); setPriceRange('');
                        loadListings({ page: 1, search: '', locality: '', bhk: '', furnishing: '', priceRange: '' });
                      }}
                      className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {listings.map((item) => (
                        <ListingCard
                          key={item.listing_id || item.id}
                          item={item}
                          isSaved={saved.some((s) => (s.listing_id || s.id) === (item.listing_id || item.id))}
                          onToggleSave={handleToggleSave}
                          onSelect={() => handleOpenDetail(item)}
                        />
                      ))}
                    </div>

                    {/* PAGINATION UI */}
                    {/* <div className="flex justify-center items-center space-x-4 mt-8">
                      <button
                        disabled={page <= 1}
                        onClick={() => loadListings({ page: page - 1 })}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-slate-600 font-medium">
                        Page {page} of {totalPages}
                      </span>
                      <button
                        disabled={page >= totalPages}
                        onClick={() => loadListings({ page: page + 1 })}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
                      >
                        Next
                      </button>
                    </div> */}
                    {/* ✅ FIXED PAGINATION UI */}
                    <div className="flex justify-center items-center space-x-4 mt-8 mb-8">
                      <button
                        disabled={page <= 1}
                        onClick={() => {
                          window.scrollTo(0, 0); // Click karne par page upar scroll hoga
                          loadListings({ page: page - 1 });
                        }}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
                      >
                        Previous
                      </button>
                      
                      <span className="text-sm text-slate-600 font-medium">
                        Page {page}
                      </span>
                      
                      <button
                        disabled={page >= totalPages && listings.length < 12}
                        onClick={() => {
                          window.scrollTo(0, 0);
                          loadListings({ page: page + 1 });
                        }}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
        
        {/* TAB 2: RENTALS */}
        {activeTab === 'rentals' && (
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Rental Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rentals.map((r) => (
                <div 
                  key={r.id || r.rental_id || r.listing_id} 
                  onClick={() => window.open(r.listing_url, '_blank')}
                  className="bg-white p-5 rounded-xl border border-slate-200 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold text-slate-800 text-lg">{r.title || `${r.bhk} BHK Rental in ${r.locality}`}</h3>
                  <p className="text-sm text-slate-500 capitalize">{r.apartment_name} • {r.locality}</p>
                  <div className="mt-4 flex justify-between items-baseline">
                    <span className="text-xl font-bold text-emerald-600">₹{r.price?.toLocaleString()}/mo</span>
                    <span className="text-sm font-medium text-slate-600">{r.carpet_area || r.super_builtup_area} sq.ft</span>
                  </div>
                  {r.deposit && <p className="text-xs text-slate-400 mt-1">Deposit: ₹{r.deposit.toLocaleString()}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: PROJECTS */}
        {activeTab === 'projects' && (
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Upcoming & Ongoing Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((p) => (
                <div 
                  key={p.id || p.project_id} 
                  onClick={() => window.open(p.project_url, '_blank')}
                  className="bg-white p-5 rounded-xl border border-slate-200 cursor-pointer hover:shadow-lg transition-shadow relative"
                >
                  <span className="absolute top-4 right-4 text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                    {p.project_status || 'Active'}
                  </span>
                  <h3 className="font-bold text-slate-800 text-lg pr-20">{p.apartment_name || p.title}</h3>
                  <p className="text-sm text-slate-500 capitalize">By {p.developer_name}</p>
                  <p className="text-sm text-slate-500 capitalize mt-1">{p.locality}</p>
                  
                  <p className="text-xs text-slate-600 mt-3 font-medium">Area: {p.min_area_sqft} - {p.max_area_sqft} sq.ft</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    ₹{p.price_min}Cr - ₹{p.price_max}Cr
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 4: SAVED */}
        {activeTab === 'saved' && (
          <div>
            {!user ? (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-600">Please sign in to access your saved properties.</p>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="mt-3 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm"
                >
                  Sign In
                </button>
              </div>
            ) : saved.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-600">No properties saved yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {saved.map((item) => (
                  <ListingCard
                    key={item.listing_id || item.id}
                    item={item}
                    isSaved={true}
                    onToggleSave={handleToggleSave}
                    onSelect={() => handleOpenDetail(item)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: INSIGHTS */}
        {activeTab === 'analytics' && analytics && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-400 font-semibold uppercase">Total Listings</div>
                <div className="text-2xl font-bold mt-1">{analytics.totalListings}</div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-400 font-semibold uppercase">Active Listings</div>
                <div className="text-2xl font-bold mt-1 text-emerald-600">{analytics.activeListings}</div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-400 font-semibold uppercase">Rentals Tracked</div>
                <div className="text-2xl font-bold mt-1">{analytics.totalRentals}</div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-400 font-semibold uppercase">Avg Rate / Sqft</div>
                <div className="text-2xl font-bold mt-1">₹{analytics.avgPricePerSqft}</div>
              </div>
            </div>
            <AnalyticsCharts analytics={analytics} />
          </div>
        )}

        {/* MODAL / DETAIL VIEW */}
        {selectedListing && (
          <PropertyModal item={selectedListing} onClose={handleCloseDetail} />
        )}
      </main>
    </div>
  );
}