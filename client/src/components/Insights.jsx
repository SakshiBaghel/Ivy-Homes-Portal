// // // import React from 'react';
// // // import { TrendingUp, AlertTriangle, ShieldAlert, Building2, DollarSign } from 'lucide-react';

// // // export default function Insights({ listings = [], rentals = [], projects = [] }) {
// // //   // 1. Calculations
// // //   const totalListings = listings.length;
// // //   const activeListings = listings.filter(i => i.is_live).length;

// // //   // Corrupt listings logic (Floor > Total Floors or Carpet > Super Builtup)
// // //   const corruptCount = listings.filter(i => (i.floor > i.total_floors) || (i.carpet_area > i.super_builtup_area)).length;

// // //   // Fake listings logic
// // //   const fakeCount = listings.filter(i => {
// // //     const desc = (i.description || "").toLowerCase();
// // //     return desc.includes("ivy homes data team") || desc.includes("ai");
// // //   }).length;

// // //   // Aundh Locality stats
// // //   const aundhListings = listings.filter(i => (i.locality || "").toLowerCase() === "aundh");
// // //   const aundhRentals = rentals.filter(r => (r.locality || "").toLowerCase() === "aundh");
// // //   const totalRentAundh = aundhRentals.reduce((sum, r) => sum + (Number(r.rent) || 0), 0);

// // //   // Avg Price per sqft
// // //   const validPrices = listings.filter(i => i.price && i.carpet_area > 0);
// // //   const avgSqftPrice = validPrices.length > 0 
// // //     ? Math.round(validPrices.reduce((sum, i) => sum + (i.price / i.carpet_area), 0) / validPrices.length) 
// // //     : 0;

// // //   return (
// // //     <div className="p-6 max-w-6xl mx-auto">
// // //       <h2 className="text-2xl font-bold text-slate-900 mb-2">Market Insights & Discoveries</h2>
// // //       <p className="text-slate-500 mb-6 text-sm">Aggregated analytics and data quality audit for Pune (Assigned Locality: Aundh)</p>

// // //       {/* Stats Grid */}
// // //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
// // //         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
// // //           <div className="text-slate-400 text-xs font-semibold uppercase">Total Listings</div>
// // //           <div className="text-3xl font-bold text-slate-900 mt-1">{totalListings}</div>
// // //           <div className="text-xs text-emerald-600 mt-2">Active: {activeListings} listings live</div>
// // //         </div>

// // //         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
// // //           <div className="text-slate-400 text-xs font-semibold uppercase">Avg Price / SqFt</div>
// // //           <div className="text-3xl font-bold text-slate-900 mt-1">₹{avgSqftPrice}</div>
// // //           <div className="text-xs text-slate-500 mt-2">Across all valid listings</div>
// // //         </div>

// // //         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
// // //           <div className="text-slate-400 text-xs font-semibold uppercase">Aundh Locality Data</div>
// // //           <div className="text-3xl font-bold text-slate-900 mt-1">{aundhListings.length}</div>
// // //           <div className="text-xs text-blue-600 mt-2">Total Monthly Rent: ₹{totalRentAundh.toLocaleString('en-IN')}</div>
// // //         </div>
// // //       </div>

// // //       {/* Discoveries / Data Quality Section */}
// // //       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
// // //         <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
// // //           <AlertTriangle className="text-amber-500" size={20} /> Data Quality & Audit Findings
// // //         </h3>
// // //         <div className="space-y-3 text-sm text-slate-700">
// // //           <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
// // //             <span>Corrupt Listing Records (Floor mismatch / Area anomalies)</span>
// // //             <span className="font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded">{corruptCount} found</span>
// // //           </div>
// // //           <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
// // //             <span>Fake / Test Listings (Injected metadata notes)</span>
// // //             <span className="font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded">{fakeCount} found</span>
// // //           </div>
// // //           <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
// // //             <span>Total Projects Tracked</span>
// // //             <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded">{projects.length} Projects</span>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // import React from 'react';
// // import { Building2, BarChart3, MapPin, Layers } from 'lucide-react';

// // export default function Insights({ analytics, listings = [], rentals = [], projects = [] }) {
// //   // Agar backend se analytics mil gaya ya hume calculate karna pada
// //   const total_listings = listings.length;
  
// //   // Median price calculation
// //   const sortedPrices = listings.map(i => Number(i.price) || 0).filter(p => p > 0).sort((a, b) => a - b);
// //   const median_price = sortedPrices.length > 0 
// //     ? sortedPrices[Math.floor(sortedPrices.length / 2)] 
// //     : 0;

// //   // Median price per sqft calculation
// //   const sortedSqftPrices = listings.map(i => (i.price && i.carpet_area) ? (i.price / i.carpet_area) : 0).filter(p => p > 0).sort((a, b) => a - b);
// //   const median_price_per_sqft = sortedSqftPrices.length > 0 
// //     ? Math.round(sortedSqftPrices[Math.floor(sortedSqftPrices.length / 2)]) 
// //     : 0;

// //   // By Locality grouping
// //   const localityMap = {};
// //   listings.forEach(i => {
// //     const loc = (i.locality || "unknown").toLowerCase();
// //     if (!localityMap[loc]) localityMap[loc] = { count: 0, prices: [] };
// //     localityMap[loc].count += 1;
// //     if (i.price) localityMap[loc].prices.push(Number(i.price));
// //   });

// //   const by_locality = Object.keys(localityMap).map(loc => {
// //     const prices = localityMap[loc].prices.sort((a, b) => a - b);
// //     const medPrice = prices.length > 0 ? prices[Math.floor(prices.length / 2)] : 0;
// //     return { locality: loc, count: localityMap[loc].count, median_price: medPrice };
// //   });

// //   // By BHK grouping
// //   const bhkMap = {};
// //   listings.forEach(i => {
// //     const bed = Number(i.bhk || i.bedroom) || 0;
// //     if (bed > 0) {
// //       bhkMap[bed] = (bhkMap[bed] || 0) + 1;
// //     }
// //   });

// //   const by_bhk = Object.keys(bhkMap).map(bed => ({
// //     bedroom: Number(bed),
// //     count: bhkMap[bed]
// //   })).sort((a, b) => a.bedroom - b.bedroom);

// //   // Exact JSON Response format as requested by documentation
// //   const summaryJson = {
// //     city: "pune",
// //     total_listings: total_listings,
// //     median_price: median_price,
// //     median_price_per_sqft: median_price_per_sqft,
// //     by_locality: by_locality,
// //     by_bhk: by_bhk
// //   };

// //   const formatPrice = (val) => {
// //     if (!val) return 'N/A';
// //     if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
// //     if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lac`;
// //     return `₹${val.toLocaleString('en-IN')}`;
// //   };

// //   return (
// //     <div className="p-6 max-w-6xl mx-auto">
// //       <div className="flex justify-between items-center mb-6">
// //         <div>
// //           <h2 className="text-2xl font-bold text-slate-900">Analytics Summary</h2>
// //           <p className="text-slate-500 text-sm">Pre-computed aggregates for your city (Pune)</p>
// //         </div>
// //       </div>

// //       {/* Overview Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
// //         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
// //           <div className="text-slate-400 text-xs font-semibold uppercase">Total Listings</div>
// //           <div className="text-3xl font-bold text-slate-900 mt-1">{total_listings}</div>
// //         </div>
// //         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
// //           <div className="text-slate-400 text-xs font-semibold uppercase">Median Price</div>
// //           <div className="text-3xl font-bold text-slate-900 mt-1">{formatPrice(median_price)}</div>
// //         </div>
// //         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
// //           <div className="text-slate-400 text-xs font-semibold uppercase">Median Price / SqFt</div>
// //           <div className="text-3xl font-bold text-slate-900 mt-1">₹{median_price_per_sqft}</div>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// //         {/* By Locality */}
// //         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
// //           <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
// //             <MapPin size={18} className="text-blue-500" /> By Locality
// //           </h3>
// //           <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
// //             {by_locality.map((item, index) => (
// //               <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-sm">
// //                 <span className="capitalize font-medium text-slate-800">{item.locality}</span>
// //                 <div className="flex gap-4 text-slate-600">
// //                   <span>Count: <b>{item.count}</b></span>
// //                   <span>Median: <b>{formatPrice(item.median_price)}</b></span>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         {/* By BHK */}
// //         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
// //           <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
// //             <Layers size={18} className="text-emerald-500" /> By BHK (Bedroom Breakdown)
// //           </h3>
// //           <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
// //             {by_bhk.map((item, index) => (
// //               <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-sm">
// //                 <span className="font-medium text-slate-800">{item.bedroom} BHK</span>
// //                 <span className="text-slate-600">Count: <b>{item.count}</b></span>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Raw JSON View to match documentation example */}
// //       <div className="bg-slate-900 text-slate-200 p-5 rounded-xl overflow-x-auto text-xs font-mono">
// //         <div className="text-slate-400 mb-2 font-sans font-semibold">// Raw API Response Format (`/v1/analytics/summary`)</div>
// //         <pre>{JSON.stringify(summaryJson, null, 2)}</pre>
// //       </div>
// //     </div>
// //   );
// // }


// import React from 'react';
// import { MapPin, Layers } from 'lucide-react';

// export default function Insights({ listings = [], rentals = [], projects = [] }) {
//   // ✅ Yahan exact allListings ki length aayegi (3500+)
//   const total_listings = listings.length;
  
//   // Median price calculation
//   const sortedPrices = listings.map(i => Number(i.price) || 0).filter(p => p > 0).sort((a, b) => a - b);
//   const median_price = sortedPrices.length > 0 
//     ? sortedPrices[Math.floor(sortedPrices.length / 2)] 
//     : 0;

//   // Median price per sqft calculation
//   const sortedSqftPrices = listings.map(i => (i.price && i.carpet_area) ? (i.price / i.carpet_area) : 0).filter(p => p > 0).sort((a, b) => a - b);
//   const median_price_per_sqft = sortedSqftPrices.length > 0 
//     ? Math.round(sortedSqftPrices[Math.floor(sortedSqftPrices.length / 2)]) 
//     : 0;

//   // By Locality grouping
//   const localityMap = {};
//   listings.forEach(i => {
//     const loc = (i.locality || "unknown").toLowerCase();
//     if (!localityMap[loc]) localityMap[loc] = { count: 0, prices: [] };
//     localityMap[loc].count += 1;
//     if (i.price) localityMap[loc].prices.push(Number(i.price));
//   });

//   const by_locality = Object.keys(localityMap).map(loc => {
//     const prices = localityMap[loc].prices.sort((a, b) => a - b);
//     const medPrice = prices.length > 0 ? prices[Math.floor(prices.length / 2)] : 0;
//     return { locality: loc, count: localityMap[loc].count, median_price: medPrice };
//   });

//   // By BHK grouping
//   const bhkMap = {};
//   listings.forEach(i => {
//     const bed = Number(i.bhk || i.bedroom) || 0;
//     if (bed > 0) {
//       bhkMap[bed] = (bhkMap[bed] || 0) + 1;
//     }
//   });

//   const by_bhk = Object.keys(bhkMap).map(bed => ({
//     bedroom: Number(bed),
//     count: bhkMap[bed]
//   })).sort((a, b) => a.bedroom - b.bedroom);

//   const summaryJson = {
//     city: "pune",
//     total_listings: total_listings,
//     median_price: median_price,
//     median_price_per_sqft: median_price_per_sqft,
//     by_locality: by_locality,
//     by_bhk: by_bhk
//   };

//   const formatPrice = (val) => {
//     if (!val) return 'N/A';
//     if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
//     if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lac`;
//     return `₹${val.toLocaleString('en-IN')}`;
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-900">Analytics Summary</h2>
//           <p className="text-slate-500 text-sm">Pre-computed aggregates for your city (Pune)</p>
//         </div>
//       </div>

//       {/* Overview Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
//           <div className="text-slate-400 text-xs font-semibold uppercase">Total Listings</div>
//           <div className="text-3xl font-bold text-slate-900 mt-1">{total_listings}</div>
//         </div>
//         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
//           <div className="text-slate-400 text-xs font-semibold uppercase">Median Price</div>
//           <div className="text-3xl font-bold text-slate-900 mt-1">{formatPrice(median_price)}</div>
//         </div>
//         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
//           <div className="text-slate-400 text-xs font-semibold uppercase">Median Price / SqFt</div>
//           <div className="text-3xl font-bold text-slate-900 mt-1">₹{median_price_per_sqft}</div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
//           <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
//             <MapPin size={18} className="text-blue-500" /> By Locality
//           </h3>
//           <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
//             {by_locality.map((item, index) => (
//               <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-sm">
//                 <span className="capitalize font-medium text-slate-800">{item.locality}</span>
//                 <div className="flex gap-4 text-slate-600">
//                   <span>Count: <b>{item.count}</b></span>
//                   <span>Median: <b>{formatPrice(item.median_price)}</b></span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
//           <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
//             <Layers size={18} className="text-emerald-500" /> By BHK (Bedroom Breakdown)
//           </h3>
//           <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
//             {by_bhk.map((item, index) => (
//               <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-sm">
//                 <span className="font-medium text-slate-800">{item.bedroom} BHK</span>
//                 <span className="text-slate-600">Count: <b>{item.count}</b></span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="bg-slate-900 text-slate-200 p-5 rounded-xl overflow-x-auto text-xs font-mono">
//         <div className="text-slate-400 mb-2 font-sans font-semibold">// Raw API Response Format (`/v1/analytics/summary`)</div>
//         <pre>{JSON.stringify(summaryJson, null, 2)}</pre>
//       </div>
//     </div>
//   );
// }


import React from 'react';
import { MapPin, Layers } from 'lucide-react';

export default function Insights({ listings = [], rentals = [], projects = [] }) {
  const total_listings = listings.length;
  
  const sortedPrices = listings.map(i => Number(i.price) || 0).filter(p => p > 0).sort((a, b) => a - b);
  const median_price = sortedPrices.length > 0 
    ? sortedPrices[Math.floor(sortedPrices.length / 2)] 
    : 0;

  const sortedSqftPrices = listings.map(i => (i.price && i.carpet_area) ? (i.price / i.carpet_area) : 0).filter(p => p > 0).sort((a, b) => a - b);
  const median_price_per_sqft = sortedSqftPrices.length > 0 
    ? Math.round(sortedSqftPrices[Math.floor(sortedSqftPrices.length / 2)]) 
    : 0;

  const localityMap = {};
  listings.forEach(i => {
    const loc = (i.locality || "unknown").toLowerCase();
    if (!localityMap[loc]) localityMap[loc] = { count: 0, prices: [] };
    localityMap[loc].count += 1;
    if (i.price) localityMap[loc].prices.push(Number(i.price));
  });

  const by_locality = Object.keys(localityMap).map(loc => {
    const prices = localityMap[loc].prices.sort((a, b) => a - b);
    const medPrice = prices.length > 0 ? prices[Math.floor(prices.length / 2)] : 0;
    return { locality: loc, count: localityMap[loc].count, median_price: medPrice };
  });

  const bhkMap = {};
  listings.forEach(i => {
    const bed = Number(i.bhk || i.bedroom) || 0;
    if (bed > 0) {
      bhkMap[bed] = (bhkMap[bed] || 0) + 1;
    }
  });

  const by_bhk = Object.keys(bhkMap).map(bed => ({
    bedroom: Number(bed),
    count: bhkMap[bed]
  })).sort((a, b) => a.bedroom - b.bedroom);

  const formatPrice = (val) => {
    if (!val) return 'N/A';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lac`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics Summary</h2>
          <p className="text-slate-500 text-sm">Pre-computed aggregates for your city (Pune)</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase">Total Listings</div>
          <div className="text-3xl font-bold text-slate-900 mt-1">{total_listings}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase">Median Price</div>
          <div className="text-3xl font-bold text-slate-900 mt-1">{formatPrice(median_price)}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase">Median Price / SqFt</div>
          <div className="text-3xl font-bold text-slate-900 mt-1">₹{median_price_per_sqft}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-blue-500" /> By Locality
          </h3>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
            {by_locality.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-sm">
                <span className="capitalize font-medium text-slate-800">{item.locality}</span>
                <div className="flex gap-4 text-slate-600">
                  <span>Count: <b>{item.count}</b></span>
                  <span>Median: <b>{formatPrice(item.median_price)}</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Layers size={18} className="text-emerald-500" /> By BHK (Bedroom Breakdown)
          </h3>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
            {by_bhk.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-sm">
                <span className="font-medium text-slate-800">{item.bedroom} BHK</span>
                <span className="text-slate-600">Count: <b>{item.count}</b></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}