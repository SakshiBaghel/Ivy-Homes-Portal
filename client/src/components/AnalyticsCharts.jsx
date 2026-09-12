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

export default function AnalyticsCharts({ analytics }) {
  if (!analytics) return null;

  // Transform BHK data for BarChart
  const bhkData = Object.entries(analytics.bhkCounts || {}).map(([key, val]) => ({
    name: `${key} BHK`,
    count: val,
  }));

  // Transform Locality data for BarChart (Top 6 localities)
  const localityData = Object.entries(analytics.localityCounts || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([key, val]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      count: val,
    }));

  // Transform PostedBy data for PieChart
  const postedByData = Object.entries(analytics.postedByCounts || {}).map(
    ([key, val]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: val,
    })
  );

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

      {/* Seller Distribution */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-md">
        <h3 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wide">
          Inventory Posted By
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={postedByData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
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
  );
}