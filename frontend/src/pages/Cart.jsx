import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../store/slices/cartSlice';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import Loader from '../components/Common/Loader';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items, totalItems, totalPrice, isLoading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      console.log('Fetching cart on Cart page load...');
      dispatch(getCart());
    }
  }, [dispatch, user]);

  const handleUpdateQuantity = async (itemId, currentQuantity, newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity === currentQuantity) return;
    
    console.log('Updating quantity:', { itemId, newQuantity });
    await dispatch(updateCartItem({ itemId, quantity: newQuantity }));
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      await dispatch(removeFromCart(itemId));
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="py-8 container-custom">
          <div className="max-w-md p-8 mx-auto text-center bg-white rounded-lg shadow-md">
            <FaShoppingBag className="mx-auto mb-4 text-6xl text-gray-400" />
            <h2 className="mb-4 text-2xl font-bold">Please Login to View Cart</h2>
            <p className="mb-6 text-gray-600">You need to be logged in to view and manage your cart.</p>
            <Link to="/login" className="inline-block btn-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="py-8 container-custom">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="py-8 container-custom">
        <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

        {items?.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="overflow-hidden bg-white rounded-lg shadow-md">
                {items.map((item, index) => (
                  <div
                    key={item._id}
                    className={`flex items-center p-4 ${
                      index !== items.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    {/* Item Image */}
                    <div className="flex-shrink-0 w-20 h-20">
                      <img
                        src={item.image || 'https://via.placeholder.com/80'}
                        alt={item.name}
                        className="object-cover w-full h-full rounded"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80';
                        }}
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 ml-4">
                      <Link
                        to={`/food/${item.food?._id || item.food}`}
                        className="font-semibold hover:text-primary-600"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 font-bold text-primary-600">
                        Rs.{item.price?.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center mr-4">
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity, item.quantity - 1)}
                        className="p-2 border rounded-l hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="w-12 py-2 text-center border-t border-b">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity, item.quantity + 1)}
                        className="p-2 border rounded-r hover:bg-gray-100"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="w-24 mr-4 font-semibold text-right">
                      Rs.{(item.price * item.quantity).toFixed(2)}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="p-2 text-red-500 hover:text-red-700"
                      title="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}

                {/* Cart Actions */}
                <div className="flex items-center justify-between p-4 bg-gray-50">
                  <button
                    onClick={handleClearCart}
                    className="font-medium text-red-500 hover:text-red-700"
                  >
                    Clear Cart
                  </button>
                  <Link to="/menu" className="font-medium text-primary-600 hover:text-primary-700">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky p-6 bg-white rounded-lg shadow-md top-24">
                <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
                
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-semibold">Rs.{totalPrice?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold">
                      {totalPrice > 500 ? 'Free' : 'Rs.5.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-semibold">
                      Rs.{((totalPrice || 0) * 0.1).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 mb-6 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">
                      Rs.{((totalPrice || 0) + ((totalPrice || 0) > 500 ? 0 : 5) + (totalPrice || 0) * 0.1).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 mb-3 text-lg btn-primary"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/menu"
                  className="inline-block w-full py-3 text-center btn-outline"
                >
                  <FaArrowLeft className="inline mr-2" />
                  Continue Shopping
                </Link>

                <p className="mt-4 text-xs text-center text-gray-500">
                  Shipping and taxes calculated at checkout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md p-8 mx-auto text-center bg-white rounded-lg shadow-md">
            <FaShoppingBag className="mx-auto mb-4 text-6xl text-gray-400" />
            <h2 className="mb-2 text-2xl font-bold">Your cart is empty</h2>
            <p className="mb-6 text-gray-600">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/menu" className="inline-flex items-center btn-primary">
              <FaArrowLeft className="mr-2" />
              Browse Menu
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;