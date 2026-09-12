// import { useState, useEffect } from 'react';
// import Navbar from './components/Navbar';
// import ListingCard from './components/ListingCard';
// import PropertyModal from './components/PropertyModal';
// import AnalyticsCharts from './components/AnalyticsCharts';
// import { fetchListings, fetchAnalytics, fetchSaved, saveListing, removeSavedListing } from './api';

// export default function App() {
//   const [activeTab, setActiveTab] = useState('listings');
//   const [listings, setListings] = useState([]);
//   const [analytics, setAnalytics] = useState(null);
//   const [saved, setSaved] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedListing, setSelectedListing] = useState(null);
//   const [toast, setToast] = useState(null);
//   const [localitiesList, setLocalitiesList] = useState([]);
  
//   const [locality, setLocality] = useState('');
//   const [bhk, setBhk] = useState('');
//   const [sortBy, setSortBy] = useState('');

//   const showToast = (message, type = 'success') => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const loadListings = async (customParams = {}) => {
//     setLoading(true);
//     try {
//       const targetPage = customParams.page !== undefined ? customParams.page : page;
//       const params = {
//         page: targetPage,
//         limit: 12,
//         locality: customParams.locality !== undefined ? (customParams.locality || undefined) : (locality || undefined),
//         bhk: customParams.bhk !== undefined ? (customParams.bhk || undefined) : (bhk || undefined),
//         sortBy: customParams.sortBy !== undefined ? (customParams.sortBy || undefined) : (sortBy || undefined),
//         search: customParams.search !== undefined ? (customParams.search || undefined) : (searchTerm || undefined),
//         ...customParams,
//       };
//       const res = await fetchListings(params);
//       setListings(res.data.results || []);
//       setTotalPages(res.data.totalPages || 1);
//       if (customParams.page !== undefined) {
//         setPage(customParams.page);
//       }
//     } catch (err) {
//       console.error('Failed to load listings', err);
//       showToast('Failed to load listings', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResetFilters = () => {
//     setSearchTerm('');
//     setLocality('');
//     setBhk('');
//     setSortBy('');
//     loadListings({ page: 1, search: '', locality: '', bhk: '', sortBy: '' });
//   };

//   const loadAnalytics = async () => {
//     try {
//       const res = await fetchAnalytics();
//       setAnalytics(res.data);
//       if (res.data?.localityCounts) {
//         const unique = Object.keys(res.data.localityCounts).sort();
//         setLocalitiesList(unique);
//       }
//     } catch (err) {
//       console.error('Failed to load analytics', err);
//     }
//   };

//   const loadSaved = async () => {
//     try {
//       const res = await fetchSaved();
//       setSaved(res.data.results || []);
//     } catch (err) {
//       console.error('Failed to load saved', err);
//     }
//   };

//   const handleToggleSave = async (item) => {
//     const targetListingId = item.listing_id || item.id;
//     const existingIndex = saved.findIndex(
//       (s) => (s.listing_id || s.id) === targetListingId || s.saved_id === targetListingId
//     );

//     try {
//       if (existingIndex !== -1) {
//         const itemToDelete = saved[existingIndex];
//         const deleteId = itemToDelete.saved_id || itemToDelete.id || targetListingId;
        
//         await removeSavedListing(deleteId);
//         setSaved((prev) => prev.filter((_, idx) => idx !== existingIndex));
//         showToast('Removed from Saved Properties', 'info');
//       } else {
//         const res = await saveListing(targetListingId);
//         const newSavedItem = {
//           ...item,
//           saved_id: res.data?.id || res.data?.saved_id || targetListingId
//         };
//         setSaved((prev) => [...prev, newSavedItem]);
//         showToast('Property saved successfully!', 'success');
//       }
//     } catch (err) {
//       console.error('Save toggle failed', err);
//       showToast('Operation failed. Please try again.', 'error');
//     }
//   };

//   useEffect(() => {
//     loadListings();
//     loadAnalytics();
//     loadSaved();
//   }, []);

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-800 relative">
//       {toast && (
//         <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
//           <div
//             className={`px-5 py-2.5 rounded-full shadow-2xl text-sm font-semibold flex items-center gap-2 border ${
//               toast.type === 'info'
//                 ? 'bg-amber-500 text-white border-amber-600'
//                 : toast.type === 'error'
//                 ? 'bg-red-600 text-white border-red-700'
//                 : 'bg-emerald-600 text-white border-emerald-700'
//             }`}
//           >
//             <span>{toast.message}</span>
//           </div>
//         </div>
//       )}

//       <Navbar
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         savedCount={saved.length}
//       />

//       <main className="max-w-7xl mx-auto px-4 py-8">
//         {activeTab === 'listings' && (
//           <div>
//             <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-slate-200">
//               <input
//                 type="text"
//                 placeholder="Search by title, society, locality..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') {
//                     loadListings({ page: 1, search: searchTerm });
//                   }
//                 }}
//                 className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white flex-1 min-w-[220px]"
//               />

//               <button
//                 onClick={() => loadListings({ page: 1, search: searchTerm })}
//                 className="bg-slate-900 hover:bg-slate-800 text-white text-sm px-4 py-2 rounded-lg font-medium transition cursor-pointer"
//               >
//                 Search
//               </button>

//               <select
//                 value={locality}
//                 onChange={(e) => {
//                   setLocality(e.target.value);
//                   loadListings({ page: 1, locality: e.target.value });
//                 }}
//                 className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer capitalize"
//               >
//                 <option value="">All Localities {localitiesList.length > 0 ? `(${localitiesList.length})` : ''}</option>
//                 {localitiesList.map((loc) => (
//                   <option key={loc} value={loc} className="capitalize">
//                     {loc}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={bhk}
//                 onChange={(e) => {
//                   setBhk(e.target.value);
//                   loadListings({ page: 1, bhk: e.target.value });
//                 }}
//                 className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer"
//               >
//                 <option value="">All BHKs</option>
//                 <option value="1">1 BHK</option>
//                 <option value="2">2 BHK</option>
//                 <option value="3">3 BHK</option>
//                 <option value="4">4 BHK</option>
//               </select>

//               <select
//                 value={sortBy}
//                 onChange={(e) => {
//                   setSortBy(e.target.value);
//                   loadListings({ page: 1, sortBy: e.target.value });
//                 }}
//                 className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer"
//               >
//                 <option value="">Sort By</option>
//                 <option value="price_asc">Price: Low to High</option>
//                 <option value="price_desc">Price: High to Low</option>
//                 <option value="area_desc">Carpet Area</option>
//               </select>

//               {(searchTerm || locality || bhk || sortBy) && (
//                 <button
//                   onClick={handleResetFilters}
//                   className="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-2 cursor-pointer transition ml-auto"
//                 >
//                   Reset Filters
//                 </button>
//               )}
//             </div>

//             {loading ? (
//               <p className="text-center text-slate-500 py-12">Loading properties...</p>
//             ) : listings.length === 0 ? (
//               <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
//                 <p className="text-slate-600 font-medium">No properties match your search/filter criteria.</p>
//                 <button
//                   onClick={handleResetFilters}
//                   className="mt-4 px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer transition"
//                 >
//                   Clear All Filters
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                   {listings.map((item) => (
//                     <ListingCard
//                       key={item.listing_id}
//                       item={item}
//                       isSaved={saved.some(
//                         (s) => (s.listing_id || s.id) === item.listing_id
//                       )}
//                       onToggleSave={handleToggleSave}
//                       onSelect={(selected) => setSelectedListing(selected)}
//                     />
//                   ))}
//                 </div>

//                 <div className="flex justify-center items-center space-x-3 mt-8">
//                   <button
//                     disabled={page <= 1}
//                     onClick={() => loadListings({ page: page - 1 })}
//                     className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
//                   >
//                     Previous
//                   </button>
//                   <span className="text-sm text-slate-600 font-medium">
//                     Page {page} of {totalPages}
//                   </span>
//                   <button
//                     disabled={page >= totalPages}
//                     onClick={() => loadListings({ page: page + 1 })}
//                     className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         )}

//         {activeTab === 'analytics' && analytics && (
//           <div>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="bg-white p-6 rounded-xl border border-slate-200">
//                 <div className="text-xs text-slate-400 font-semibold uppercase">Total Listings</div>
//                 <div className="text-2xl font-bold mt-2">{analytics.totalListings}</div>
//               </div>
//               <div className="bg-white p-6 rounded-xl border border-slate-200">
//                 <div className="text-xs text-slate-400 font-semibold uppercase">Active Listings</div>
//                 <div className="text-2xl font-bold mt-2 text-emerald-600">{analytics.activeListings}</div>
//               </div>
//               <div className="bg-white p-6 rounded-xl border border-slate-200">
//                 <div className="text-xs text-slate-400 font-semibold uppercase">Rentals Tracked</div>
//                 <div className="text-2xl font-bold mt-2">{analytics.totalRentals}</div>
//               </div>
//               <div className="bg-white p-6 rounded-xl border border-slate-200">
//                 <div className="text-xs text-slate-400 font-semibold uppercase">Avg Rate / Sqft</div>
//                 <div className="text-2xl font-bold mt-2">₹{analytics.avgPricePerSqft}</div>
//               </div>
//             </div>

//             <AnalyticsCharts analytics={analytics} />
//           </div>
//         )}

//         {activeTab === 'saved' && (
//           <div>
//             <h2 className="text-xl font-bold mb-4">Saved Properties ({saved.length})</h2>
//             {saved.length === 0 ? (
//               <p className="text-slate-400">No properties saved yet.</p>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {saved.map((item) => (
//                   <ListingCard
//                     key={item.listing_id || item.id}
//                     item={item}
//                     isSaved={true}
//                     showRemoveBtn={true}
//                     onToggleSave={handleToggleSave}
//                     onSelect={(selected) => setSelectedListing(selected)}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {selectedListing && (
//           <PropertyModal
//             item={selectedListing}
//             onClose={() => setSelectedListing(null)}
//           />
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
import { fetchListings, fetchAnalytics, fetchSaved, saveListing, removeSavedListing } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('listings');
  const [listings, setListings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [toast, setToast] = useState(null);
  const [localitiesList, setLocalitiesList] = useState([]);
  const [bhkList, setBhkList] = useState([]);

  const [locality, setLocality] = useState('');
  const [bhk, setBhk] = useState('');
  const [sortBy, setSortBy] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadListings = async (customParams = {}) => {
    setLoading(true);
    try {
      const targetPage = customParams.page !== undefined ? customParams.page : page;
      const params = {
        page: targetPage,
        limit: 12,
        locality: customParams.locality !== undefined ? (customParams.locality || undefined) : (locality || undefined),
        bhk: customParams.bhk !== undefined ? (customParams.bhk || undefined) : (bhk || undefined),
        sortBy: customParams.sortBy !== undefined ? (customParams.sortBy || undefined) : (sortBy || undefined),
        search: customParams.search !== undefined ? (customParams.search || undefined) : (searchTerm || undefined),
        ...customParams,
      };
      const res = await fetchListings(params);
      setListings(res.data.results || []);
      setTotalPages(res.data.totalPages || 1);
      if (customParams.page !== undefined) {
        setPage(customParams.page);
      }
    } catch (err) {
      console.error('Failed to load listings', err);
      showToast('Failed to load listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setLocality('');
    setBhk('');
    setSortBy('');
    loadListings({ page: 1, search: '', locality: '', bhk: '', sortBy: '' });
  };

  const loadAnalytics = async () => {
    try {
      const res = await fetchAnalytics();
      setAnalytics(res.data);
      if (res.data?.localityCounts) {
        const unique = Object.keys(res.data.localityCounts).sort();
        setLocalitiesList(unique);
      }
      if (res.data?.bhkCounts) {
        const uniqueBhks = Object.keys(res.data.bhkCounts)
          .map(Number)
          .filter((n) => !isNaN(n) && n > 0)
          .sort((a, b) => a - b);
        setBhkList(uniqueBhks);
      }
    } catch (err) {
      console.error('Failed to load analytics', err);
    }
  };

  const loadSaved = async () => {
    try {
      const res = await fetchSaved();
      setSaved(res.data.results || []);
    } catch (err) {
      console.error('Failed to load saved', err);
    }
  };

  const handleToggleSave = async (item) => {
    const targetListingId = item.listing_id || item.id;
    const existingIndex = saved.findIndex(
      (s) => (s.listing_id || s.id) === targetListingId || s.saved_id === targetListingId
    );

    try {
      if (existingIndex !== -1) {
        const itemToDelete = saved[existingIndex];
        const deleteId = itemToDelete.saved_id || itemToDelete.id || targetListingId;

        await removeSavedListing(deleteId);
        setSaved((prev) => prev.filter((_, idx) => idx !== existingIndex));
        showToast('Removed from Saved Properties', 'info');
      } else {
        const res = await saveListing(targetListingId);
        const newSavedItem = {
          ...item,
          saved_id: res.data?.id || res.data?.saved_id || targetListingId,
        };
        setSaved((prev) => [...prev, newSavedItem]);
        showToast('Property saved successfully!', 'success');
      }
    } catch (err) {
      console.error('Save toggle failed', err);
      showToast('Operation failed. Please try again.', 'error');
    }
  };

  useEffect(() => {
    loadListings();
    loadAnalytics();
    loadSaved();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div
            className={`px-5 py-2.5 rounded-full shadow-2xl text-sm font-semibold flex items-center gap-2 border ${
              toast.type === 'info'
                ? 'bg-amber-500 text-white border-amber-600'
                : toast.type === 'error'
                ? 'bg-red-600 text-white border-red-700'
                : 'bg-emerald-600 text-white border-emerald-700'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={saved.length}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'listings' && (
          <div>
            <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-slate-200">
              <input
                type="text"
                placeholder="Search by title, society, locality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    loadListings({ page: 1, search: searchTerm });
                  }
                }}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white flex-1 min-w-[220px]"
              />

              <button
                onClick={() => loadListings({ page: 1, search: searchTerm })}
                className="bg-slate-900 hover:bg-slate-800 text-white text-sm px-4 py-2 rounded-lg font-medium transition cursor-pointer"
              >
                Search
              </button>

              <select
                value={locality}
                onChange={(e) => {
                  setLocality(e.target.value);
                  loadListings({ page: 1, locality: e.target.value });
                }}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer capitalize"
              >
                <option value="">All Localities {localitiesList.length > 0 ? `(${localitiesList.length})` : ''}</option>
                {localitiesList.map((loc) => (
                  <option key={loc} value={loc} className="capitalize">
                    {loc}
                  </option>
                ))}
              </select>

              <select
                value={bhk}
                onChange={(e) => {
                  setBhk(e.target.value);
                  loadListings({ page: 1, bhk: e.target.value });
                }}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer"
              >
                <option value="">All BHKs</option>
                {bhkList.length > 0
                  ? bhkList.map((val) => (
                      <option key={val} value={val}>
                        {val} BHK
                      </option>
                    ))
                  : [1, 2, 3, 4].map((val) => (
                      <option key={val} value={val}>
                        {val} BHK
                      </option>
                    ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  loadListings({ page: 1, sortBy: e.target.value });
                }}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer"
              >
                <option value="">Sort By</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="area_desc">Carpet Area</option>
              </select>

              {(searchTerm || locality || bhk || sortBy) && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-2 cursor-pointer transition ml-auto"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {loading ? (
              <p className="text-center text-slate-500 py-12">Loading properties...</p>
            ) : listings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-600 font-medium">No properties match your search/filter criteria.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {listings.map((item) => (
                    <ListingCard
                      key={item.listing_id}
                      item={item}
                      isSaved={saved.some(
                        (s) => (s.listing_id || s.id) === item.listing_id
                      )}
                      onToggleSave={handleToggleSave}
                      onSelect={(selected) => setSelectedListing(selected)}
                    />
                  ))}
                </div>

                <div className="flex justify-center items-center space-x-3 mt-8">
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
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'analytics' && analytics && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-400 font-semibold uppercase">Total Listings</div>
                <div className="text-2xl font-bold mt-2">{analytics.totalListings}</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-400 font-semibold uppercase">Active Listings</div>
                <div className="text-2xl font-bold mt-2 text-emerald-600">{analytics.activeListings}</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-400 font-semibold uppercase">Rentals Tracked</div>
                <div className="text-2xl font-bold mt-2">{analytics.totalRentals}</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-400 font-semibold uppercase">Avg Rate / Sqft</div>
                <div className="text-2xl font-bold mt-2">₹{analytics.avgPricePerSqft}</div>
              </div>
            </div>

            <AnalyticsCharts analytics={analytics} />
          </div>
        )}

        {activeTab === 'saved' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Saved Properties ({saved.length})</h2>
            {saved.length === 0 ? (
              <p className="text-slate-400">No properties saved yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {saved.map((item) => (
                  <ListingCard
                    key={item.listing_id || item.id}
                    item={item}
                    isSaved={true}
                    showRemoveBtn={true}
                    onToggleSave={handleToggleSave}
                    onSelect={(selected) => setSelectedListing(selected)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {selectedListing && (
          <PropertyModal
            item={selectedListing}
            onClose={() => setSelectedListing(null)}
          />
        )}
      </main>
    </div>
  );
}