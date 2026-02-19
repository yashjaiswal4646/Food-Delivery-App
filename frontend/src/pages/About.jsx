import React from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaTruck, FaLeaf, FaHeart } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 text-white bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="text-center container-custom">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">About FoodieExpress</h1>
          <p className="max-w-3xl mx-auto text-xl text-primary-100">
            We're on a mission to deliver delicious food to your doorstep, 
            connecting you with the best restaurants in town.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold">Our Story</h2>
              <p className="mb-4 text-gray-600">
                Founded in 2020, FoodieExpress started with a simple idea: make great food accessible to everyone. 
                What began as a small delivery service in one neighborhood has grown into a platform connecting 
                hundreds of restaurants with thousands of happy customers.
              </p>
              <p className="mb-4 text-gray-600">
                We believe that food brings people together. Whether it's a quick lunch, a family dinner, 
                or a celebration with friends, we're here to make sure you get the best food, delivered fast and fresh.
              </p>
              <p className="text-gray-600">
                Today, we're proud to serve communities across the city, working with local restaurants to 
                bring their delicious creations to your table.
              </p>
            </div>
            <div className="overflow-hidden rounded-lg shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1552566624-52f8a3a7b9d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Our team"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="mb-12 text-3xl font-bold text-center">Our Values</h2>
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-primary-100">
                <FaUtensils className="text-3xl text-primary-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Quality Food</h3>
              <p className="text-gray-600">We partner with the best restaurants to ensure every meal meets our quality standards.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-primary-100">
                <FaTruck className="text-3xl text-primary-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Fast Delivery</h3>
              <p className="text-gray-600">Our delivery partners work hard to get your food to you hot and fresh.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-primary-100">
                <FaLeaf className="text-3xl text-primary-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Fresh Ingredients</h3>
              <p className="text-gray-600">We prioritize restaurants that use fresh, high-quality ingredients.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-primary-100">
                <FaHeart className="text-3xl text-primary-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Customer Love</h3>
              <p className="text-gray-600">Your satisfaction is our top priority. We're here to make you happy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="mb-4 text-3xl font-bold text-center">Meet Our Team</h2>
          <p className="max-w-2xl mx-auto mb-12 text-center text-gray-600">
            The passionate people behind FoodieExpress working hard to bring you the best food delivery experience.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="text-center">
                <div className="w-48 h-48 mx-auto mb-4 overflow-hidden border-4 rounded-full border-primary-100">
                  <img 
                    src={`https://randomuser.me/api/portraits/${item % 2 === 0 ? 'women' : 'men'}/${item + 20}.jpg`} 
                    alt="Team member"
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-semibold">
                  {item === 1 ? 'John Smith' : item === 2 ? 'Sarah Johnson' : 'Mike Chen'}
                </h3>
                <p className="text-gray-600">
                  {item === 1 ? 'CEO & Founder' : item === 2 ? 'Head of Operations' : 'Technical Lead'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;