
// // import { useState, useEffect } from 'react';
// // import Navbar from './components/Navbar';
// // import ListingCard from './components/ListingCard';
// // import RentalCard from './components/RentalCard';
// // import ProjectCard from './components/ProjectCard';
// // import PropertyModal from './components/PropertyModal';
// // import AnalyticsCharts from './components/AnalyticsCharts';
// // import LoginModal from './components/LoginModal';
// // import { useAuth } from './context/AuthContext';
// // import Insights from './components/Insights';

// // import {   
// //   fetchListings,
// //   fetchListingById,
// //   fetchProjects,
// //   fetchRentals,
// //   fetchAnalytics,
// //   fetchSaved,
// //   saveListing,
// //   removeSavedListing
// // } from './api';

// // export default function App() {
// //   const { user, logout } = useAuth();
// //   const [activeTab, setActiveTab] = useState('listings');
// //   const [showLoginModal, setShowLoginModal] = useState(false);

// //   // Listings data & pagination
// //   const [allListings, setAllListings] = useState([]);
// //   const [listings, setListings] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [page, setPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);

// //   // Strict Filters
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [locality, setLocality] = useState('');
// //   const [bhk, setBhk] = useState('');
// //   const [furnishing, setFurnishing] = useState('');
// //   const [priceRange, setPriceRange] = useState('');
  
// //   // Dynamic Options
// //   const [localitiesList, setLocalitiesList] = useState([]);
// //   const [bhkList, setBhkList] = useState([]);
// //   const [priceOptions, setPriceOptions] = useState([]);

// //   // Projects & Rentals (with their own Pagination States)
// //   const [projects, setProjects] = useState([]);
// //   const [rentals, setRentals] = useState([]);
// //   const [rentalsLoading, setRentalsLoading] = useState(false);
// //   const [projectsPage, setProjectsPage] = useState(1);
// //   const [rentalsPage, setRentalsPage] = useState(1);

// //   // Insights & Saved
// //   const [analytics, setAnalytics] = useState(null);
// //   const [saved, setSaved] = useState([]);
// //   const [selectedListing, setSelectedListing] = useState(null);
// //   const [toast, setToast] = useState(null);

// //   const showToast = (message, type = 'success') => {
// //     setToast({ message, type });
// //     setTimeout(() => setToast(null), 3000);
// //   };

// //   const parsePrice = (val) => {
// //     if (!val) return 0;
// //     return Number(String(val).replace(/,/g, '').replace(/[^\d.-]/g, ''));
// //   };

// //   useEffect(() => {
// //     if (user) {
// //       loadAnalytics(); 
// //       loadSaved();
// //       fetchAllData(); 
// //     } else {
// //       setAllListings([]);
// //       setListings([]);
// //       setSaved([]);
// //       setAnalytics(null);
// //       setProjects([]);
// //       setRentals([]);
// //       setLocalitiesList([]);
// //       setBhkList([]);
// //       setPriceOptions([]);
// //       setActiveTab('listings');
// //     }
// //   }, [user]);

 
// //   // ✅ LOOP FETCH (Using offset & limit): API se 3500+ properties ek sath fetch karna
// //   const fetchAllData = async () => {
// //     setLoading(true);
// //     try {
// //       let allItems = [];
// //       let currentOffset = 0;
// //       let hasMore = true;

// //       // Loop lagakar saara data offset se fetch karenge
// //       while (hasMore) {
// //         const res = await fetchListings({ limit: 100, offset: currentOffset });
// //         const dataObj = res.data || {};
        
// //         // Data nikalo
// //         const items = dataObj.results || dataObj.data || (Array.isArray(dataObj) ? dataObj : []);
// //         allItems = [...allItems, ...items];

// //         // Agar 'has_more: false' ho ya items na bache ho toh loop stop karo
// //         if (dataObj.has_more === false || items.length === 0) {
// //           hasMore = false;
// //         } else {
// //           currentOffset += 100; // Next batch ke liye offset badha do
// //         }
// //       }

// //       // Duplicate hatane ke liye check
// //       const uniqueItems = Array.from(new Map(allItems.map(item => [item.listing_id || item.id, item])).values());
      
// //       setAllListings(uniqueItems);

// //       // Localities extract karo
// //       const uniqueLocalities = [...new Set(uniqueItems.map(item => item.locality?.toLowerCase()).filter(Boolean))];
// //       setLocalitiesList(uniqueLocalities.sort());
      
// //       // BHKs extract karo
// //       const fetchedBhks = uniqueItems.map(item => Number(item.bhk)).filter(n => !isNaN(n) && n > 0);
// //       const combinedBhks = [...new Set([...fetchedBhks, 1, 2, 3, 4, 5, 6, 7, 8])]; 
// //       setBhkList(combinedBhks.sort((a, b) => a - b));

// //       // Prices
// //       setPriceOptions([
// //         { label: 'Under ₹50 Lakh', value: '0-5000000' },
// //         { label: '₹50L - ₹1 Crore', value: '5000000-10000000' },
// //         { label: '₹1 Crore - ₹2 Crore', value: '10000000-20000000' },
// //         { label: '₹2 Crore - ₹5 Crore', value: '20000000-50000000' },
// //         { label: 'Above ₹5 Crore', value: '50000000-9999999999' }
// //       ]);

// //       // Data aane ke baad first filter apply karo
// //       applyFilters(uniqueItems, { page: 1 });

// //     } catch (err) {
// //       console.error("Failed to fetch complete data", err);
// //       showToast('Failed to load listings', 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const applyFilters = (sourceData, customParams = {}) => {
// //     const dataToFilter = sourceData || allListings;

// //     const activeLoc = customParams.locality !== undefined ? customParams.locality : locality;
// //     const activeBhk = customParams.bhk !== undefined ? customParams.bhk : bhk;
// //     const activeFurn = customParams.furnishing !== undefined ? customParams.furnishing : furnishing;
// //     const activeRange = customParams.priceRange !== undefined ? customParams.priceRange : priceRange;
// //     const activeSearch = customParams.search !== undefined ? customParams.search : searchTerm;
// //     const activePage = customParams.page !== undefined ? customParams.page : page;

// //     let filtered = [...dataToFilter];

// //     if (activeSearch) {
// //       const searchLower = activeSearch.toLowerCase();
// //       filtered = filtered.filter((item) =>
// //         (item.title?.toLowerCase().includes(searchLower)) ||
// //         (item.locality?.toLowerCase().includes(searchLower)) ||
// //         (item.apartment_name?.toLowerCase().includes(searchLower))
// //       );
// //     }

// //     if (activeLoc) {
// //       filtered = filtered.filter(item => item.locality?.toLowerCase() === activeLoc.toLowerCase());
// //     }

// //     if (activeBhk) {
// //       filtered = filtered.filter(item => Number(item.bhk) === Number(activeBhk));
// //     }

// //     if (activeFurn) {
// //       filtered = filtered.filter(item => item.furnishing?.toLowerCase() === activeFurn.toLowerCase());
// //     }

// //     if (activeRange) {
// //       const [min, max] = activeRange.split('-');
// //       const minPrice = Number(min);
// //       const maxPrice = Number(max);
// //       filtered = filtered.filter(item => {
// //         const price = parsePrice(item.price);
// //         return price >= minPrice && price <= maxPrice;
// //       });
// //     }

// //     const startIndex = (activePage - 1) * 12;
// //     const paginatedResults = filtered.slice(startIndex, startIndex + 12);

// //     setListings(paginatedResults);
// //     setTotalPages(Math.ceil(filtered.length / 12) || 1);
// //     if (customParams.page !== undefined) setPage(customParams.page);
// //   };

// //   const loadListings = (customParams = {}) => {
// //     if (allListings.length > 0) {
// //       applyFilters(allListings, customParams);
// //     }
// //   };

// //   const loadRentalsAndProjects = async () => {
// //     setRentalsLoading(true);
// //     try {
// //       // 1. Projects Fetch Loop
// //       let allProjectsData = [];
// //       let projOffset = 0;
// //       let projHasMore = true;

// //       while (projHasMore) {
// //         const projRes = await fetchProjects({ limit: 100, offset: projOffset });
// //         const dataObj = projRes.data || {};
// //         const items = dataObj.results || dataObj.data || [];
// //         allProjectsData = [...allProjectsData, ...items];

// //         if (dataObj.has_more === false || items.length === 0) projHasMore = false;
// //         else projOffset += 100;
// //       }
// //       setProjects(allProjectsData);

// //       // 2. Rentals Fetch Loop
// //       let allRentalsData = [];
// //       let rentOffset = 0;
// //       let rentHasMore = true;

// //       while (rentHasMore) {
// //         const rentRes = await fetchRentals({ limit: 100, offset: rentOffset });
// //         const dataObj = rentRes.data || {};
// //         const items = dataObj.results || dataObj.data || [];
// //         allRentalsData = [...allRentalsData, ...items];

// //         if (dataObj.has_more === false || items.length === 0) rentHasMore = false;
// //         else rentOffset += 100;
// //       }
// //       setRentals(allRentalsData);

// //     } catch (err) {
// //       console.error('Error fetching rentals/projects', err);
// //     } finally {
// //       setRentalsLoading(false);
// //     }
// //   };

// //   const loadAnalytics = async () => {
// //     try {
// //       const res = await fetchAnalytics();
// //       setAnalytics(res.data);
// //     } catch (err) {
// //       console.error('Failed to load analytics', err);
// //     }
// //   };

// //   const loadSaved = async () => {
// //     if (!user) {
// //       setSaved([]);
// //       return;
// //     }
// //     try {
// //       const res = await fetchSaved();
// //       setSaved(res.data.results || res.data || []);
// //     } catch (err) {
// //       console.error('Failed to load saved listings', err);
// //     }
// //   };

// //   const handleToggleSave = async (item) => {
// //     if (!user) {
// //       setShowLoginModal(true);
// //       return;
// //     }
// //     const targetId = item.listing_id || item.id;
// //     const existing = saved.find((s) => (s.listing_id || s.id) === targetId || s.saved_id === targetId);

// //     try {
// //       if (existing) {
// //         const deleteId = existing.saved_id || existing.id || targetId;
// //         await removeSavedListing(deleteId);
// //         setSaved((prev) => prev.filter((s) => (s.listing_id || s.id) !== targetId && s.saved_id !== deleteId));
// //         showToast('Removed from Saved', 'info');
// //       } else {
// //         const res = await saveListing(targetId);
// //         setSaved((prev) => [...prev, { ...item, saved_id: res.data?.id || targetId }]);
// //         showToast('Saved to your collection!', 'success');
// //       }
// //     } catch (err) {
// //       showToast('Action failed', 'error');
// //     }
// //   };

// //   const handleOpenDetail = (item) => {
// //     setSelectedListing(item);
// //     window.history.pushState({}, '', `/listings/${item.listing_id || item.id}`);
// //   };

// //   const handleCloseDetail = () => {
// //     setSelectedListing(null);
// //     window.history.pushState({}, '', '/');
// //   };

// //   return (
// //     <div className="min-h-screen bg-slate-50 text-slate-800">
// //       {toast && (
// //         <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
// //           <div className="px-4 py-2 rounded-lg shadow-lg text-sm font-semibold bg-slate-900 text-white">
// //             {toast.message}
// //           </div>
// //         </div>
// //       )}

// //       {showLoginModal && (
// //         <LoginModal
// //           onSuccess={() => {
// //             setShowLoginModal(false);
// //             loadSaved();
// //           }}
// //         />
// //       )}

// //       <Navbar
// //         activeTab={activeTab}
// //         setActiveTab={(tab) => {
// //           setActiveTab(tab);
// //           if ((tab === 'rentals' || tab === 'projects') && rentals.length === 0) loadRentalsAndProjects();
// //         }}
// //         savedCount={saved.length}
// //         user={user}
// //         onLoginClick={() => setShowLoginModal(true)}
// //         onLogoutClick={logout}
// //       />

// //       <main className="max-w-7xl mx-auto px-4 py-8">
        
// //         {/* TAB 1: LISTINGS */}
// //         {activeTab === 'listings' && (
// //           <div>
// //             {!user ? (
// //               <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
// //                 <p className="text-slate-600 mb-4">Please sign in to view and search properties.</p>
// //                 <button
// //                   onClick={() => setShowLoginModal(true)}
// //                   className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium transition hover:bg-emerald-600"
// //                 >
// //                   Sign In
// //                 </button>
// //               </div>
// //             ) : (
// //               <>
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-6 bg-white p-4 rounded-xl border border-slate-200">
// //                   <input
// //                     type="text"
// //                     placeholder="Search title, locality..."
// //                     value={searchTerm}
// //                     onChange={(e) => setSearchTerm(e.target.value)}
// //                     onKeyDown={(e) => e.key === 'Enter' && loadListings({ page: 1, search: searchTerm })}
// //                     className="border rounded-lg px-3 py-2 text-sm"
// //                   />

// //                   <select
// //                     value={locality}
// //                     onChange={(e) => {
// //                       setLocality(e.target.value);
// //                       loadListings({ page: 1, locality: e.target.value });
// //                     }}
// //                     className="border rounded-lg px-3 py-2 text-sm capitalize"
// //                   >
// //                     <option value="">All Localities ({localitiesList.length})</option>
// //                     {localitiesList.map((loc) => (
// //                       <option key={loc} value={loc} className="capitalize">{loc}</option>
// //                     ))}
// //                   </select>

// //                   <select
// //                     value={bhk}
// //                     onChange={(e) => {
// //                       setBhk(e.target.value);
// //                       loadListings({ page: 1, bhk: e.target.value });
// //                     }}
// //                     className="border rounded-lg px-3 py-2 text-sm"
// //                   >
// //                     <option value="">All Bedrooms</option>
// //                     {bhkList.length > 0 ? (
// //                       bhkList.map((val) => <option key={val} value={val}>{val} BHK</option>)
// //                     ) : (
// //                       [1, 2, 3, 4, 5, 6, 7, 8].map((val) => <option key={val} value={val}>{val} BHK</option>)
// //                     )}
// //                   </select>

// //                   <select
// //                     value={furnishing}
// //                     onChange={(e) => {
// //                       setFurnishing(e.target.value);
// //                       loadListings({ page: 1, furnishing: e.target.value });
// //                     }}
// //                     className="border rounded-lg px-3 py-2 text-sm"
// //                   >
// //                     <option value="">All Furnishing</option>
// //                     <option value="Unfurnished">Unfurnished</option>
// //                     <option value="Semi-Furnished">Semi-Furnished</option>
// //                     <option value="Fully-Furnished">Fully-Furnished</option>
// //                   </select>

// //                   <select
// //                     value={priceRange}
// //                     onChange={(e) => {
// //                       setPriceRange(e.target.value);
// //                       loadListings({ page: 1, priceRange: e.target.value });
// //                     }}
// //                     className="border rounded-lg px-3 py-2 text-sm"
// //                   >
// //                     <option value="">All Prices</option>
// //                     {priceOptions.map((opt) => (
// //                       <option key={opt.value} value={opt.value}>{opt.label}</option>
// //                     ))}
// //                   </select>
// //                 </div>

// //                 {loading ? (
// //                   <p className="text-center py-12 text-slate-500">Loading complete database...</p>
// //                 ) : listings.length === 0 ? (
// //                   <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
// //                     <p>No listings matched your filters.</p>
// //                     <button 
// //                       onClick={() => {
// //                         setSearchTerm(''); setLocality(''); setBhk(''); setFurnishing(''); setPriceRange('');
// //                         loadListings({ page: 1, search: '', locality: '', bhk: '', furnishing: '', priceRange: '' });
// //                       }}
// //                       className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm"
// //                     >
// //                       Clear Filters
// //                     </button>
// //                   </div>
// //                 ) : (
// //                   <>
// //                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
// //                       {listings.map((item) => (
// //                         <ListingCard
// //                           key={item.listing_id || item.id}
// //                           item={item}
// //                           isSaved={saved.some((s) => (s.listing_id || s.id) === (item.listing_id || item.id))}
// //                           onToggleSave={handleToggleSave}
// //                           onSelect={() => handleOpenDetail(item)}
// //                         />
// //                       ))}
// //                     </div>

// //                     <div className="flex justify-center items-center space-x-4 mt-8 mb-8">
// //                       <button
// //                         disabled={page <= 1}
// //                         onClick={() => {
// //                           window.scrollTo(0, 0); 
// //                           loadListings({ page: page - 1 });
// //                         }}
// //                         className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
// //                       >
// //                         Previous
// //                       </button>
                      
// //                       <span className="text-sm text-slate-600 font-medium">
// //                         Page {page} of {totalPages}
// //                       </span>
                      
// //                       <button
// //                         disabled={page >= totalPages}
// //                         onClick={() => {
// //                           window.scrollTo(0, 0);
// //                           loadListings({ page: page + 1 });
// //                         }}
// //                         className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
// //                       >
// //                         Next
// //                       </button>
// //                     </div>
// //                   </>
// //                 )}
// //               </>
// //             )}
// //           </div>
// //         )}
        
// //         {/* TAB 2: RENTALS */}
// //         {activeTab === 'rentals' && (
// //           <section>
// //             <h2 className="text-xl font-bold text-slate-900 mb-6">Rental Properties</h2>
// //             {rentalsLoading ? (
// //               <p className="text-center py-12 text-slate-500">Loading complete database...</p>
// //             ) : (
// //               <>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                   {rentals.slice((rentalsPage - 1) * 12, rentalsPage * 12).map((r) => (
// //                     <RentalCard key={r.id || r.rental_id || r.listing_id} rental={r} />
// //                   ))}
// //                 </div>
                
// //                 {/* Rentals Pagination */}
// //                 <div className="flex justify-center items-center space-x-4 mt-8 mb-8">
// //                   <button
// //                     disabled={rentalsPage <= 1}
// //                     onClick={() => { window.scrollTo(0, 0); setRentalsPage(rentalsPage - 1); }}
// //                     className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
// //                   >
// //                     Previous
// //                   </button>
// //                   <span className="text-sm text-slate-600 font-medium">
// //                     Page {rentalsPage} of {Math.ceil(rentals.length / 12) || 1}
// //                   </span>
// //                   <button
// //                     disabled={rentalsPage >= Math.ceil(rentals.length / 12)}
// //                     onClick={() => { window.scrollTo(0, 0); setRentalsPage(rentalsPage + 1); }}
// //                     className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
// //                   >
// //                     Next
// //                   </button>
// //                 </div>
// //               </>
// //             )}
// //           </section>
// //         )}

// //         {/* TAB 3: PROJECTS */}
// //         {activeTab === 'projects' && (
// //           <section>
// //             <h2 className="text-xl font-bold text-slate-900 mb-6">Upcoming & Ongoing Projects</h2>
// //             {rentalsLoading ? (
// //               <p className="text-center py-12 text-slate-500">Loading complete database...</p>
// //             ) : (
// //               <>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                   {projects.slice((projectsPage - 1) * 12, projectsPage * 12).map((p) => (
// //                     <ProjectCard key={p.id || p.project_id} project={p} />
// //                   ))}
// //                 </div>
                
// //                 {/* Projects Pagination */}
// //                 <div className="flex justify-center items-center space-x-4 mt-8 mb-8">
// //                   <button
// //                     disabled={projectsPage <= 1}
// //                     onClick={() => { window.scrollTo(0, 0); setProjectsPage(projectsPage - 1); }}
// //                     className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
// //                   >
// //                     Previous
// //                   </button>
// //                   <span className="text-sm text-slate-600 font-medium">
// //                     Page {projectsPage} of {Math.ceil(projects.length / 12) || 1}
// //                   </span>
// //                   <button
// //                     disabled={projectsPage >= Math.ceil(projects.length / 12)}
// //                     onClick={() => { window.scrollTo(0, 0); setProjectsPage(projectsPage + 1); }}
// //                     className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
// //                   >
// //                     Next
// //                   </button>
// //                 </div>
// //               </>
// //             )}
// //           </section>
// //         )}

// //         {/* TAB 4: SAVED */}
// //         {activeTab === 'saved' && (
// //           <div>
// //             {!user ? (
// //               <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
// //                 <p className="text-slate-600">Please sign in to access your saved properties.</p>
// //                 <button
// //                   onClick={() => setShowLoginModal(true)}
// //                   className="mt-3 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm"
// //                 >
// //                   Sign In
// //                 </button>
// //               </div>
// //             ) : saved.length === 0 ? (
// //               <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
// //                 <p className="text-slate-600">No properties saved yet.</p>
// //               </div>
// //             ) : (
// //               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
// //                 {saved.map((item) => (
// //                   <ListingCard
// //                     key={item.listing_id || item.id}
// //                     item={item}
// //                     isSaved={true}
// //                     onToggleSave={handleToggleSave}
// //                     onSelect={() => handleOpenDetail(item)}
// //                   />
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* TAB 5: INSIGHTS */}
// //         {activeTab === 'analytics' && analytics && (
// //           <div>
// //             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
// //               <div className="bg-white p-5 rounded-xl border border-slate-200">
// //                 <div className="text-xs text-slate-400 font-semibold uppercase">Total Listings</div>
// //                 <div className="text-2xl font-bold mt-1">{analytics.totalListings}</div>
// //               </div>
// //               <div className="bg-white p-5 rounded-xl border border-slate-200">
// //                 <div className="text-xs text-slate-400 font-semibold uppercase">Active Listings</div>
// //                 <div className="text-2xl font-bold mt-1 text-emerald-600">{analytics.activeListings}</div>
// //               </div>
// //               <div className="bg-white p-5 rounded-xl border border-slate-200">
// //                 <div className="text-xs text-slate-400 font-semibold uppercase">Rentals Tracked</div>
// //                 <div className="text-2xl font-bold mt-1">{analytics.totalRentals}</div>
// //               </div>
// //               <div className="bg-white p-5 rounded-xl border border-slate-200">
// //                 <div className="text-xs text-slate-400 font-semibold uppercase">Avg Rate / Sqft</div>
// //                 <div className="text-2xl font-bold mt-1">₹{analytics.avgPricePerSqft}</div>
// //               </div>
// //             </div>
// //             <AnalyticsCharts analytics={analytics} />
// //           </div>
// //         )}

// //         {/* MODAL / DETAIL VIEW */}
// //         {selectedListing && (
// //           <PropertyModal item={selectedListing} onClose={handleCloseDetail} />
// //         )}
// //       </main>
// //     </div>
// //   );
// // }



// import { useState, useEffect } from 'react';
// import Navbar from './components/Navbar';
// import ListingCard from './components/ListingCard';
// import RentalCard from './components/RentalCard';
// import ProjectCard from './components/ProjectCard';
// import PropertyModal from './components/PropertyModal';
// import AnalyticsCharts from './components/AnalyticsCharts';
// import LoginModal from './components/LoginModal';
// import { useAuth } from './context/AuthContext';
// import Insights from './components/Insights';

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
//   const [allListings, setAllListings] = useState([]);
//   const [listings, setListings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // Strict Filters
//   const [searchTerm, setSearchTerm] = useState('');
//   const [locality, setLocality] = useState('');
//   const [bhk, setBhk] = useState('');
//   const [furnishing, setFurnishing] = useState('');
//   const [priceRange, setPriceRange] = useState('');
  
//   // Dynamic Options
//   const [localitiesList, setLocalitiesList] = useState([]);
//   const [bhkList, setBhkList] = useState([]);
//   const [priceOptions, setPriceOptions] = useState([]);

//   // Projects & Rentals (with their own Pagination States)
//   const [projects, setProjects] = useState([]);
//   const [rentals, setRentals] = useState([]);
//   const [rentalsLoading, setRentalsLoading] = useState(false);
//   const [projectsPage, setProjectsPage] = useState(1);
//   const [rentalsPage, setRentalsPage] = useState(1);

//   // Insights & Saved
//   const [analytics, setAnalytics] = useState(null);
//   const [saved, setSaved] = useState([]);
//   const [selectedListing, setSelectedListing] = useState(null);
//   const [toast, setToast] = useState(null);

//   const showToast = (message, type = 'success') => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const parsePrice = (val) => {
//     if (!val) return 0;
//     return Number(String(val).replace(/,/g, '').replace(/[^\d.-]/g, ''));
//   };

//   useEffect(() => {
//     if (user) {
//       loadAnalytics(); 
//       loadSaved();
//       fetchAllData(); 
//       loadRentalsAndProjects(); // Initial load for rentals/projects/insights
//     } else {
//       setAllListings([]);
//       setListings([]);
//       setSaved([]);
//       setAnalytics(null);
//       setProjects([]);
//       setRentals([]);
//       setLocalitiesList([]);
//       setBhkList([]);
//       setPriceOptions([]);
//       setActiveTab('listings');
//     }
//   }, [user]);

//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       let allItems = [];
//       let currentOffset = 0;
//       let hasMore = true;

//       while (hasMore) {
//         const res = await fetchListings({ limit: 100, offset: currentOffset });
//         const dataObj = res.data || {};
//         const items = dataObj.results || dataObj.data || (Array.isArray(dataObj) ? dataObj : []);
//         allItems = [...allItems, ...items];

//         if (dataObj.has_more === false || items.length === 0) {
//           hasMore = false;
//         } else {
//           currentOffset += 100;
//         }
//       }

//       const uniqueItems = Array.from(new Map(allItems.map(item => [item.listing_id || item.id, item])).values());
//       setAllListings(uniqueItems);

//       const uniqueLocalities = [...new Set(uniqueItems.map(item => item.locality?.toLowerCase()).filter(Boolean))];
//       setLocalitiesList(uniqueLocalities.sort());
      
//       const fetchedBhks = uniqueItems.map(item => Number(item.bhk)).filter(n => !isNaN(n) && n > 0);
//       const combinedBhks = [...new Set([...fetchedBhks, 1, 2, 3, 4, 5, 6, 7, 8])]; 
//       setBhkList(combinedBhks.sort((a, b) => a - b));

//       setPriceOptions([
//         { label: 'Under ₹50 Lakh', value: '0-5000000' },
//         { label: '₹50L - ₹1 Crore', value: '5000000-10000000' },
//         { label: '₹1 Crore - ₹2 Crore', value: '10000000-20000000' },
//         { label: '₹2 Crore - ₹5 Crore', value: '20000000-50000000' },
//         { label: 'Above ₹5 Crore', value: '50000000-9999999999' }
//       ]);

//       applyFilters(uniqueItems, { page: 1 });
//     } catch (err) {
//       console.error("Failed to fetch complete data", err);
//       showToast('Failed to load listings', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilters = (sourceData, customParams = {}) => {
//     const dataToFilter = sourceData || allListings;
//     const activeLoc = customParams.locality !== undefined ? customParams.locality : locality;
//     const activeBhk = customParams.bhk !== undefined ? customParams.bhk : bhk;
//     const activeFurn = customParams.furnishing !== undefined ? customParams.furnishing : furnishing;
//     const activeRange = customParams.priceRange !== undefined ? customParams.priceRange : priceRange;
//     const activeSearch = customParams.search !== undefined ? customParams.search : searchTerm;
//     const activePage = customParams.page !== undefined ? customParams.page : page;

//     let filtered = [...dataToFilter];

//     if (activeSearch) {
//       const searchLower = activeSearch.toLowerCase();
//       filtered = filtered.filter((item) =>
//         (item.title?.toLowerCase().includes(searchLower)) ||
//         (item.locality?.toLowerCase().includes(searchLower)) ||
//         (item.apartment_name?.toLowerCase().includes(searchLower))
//       );
//     }

//     if (activeLoc) {
//       filtered = filtered.filter(item => item.locality?.toLowerCase() === activeLoc.toLowerCase());
//     }

//     if (activeBhk) {
//       filtered = filtered.filter(item => Number(item.bhk) === Number(activeBhk));
//     }

//     if (activeFurn) {
//       filtered = filtered.filter(item => item.furnishing?.toLowerCase() === activeFurn.toLowerCase());
//     }

//     if (activeRange) {
//       const [min, max] = activeRange.split('-');
//       const minPrice = Number(min);
//       const maxPrice = Number(max);
//       filtered = filtered.filter(item => {
//         const price = parsePrice(item.price);
//         return price >= minPrice && price <= maxPrice;
//       });
//     }

//     const startIndex = (activePage - 1) * 12;
//     const paginatedResults = filtered.slice(startIndex, startIndex + 12);

//     setListings(paginatedResults);
//     setTotalPages(Math.ceil(filtered.length / 12) || 1);
//     if (customParams.page !== undefined) setPage(customParams.page);
//   };

//   const loadListings = (customParams = {}) => {
//     if (allListings.length > 0) {
//       applyFilters(allListings, customParams);
//     }
//   };

//   const loadRentalsAndProjects = async () => {
//     setRentalsLoading(true);
//     try {
//       let allProjectsData = [];
//       let projOffset = 0;
//       let projHasMore = true;

//       while (projHasMore) {
//         const projRes = await fetchProjects({ limit: 100, offset: projOffset });
//         const dataObj = projRes.data || {};
//         const items = dataObj.results || dataObj.data || [];
//         allProjectsData = [...allProjectsData, ...items];

//         if (dataObj.has_more === false || items.length === 0) projHasMore = false;
//         else projOffset += 100;
//       }
//       setProjects(allProjectsData);

//       let allRentalsData = [];
//       let rentOffset = 0;
//       let rentHasMore = true;

//       while (rentHasMore) {
//         const rentRes = await fetchRentals({ limit: 100, offset: rentOffset });
//         const dataObj = rentRes.data || {};
//         const items = dataObj.results || dataObj.data || [];
//         allRentalsData = [...allRentalsData, ...items];

//         if (dataObj.has_more === false || items.length === 0) rentHasMore = false;
//         else rentOffset += 100;
//       }
//       setRentals(allRentalsData);

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
//           if ((tab === 'rentals' || tab === 'projects') && rentals.length === 0) loadRentalsAndProjects();
//         }}
//         savedCount={saved.length}
//         user={user}
//         onLoginClick={() => setShowLoginModal(true)}
//         onLogoutClick={logout}
//       />

//       <main className="max-w-7xl mx-auto px-4 py-8">
        
//         {/* TAB 1: LISTINGS */}
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
//                     placeholder="Search title, locality..."
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
//                     {bhkList.length > 0 ? (
//                       bhkList.map((val) => <option key={val} value={val}>{val} BHK</option>)
//                     ) : (
//                       [1, 2, 3, 4, 5, 6, 7, 8].map((val) => <option key={val} value={val}>{val} BHK</option>)
//                     )}
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
//                     {priceOptions.map((opt) => (
//                       <option key={opt.value} value={opt.value}>{opt.label}</option>
//                     ))}
//                   </select>
//                 </div>

//                 {loading ? (
//                   <p className="text-center py-12 text-slate-500">Loading complete database...</p>
//                 ) : listings.length === 0 ? (
//                   <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
//                     <p>No listings matched your filters.</p>
//                     <button 
//                       onClick={() => {
//                         setSearchTerm(''); setLocality(''); setBhk(''); setFurnishing(''); setPriceRange('');
//                         loadListings({ page: 1, search: '', locality: '', bhk: '', furnishing: '', priceRange: '' });
//                       }}
//                       className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm"
//                     >
//                       Clear Filters
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                       {listings.map((item) => (
//                         <ListingCard
//                           key={item.listing_id || item.id}
//                           item={item}
//                           isSaved={saved.some((s) => (s.listing_id || s.id) === (item.listing_id || item.id))}
//                           onToggleSave={handleToggleSave}
//                           onSelect={() => handleOpenDetail(item)}
//                         />
//                       ))}
//                     </div>

//                     <div className="flex justify-center items-center space-x-4 mt-8 mb-8">
//                       <button
//                         disabled={page <= 1}
//                         onClick={() => {
//                           window.scrollTo(0, 0); 
//                           loadListings({ page: page - 1 });
//                         }}
//                         className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
//                       >
//                         Previous
//                       </button>
//                       <span className="text-sm text-slate-600 font-medium">
//                         Page {page} of {totalPages}
//                       </span>
//                       <button
//                         disabled={page >= totalPages}
//                         onClick={() => {
//                           window.scrollTo(0, 0);
//                           loadListings({ page: page + 1 });
//                         }}
//                         className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
//                       >
//                         Next
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </>
//             )}
//           </div>
//         )}
        
//         {/* TAB 2: RENTALS */}
//         {activeTab === 'rentals' && (
//           <section>
//             <h2 className="text-xl font-bold text-slate-900 mb-6">Rental Properties</h2>
//             {rentalsLoading ? (
//               <p className="text-center py-12 text-slate-500">Loading complete database...</p>
//             ) : (
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {rentals.slice((rentalsPage - 1) * 12, rentalsPage * 12).map((r) => (
//                     <RentalCard key={r.id || r.rental_id || r.listing_id} rental={r} />
//                   ))}
//                 </div>
                
//                 <div className="flex justify-center items-center space-x-4 mt-8 mb-8">
//                   <button
//                     disabled={rentalsPage <= 1}
//                     onClick={() => { window.scrollTo(0, 0); setRentalsPage(rentalsPage - 1); }}
//                     className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
//                   >
//                     Previous
//                   </button>
//                   <span className="text-sm text-slate-600 font-medium">
//                     Page {rentalsPage} of {Math.ceil(rentals.length / 12) || 1}
//                   </span>
//                   <button
//                     disabled={rentalsPage >= Math.ceil(rentals.length / 12)}
//                     onClick={() => { window.scrollTo(0, 0); setRentalsPage(rentalsPage + 1); }}
//                     className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}
//           </section>
//         )}

//         {/* TAB 3: PROJECTS */}
//         {activeTab === 'projects' && (
//           <section>
//             <h2 className="text-xl font-bold text-slate-900 mb-6">Upcoming & Ongoing Projects</h2>
//             {rentalsLoading ? (
//               <p className="text-center py-12 text-slate-500">Loading complete database...</p>
//             ) : (
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {projects.slice((projectsPage - 1) * 12, projectsPage * 12).map((p) => (
//                     <ProjectCard key={p.id || p.project_id} project={p} />
//                   ))}
//                 </div>
                
//                 <div className="flex justify-center items-center space-x-4 mt-8 mb-8">
//                   <button
//                     disabled={projectsPage <= 1}
//                     onClick={() => { window.scrollTo(0, 0); setProjectsPage(projectsPage - 1); }}
//                     className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
//                   >
//                     Previous
//                   </button>
//                   <span className="text-sm text-slate-600 font-medium">
//                     Page {projectsPage} of {Math.ceil(projects.length / 12) || 1}
//                   </span>
//                   <button
//                     disabled={projectsPage >= Math.ceil(projects.length / 12)}
//                     onClick={() => { window.scrollTo(0, 0); setProjectsPage(projectsPage + 1); }}
//                     className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}
//           </section>
//         )}

//         {/* TAB 4: SAVED */}
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

//         {/* TAB 5: INSIGHTS & ANALYTICS */}
//         {activeTab === 'analytics' && (
//           <div>
//             <Insights listings={allListings} rentals={rentals} projects={projects} />
//             {analytics && <AnalyticsCharts analytics={analytics} />}
//           </div>
//         )}

//         {/* MODAL / DETAIL VIEW */}
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
import RentalCard from './components/RentalCard';
import ProjectCard from './components/ProjectCard';
import PropertyModal from './components/PropertyModal';
import AnalyticsCharts from './components/AnalyticsCharts';
import LoginModal from './components/LoginModal';
import { useAuth } from './context/AuthContext';
import Insights from './components/Insights';

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
  const [allListings, setAllListings] = useState([]);
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
  
  // Dynamic Options
  const [localitiesList, setLocalitiesList] = useState([]);
  const [bhkList, setBhkList] = useState([]);
  const [priceOptions, setPriceOptions] = useState([]);

  // Projects & Rentals (with their own Pagination States)
  const [projects, setProjects] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [rentalsLoading, setRentalsLoading] = useState(false);
  const [projectsPage, setProjectsPage] = useState(1);
  const [rentalsPage, setRentalsPage] = useState(1);

  // Insights & Saved
  const [analytics, setAnalytics] = useState(null);
  const [saved, setSaved] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const parsePrice = (val) => {
    if (!val) return 0;
    return Number(String(val).replace(/,/g, '').replace(/[^\d.-]/g, ''));
  };

  useEffect(() => {
    if (user) {
      loadAnalytics(); 
      loadSaved();
      fetchAllData(); 
      loadRentalsAndProjects(); // Initial load for rentals/projects/insights
    } else {
      setAllListings([]);
      setListings([]);
      setSaved([]);
      setAnalytics(null);
      setProjects([]);
      setRentals([]);
      setLocalitiesList([]);
      setBhkList([]);
      setPriceOptions([]);
      setActiveTab('listings');
    }
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      let allItems = [];
      let currentOffset = 0;
      let hasMore = true;

      while (hasMore) {
        const res = await fetchListings({ limit: 100, offset: currentOffset });
        const dataObj = res.data || {};
        const items = dataObj.results || dataObj.data || (Array.isArray(dataObj) ? dataObj : []);
        allItems = [...allItems, ...items];

        if (dataObj.has_more === false || items.length === 0) {
          hasMore = false;
        } else {
          currentOffset += 100;
        }
      }

      const uniqueItems = Array.from(new Map(allItems.map(item => [item.listing_id || item.id, item])).values());
      setAllListings(uniqueItems);

      const uniqueLocalities = [...new Set(uniqueItems.map(item => item.locality?.toLowerCase()).filter(Boolean))];
      setLocalitiesList(uniqueLocalities.sort());
      
      const fetchedBhks = uniqueItems.map(item => Number(item.bhk)).filter(n => !isNaN(n) && n > 0);
      const combinedBhks = [...new Set([...fetchedBhks, 1, 2, 3, 4, 5, 6, 7, 8])]; 
      setBhkList(combinedBhks.sort((a, b) => a - b));

      setPriceOptions([
        { label: 'Under ₹50 Lakh', value: '0-5000000' },
        { label: '₹50L - ₹1 Crore', value: '5000000-10000000' },
        { label: '₹1 Crore - ₹2 Crore', value: '10000000-20000000' },
        { label: '₹2 Crore - ₹5 Crore', value: '20000000-50000000' },
        { label: 'Above ₹5 Crore', value: '50000000-9999999999' }
      ]);

      applyFilters(uniqueItems, { page: 1 });
    } catch (err) {
      console.error("Failed to fetch complete data", err);
      showToast('Failed to load listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (sourceData, customParams = {}) => {
    const dataToFilter = sourceData || allListings;
    const activeLoc = customParams.locality !== undefined ? customParams.locality : locality;
    const activeBhk = customParams.bhk !== undefined ? customParams.bhk : bhk;
    const activeFurn = customParams.furnishing !== undefined ? customParams.furnishing : furnishing;
    const activeRange = customParams.priceRange !== undefined ? customParams.priceRange : priceRange;
    const activeSearch = customParams.search !== undefined ? customParams.search : searchTerm;
    const activePage = customParams.page !== undefined ? customParams.page : page;

    let filtered = [...dataToFilter];

    if (activeSearch) {
      const searchLower = activeSearch.toLowerCase();
      filtered = filtered.filter((item) =>
        (item.title?.toLowerCase().includes(searchLower)) ||
        (item.locality?.toLowerCase().includes(searchLower)) ||
        (item.apartment_name?.toLowerCase().includes(searchLower))
      );
    }

    if (activeLoc) {
      filtered = filtered.filter(item => item.locality?.toLowerCase() === activeLoc.toLowerCase());
    }

    if (activeBhk) {
      filtered = filtered.filter(item => Number(item.bhk) === Number(activeBhk));
    }

    if (activeFurn) {
      filtered = filtered.filter(item => item.furnishing?.toLowerCase() === activeFurn.toLowerCase());
    }

    if (activeRange) {
      const [min, max] = activeRange.split('-');
      const minPrice = Number(min);
      const maxPrice = Number(max);
      filtered = filtered.filter(item => {
        const price = parsePrice(item.price);
        return price >= minPrice && price <= maxPrice;
      });
    }

    const startIndex = (activePage - 1) * 12;
    const paginatedResults = filtered.slice(startIndex, startIndex + 12);

    setListings(paginatedResults);
    setTotalPages(Math.ceil(filtered.length / 12) || 1);
    if (customParams.page !== undefined) setPage(customParams.page);
  };

  const loadListings = (customParams = {}) => {
    if (allListings.length > 0) {
      applyFilters(allListings, customParams);
    }
  };

  const loadRentalsAndProjects = async () => {
    setRentalsLoading(true);
    try {
      let allProjectsData = [];
      let projOffset = 0;
      let projHasMore = true;

      while (projHasMore) {
        const projRes = await fetchProjects({ limit: 100, offset: projOffset });
        const dataObj = projRes.data || {};
        const items = dataObj.results || dataObj.data || [];
        allProjectsData = [...allProjectsData, ...items];

        if (dataObj.has_more === false || items.length === 0) projHasMore = false;
        else projOffset += 100;
      }
      setProjects(allProjectsData);

      let allRentalsData = [];
      let rentOffset = 0;
      let rentHasMore = true;

      while (rentHasMore) {
        const rentRes = await fetchRentals({ limit: 100, offset: rentOffset });
        const dataObj = rentRes.data || {};
        const items = dataObj.results || dataObj.data || [];
        allRentalsData = [...allRentalsData, ...items];

        if (dataObj.has_more === false || items.length === 0) rentHasMore = false;
        else rentOffset += 100;
      }
      setRentals(allRentalsData);

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
                      [1, 2, 3, 4, 5, 6, 7, 8].map((val) => <option key={val} value={val}>{val} BHK</option>)
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
                    {priceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {loading ? (
                  <p className="text-center py-12 text-slate-500">Loading complete database...</p>
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

                    <div className="flex justify-center items-center space-x-4 mt-8 mb-8">
                      <button
                        disabled={page <= 1}
                        onClick={() => {
                          window.scrollTo(0, 0); 
                          loadListings({ page: page - 1 });
                        }}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-slate-600 font-medium">
                        Page {page} of {totalPages}
                      </span>
                      <button
                        disabled={page >= totalPages}
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
            {rentalsLoading ? (
              <p className="text-center py-12 text-slate-500">Loading complete database...</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rentals.slice((rentalsPage - 1) * 12, rentalsPage * 12).map((r) => (
                    <RentalCard key={r.id || r.rental_id || r.listing_id} rental={r} />
                  ))}
                </div>
                
                <div className="flex justify-center items-center space-x-4 mt-8 mb-8">
                  <button
                    disabled={rentalsPage <= 1}
                    onClick={() => { window.scrollTo(0, 0); setRentalsPage(rentalsPage - 1); }}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-600 font-medium">
                    Page {rentalsPage} of {Math.ceil(rentals.length / 12) || 1}
                  </span>
                  <button
                    disabled={rentalsPage >= Math.ceil(rentals.length / 12)}
                    onClick={() => { window.scrollTo(0, 0); setRentalsPage(rentalsPage + 1); }}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        {/* TAB 3: PROJECTS */}
        {activeTab === 'projects' && (
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Upcoming & Ongoing Projects</h2>
            {rentalsLoading ? (
              <p className="text-center py-12 text-slate-500">Loading complete database...</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.slice((projectsPage - 1) * 12, projectsPage * 12).map((p) => (
                    <ProjectCard key={p.id || p.project_id} project={p} />
                  ))}
                </div>
                
                <div className="flex justify-center items-center space-x-4 mt-8 mb-8">
                  <button
                    disabled={projectsPage <= 1}
                    onClick={() => { window.scrollTo(0, 0); setProjectsPage(projectsPage - 1); }}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-600 font-medium">
                    Page {projectsPage} of {Math.ceil(projects.length / 12) || 1}
                  </span>
                  <button
                    disabled={projectsPage >= Math.ceil(projects.length / 12)}
                    onClick={() => { window.scrollTo(0, 0); setProjectsPage(projectsPage + 1); }}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
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

        {/* TAB 5: INSIGHTS & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div>
            <Insights listings={allListings} rentals={rentals} projects={projects} />
            {analytics && <AnalyticsCharts analytics={analytics} />}
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