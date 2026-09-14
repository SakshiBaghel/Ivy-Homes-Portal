export default function RentalCard({ rental }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between h-full">
      
      {/* Top: Title & Property Type */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{rental.title}</h3>
          <p className="text-sm text-slate-500 capitalize">
            {rental.apartment_name} • {rental.locality}
          </p>
        </div>
        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded uppercase">
          {rental.property_type}
        </span>
      </div>

      {/* Middle: Grid Details */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 my-2 border-y border-slate-100 py-4">
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase">Rent / Month</p>
          <p className="text-xl font-bold text-emerald-600">₹{rental.price?.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase">Deposit</p>
          <p className="text-lg font-bold text-slate-800">₹{rental.deposit?.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase">Size</p>
          <p className="text-sm font-medium text-slate-700">
            {rental.bedroom} BHK • {rental.bathroom} Bath
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase">Area & Furnishing</p>
          <p className="text-sm font-medium text-slate-700 capitalize">
            {rental.carpet_area} sq.ft • {rental.furnishing?.replace('-', ' ')}
          </p>
        </div>
      </div>

      {/* Bottom: Agent Info & Button */}
      <div className="pt-2 flex justify-between items-center mt-2">
        <div className="text-xs text-slate-500">
          <p>Contact: <span className="font-semibold text-slate-700">{rental.posted_by_name}</span></p>
          <p className="capitalize text-slate-400">{rental.posted_by}</p>
        </div>
        
        <a 
          href={rental.listing_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition"
        >
          View Source
        </a>
      </div>
    </div>
  );
}