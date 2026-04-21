import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://food-delivery-api-kgax.onrender.com/api';

// Initial state
const initialState = {
  dashboardStats: null,
  users: [],
  allOrders: [],
  foods: [],
  categories: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Get Dashboard Stats
export const getDashboardStats = createAsyncThunk(
  'admin/getDashboardStats',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_URL}/admin/dashboard`, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get All Users
export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_URL}/admin/users`, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Toggle User Block Status
export const toggleUserBlock = createAsyncThunk(
  'admin/toggleUserBlock',
  async (userId, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(`${API_URL}/admin/users/${userId}/toggle-block`, {}, config);
      toast.success(`User ${response.data.user.isBlocked ? 'blocked' : 'unblocked'} successfully`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get All Orders
export const getAllOrders = createAsyncThunk(
  'admin/getAllOrders',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_URL}/admin/orders`, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Order Status
export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ orderId, status }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(`${API_URL}/admin/orders/${orderId}/status`, { status }, config);
      toast.success('Order status updated successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create Food
export const createFood = createAsyncThunk(
  'admin/createFood',
  async (foodData, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      
      const response = await axios.post(`${API_URL}/foods`, foodData, config);
      toast.success('Food item created successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Food
export const updateFood = createAsyncThunk(
  'admin/updateFood',
  async ({ id, foodData }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      
      const response = await axios.put(`${API_URL}/foods/${id}`, foodData, config);
      toast.success('Food item updated successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete Food
export const deleteFood = createAsyncThunk(
  'admin/deleteFood',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.delete(`${API_URL}/foods/${id}`, config);
      toast.success('Food item deleted successfully');
      return { id, ...response.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create Category
export const createCategory = createAsyncThunk(
  'admin/createCategory',
  async (categoryData, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      
      const response = await axios.post(`${API_URL}/categories`, categoryData, config);
      toast.success('Category created successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Category
export const updateCategory = createAsyncThunk(
  'admin/updateCategory',
  async ({ id, categoryData }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      
      const response = await axios.put(`${API_URL}/categories/${id}`, categoryData, config);
      toast.success('Category updated successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete Category
export const deleteCategory = createAsyncThunk(
  'admin/deleteCategory',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.delete(`${API_URL}/categories/${id}`, config);
      toast.success('Category deleted successfully');
      return { id, ...response.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    resetAdminState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearAdminData: (state) => {
      state.dashboardStats = null;
      state.users = [];
      state.allOrders = [];
      state.foods = [];
      state.categories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dashboardStats = action.payload.stats;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload.users;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Toggle User Block
      .addCase(toggleUserBlock.fulfilled, (state, action) => {
        state.isSuccess = true;
        // Update user in the list
        const index = state.users.findIndex(user => user._id === action.payload.user._id);
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
      })

      // Get All Orders
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.allOrders = action.payload.orders;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isSuccess = true;
        // Update order in the list
        const index = state.allOrders.findIndex(order => order._id === action.payload.order._id);
        if (index !== -1) {
          state.allOrders[index] = action.payload.order;
        }
        // Update dashboard stats if they exist
        if (state.dashboardStats) {
          const orderIndex = state.dashboardStats.recentOrders.findIndex(
            order => order._id === action.payload.order._id
          );
          if (orderIndex !== -1) {
            state.dashboardStats.recentOrders[orderIndex] = action.payload.order;
          }
        }
      })

      // Create Food
      .addCase(createFood.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.foods = [action.payload.food, ...state.foods];
      })

      // Update Food
      .addCase(updateFood.fulfilled, (state, action) => {
        state.isSuccess = true;
        const index = state.foods.findIndex(food => food._id === action.payload.food._id);
        if (index !== -1) {
          state.foods[index] = action.payload.food;
        }
      })

      // Delete Food
      .addCase(deleteFood.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.foods = state.foods.filter(food => food._id !== action.payload.id);
      })

      // Create Category
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.categories = [action.payload.category, ...state.categories];
      })

      // Update Category
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isSuccess = true;
        const index = state.categories.findIndex(cat => cat._id === action.payload.category._id);
        if (index !== -1) {
          state.categories[index] = action.payload.category;
        }
      })

      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.categories = state.categories.filter(cat => cat._id !== action.payload.id);
      });
  },
});

export const { resetAdminState, clearAdminData } = adminSlice.actions;
export default adminSlice.reducer;
