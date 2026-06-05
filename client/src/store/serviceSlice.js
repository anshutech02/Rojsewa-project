import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api.js';

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const { search, category, minPrice, maxPrice, rating, isEmergency, city } = queryParams;
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice); 
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (rating) params.append('rating', rating);
      if (isEmergency) params.append('isEmergency', isEmergency);
      if (city) params.append('city', city);

      const { data } = await api.get(`/services?${params.toString()}`);
      return data.services;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch services');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'services/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/categories');
      return data.categories;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories');
    }
  }
);

export const fetchServiceDetail = createAsyncThunk(
  'services/fetchServiceDetail',
  async (serviceId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/services/${serviceId}`);
      return data.service;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch service detail');
    }
  }
);

export const createService = createAsyncThunk(
  'services/createService',
  async (serviceData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/services', serviceData);
      return data.service;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create service');
    }
  }
);

export const fetchProviderServices = createAsyncThunk(
  'services/fetchProviderServices',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/services/provider/me');
      return data.services;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch provider services');
    }
  }
);

export const updateService = createAsyncThunk(
  'services/updateService',
  async ({ serviceId, serviceData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/services/${serviceId}`, serviceData);
      return data.service;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update service');
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (serviceId, { rejectWithValue }) => {
    try {
      await api.delete(`/services/${serviceId}`);
      return serviceId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete service');
    }
  }
);

const initialState = {
  serviceList: [],
  providerServices: [],
  categories: [],
  currentService: null,
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearCurrentService: (state) => {
      state.currentService = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceList = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Fetch Service Detail
      .addCase(fetchServiceDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentService = action.payload;
      })
      .addCase(fetchServiceDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Provider Services
      .addCase(fetchProviderServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviderServices.fulfilled, (state, action) => {
        state.loading = false;
        state.providerServices = action.payload;
      })
      .addCase(fetchProviderServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Service
      .addCase(createService.fulfilled, (state, action) => {
        state.providerServices.push(action.payload);
        state.serviceList.push(action.payload);
      })
      // Update Service
      .addCase(updateService.fulfilled, (state, action) => {
        const idx = state.providerServices.findIndex(s => s._id === action.payload._id);
        if (idx !== -1) {
          state.providerServices[idx] = action.payload;
        }
        const listIdx = state.serviceList.findIndex(s => s._id === action.payload._id);
        if (listIdx !== -1) {
          state.serviceList[listIdx] = action.payload;
        }
        if (state.currentService && state.currentService._id === action.payload._id) {
          state.currentService = action.payload;
        }
      })
      // Delete Service
      .addCase(deleteService.fulfilled, (state, action) => {
        state.providerServices = state.providerServices.filter(s => s._id !== action.payload);
        state.serviceList = state.serviceList.filter(s => s._id !== action.payload);
      });
  },
});

export const { clearCurrentService } = serviceSlice.actions;
export default serviceSlice.reducer;
