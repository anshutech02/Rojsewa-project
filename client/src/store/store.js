import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import serviceReducer from './serviceSlice.js';
import bookingReducer from './bookingSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    services: serviceReducer,
    bookings: bookingReducer,
  },
});

export default store;
