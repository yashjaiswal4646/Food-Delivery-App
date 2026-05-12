import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaArrowLeft, 
  FaUser, 
  FaMapMarkerAlt, 
  FaCreditCard, 
  FaMoneyBill, 
  FaMobile,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaTruck,
  FaUtensils
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import Loader from '../../components/Common/Loader';
import Error from '../../components/Common/Error';

const API_URL = import.meta.env.VITE_API_URL || 'https://food-delivery-api-kgax.onrender.com/api';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_URL}/orders/${id}`, config);
      setOrder(response.data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
      setError(error.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`${API_URL}/admin/orders/${id}/status`, { status: newStatus }, config);
      
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrderDetails(); // Refresh order details
      
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
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

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'cod':
        return <FaMoneyBill className="text-green-600" />;
      case 'card':
        return <FaCreditCard className="text-blue-600" />;
      case 'upi':
        return <FaMobile className="text-purple-600" />;
      default:
        return <FaCreditCard className="text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;
  if (!order) return <Error message="Order not found" />;

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" />
          Back to Orders
        </button>
        <h1 className="text-2xl font-bold">Order Details</h1>
      </div>

      {/* Order Status Card */}
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="text-lg font-semibold">#{order._id.slice(-8).toUpperCase()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Placed on</p>
            <p className="text-sm">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        {/* Status Update */}
        <div className="flex items-center gap-4 p-4 mt-4 rounded-lg bg-gray-50">
          <div className="flex items-center">
            <FaClock className="mr-2 text-gray-500" />
            <span className="text-sm font-medium">Order Status:</span>
          </div>
          <select
            value={order.orderStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating}
            className={`px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500 ${getStatusColor(order.orderStatus)}`}
          >
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {updating && <span className="text-sm text-gray-500">Updating...</span>}
        </div>
      </div>

      {/* Customer Information */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="flex items-center mb-4 text-lg font-semibold">
          <FaUser className="mr-2 text-primary-600" />
          Customer Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{order.user?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{order.user?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{order.user?.phone || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="flex items-center mb-4 text-lg font-semibold">
          <FaMapMarkerAlt className="mr-2 text-primary-600" />
          Shipping Address
        </h2>
        <p className="text-gray-700">
          {order.shippingAddress?.street},<br />
          {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode},<br />
          {order.shippingAddress?.country}
        </p>
      </div>

      {/* Payment Information */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="flex items-center mb-4 text-lg font-semibold">
          {getPaymentIcon(order.paymentMethod)}
          <span className="ml-2">Payment Information</span>
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Method</p>
            <p className="font-medium capitalize">{order.paymentMethod}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
              {order.isPaid ? 'Paid' : 'Pending'}
            </p>
          </div>
          {order.isPaid && order.paidAt && (
            <div>
              <p className="text-sm text-gray-500">Paid on</p>
              <p className="text-sm">{formatDate(order.paidAt)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="flex items-center mb-4 text-lg font-semibold">
          <FaUtensils className="mr-2 text-primary-600" />
          Order Items
        </h2>
        <div className="space-y-4">
          {order.orderItems?.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-4">
                <img
                  src={item.image || 'https://via.placeholder.com/60'}
                  alt={item.name}
                  className="object-cover w-16 h-16 rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/60';
                  }}
                />
                <div>
                  <Link 
                    to={`/food/${item.food?._id || item._id}`}
                    className="font-medium hover:text-primary-600"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-500">
                    Rs.{item.price} × {item.quantity}
                  </p>
                </div>
              </div>
              <div className="text-lg font-semibold text-primary-600">
                Rs.{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="pt-4 mt-4 border-t">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>Rs.{order.itemsPrice?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span>Rs.{order.deliveryPrice?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span>Rs.{order.taxPrice?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between pt-2 text-lg font-bold border-t">
              <span>Total</span>
              <span className="text-primary-600">Rs.{order.totalPrice?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Status */}
      {order.deliveredAt && (
        <div className="p-4 rounded-lg bg-green-50">
          <div className="flex items-center">
            <FaCheckCircle className="mr-2 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Delivered</p>
              <p className="text-sm text-green-600">{formatDate(order.deliveredAt)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
