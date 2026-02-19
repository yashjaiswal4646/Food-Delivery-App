import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getFood } from '../store/slices/foodSlice';
import { addToCart } from '../store/slices/cartSlice';
import { FaStar, FaClock, FaLeaf, FaMinus, FaPlus, FaShoppingCart, FaUser, FaCalendar } from 'react-icons/fa';
import Loader from '../components/Common/Loader';
import Rating from '../components/UI/Rating';
import ReviewModal from '../components/UI/ReviewModal';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FoodDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [canReview, setCanReview] = useState({ canReview: false, alreadyReviewed: false, hasOrdered: false });
  const [checkingReview, setCheckingReview] = useState(false);
  
  const { food, isLoading } = useSelector((state) => state.food);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      console.log('Fetching food details for ID:', id);
      dispatch(getFood(id));
      fetchReviews();
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (user && id) {
      checkCanReview();
    }
  }, [user, id]);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await axios.get(`${API_URL}/foods/${id}/reviews`);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const checkCanReview = async () => {
    setCheckingReview(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/foods/${id}/reviews/can-review`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCanReview(response.data);
    } catch (error) {
      console.error('Error checking review status:', error);
    } finally {
      setCheckingReview(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!food || !food._id) {
      toast.error('Food item not found');
      return;
    }

    setAddingToCart(true);
    console.log('Adding to cart:', { foodId: food._id, quantity });

    try {
      const result = await dispatch(addToCart({ 
        foodId: food._id, 
        quantity: quantity 
      })).unwrap();
      
      console.log('Add to cart result:', result);
      toast.success(`${quantity} x ${food.name} added to cart!`);
      
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error(error || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/foods/${id}/reviews`,
        reviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Review submitted successfully!');
      fetchReviews(); // Refresh reviews
      checkCanReview(); // Update review status
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (isLoading) return <Loader />;
  if (!food) return <div className="py-12 text-center">Food not found</div>;

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-5xl px-4 py-6 mx-auto">
        {/* Food Details Card */}
        <div className="overflow-hidden bg-white rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-5/12">
              <div className="relative h-64 md:h-72">
                <img
                  src={food.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={food.name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
                {food.isVegetarian && (
                  <span className="absolute px-2 py-1 text-xs text-white bg-green-500 rounded-full top-3 right-3">
                    Veg
                  </span>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="p-5 md:w-7/12 md:p-6">
              <h1 className="mb-2 text-2xl font-bold md:text-3xl">{food.name}</h1>
              
              {/* Ratings */}
              <div className="flex flex-wrap items-center mb-3 text-sm">
                <Rating value={food.rating || 0} size="sm" />
                <span className="ml-2 text-gray-500">
                  ({food.numReviews || 0} {food.numReviews === 1 ? 'review' : 'reviews'})
                </span>
                <span className="mx-2 text-gray-300">|</span>
                <div className="flex items-center text-gray-500">
                  <FaClock className="mr-1" size={14} />
                  <span>{food.preparationTime} min</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-3">
                <span className="text-2xl font-bold text-primary-600 md:text-3xl">Rs.{food.price}</span>
              </div>

              {/* Description */}
              <div className="mb-3">
                <h2 className="mb-1 text-base font-semibold">Description</h2>
                <p className="text-sm text-gray-600">{food.description}</p>
              </div>

              {/* Category & Dietary Info */}
              <div className="flex flex-wrap gap-3 mb-3">
                <div>
                  <span className="text-xs text-gray-500">Category:</span>
                  <span className="ml-1 text-sm font-medium">{food.category?.name || 'Uncategorized'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500">Type:</span>
                  {food.isVegetarian ? (
                    <span className="flex items-center ml-1 text-sm text-green-600">
                      <FaLeaf className="mr-1" size={12} />
                      Veg
                    </span>
                  ) : (
                    <span className="flex items-center ml-1 text-sm text-red-600">
                      <FaLeaf className="mr-1" size={12} />
                      Non-Veg
                    </span>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-4">
                {food.isAvailable ? (
                  <span className="text-xs font-semibold text-green-600">✓ In Stock</span>
                ) : (
                  <span className="text-xs font-semibold text-red-600">✗ Out of Stock</span>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              {food.isAvailable && (
                <div className="pt-3 border-t">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-semibold">Qty:</span>
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={decrementQuantity}
                        className="px-3 py-1 transition hover:bg-gray-100"
                        disabled={quantity <= 1}
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="px-4 py-1 text-sm font-semibold border-x">{quantity}</span>
                      <button
                        onClick={incrementQuantity}
                        className="px-3 py-1 transition hover:bg-gray-100"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart || !food.isAvailable}
                    className="flex items-center justify-center w-full py-3 text-sm font-medium btn-primary md:text-base"
                  >
                    <FaShoppingCart className="mr-2" size={16} />
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-6 overflow-hidden bg-white rounded-lg shadow-md">
          <div className="p-5 border-b md:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Customer Reviews</h2>
              
              {/* Review Button */}
              {user && (
                <div>
                  {canReview.canReview ? (
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-600 hover:bg-primary-700"
                    >
                      Write a Review
                    </button>
                  ) : canReview.alreadyReviewed ? (
                    <span className="text-sm text-green-600">✓ You already reviewed this</span>
                  ) : canReview.hasOrdered ? (
                    <span className="text-sm text-yellow-600">Please wait for delivery to review</span>
                  ) : (
                    <span className="text-sm text-gray-500">Order this item to review</span>
                  )}
                </div>
              )}
              {!user && (
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm text-primary-600 hover:underline"
                >
                  Login to write a review
                </button>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="p-5 md:p-6">
            {loadingReviews ? (
              <div className="py-8 text-center">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No reviews yet. Be the first to review this item!
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="pb-6 border-b last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                          <FaUser className="text-gray-600" size={14} />
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold">{review.name}</p>
                          <div className="flex items-center mt-1">
                            <Rating value={review.rating} size="sm" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <FaCalendar className="mr-1" />
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleSubmitReview}
        foodName={food.name}
      />
    </div>
  );
};

export default FoodDetails;