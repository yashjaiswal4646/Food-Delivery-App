import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getMe } from '../store/slices/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login again');
        return;
      }

      console.log('Updating profile with token:', token.substring(0, 20) + '...');
      console.log('Sending data:', formData);

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      // Prepare data to send (remove email as it shouldn't be updated)
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      };

      const response = await axios.put(`${API_URL}/users/profile`, updateData, config);
      
      console.log('Update response:', response.data);
      
      if (response.data.success) {
        // Refresh user data in Redux
        await dispatch(getMe());
        toast.success(response.data.message || 'Profile updated successfully');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      
      if (error.response) {
        // Server responded with error
        console.error('Error response:', error.response.data);
        
        if (error.response.status === 401) {
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else if (error.response.status === 400) {
          toast.error(error.response.data.message || 'Invalid data provided');
        } else if (error.response.status === 404) {
          toast.error('User not found');
        } else {
          toast.error(error.response.data.message || 'Failed to update profile');
        }
      } else if (error.request) {
        // Request made but no response
        console.error('No response received:', error.request);
        toast.error('Cannot connect to server. Please check if backend is running.');
      } else {
        // Something else happened
        console.error('Error:', error.message);
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="py-8 container-custom">
        <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

        <div className="grid gap-8 md:grid-cols-4">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="mb-4 text-center">
                <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 rounded-full bg-primary-100">
                  <FaUser className="text-4xl text-primary-600" />
                </div>
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <FaEnvelope className="mr-2" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaPhone className="mr-2" />
                  <span className="text-sm">{user?.phone || 'Not added'}</span>
                </div>
                {user?.address?.street && (
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2" />
                    <span className="text-sm">
                      {user.address.street}, {user.address.city}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="md:col-span-3">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="mb-6 text-xl font-bold">Edit Profile</h2>

              <form onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                      disabled
                      readOnly
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="10 digit mobile number"
                      pattern="[0-9]{10}"
                      title="Please enter a 10 digit phone number"
                      required
                    />
                  </div>
                </div>

                <h3 className="mt-8 mb-4 text-lg font-semibold">Address Information</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="House number, street name"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <input
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., India"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center px-8 py-3 btn-primary"
                  >
                    {loading ? (
                      <>
                        <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        Update Profile
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;