import { useState, useEffect } from 'react';
import { fetchRentals } from '../api';

export default function Rentals() {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const getRentals = async () => {
      try {
        const res = await fetchRentals({ page: 1, limit: 12 });
        const data = Array.isArray(res.data) ? res.data : res.data.items || [];
        setRentals(data);
      } catch (err) {
        console.error(err);
      }
    };
    getRentals();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {rentals.map((item) => (
        <div key={item.listing_id} className="border rounded-lg p-4 shadow-sm bg-white">
          <h3 className="font-bold text-lg">{item.title}</h3>
          <p className="text-sm text-slate-500">{item.locality} • {item.bhk} BHK</p>
          <p className="text-xl font-bold text-emerald-600 mt-2">₹{item.price.toLocaleString()}/mo</p>
          <p className="text-xs text-slate-400 mt-1">Deposit: ₹{item.deposit.toLocaleString()}</p>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-3 font-medium">
            {item.furnishing}
          </span>
        </div>
      ))}
    </div>
  );
}