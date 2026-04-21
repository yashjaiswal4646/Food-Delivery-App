import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://food-delivery-api-kgax.onrender.com/api';

// Get all foods
export const getFoods = createAsyncThunk(
  'food/getFoods',
  async (params = {}, thunkAPI) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(`${API_URL}/foods?${queryString}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single food
export const getFood = createAsyncThunk(
  'food/getFood',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/foods/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get categories
export const getCategories = createAsyncThunk(
  'food/getCategories',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  foods: [],
  food: null,
  categories: [],
  totalCount: 0,
  isLoading: false,
  filters: {
    category: '',
    search: '',
    sort: '',
    minPrice: '',
    maxPrice: '',
    isVegetarian: false,
  },
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Foods
      .addCase(getFoods.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFoods.fulfilled, (state, action) => {
        state.isLoading = false;
        state.foods = action.payload.foods;
        state.totalCount = action.payload.count;
      })
      .addCase(getFoods.rejected, (state) => {
        state.isLoading = false;
      })
      // Get Food
      .addCase(getFood.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFood.fulfilled, (state, action) => {
        state.isLoading = false;
        state.food = action.payload.food;
      })
      .addCase(getFood.rejected, (state) => {
        state.isLoading = false;
      })
      // Get Categories
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.categories;
      })
      .addCase(getCategories.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setFilters, resetFilters } = foodSlice.actions;
export default foodSlice.reducer;
