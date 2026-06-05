import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api.js';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/notifications');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/notifications/${id}/read`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to mark notification as read');
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/notifications/read-all');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to mark all notifications as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete notification');
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addLiveNotification: (state, action) => {
      // Add socket/live notification if it doesn't already exist
      if (!state.notifications.some((n) => n._id === action.payload._id)) {
        state.notifications.unshift(action.payload);
        if (!action.payload.isRead) {
          state.unreadCount += 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.notifications.filter((n) => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark Read
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex((n) => n._id === action.payload.notification._id);
        if (index !== -1) {
          if (!state.notifications[index].isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.notifications[index] = action.payload.notification;
        }
      })
      // Mark All Read
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({ ...n, isRead: true }));
        state.unreadCount = 0;
      })
      // Delete
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const deletedId = action.payload;
        const index = state.notifications.findIndex((n) => n._id === deletedId);
        if (index !== -1) {
          if (!state.notifications[index].isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.notifications.splice(index, 1);
        }
      });
  },
});

export const { addLiveNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
