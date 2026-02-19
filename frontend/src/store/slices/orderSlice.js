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
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Initial state
const initialState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Create new order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, thunkAPI) => {
    try {
      console.log('Creating order with data:', orderData);
      const response = await api.post('/orders', orderData);
      
      if (response.data.success) {
        toast.success('Order placed successfully!');
      }
      
      return response.data;
    } catch (error) {
      console.error('Create order error:', error);
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user orders
export const getMyOrders = createAsyncThunk(
  'order/getMyOrders',
  async (_, thunkAPI) => {
    try {
      console.log('Fetching my orders');
      const response = await api.get('/orders/myorders');
      console.log('Orders response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get my orders error:', error);
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single order
export const getOrderById = createAsyncThunk(
  'order/getOrderById',
  async (id, thunkAPI) => {
    try {
      console.log('Fetching order by ID:', id);
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get order by ID error:', error);
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update order to paid
export const updateOrderToPaid = createAsyncThunk(
  'order/updateOrderToPaid',
  async ({ id, paymentResult }, thunkAPI) => {
    try {
      const response = await api.put(`/orders/${id}/pay`, paymentResult);
      toast.success('Payment successful!');
      return response.data;
    } catch (error) {
      console.error('Update order to paid error:', error);
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Cancel order
export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async (id, thunkAPI) => {
    try {
      const response = await api.put(`/orders/${id}/cancel`, {});
      toast.success('Order cancelled successfully');
      return response.data;
    } catch (error) {
      console.error('Cancel order error:', error);
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentOrder = action.payload.order;
        state.orders = [action.payload.order, ...state.orders];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get My Orders
      .addCase(getMyOrders.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload.orders;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get Order By Id
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentOrder = action.payload.order;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update Order To Paid
      .addCase(updateOrderToPaid.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateOrderToPaid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentOrder = action.payload.order;
        // Update in orders list
        const index = state.orders.findIndex(order => order._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      })
      .addCase(updateOrderToPaid.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentOrder = action.payload.order;
        // Update in orders list
        const index = state.orders.findIndex(order => order._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetOrderState, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;