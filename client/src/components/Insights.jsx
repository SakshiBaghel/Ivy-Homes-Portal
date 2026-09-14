import React from 'react';
import { TrendingUp, AlertTriangle, ShieldAlert, Building2, DollarSign } from 'lucide-react';

export default function Insights({ listings = [], rentals = [], projects = [] }) {
  // 1. Calculations
  const totalListings = listings.length;
  const activeListings = listings.filter(i => i.is_live).length;

  // Corrupt listings logic (Floor > Total Floors or Carpet > Super Builtup)
  const corruptCount = listings.filter(i => (i.floor > i.total_floors) || (i.carpet_area > i.super_builtup_area)).length;

  // Fake listings logic
  const fakeCount = listings.filter(i => {
    const desc = (i.description || "").toLowerCase();
    return desc.includes("ivy homes data team") || desc.includes("ai");
  }).length;

  // Aundh Locality stats
  const aundhListings = listings.filter(i => (i.locality || "").toLowerCase() === "aundh");
  const aundhRentals = rentals.filter(r => (r.locality || "").toLowerCase() === "aundh");
  const totalRentAundh = aundhRentals.reduce((sum, r) => sum + (Number(r.rent) || 0), 0);

  // Avg Price per sqft
  const validPrices = listings.filter(i => i.price && i.carpet_area > 0);
  const avgSqftPrice = validPrices.length > 0 
    ? Math.round(validPrices.reduce((sum, i) => sum + (i.price / i.carpet_area), 0) / validPrices.length) 
    : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Market Insights & Discoveries</h2>
      <p className="text-slate-500 mb-6 text-sm">Aggregated analytics and data quality audit for Pune (Assigned Locality: Aundh)</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase">Total Listings</div>
          <div className="text-3xl font-bold text-slate-900 mt-1">{totalListings}</div>
          <div className="text-xs text-emerald-600 mt-2">Active: {activeListings} listings live</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase">Avg Price / SqFt</div>
          <div className="text-3xl font-bold text-slate-900 mt-1">₹{avgSqftPrice}</div>
          <div className="text-xs text-slate-500 mt-2">Across all valid listings</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase">Aundh Locality Data</div>
          <div className="text-3xl font-bold text-slate-900 mt-1">{aundhListings.length}</div>
          <div className="text-xs text-blue-600 mt-2">Total Monthly Rent: ₹{totalRentAundh.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Discoveries / Data Quality Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="text-amber-500" size={20} /> Data Quality & Audit Findings
        </h3>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span>Corrupt Listing Records (Floor mismatch / Area anomalies)</span>
            <span className="font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded">{corruptCount} found</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span>Fake / Test Listings (Injected metadata notes)</span>
            <span className="font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded">{fakeCount} found</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span>Total Projects Tracked</span>
            <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded">{projects.length} Projects</span>
          </div>
        </div>
      </div>
    </div>
  );
}