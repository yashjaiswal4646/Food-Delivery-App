import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaTruck, FaClock } from 'react-icons/fa';
import Loader from '../components/Common/Loader';
import Error from '../components/Common/Error';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_URL}/orders/${id}`, config);
      setOrder(response.data.order);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600';
      case 'preparing':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;
  if (!order) return <Error message="Order not found" />;

  return (
    <div className="min-h-screen pt-20">
      <div className="py-8 container-custom">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="mb-8 text-center">
            <FaCheckCircle className="mx-auto mb-4 text-6xl text-green-500" />
            <h1 className="mb-2 text-3xl font-bold">Order Placed Successfully!</h1>
            <p className="text-gray-600">
              Thank you for your order. We'll start preparing it right away.
            </p>
          </div>

          {/* Order Details */}
          <div className="overflow-hidden bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">Order ID</span>
                  <p className="font-semibold">{order._id}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Order Date</span>
                  <p className="font-semibold">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Order Status */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaTruck className={`text-2xl mr-3 ${getStatusColor(order.orderStatus)}`} />
                    <div>
                      <p className="text-sm text-gray-600">Current Status</p>
                      <p className={`font-semibold capitalize ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-3 text-2xl text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Estimated Delivery</p>
                      <p className="font-semibold">
                        {order.deliveredAt 
                          ? new Date(order.deliveredAt).toLocaleDateString()
                          : 'Within 45 minutes'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="mb-3 font-semibold">Order Items</h3>
                <div className="space-y-3">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="object-cover w-12 h-12 mr-3 rounded"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Delivery Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium capitalize">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </p>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">Delivery Address</p>
                <p className="font-medium">
                  {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
              </div>

              {/* Order Total */}
              <div className="pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>Rs.{order.itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>Rs.{order.deliveryPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>Rs.{order.taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 text-lg font-bold border-t">
                    <span>Total</span>
                    <span className="text-primary-600">Rs.{order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <Link to="/orders" className="flex-1 text-center btn-outline">
              View All Orders
            </Link>
            <Link to="/menu" className="flex-1 text-center btn-primary">
              Order More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;