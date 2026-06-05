import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './store/authSlice.js';
import HomePage from './features/services/HomePage.jsx';
import LoginPage from './features/auth/LoginPage.jsx';
import RegisterPage from './features/auth/RegisterPage.jsx';
import ProfilePage from './features/auth/ProfilePage.jsx';
import ServiceDetailPage from './features/services/ServiceDetailPage.jsx';
import BookingFlow from './features/booking/BookingFlow.jsx';
import BookingHistory from './features/booking/BookingHistory.jsx';
import BookingDetailPage from './features/booking/BookingDetailPage.jsx';
import ProviderDashboard from './features/provider/ProviderDashboard.jsx';
import AdminDashboard from './features/admin/AdminDashboard.jsx';
import ProtectedRoute from './components/shared/ProtectedRoute.jsx';
import Spinner from './components/ui/Spinner.jsx';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMe());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />

        {/* Protected Customer Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/new"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <BookingFlow />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <BookingHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/:id"
          element={
            <ProtectedRoute>
              <BookingDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Provider Routes */}
        <Route
          path="/provider"
          element={
            <ProtectedRoute allowedRoles={['provider']}>
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/services"
          element={
            <ProtectedRoute allowedRoles={['provider']}>
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
