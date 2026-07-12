import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api.js';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('accessToken', data.accessToken);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('accessToken', data.accessToken);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Registration failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    return null;
  } catch (error) {
    // Always clear token on logout attempt, even if the API call fails
    localStorage.removeItem('accessToken');
    return rejectWithValue(error.response?.data?.error || 'Logout failed');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 3000; // 3 seconds between retries

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { data } = await api.get('/auth/me');
      return data;
    } catch (error) {
      const isNetworkError = !error.response && (error.code === 'ECONNABORTED' || error.message === 'Network Error');
      const isServerWaking = error.response?.status >= 500;

      // Retry on network errors or 5xx (Render waking up), unless last attempt
      if ((isNetworkError || isServerWaking) && attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY * attempt));
        continue;
      }

      return rejectWithValue({
        status: error.response?.status,
        isNetworkError: isNetworkError,
        message:
          error.response?.data?.error ||
          (isNetworkError ? 'Server is starting up, please wait...' : error.message) ||
          'Failed to load profile',
      });
    }
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/auth/update-profile', profileData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to update profile');
  }
});

const initialState = {
  user: null,
  provider: null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  initialLoading: !!localStorage.getItem('accessToken'), // true only if we need to verify the token
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.provider = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Clear auth state regardless — the user wanted to log out
        state.user = null;
        state.provider = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      // Get Me
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.initialLoading = false;
        state.user = action.payload.user;
        state.provider = action.payload.provider;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.initialLoading = false;

        const status = action.payload?.status;
        const isNetworkError = action.payload?.isNetworkError;

        if (status === 401) {
          // Definitive auth failure — clear everything
          state.user = null;
          state.provider = null;
          state.isAuthenticated = false;
          localStorage.removeItem("accessToken");
        } else if (isNetworkError) {
          // Network error (Render sleeping) — keep user authenticated
          // so they don't get redirected to login. The token is still valid.
          // isAuthenticated stays true, user data may be null until next success.
        }

        state.error =
          action.payload?.message || action.error?.message || "Failed to load profile";
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        if (action.payload.provider !== undefined) {
          state.provider = action.payload.provider;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
// Selector for admin role
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
