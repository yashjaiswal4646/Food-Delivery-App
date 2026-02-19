import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getFoods, getCategories } from '../store/slices/foodSlice';
import { FaArrowRight, FaStar, FaClock } from 'react-icons/fa';
import Loader from '../components/Common/Loader';
import Error from '../components/Common/Error';

const Home = () => {
  const dispatch = useDispatch();
  const { foods, categories, isLoading } = useSelector((state) => state.food);

  useEffect(() => {
    dispatch(getFoods({ limit: 6 }));
    dispatch(getCategories());
  }, [dispatch]);

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 text-white bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="container-custom">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h1 className="mb-6 text-4xl font-bold md:text-5xl">
                Delicious Food Delivered to Your Doorstep
              </h1>
              <p className="mb-8 text-xl text-primary-100">
                Choose from hundreds of restaurants and get your favorite food delivered fast and fresh.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/menu" className="px-8 py-3 font-semibold transition bg-white rounded-lg text-primary-600 hover:bg-gray-100">
                  Order Now
                </Link>
                <Link to="/categories" className="px-8 py-3 font-semibold text-white transition border-2 border-white rounded-lg hover:bg-white hover:text-primary-600">
                  Browse Categories
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Delicious Food"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Popular Categories</h2>
            <p className="text-gray-600">Explore our most popular food categories</p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category._id}
                to={`/menu?category=${category._id}`}
                className="group"
              >
                <div className="p-6 text-center card">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="object-cover w-24 h-24 mx-auto mb-4 transition rounded-full group-hover:scale-110"
                  />
                  <h3 className="mb-2 text-lg font-semibold">{category.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/categories" className="inline-flex items-center btn-outline">
              View All Categories
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Foods */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Featured Items</h2>
            <p className="text-gray-600">Try our most popular dishes</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                      <span>{food.rating} ({food.numReviews} reviews)</span>
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

          <div className="mt-8 text-center">
            <Link to="/menu" className="inline-flex items-center btn-primary">
              View Full Menu
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Fast Delivery</h3>
              <p className="text-gray-600">Get your food delivered within 30-45 minutes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Quality Food</h3>
              <p className="text-gray-600">Prepared by top chefs with fresh ingredients</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Secure Payment</h3>
              <p className="text-gray-600">Multiple payment options with secure checkout</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;