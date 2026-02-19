import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import {
  FaTachometerAlt,
  FaUtensils,
  FaList,
  FaShoppingBag,
  FaUsers,
  FaChartBar,
  FaCog,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaHome
} from 'react-icons/fa';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      icon: <FaTachometerAlt className="text-xl" />
    },
    {
      path: '/admin/foods',
      name: 'Food Management',
      icon: <FaUtensils className="text-xl" />
    },
    {
      path: '/admin/categories',
      name: 'Categories',
      icon: <FaList className="text-xl" />
    },
    {
      path: '/admin/orders',
      name: 'Order Management',
      icon: <FaShoppingBag className="text-xl" />
    },
    {
      path: '/admin/users',
      name: 'User Management',
      icon: <FaUsers className="text-xl" />
    },
    
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 z-50 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {sidebarOpen ? (
            <h2 className="text-xl font-bold text-primary-500">Admin Panel</h2>
          ) : (
            <h2 className="mx-auto text-xl font-bold text-primary-500">A</h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Admin Info */}
        {sidebarOpen && (
          <div className="p-4 border-b border-gray-800">
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        )}

        {/* Menu Items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Links */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Link
            to="/"
            className="flex items-center p-3 mb-2 text-gray-300 transition-colors rounded-lg hover:bg-gray-800 hover:text-white"
          >
            <FaHome className="mr-3 text-xl" />
            {sidebarOpen && <span>Back to Site</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 text-gray-300 transition-colors rounded-lg hover:bg-red-600 hover:text-white"
          >
            <FaSignOutAlt className="mr-3 text-xl" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              {menuItems.find(item => isActive(item.path))?.name || 'Admin Panel'}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name}
              </span>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100">
                <span className="font-semibold text-primary-600">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;