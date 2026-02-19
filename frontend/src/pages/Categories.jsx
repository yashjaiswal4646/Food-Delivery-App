import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCategories } from '../store/slices/foodSlice';
import { FaUtensils, FaArrowRight } from 'react-icons/fa';
import Loader from '../components/Common/Loader';
import Error from '../components/Common/Error';

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, isLoading } = useSelector((state) => state.food);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="py-12 container-custom">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Food Categories
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Explore our wide variety of delicious food categories. From local favorites to international cuisine, we have something for everyone.
          </p>
        </div>

        {/* Categories Grid */}
        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/menu?category=${category._id}`}
                className="relative overflow-hidden transition-all duration-300 transform bg-white shadow-lg group rounded-2xl hover:-translate-y-2 hover:shadow-xl"
                onMouseEnter={() => setHoveredCategory(category._id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {/* Category Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={category.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={category.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:opacity-100" />
                </div>

                {/* Category Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transition-transform duration-300 transform translate-y-0 group-hover:translate-y-0">
                  <h3 className="mb-2 text-2xl font-bold text-white drop-shadow-lg">
                    {category.name}
                  </h3>
                  <p className="mb-3 text-sm text-white/90 line-clamp-2 drop-shadow">
                    {category.description}
                  </p>
                  <div className="flex items-center font-medium text-white">
                    <span className="mr-2">Explore Now</span>
                    <FaArrowRight className="transition-transform duration-300 transform group-hover:translate-x-2" />
                  </div>
                </div>

                {/* Category Icon Badge */}
                <div className="absolute p-3 text-white transition-transform duration-300 transform rounded-full shadow-lg top-4 right-4 bg-primary-600 group-hover:rotate-12">
                  <FaUtensils className="text-xl" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white shadow-sm rounded-2xl">
            <FaUtensils className="mx-auto mb-4 text-6xl text-gray-300" />
            <h3 className="mb-2 text-2xl font-semibold text-gray-700">
              No Categories Found
            </h3>
            <p className="mb-6 text-gray-500">
              We're working on adding more categories. Please check back later!
            </p>
            <Link to="/" className="inline-block btn-primary">
              Go Back Home
            </Link>
          </div>
        )}

        {/* Featured Categories Section */}
        {categories && categories.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-8 text-3xl font-bold text-center">
              Why Choose Our Categories?
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="p-6 text-center bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100">
                  <FaUtensils className="text-2xl text-primary-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Wide Variety</h3>
                <p className="text-gray-600">
                  Choose from multiple cuisines and food types
                </p>
              </div>
              <div className="p-6 text-center bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Quick Access</h3>
                <p className="text-gray-600">
                  Find your favorite foods faster with organized categories
                </p>
              </div>
              <div className="p-6 text-center bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Quality Assured</h3>
                <p className="text-gray-600">
                  Every category features top-rated restaurants and dishes
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;