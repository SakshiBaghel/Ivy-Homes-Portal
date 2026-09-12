
// import React from 'react';
import { Bed, Bath, Maximize2, MapPin, Heart, Trash2 } from 'lucide-react';

export default function ListingCard({ item, isSaved, onToggleSave, onSelect, showRemoveBtn = false }) {
  const formatPrice = (val) => {
    if (!val) return 'N/A';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lac`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div
      onClick={() => onSelect && onSelect(item)}
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition cursor-pointer flex flex-col justify-between"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-100 text-slate-700">
            {item.property_type || 'Property'}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(item);
            }}
            className="p-1 text-slate-400 hover:text-red-500 transition cursor-pointer"
            title={isSaved ? "Remove from saved" : "Save property"}
          >
            <Heart size={20} className={isSaved ? 'fill-red-500 text-red-500' : ''} />
          </button>
        </div>

        <h3 className="font-semibold text-slate-900 text-lg leading-snug line-clamp-1">
          {item.apartment_name || item.title || 'Residential Property'}
        </h3>

        <div className="flex items-center text-slate-500 text-xs mt-1 capitalize">
          <MapPin size={14} className="mr-1 text-slate-400" />
          {item.locality || 'Pune'}
        </div>

        <div className="text-xl font-bold text-slate-900 my-3">
          {formatPrice(item.price)}
          {item.carpet_area ? (
            <span className="text-xs text-slate-400 font-normal ml-2">
              (₹{Math.round(item.price / item.carpet_area)} / sqft)
            </span>
          ) : null}
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
          <div className="flex items-center">
            <Bed size={14} className="mr-1 text-slate-400" />
            <span>{item.bedroom} BHK</span>
          </div>
          <div className="flex items-center">
            <Bath size={14} className="mr-1 text-slate-400" />
            <span>{item.bathroom} Bath</span>
          </div>
          <div className="flex items-center">
            <Maximize2 size={14} className="mr-1 text-slate-400" />
            <span>{item.carpet_area || item.super_built_up_area || '-'} sqft</span>
          </div>
        </div>
      </div>

      {showRemoveBtn && (
        <div className="px-5 pb-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(item);
            }}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
          >
            <Trash2 size={14} /> Remove Property
          </button>
        </div>
      )}
    </div>
  );
}