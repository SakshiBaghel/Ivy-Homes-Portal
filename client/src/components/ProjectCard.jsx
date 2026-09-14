export default function ProjectCard({ project }) {
  // Possession date se sirf saal (year) nikalne ke liye
  const possessionYear = project.possession_date 
    ? new Date(project.possession_date).getFullYear() 
    : 'N/A';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between h-full relative">
      
      {/* Top: Status Badge */}
      <span className="absolute top-4 right-4 px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wider border border-emerald-200">
        {project.project_status?.replace('-', ' ')}
      </span>

      {/* Top: Title & Developer */}
      <div className="mb-4 pr-16">
        <h3 className="text-lg font-bold text-slate-900">{project.apartment_name}</h3>
        <p className="text-sm text-slate-500 capitalize">
          By {project.developer_name} • {project.locality}
        </p>
      </div>

      {/* Middle: Grid Details */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 my-2 border-y border-slate-100 py-4">
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase">Price Range</p>
          <p className="text-lg font-bold text-emerald-600">₹{project.price_min} - {project.price_max} Cr</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase">Area Range</p>
          <p className="text-sm font-medium text-slate-800">{project.min_area_sqft} - {project.max_area_sqft} sq.ft</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase">Possession</p>
          <p className="text-sm font-medium text-slate-800">{possessionYear}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase">Scale</p>
          <p className="text-sm font-medium text-slate-800">{project.total_units} Units • {project.total_towers} Towers</p>
        </div>
      </div>

      {/* Bottom: RERA, Amenities & Button */}
      <div className="pt-2 flex justify-between items-end mt-2">
        <div className="text-xs text-slate-500 max-w-[50%]">
          <p className="mb-1">RERA: <span className="font-medium text-slate-700 truncate block">{project.rera_number || 'N/A'}</span></p>
          <p className="capitalize truncate" title={project.amenities?.join(', ')}>
            {project.amenities?.slice(0, 3).join(', ')}{project.amenities?.length > 3 ? '...' : ''}
          </p>
        </div>
        
        <a 
          href={project.project_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition whitespace-nowrap"
        >
          View Source
        </a>
      </div>
    </div>
  );
}