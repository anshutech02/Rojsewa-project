import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "./store/authSlice.js";
import HomePage from "./features/services/HomePage.jsx";
import LoginPage from "./features/auth/LoginPage.jsx";
import RegisterPage from "./features/auth/RegisterPage.jsx";
import ForgotPasswordPage from "./features/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./features/auth/ResetPasswordPage.jsx";
import VerifyEmailPage from "./features/auth/VerifyEmailPage.jsx";
import ProfilePage from "./features/auth/ProfilePage.jsx";
import ServiceDetailPage from "./features/services/ServiceDetailPage.jsx";
import BookingFlow from "./features/booking/BookingFlow.jsx";
import BookingHistory from "./features/booking/BookingHistory.jsx";
import BookingDetailPage from "./features/booking/BookingDetailPage.jsx";
import ProviderDashboard from "./features/provider/ProviderDashboard.jsx";
import AdminDashboard from "./features/admin/AdminDashboard.jsx";
import ProtectedRoute from "./components/shared/ProtectedRoute.jsx";
import Spinner from "./components/ui/Spinner.jsx";
import { waitForServer } from "./utils/waitForServer.js";
import TypingText from "./components/ui/TypingText.jsx";

const App = () => {
  const dispatch = useDispatch();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await waitForServer();

      if (localStorage.getItem("accessToken")) {
        try {
          await dispatch(getMe()).unwrap();
        } catch (err) {
          // Ignore if token is invalid
        }
      }

      setAppReady(true);
    };

    initialize();
  }, [dispatch]);

  if (!appReady) {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <Spinner />

      <TypingText />

      <p className="mt-2 text-sm text-gray-500">
        This may take a few seconds if the server is waking up.
      </p>
    </div>
  );
}

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
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
          path="/verify-email"
          element={
            <ProtectedRoute>
              <VerifyEmailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/new"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
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
            <ProtectedRoute allowedRoles={["provider"]}>
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/services"
          element={
            <ProtectedRoute allowedRoles={["provider"]}>
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
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
