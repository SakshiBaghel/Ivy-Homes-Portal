// import React from 'react';
import { X, Bed, Bath, Maximize2, MapPin, CheckCircle, Phone, User, Compass, Layers } from 'lucide-react';

export default function PropertyModal({ item, onClose }) {
  if (!item) return null;

  const formatPrice = (val) => {
    if (!val) return 'N/A';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lac`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase px-2.5 py-1 rounded bg-slate-100 text-slate-700">
            {item.property_type || 'Apartment'}
          </span>
          {item.is_verified && (
            <span className="flex items-center text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600">
              <CheckCircle size={14} className="mr-1" /> Verified
            </span>
          )}
        </div>

        <h2 className="text-2xl font-bold text-slate-900">
          {item.apartment_name || item.title}
        </h2>

        <p className="flex items-center text-slate-500 text-sm mt-1 capitalize">
          <MapPin size={16} className="mr-1 text-slate-400" />
          {item.locality || 'Pune'}
        </p>

        <div className="my-4 p-4 rounded-xl bg-slate-50 flex justify-between items-center">
          <div>
            <div className="text-2xl font-bold text-slate-900">{formatPrice(item.price)}</div>
            {item.carpet_area ? (
              <div className="text-xs text-slate-500">
                ₹{Math.round(item.price / item.carpet_area)} per sqft
              </div>
            ) : null}
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>Furnishing: <span className="font-semibold text-slate-700 capitalize">{item.furnishing || 'N/A'}</span></div>
            <div>Facing: <span className="font-semibold text-slate-700 capitalize">{item.facing_direction || 'N/A'}</span></div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 my-4 text-center">
          <div className="p-3 rounded-lg border border-slate-100">
            <Bed size={18} className="mx-auto text-slate-400 mb-1" />
            <div className="text-xs text-slate-500">Bedrooms</div>
            <div className="font-semibold text-slate-800">{item.bedroom} BHK</div>
          </div>
          <div className="p-3 rounded-lg border border-slate-100">
            <Bath size={18} className="mx-auto text-slate-400 mb-1" />
            <div className="text-xs text-slate-500">Bathrooms</div>
            <div className="font-semibold text-slate-800">{item.bathroom}</div>
          </div>
          <div className="p-3 rounded-lg border border-slate-100">
            <Maximize2 size={18} className="mx-auto text-slate-400 mb-1" />
            <div className="text-xs text-slate-500">Carpet Area</div>
            <div className="font-semibold text-slate-800">{item.carpet_area || '-'} sqft</div>
          </div>
          <div className="p-3 rounded-lg border border-slate-100">
            <Layers size={18} className="mx-auto text-slate-400 mb-1" />
            <div className="text-xs text-slate-500">Floor</div>
            <div className="font-semibold text-slate-800">{item.floor} of {item.total_floors}</div>
          </div>
        </div>

        <div className="my-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-1">Description</h4>
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg">
            {item.description || 'No description provided.'}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <User size={14} /> Posted by ({item.posted_by})
            </div>
            <div className="font-semibold text-slate-800 text-sm">{item.posted_by_name || 'Owner'}</div>
          </div>
          <a
            href={`tel:${item.posted_by_contact}`}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <Phone size={16} />
            {item.posted_by_contact || 'Contact'}
          </a>
        </div>
      </div>
    </div>
  );
}