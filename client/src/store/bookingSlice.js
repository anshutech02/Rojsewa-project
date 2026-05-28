import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api.js';

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/bookings', bookingData);
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Booking failed');
    }
  }
);

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/bookings');
      return data.bookings;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to load bookings');
    }
  }
);

export const fetchBookingDetail = createAsyncThunk(
  'bookings/fetchBookingDetail',
  async (bookingId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/bookings/${bookingId}`);
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to load booking details');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async ({ bookingId, cancellationReason }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/bookings/${bookingId}/cancel`, { cancellationReason });
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Cancellation failed');
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateBookingStatus',
  async ({ bookingId, status, note }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/bookings/${bookingId}/status`, { status, note });
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Status update failed');
    }
  }
);

const initialState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    updateLocalBookingStatus: (state, action) => {
      const { _id, status, statusHistory } = action.payload;
      const index = state.bookings.findIndex(b => b._id === _id);
      if (index !== -1) {
        state.bookings[index].status = status;
        state.bookings[index].statusHistory = statusHistory;
      }
      if (state.currentBooking && state.currentBooking._id === _id) {
        state.currentBooking.status = status;
        state.currentBooking.statusHistory = statusHistory;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Booking Detail
      .addCase(fetchBookingDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(fetchBookingDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Booking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        state.currentBooking = action.payload;
      })
      // Update Booking Status
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        state.currentBooking = action.payload;
      });
  },
});

export const { clearCurrentBooking, updateLocalBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
