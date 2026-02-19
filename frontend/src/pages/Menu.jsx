import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { getFoods, getCategories, setFilters } from '../store/slices/foodSlice';
import { FaStar, FaClock, FaFilter } from 'react-icons/fa';
import Loader from '../components/Common/Loader';
import Error from '../components/Common/Error';

const Menu = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const { foods, categories, filters, isLoading, totalCount } = useSelector(
    (state) => state.food
  );

  useEffect(() => {
    // Get filters from URL
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || '';
    
    dispatch(setFilters({ category, search, sort }));
  }, [searchParams, dispatch]);

  useEffect(() => {
    // Fetch foods with filters
    const queryParams = {};
    if (filters.category) queryParams.category = filters.category;
    if (filters.search) queryParams.search = filters.search;
    if (filters.sort) queryParams.sort = filters.sort;
    if (filters.minPrice) queryParams.minPrice = filters.minPrice;
    if (filters.maxPrice) queryParams.maxPrice = filters.maxPrice;
    if (filters.isVegetarian) queryParams.isVegetarian = filters.isVegetarian;
    
    dispatch(getFoods(queryParams));
    dispatch(getCategories());
  }, [dispatch, filters]);

  const handleCategoryChange = (categoryId) => {
    setSearchParams({ ...filters, category: categoryId });
    dispatch(setFilters({ category: categoryId }));
  };

  const handleSortChange = (e) => {
    const sort = e.target.value;
    setSearchParams({ ...filters, sort });
    dispatch(setFilters({ sort }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const search = e.target.search.value;
    setSearchParams({ ...filters, search });
    dispatch(setFilters({ search }));
  };

  const handlePriceFilter = () => {
    dispatch(setFilters(priceRange));
    setShowFilters(false);
  };

  const handleVegetarianToggle = () => {
    dispatch(setFilters({ isVegetarian: !filters.isVegetarian }));
  };

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' });
    setSearchParams({});
    dispatch(setFilters({
      category: '',
      search: '',
      sort: '',
      minPrice: '',
      maxPrice: '',
      isVegetarian: false,
    }));
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen pt-20">
      <div className="py-8 container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold">Our Menu</h1>
          <p className="text-gray-600">
            Explore our delicious food items ({totalCount} items)
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <input
                type="text"
                name="search"
                placeholder="Search food items..."
                defaultValue={filters.search}
                className="input-field"
              />
            </form>

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={handleSortChange}
              className="input-field md:w-48"
            >
              <option value="">Sort by</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center btn-outline md:w-auto"
            >
              <FaFilter className="mr-2" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="p-4 mt-4 rounded-lg bg-gray-50">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Price Range */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Vegetarian Filter */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Dietary Preferences
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.isVegetarian}
                      onChange={handleVegetarianToggle}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span>Vegetarian Only</span>
                  </label>
                </div>

                {/* Filter Actions */}
                <div className="flex items-end gap-2">
                  <button
                    onClick={handlePriceFilter}
                    className="flex-1 btn-primary"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={clearFilters}
                    className="flex-1 btn-outline"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex pb-2 space-x-2">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                !filters.category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategoryChange(category._id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  filters.category === category._id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Food Grid */}
        {foods.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {foods.map((food) => (
              <Link to={`/food/${food._id}`} key={food._id} className="overflow-hidden card group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="object-cover w-full h-full transition duration-300 group-hover:scale-110"
                  />
                  {food.isVegetarian && (
                    <span className="absolute px-2 py-1 text-xs text-white bg-green-500 rounded top-2 right-2">
                      Veg
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold">{food.name}</h3>
                    <span className="font-bold text-primary-600">Rs.{food.price}</span>
                  </div>
                  <p className="mb-3 text-sm text-gray-600 line-clamp-2">{food.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <FaStar className="mr-1 text-yellow-400" />
                      <span>{food.rating} ({food.numReviews})</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <FaClock className="mr-1" />
                      <span>{food.preparationTime} min</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <h3 className="mb-2 text-xl font-semibold">No food items found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;