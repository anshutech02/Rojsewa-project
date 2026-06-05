import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
} from '../../store/notificationSlice.js';
import {
  Bell,
  ClipboardList,
  CreditCard,
  Star,
  Award,
  AlertTriangle,
  Check,
  Trash2,
  CheckCheck,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const NotificationTray = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading } = useSelector((state) => state.notifications);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Poll for notifications every 12 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    dispatch(fetchNotifications());
    const interval = setInterval(() => {
      dispatch(fetchNotifications());
    }, 12000);

    return () => clearInterval(interval);
  }, [dispatch, isAuthenticated]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkRead = (id, isRead) => {
    if (isRead) return;
    dispatch(markNotificationRead(id))
      .unwrap()
      .catch(() => toast.error('Failed to mark read'));
  };

  const handleMarkAllRead = () => {
    if (unreadCount === 0) return;
    dispatch(markAllNotificationsRead())
      .unwrap()
      .then(() => toast.success('All marked as read'))
      .catch(() => toast.error('Failed to mark all read'));
  };

  const handleDelete = (e, id) => {
    e.stopPropagation(); // Avoid triggering markRead on click
    dispatch(deleteNotification(id))
      .unwrap()
      .then(() => toast.success('Notification cleared'))
      .catch(() => toast.error('Failed to clear notification'));
  };

  // Get matching icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return <ClipboardList size={14} className="text-indigo-400" />;
      case 'payment':
        return <CreditCard size={14} className="text-emerald-400" />;
      case 'review':
        return <Star size={14} className="text-yellow-400" />;
      case 'provider':
        return <Award size={14} className="text-amber-400" />;
      case 'system':
      default:
        return <AlertTriangle size={14} className="text-purple-400" />;
    }
  };

  // Time formatter
  const formatTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Bell Button */}
      <button
        onClick={handleToggle}
        className="relative p-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 border border-transparent hover:border-zinc-800/80 transition-all duration-300 cursor-pointer"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 bg-red-600 border-2 border-zinc-950 text-[8px] font-black text-white rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Tray Dropdown Overlay */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[460px] animate-in fade-in slide-in-from-top-3 duration-200">
          
          {/* Header */}
          <div className="p-4 border-b border-zinc-800/60 bg-zinc-900/60 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-sm text-zinc-200">Updates & Notifications</h4>
              <p className="text-[10px] text-zinc-500">{unreadCount} unread messages</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                title="Mark all as read"
              >
                <CheckCheck size={12} />
                Read all
              </button>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/40 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="py-12 px-6 flex flex-col items-center gap-2 text-center text-zinc-500">
                <Bell size={24} className="text-zinc-700" />
                <p className="text-xs font-semibold text-zinc-400">All caught up!</p>
                <p className="text-[10px] text-zinc-500">You don't have any notifications at the moment.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleMarkRead(notification._id, notification.isRead)}
                  className={`p-3.5 flex gap-3 cursor-pointer transition-all duration-200 relative group ${
                    notification.isRead 
                      ? 'bg-transparent hover:bg-zinc-800/10' 
                      : 'bg-indigo-950/10 hover:bg-indigo-950/20 border-l-2 border-indigo-500'
                  }`}
                >
                  {/* Icon Indicator */}
                  <div className="flex-shrink-0 w-7 h-7 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex justify-between items-start gap-2">
                      <h5 className={`text-xs font-bold truncate ${
                        notification.isRead ? 'text-zinc-300' : 'text-zinc-100'
                      }`}>
                        {notification.title}
                      </h5>
                      <span className="text-[9px] text-zinc-500 font-medium flex-shrink-0 mt-0.5">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                      {notification.message}
                    </p>
                  </div>

                  {/* Actions buttons */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex gap-1 bg-zinc-900/90 pl-2 rounded transition-opacity">
                    {!notification.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkRead(notification._id, false);
                        }}
                        className="p-1 rounded text-emerald-400 hover:bg-emerald-950/30 transition-colors"
                        title="Mark read"
                      >
                        <Check size={12} />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(e, notification._id)}
                      className="p-1 rounded text-red-400 hover:bg-red-950/30 transition-colors"
                      title="Clear"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer View */}
          <div className="p-2 border-t border-zinc-850 bg-zinc-950/30 text-center">
            <span className="text-[9px] text-zinc-600 font-bold tracking-widest uppercase">
              Rozseva Notification Service
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationTray;
