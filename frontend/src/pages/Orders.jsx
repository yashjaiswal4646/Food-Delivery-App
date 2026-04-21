import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingBag, FaClock, FaCheckCircle, FaTimesCircle, FaStar } from 'react-icons/fa';
import Loader from '../components/Common/Loader';
import Error from '../components/Common/Error';

const API_URL = import.meta.env.VITE_API_URL || 'https://food-delivery-api-kgax.onrender.com/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_URL}/orders/myorders`, config);
      setOrders(response.data.orders);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="py-8 container-custom">
        <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden transition bg-white rounded-lg shadow-md hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="mr-4 text-sm text-gray-600">
                          Order ID: {order._id.slice(-8).toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span>{order.orderItems.length} items</span>
                        <span className="font-semibold text-primary-600">
                          Rs.{order.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Status and Action */}
                    <div className="flex items-center mt-4 md:mt-0">
                      {getStatusIcon(order.orderStatus)}
                      <span className="ml-2 text-sm text-gray-600">
                        {order.orderStatus === 'delivered' && 'Delivered'}
                        {order.orderStatus === 'preparing' && 'Preparing your food'}
                        {order.orderStatus === 'pending' && 'Order confirmed'}
                        {order.orderStatus === 'cancelled' && 'Order cancelled'}
                      </span>
                    </div>
                  </div>

                  {/* Order Items with Review Buttons */}
                  <div className="mt-4">
                    <h3 className="mb-3 text-sm font-semibold text-gray-700">Order Items:</h3>
                    <div className="space-y-3">
                      {order.orderItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                          <div className="flex items-center space-x-3">
                            {/* Item Image */}
                            <div className="w-12 h-12 overflow-hidden rounded-md">
                              <img
                                src={item.image || 'https://via.placeholder.com/50'}
                                alt={item.name}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/50';
                                }}
                              />
                            </div>
                            
                            {/* Item Details */}
                            <div>
                              <Link 
                                to={`/food/${item.food?._id || item._id}`}
                                className="font-medium text-gray-800 hover:text-primary-600"
                              >
                                {item.name}
                              </Link>
                              <div className="text-sm text-gray-500">
                                Qty: {item.quantity} × Rs.{item.price}
                              </div>
                            </div>
                          </div>

                          {/* Review Button - Only for delivered orders */}
                          {order.orderStatus === 'delivered' && (
                            <Link
                              to={`/food/${item.food?._id || item._id}`}
                              className="flex items-center px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 transition"
                            >
                              <FaStar className="mr-1 text-yellow-500" size={12} />
                              Write Review
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* View Order Details Link */}
                  <div className="mt-4 text-right">
                    <Link
                      to={`/order/${order._id}`}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      View Order Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-white rounded-lg shadow">
            <FaShoppingBag className="mx-auto mb-4 text-6xl text-gray-400" />
            <h2 className="mb-4 text-2xl font-bold">No orders yet</h2>
            <p className="mb-4 text-gray-600">Looks like you haven't placed any orders.</p>
            <Link to="/menu" className="btn-primary">
              Browse Menu
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;