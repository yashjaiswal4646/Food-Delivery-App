import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Loader from '../../components/Common/Loader';
import Error from '../../components/Common/Error';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

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
      
      const response = await axios.get(`${API_URL}/admin/orders`, config);
      setOrders(response.data.orders);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // FIX 2: Function to mark order as paid
  const handleMarkAsPaid = async (orderId, e) => {
    e.stopPropagation(); // Prevent row click
    
    if (!window.confirm('Mark this order as paid?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`${API_URL}/orders/${orderId}/pay`, {
        id: `MANUAL-${Date.now()}`,
        status: 'completed'
      }, config);
      
      toast.success('Order marked as paid');
      fetchOrders(); // Refresh orders
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update payment status');
    }
  };

  // FIX 2: Function to handle delivered and paid for COD orders
  const handleDeliveredAndPaid = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // First update order status to delivered
      await axios.put(`${API_URL}/admin/orders/${orderId}/status`, 
        { status: 'delivered' }, 
        config
      );

      // Then mark as paid (for COD orders)
      if (selectedOrder?.paymentMethod === 'cod') {
        await axios.put(`${API_URL}/orders/${orderId}/pay`, {
          id: `COD-${Date.now()}`,
          status: 'completed'
        }, config);
      }
      
      toast.success('Order delivered and payment completed');
      fetchOrders();
      setShowDetails(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order');
    }
  };

  // Updated handleStatusChange to auto-mark COD as paid when delivered
  const handleStatusChange = async (orderId, newStatus, e) => {
    e.stopPropagation(); // Prevent row click
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Find the order to check payment method
      const order = orders.find(o => o._id === orderId);

      // If status is being changed to delivered and payment method is COD and not paid
      if (newStatus === 'delivered' && order?.paymentMethod === 'cod' && !order.isPaid) {
        // First mark as paid
        await axios.put(`${API_URL}/orders/${orderId}/pay`, {
          id: `COD-${Date.now()}`,
          status: 'completed'
        }, config);
      }

      // Then update status
      await axios.put(`${API_URL}/admin/orders/${orderId}/status`, 
        { status: newStatus }, 
        config
      );
      
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
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

  const handleRowClick = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleViewDetails = (e, order) => {
    e.stopPropagation(); // Prevent row click when clicking the view button
    setSelectedOrder(order);
    setShowDetails(true);
  };

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="py-8 container-custom">
        <h1 className="mb-8 text-3xl font-bold">Order Management</h1>

        {/* Orders Table */}
        <div className="overflow-hidden bg-white rounded-lg shadow-md">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Payment
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr 
                  key={order._id}
                  className="transition cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(order._id)}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{order.user?.name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{order.user?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-primary-600">
                      Rs.{order.totalPrice?.toFixed(2) || '0.00'}
                    </div>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value, e)}
                      className={`text-sm rounded-full px-3 py-1 font-medium border-0 cursor-pointer ${getStatusColor(order.orderStatus)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    {/* FIX 3: Updated Payment Status Column */}
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.isPaid
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                      {!order.isPaid && order.paymentMethod === 'cod' && (
                        <button
                          onClick={(e) => handleMarkAsPaid(order._id, e)}
                          className="text-xs text-green-600 hover:text-green-800 whitespace-nowrap"
                          title="Mark as Paid"
                        >
                          ✓ Mark Paid
                        </button>
                      )}
                      {!order.isPaid && order.paymentMethod !== 'cod' && (
                        <span className="text-xs text-blue-600 whitespace-nowrap">
                          (Awaiting)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleViewDetails(e, order)}
                      className="text-blue-600 transition hover:text-blue-900"
                      title="View Order Details"
                    >
                      <FaEye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {showDetails && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-medium">#{selectedOrder._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="mb-3 font-semibold">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{selectedOrder.user?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedOrder.user?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedOrder.user?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="mb-3 font-semibold">Shipping Address</h3>
                  <p className="text-gray-700">
                    {selectedOrder.shippingAddress?.street},<br />
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode},<br />
                    {selectedOrder.shippingAddress?.country}
                  </p>
                </div>

                {/* Order Items */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="mb-3 font-semibold">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.orderItems?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image || 'https://via.placeholder.com/50'}
                            alt={item.name}
                            className="object-cover w-12 h-12 rounded"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/50';
                            }}
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Rs.{item.price} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-primary-600">
                          Rs.{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium capitalize">{selectedOrder.paymentMethod || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <p className={`font-medium ${selectedOrder.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                      {selectedOrder.isPaid ? 'Paid' : 'Pending'}
                    </p>
                  </div>
                </div>

                {/* FIX 4: Payment Actions Section */}
                {!selectedOrder.isPaid && (
                  <div className="p-4 rounded-lg bg-yellow-50">
                    <h3 className="mb-3 font-semibold text-yellow-800">Payment Action Required</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsPaid(selectedOrder._id, e);
                          setShowDetails(false);
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        Mark as Paid
                      </button>
                      {selectedOrder.paymentMethod === 'cod' && (
                        <button
                          onClick={() => handleDeliveredAndPaid(selectedOrder._id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                          Mark Delivered & Paid
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="mb-3 font-semibold">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>Rs.{selectedOrder.itemsPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span>Rs.{selectedOrder.deliveryPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>Rs.{selectedOrder.taxPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between pt-2 text-lg font-bold border-t">
                      <span>Total</span>
                      <span className="text-primary-600">Rs.{selectedOrder.totalPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowDetails(false);
                    navigate(`/admin/orders/${selectedOrder._id}`);
                  }}
                  className="btn-primary"
                >
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;