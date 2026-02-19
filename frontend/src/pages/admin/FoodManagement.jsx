import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaImage, FaSearch, FaSync } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Loader from '../../components/Common/Loader';
import Error from '../../components/Common/Error';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FoodManagement = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    preparationTime: '',
    isVegetarian: false,
    isAvailable: true,
    image: null,
  });

  // Fetch foods and categories on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      console.log('Fetching foods and categories...');
      
      // Fetch both foods and categories
      const foodsResponse = await axios.get(`${API_URL}/foods`, config);
      const categoriesResponse = await axios.get(`${API_URL}/categories`, config);
      
      console.log('Foods API response:', foodsResponse.data);
      console.log('Categories API response:', categoriesResponse.data);
      
      // Handle different response structures
      let foodsData = [];
      if (foodsResponse.data && foodsResponse.data.foods) {
        foodsData = foodsResponse.data.foods;
      } else if (foodsResponse.data && Array.isArray(foodsResponse.data)) {
        foodsData = foodsResponse.data;
      } else if (foodsResponse.data && foodsResponse.data.data) {
        foodsData = foodsResponse.data.data;
      }
      
      console.log('Processed foods data:', foodsData);
      console.log('Number of foods:', foodsData.length);
      
      setFoods(foodsData);
      
      // Handle categories data
      let categoriesData = [];
      if (categoriesResponse.data && categoriesResponse.data.categories) {
        categoriesData = categoriesResponse.data.categories;
      } else if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
        categoriesData = categoriesResponse.data;
      }
      
      setCategories(categoriesData);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.response?.data?.message || 'Failed to fetch data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    toast.success('Data refreshed');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, image: files[0] });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      preparationTime: '',
      isVegetarian: false,
      isAvailable: true,
      image: null,
    });
    setEditingFood(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Validate form
    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.preparationTime) {
      toast.error('Please fill in all required fields');
      setSubmitting(false);
      return;
    }

    if (!editingFood && !formData.image) {
      toast.error('Please select an image');
      setSubmitting(false);
      return;
    }
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Log FormData contents for debugging
    console.log('Submitting form data:');
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      let response;
      
      if (editingFood) {
        console.log('Updating food with ID:', editingFood._id);
        response = await axios.put(`${API_URL}/foods/${editingFood._id}`, formDataToSend, config);
        toast.success('Food updated successfully');
      } else {
        console.log('Creating new food');
        response = await axios.post(`${API_URL}/foods`, formDataToSend, config);
        toast.success('Food added successfully');
      }

      console.log('Server response:', response.data);
      
      // Close modal and reset form
      setShowModal(false);
      resetForm();
      
      // Refresh the food list immediately
      await fetchData();
      
    } catch (error) {
      console.error('Error saving food:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Operation failed';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('No authentication token found');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await axios.delete(`${API_URL}/foods/${id}`, config);
        toast.success('Food deleted successfully');
        
        // Refresh the food list
        await fetchData();
        
      } catch (error) {
        console.error('Error deleting food:', error);
        toast.error(error.response?.data?.message || 'Failed to delete food');
      }
    }
  };

  const handleEdit = (food) => {
    console.log('Editing food:', food);
    setEditingFood(food);
    setFormData({
      name: food.name || '',
      description: food.description || '',
      price: food.price || '',
      category: food.category?._id || food.category || '',
      preparationTime: food.preparationTime || '',
      isVegetarian: food.isVegetarian || false,
      isAvailable: food.isAvailable !== undefined ? food.isAvailable : true,
      image: null,
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Filter foods based on search and category
  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         food.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || food.category?._id === selectedCategory || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading && !refreshing) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header with title, stats and add button */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Food Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Total Foods: <span className="font-semibold text-primary-600">{foods.length}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 transition border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={refreshing}
          >
            <FaSync className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center px-4 py-2 text-white transition rounded-lg bg-primary-600 hover:bg-primary-700"
          >
            <FaPlus className="mr-2" />
            Add New Food
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow md:flex-row">
        <div className="relative flex-1">
          <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search foods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-[200px]"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        {(searchTerm || selectedCategory) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 text-red-700 border border-red-200 rounded-lg bg-red-50">
          <p>{error}</p>
          <button 
            onClick={fetchData}
            className="mt-2 text-sm text-red-600 underline hover:text-red-800"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Food List */}
      <div className="overflow-hidden bg-white rounded-lg shadow">
        {foods.length === 0 ? (
          <div className="py-12 text-center">
            <FaImage className="mx-auto mb-4 text-6xl text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-700">No Food Items Found</h3>
            <p className="mb-4 text-gray-500">
              Get started by adding your first food item.
            </p>
            <button
              onClick={openAddModal}
              className="btn-primary"
            >
              Add Your First Food
            </button>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="py-12 text-center">
            <FaSearch className="mx-auto mb-4 text-6xl text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-700">No Matching Foods</h3>
            <p className="mb-4 text-gray-500">
              No foods match your search criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="text-primary-600 hover:text-primary-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="p-4 border-b bg-gray-50">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredFoods.length}</span> of{' '}
                <span className="font-semibold">{foods.length}</span> total foods
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Image
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Prep Time
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredFoods.map((food) => (
                    <tr key={food._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <img
                          src={food.image || 'https://via.placeholder.com/50x50?text=No+Image'}
                          alt={food.name}
                          className="object-cover w-12 h-12 rounded"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{food.name}</div>
                        <div className="max-w-xs text-sm text-gray-500 truncate">{food.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {food.category?.name || 
                           (typeof food.category === 'object' ? food.category?.name : 'N/A')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-primary-600">Rs.{food.price}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{food.preparationTime} min</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            food.isAvailable
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {food.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                          {food.isVegetarian && (
                            <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
                              Veg
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(food)}
                          className="mr-3 text-blue-600 hover:text-blue-900"
                          title="Edit food"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(food._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete food"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="mb-6 text-2xl font-bold">
              {editingFood ? 'Edit Food' : 'Add New Food'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Food Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Margherita Pizza"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="input-field"
                    placeholder="Describe the food item..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Price (Rs.) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="input-field"
                      placeholder="9.99"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Preparation Time (min) *
                    </label>
                    <input
                      type="number"
                      name="preparationTime"
                      value={formData.preparationTime}
                      onChange={handleInputChange}
                      min="1"
                      className="input-field"
                      placeholder="15"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Food Image {!editingFood && '*'}
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="input-field"
                    required={!editingFood}
                  />
                  {editingFood && (
                    <p className="mt-1 text-sm text-gray-500">
                      Leave empty to keep current image
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isVegetarian"
                      checked={formData.isVegetarian}
                      onChange={handleInputChange}
                      className="rounded text-primary-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Vegetarian</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                      className="rounded text-primary-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Available</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 transition border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : (editingFood ? 'Update Food' : 'Add Food')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodManagement;