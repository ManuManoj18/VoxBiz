import React, { useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/home' || location.pathname === '/';
  const navigate = useNavigate();

  const { isAuthenticated, logout, isLoading } = useAuth();

  const handlelaunch = () => {
    if (isAuthenticated) {
      navigate('/dblist');
    } else {
      navigate('/login');
    }
  };
  
  useEffect(() => {
    console.log("Updated isAuthenticated:", isAuthenticated);
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
  };

  return (
  <nav className="relative z-10 flex w-full items-center justify-between bg-black/20 backdrop-blur-lg border-white/10 text-white border-b shadow-sm/50 px-16 py-3 mx-8 rounded-b-xl">

      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="relative group">
          <img
            src="/Navlogo.png"
            alt="Logo"
            className="size-10 rounded-full object-cover transition-all duration-300 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(139,69,199,0.8)] group-hover:drop-shadow-[0_0_25px_rgba(139,69,199,1)]"
          />
          <div className="absolute inset-0 rounded-full transition-all duration-300 bg-violet-500/20 group-hover:bg-violet-500/30 blur-sm group-hover:blur-md"></div>
        </div>

        <h1 className="text-2xl font-bold flex items-center whitespace-nowrap cursor-pointer hover:scale-105 transition-transform duration-200"
          style={{ fontSize: '1.8rem', lineHeight: '1.5rem' }}>
          Vox<span className="bg-gradient-to-br from-violet-500 to-pink-500 text-transparent bg-clip-text">Biz</span>
        </h1>
      </div>

      {/* Innovative Action Button & Settings Section */}
      <div className="flex items-center gap-4">

        {/* Single Cosmic Launch Button for Navbar - Only show when NOT authenticated */}
        {isHomePage && !isLoading && (
          <div className="relative group">
            <button
              onClick={() => handlelaunch()}
              className="relative px-5 py-2.5 font-semibold rounded-full transition-all duration-500 transform bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white hover:scale-110 active:scale-90 hover:rotate-1 group-hover:shadow-[0_0_40px_rgba(147,51,234,0.7)] overflow-hidden"
              style={{
                backgroundSize: '200% 200%',
                animation: 'gradient-flow 3s ease infinite'
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="group-hover:animate-spin transition-transform duration-300">🚀</span>
                Launch
                <span className="group-hover:animate-pulse">⚡</span>
              </span>

              {/* Orbiting Particles */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full group-hover:animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-pink-400 rounded-full group-hover:animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Cosmic Trail Effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 opacity-0 group-hover:opacity-30 group-hover:scale-150 transition-all duration-500 blur-sm"></div>

              {/* Ripple on Click */}
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 group-active:animate-ping transition-opacity duration-150"></div>
            </button>

            {/* CSS for gradient animation */}
            <style jsx>{`
    @keyframes gradient-flow {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
  `}</style>
          </div>
        )}
        {/* Logout Section (only if authenticated) */}
        {isAuthenticated && (
          <>
            <div className="border-t border-gray-700/50 mt-1"></div>

            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-red-400 hover:bg-red-900/20 hover:text-red-300"
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        )}

      </div>
    </nav>
  );
};

export default Navbar;