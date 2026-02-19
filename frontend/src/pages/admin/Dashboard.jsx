import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUsers, FaUtensils, FaShoppingBag, FaDollarSign } from 'react-icons/fa';
import Loader from '../../components/Common/Loader';
import Error from '../../components/Common/Error';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_URL}/admin/dashboard`, config);
      setStats(response.data.stats);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FaUsers,
      color: 'bg-blue-500',
      link: '/admin/users',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: FaShoppingBag,
      color: 'bg-green-500',
      link: '/admin/orders',
    },
    {
      title: 'Total Foods',
      value: stats.totalFoods,
      icon: FaUtensils,
      color: 'bg-yellow-500',
      link: '/admin/foods',
    },
    {
      title: 'Total Revenue',
      value: `Rs.${stats.totalRevenue.toFixed(2)}`,
      icon: FaDollarSign,
      color: 'bg-purple-500',
      link: '/admin/orders',
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="py-8 container-custom">
        <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="p-6 transition bg-white rounded-lg shadow-md hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                  <stat.icon className="text-xl text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Recent Orders */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-bold">Recent Orders</h2>
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <Link
                  key={order._id}
                  to={`/admin/orders/${order._id}`} 
                  className="block p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order #{order._id.slice(-6)}</p>
                      <p className="text-sm text-gray-600">
                        {order.user?.name} • ${order.totalPrice.toFixed(2)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.orderStatus === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                      order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              to="/admin/orders"
              className="w-full mt-4 text-center btn-outline"
            >
              View All Orders
            </Link>
          </div>

          {/* Popular Foods */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-bold">Popular Foods</h2>
            <div className="space-y-3">
              {stats.popularFoods.map((food, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <span className="mr-3 text-lg font-bold text-gray-400">#{index + 1}</span>
                    <span className="font-medium">{food.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{food.count} orders</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;