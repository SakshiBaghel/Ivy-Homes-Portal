// import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsCharts({ listings = [] }) {
  if (!listings || listings.length === 0) return null;

  // 1. Locality counts
  const localityCounts = {};
  listings.forEach(item => {
    const loc = item.locality ? item.locality.toLowerCase() : 'other';
    localityCounts[loc] = (localityCounts[loc] || 0) + 1;
  });

  const localityData = Object.entries(localityCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, val]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      count: val,
    }));

  // 2. BHK counts
  const bhkCounts = {};
  listings.forEach(item => {
    const bed = Number(item.bhk || item.bedroom) || 0;
    if (bed > 0) {
      bhkCounts[bed] = (bhkCounts[bed] || 0) + 1;
    }
  });

  const bhkData = Object.entries(bhkCounts).map(([key, val]) => ({
    name: `${key} BHK`,
    count: val,
  })).sort((a, b) => parseInt(a.name) - parseInt(b.name));

  // 3. Posted By counts
  const postedByCounts = {};
  listings.forEach(item => {
    const posted = item.posted_by ? item.posted_by.toLowerCase() : 'unknown';
    postedByCounts[posted] = (postedByCounts[posted] || 0) + 1;
  });

  const postedByData = Object.entries(postedByCounts).map(([key, val]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: val,
  }));

  // 4. Furnishing counts
  const furnishingCounts = {};
  listings.forEach(item => {
    const furn = item.furnishing ? item.furnishing.toLowerCase() : 'unspecified';
    furnishingCounts[furn] = (furnishingCounts[furn] || 0) + 1;
  });

  const furnishingData = Object.entries(furnishingCounts).map(([key, val]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    count: val,
  }));

  return (
    <div className="space-y-8 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Locality Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wide">
            Top Localities by Volume
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={localityData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BHK Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wide">
            Inventory by BHK Type
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bhkData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Furnishing Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wide">
            Furnishing Breakdown
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={furnishingData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Seller Distribution (Pie Chart) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wide">
            Inventory Posted By
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={postedByData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {postedByData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}