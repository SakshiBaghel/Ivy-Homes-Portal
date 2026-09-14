import { Home, Heart, BarChart3, LogIn, LogOut, Key, Building2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, savedCount = 0, user, onLoginClick, onLogoutClick }) {
  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 font-bold text-xl tracking-tight cursor-pointer" onClick={() => setActiveTab('listings')}>
          <span className="text-emerald-400">Ivy</span>
          <span>Homes</span>
        </div>

        <nav className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'listings' ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Home size={16} />
            <span>Listings</span>
          </button>

          <button
            onClick={() => setActiveTab('rentals')}
            className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'rentals' ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Key size={16} />
            <span>Rentals</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'projects' ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Building2 size={16} />
            <span>Projects</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'analytics' ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BarChart3 size={16} />
            <span>Insights</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition relative ${
              activeTab === 'saved' ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:bg-slate-800'
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

          <div className="border-l border-slate-700 ml-2 pl-4 flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-emerald-400 font-medium">{user.email}</span>
                <button
                  onClick={onLogoutClick}
                  className="flex items-center space-x-1 text-sm text-red-400 hover:text-red-300 font-medium"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center space-x-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition"
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}