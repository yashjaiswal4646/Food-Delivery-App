import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to request:', token.substring(0, 20) + '...');
    } else {
      console.log('No token found for request');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get cart
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔍 Fetching cart from API...');
      const response = await api.get('/cart');
      console.log('✅ Cart API response:', response.data);
      
      if (response.data.success) {
        return response.data;
      } else {
        return rejectWithValue('Failed to fetch cart');
      }
    } catch (error) {
      console.error('❌ Get cart error:', error);
      console.error('Error response:', error.response?.data);
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Add to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ foodId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      console.log('➕ Adding to cart:', { foodId, quantity });
      
      const response = await api.post('/cart/add', { foodId, quantity });
      console.log('✅ Add to cart response:', response.data);
      
      if (response.data.success) {
        toast.success('Item added to cart');
        
        // Immediately fetch the updated cart
        console.log('🔄 Fetching updated cart...');
        await dispatch(getCart());
        
        return response.data;
      } else {
        return rejectWithValue('Failed to add item');
      }
    } catch (error) {
      console.error('❌ Add to cart error:', error);
      console.error('Error response:', error.response?.data);
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Update cart item
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      console.log('✏️ Updating cart item:', { itemId, quantity });
      
      const response = await api.put(`/cart/update/${itemId}`, { quantity });
      console.log('✅ Update cart response:', response.data);
      
      if (response.data.success) {
        // Immediately fetch the updated cart
        await dispatch(getCart());
        return response.data;
      } else {
        return rejectWithValue('Failed to update item');
      }
    } catch (error) {
      console.error('❌ Update cart error:', error);
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { dispatch, rejectWithValue }) => {
    try {
      console.log('🗑️ Removing from cart:', itemId);
      
      const response = await api.delete(`/cart/remove/${itemId}`);
      console.log('✅ Remove from cart response:', response.data);
      
      if (response.data.success) {
        toast.success('Item removed from cart');
        // Immediately fetch the updated cart
        await dispatch(getCart());
        return response.data;
      } else {
        return rejectWithValue('Failed to remove item');
      }
    } catch (error) {
      console.error('❌ Remove from cart error:', error);
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      console.log('🧹 Clearing cart');
      
      const response = await api.delete('/cart/clear');
      console.log('✅ Clear cart response:', response.data);
      
      if (response.data.success) {
        toast.success('Cart cleared');
        // Immediately fetch the updated cart
        await dispatch(getCart());
        return response.data;
      } else {
        return rejectWithValue('Failed to clear cart');
      }
    } catch (error) {
      console.error('❌ Clear cart error:', error);
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  cart: null,
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  isError: false,
  message: '',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      console.log('🔄 Resetting cart state');
      state.cart = null;
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        console.log('⏳ Getting cart...');
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        console.log('✅ Get cart fulfilled:', action.payload);
        state.isLoading = false;
        
        if (action.payload && action.payload.cart) {
          state.cart = action.payload.cart;
          state.items = action.payload.cart.items || [];
          state.totalItems = action.payload.cart.totalItems || 0;
          state.totalPrice = action.payload.cart.totalPrice || 0;
          console.log('📦 Cart items:', state.items);
          console.log('🔢 Total items:', state.totalItems);
        } else {
          console.log('⚠️ No cart data in response');
          state.items = [];
          state.totalItems = 0;
          state.totalPrice = 0;
        }
      })
      .addCase(getCart.rejected, (state, action) => {
        console.error('❌ Get cart rejected:', action.payload);
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;