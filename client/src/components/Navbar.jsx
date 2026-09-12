// // import React from 'react';
// import { Home, Heart, BarChart3 } from 'lucide-react';

// export default function Navbar({ activeTab, setActiveTab }) {
//   return (
//     <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//         <div className="flex items-center space-x-2 font-bold text-xl tracking-tight">
//           <span className="text-emerald-400">Ivy</span>
//           <span>Homes</span>
//         </div>

//         <nav className="flex space-x-2">
//           <button
//             onClick={() => setActiveTab('listings')}
//             className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
//               activeTab === 'listings'
//                 ? 'bg-emerald-500 text-white'
//                 : 'text-slate-300 hover:bg-slate-800'
//             }`}
//           >
//             <Home size={16} />
//             <span>Listings</span>
//           </button>

//           <button
//             onClick={() => setActiveTab('analytics')}
//             className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
//               activeTab === 'analytics'
//                 ? 'bg-emerald-500 text-white'
//                 : 'text-slate-300 hover:bg-slate-800'
//             }`}
//           >
//             <BarChart3 size={16} />
//             <span>Market Insights</span>
//           </button>

//           <button
//             onClick={() => setActiveTab('saved')}
//             className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
//               activeTab === 'saved'
//                 ? 'bg-emerald-500 text-white'
//                 : 'text-slate-300 hover:bg-slate-800'
//             }`}
//           >
//             <Heart size={16} />
//             <span>Saved</span>
//           </button>
//         </nav>
//       </div>
//     </header>
//   );
// }

// import React from 'react';
import { Home, Heart, BarChart3 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, savedCount = 0 }) {
  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 font-bold text-xl tracking-tight cursor-pointer" onClick={() => setActiveTab('listings')}>
          <span className="text-emerald-400">Ivy</span>
          <span>Homes</span>
        </div>

        <nav className="flex space-x-2">
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'listings'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Home size={16} />
            <span>Listings</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'analytics'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BarChart3 size={16} />
            <span>Market Insights</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition relative ${
              activeTab === 'saved'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Heart size={16} />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-xs bg-red-500 text-white rounded-full font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}