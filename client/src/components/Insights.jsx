
// import React from 'react';
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