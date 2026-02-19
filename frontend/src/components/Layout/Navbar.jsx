import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);

  // Debug log for cart items
  useEffect(() => {
    console.log('👤 User:', user?.email);
    console.log('🛒 Cart total items in Navbar:', totalItems);
  }, [user, totalItems]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">FoodieExpress</span>
          </Link>

          {/* Desktop Menu */}
          <div className="items-center hidden space-x-8 md:flex">
            <Link to="/" className="text-gray-700 transition hover:text-primary-600">
              Home
            </Link>
            <Link to="/menu" className="text-gray-700 transition hover:text-primary-600">
              Menu
            </Link>
            <Link to="/categories" className="text-gray-700 transition hover:text-primary-600">
              Categories
            </Link>
            
            {user ? (
              <>
                <Link to="/orders" className="text-gray-700 transition hover:text-primary-600">
                  Orders
                </Link>
                
                {/* Cart Icon with Count */}
                <Link to="/cart" className="relative group">
                  <FaShoppingCart className="text-xl text-gray-700 transition group-hover:text-primary-600" />
                  {totalItems > 0 && (
                    <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full -top-2 -right-2 bg-primary-600 animate-pulse">
                      {totalItems}
                    </span>
                  )}
                </Link>
                
                {/* User Dropdown */}
                <div className="relative user-dropdown-container">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 focus:outline-none"
                  >
                    <FaUser />
                    <span>{user.name?.split(' ')[0]}</span>
                  </button>
                  
                  {dropdownOpen && (
                    <div 
                      className="absolute right-0 w-48 py-2 mt-2 bg-white border border-gray-100 rounded-lg shadow-lg"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 transition hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-gray-700 transition hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-1 border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-red-600 transition hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl text-gray-700 md:hidden"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute left-0 right-0 px-4 py-4 mt-2 bg-white shadow-lg md:hidden">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-600"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/menu"
                className="text-gray-700 hover:text-primary-600"
                onClick={() => setIsOpen(false)}
              >
                Menu
              </Link>
              <Link
                to="/categories"
                className="text-gray-700 hover:text-primary-600"
                onClick={() => setIsOpen(false)}
              >
                Categories
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/orders"
                    className="text-gray-700 hover:text-primary-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    to="/cart"
                    className="flex items-center justify-between text-gray-700 hover:text-primary-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>Cart</span>
                    {totalItems > 0 && (
                      <span className="flex items-center justify-center w-5 h-5 text-xs text-white rounded-full bg-primary-600">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-primary-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="text-gray-700 hover:text-primary-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-left text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="text-center btn-outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-center btn-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;