import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2, Home, Heart, Plus, LogOut, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-[#252526] border-b border-[#3e3e42]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo & Links */}
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 mr-8">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Code2 size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">
                DevSnippet
              </span>
            </Link>

            {/* Navigation Links */}
            {isAuthenticated() && (
              <div className="flex space-x-4">
                <Link
                  to="/public"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-[#cccccc] hover:text-white hover:bg-[#2d2d30] transition"
                >
                  <Globe size={20} />
                  <span className="hidden sm:block">Public</span>
                </Link>
                <Link
                  to="/my-snippets"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-[#cccccc] hover:text-white hover:bg-[#2d2d30] transition"
                >
                  <Home size={20} />
                  <span className="hidden sm:block">My Snippets</span>
                </Link>

                <Link
                  to="/favorites"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-[#cccccc] hover:text-white hover:bg-[#2d2d30] transition"
                >
                  <Heart size={20} />
                  <span className="hidden sm:block">Favorites</span>
                </Link>

                
              </div>
            )}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <>
                {/* Create Button */}
                <Link
                  to="/create"
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition"
                >
                  <Plus size={20} />
                  <span className="hidden sm:block">New Snippet</span>
                </Link>

                {/* User Info */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm text-white font-medium">
                      {user?.username}
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-[#cccccc] hover:text-white hover:bg-[#2d2d30] transition"
                >
                  <LogOut size={20} />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/public"
                  className="text-[#cccccc] hover:text-white px-3 py-2"
                >
                  Public Snippets
                </Link>
                <Link
                  to="/login"
                  className="text-[#cccccc] hover:text-white px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;