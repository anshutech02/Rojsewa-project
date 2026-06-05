import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import serviceReducer from './serviceSlice.js';
import bookingReducer from './bookingSlice.js';
import notificationReducer from './notificationSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    services: serviceReducer,
    bookings: bookingReducer,
    notifications: notificationReducer,
  },
});

export default store;
