import { useState, useEffect } from 'react';
import { fetchProjects } from '../api';

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await fetchProjects({ page: 1, limit: 12 });
        const data = Array.isArray(res.data) ? res.data : res.data.items || [];
        setProjects(data);
      } catch (err) {
        console.error(err);
      }
    };
    getProjects();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {projects.map((proj) => (
        <div key={proj.project_id} className="border rounded-lg p-4 shadow-sm bg-white">
          <h3 className="font-bold text-lg">{proj.apartment_name}</h3>
          <p className="text-sm text-slate-500">By {proj.developer_name} • {proj.locality}</p>
          <p className="text-lg font-bold text-emerald-600 mt-2">
            ₹{(proj.price_min / 10000000).toFixed(2)}Cr - ₹{(proj.price_max / 10000000).toFixed(2)}Cr
          </p>
          <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">{proj.project_status}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {proj.amenities?.slice(0, 3).map((amenity, i) => (
              <span key={i} className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded capitalize">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}