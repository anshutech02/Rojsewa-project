import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings, updateBookingStatus } from '../../store/bookingSlice.js';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { LayoutDashboard, Check, X, Play, ShieldAlert, Award } from 'lucide-react';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';

const ProviderDashboard = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchBookings());
    
    api.get('/provider/dashboard')
      .then(({ data }) => {
        setStats(data.stats);
      })
      .catch((err) => toast.error('Failed to load dashboard metrics'))
      .finally(() => setStatsLoading(false));
  }, [dispatch]);

  const handleStatusUpdate = (bookingId, nextStatus) => {
    const confirmation = window.confirm(`Are you sure you want to update this booking to: ${nextStatus}?`);
    if (!confirmation) return;

    dispatch(updateBookingStatus({ bookingId, status: nextStatus }))
      .unwrap()
      .then(() => {
        toast.success(`Booking ${nextStatus} successfully!`);
        // Reload dashboard stats
        api.get('/provider/dashboard').then(({ data }) => setStats(data.stats));
      })
      .catch((err) => toast.error(err));
  };

  const providerLinks = [
    { label: 'Overview', path: '/provider', icon: LayoutDashboard },
  ];

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <DashboardLayout title="Provider Control Panel" sidebarLinks={providerLinks}>
      {/* Top metrics bar */}
      {statsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => <div key={n} className="glass h-24 shimmer rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card hoverEffect={false} className="p-4 flex flex-col gap-1">
            <span className="text-zinc-500 text-xs uppercase font-medium">Total Bookings</span>
            <span className="text-2xl font-black text-zinc-100">{stats?.totalBookings || 0}</span>
          </Card>
          <Card hoverEffect={false} className="p-4 flex flex-col gap-1">
            <span className="text-zinc-500 text-xs uppercase font-medium">Active Bookings</span>
            <span className="text-2xl font-black text-indigo-400">{stats?.activeBookings || 0}</span>
          </Card>
          <Card hoverEffect={false} className="p-4 flex flex-col gap-1">
            <span className="text-zinc-500 text-xs uppercase font-medium">Total Earnings</span>
            <span className="text-2xl font-black text-emerald-400">₹{stats?.totalEarnings || 0}</span>
          </Card>
          <Card hoverEffect={false} className="p-4 flex flex-col gap-1">
            <span className="text-zinc-500 text-xs uppercase font-medium">Rating</span>
            <span className="text-2xl font-black text-yellow-400">⭐ {stats?.rating?.toFixed(1) || '0.0'}</span>
          </Card>
        </div>
      )}

      {/* Bookings Queue */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold">Booking Request Queue</h3>
        {bookings.length === 0 ? (
          <Card hoverEffect={false} className="p-8 text-center text-zinc-500">
            No booking requests received yet.
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <Card key={booking._id} className="p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-zinc-200 text-sm">
                      {booking.service?.title}
                    </h4>
                    <span className="text-xs text-zinc-400">
                      Customer: {booking.customer?.name} | {booking.customer?.phone}
                    </span>
                  </div>
                  <Badge status={booking.status}>{booking.status}</Badge>
                </div>

                <div className="text-xs text-zinc-400 bg-zinc-900/40 border border-zinc-800/80 p-3 rounded-lg flex flex-col gap-1.5">
                  <div>
                    <span className="font-semibold text-zinc-300">Schedule:</span>{' '}
                    {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-300">Address:</span>{' '}
                    {booking.address?.street}, {booking.address?.city}
                  </div>
                  {booking.notes && (
                    <div>
                      <span className="font-semibold text-zinc-300">Notes:</span> {booking.notes}
                    </div>
                  )}
                </div>

                {/* Operations buttons */}
                {booking.status === 'pending' && (
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" className="gap-1.5 text-red-400 border-red-500/20 hover:bg-red-500/10" onClick={() => handleStatusUpdate(booking._id, 'rejected')}>
                      <X size={14} /> Reject
                    </Button>
                    <Button variant="primary" size="sm" className="gap-1.5" onClick={() => handleStatusUpdate(booking._id, 'accepted')}>
                      <Check size={14} /> Accept Request
                    </Button>
                  </div>
                )}

                {booking.status === 'accepted' && (
                  <div className="flex gap-2 justify-end">
                    <Button variant="primary" size="sm" className="gap-1.5" onClick={() => handleStatusUpdate(booking._id, 'in_progress')}>
                      <Play size={14} /> Start Service
                    </Button>
                  </div>
                )}

                {booking.status === 'in_progress' && (
                  <div className="flex gap-2 justify-end">
                    <Button variant="primary" size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-500" onClick={() => handleStatusUpdate(booking._id, 'completed')}>
                      <Check size={14} /> Mark Completed
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProviderDashboard;
