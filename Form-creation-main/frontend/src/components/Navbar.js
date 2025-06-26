import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-900">
          Form Builder Pro
        </Link>
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <span className="text-sm text-gray-600">Welcome, {user.username}</span>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm text-blue-600 hover:text-blue-800">
                  Admin Dashboard
                </Link>
              )}
              {user.role === 'user' && (
                <Link to="/dashboard" className="text-sm text-blue-600 hover:text-blue-800">
                  My Forms
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-gray-600 hover:text-gray-800"
              >
                <FaSignOutAlt className="mr-1" /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
