import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings } from '../../store/bookingSlice.js';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const BookingHistory = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Your Bookings</h2>
          <p className="text-zinc-500 text-sm">Monitor and check current service appointments status</p>
        </div>

        {bookings.length === 0 ? (
          <Card hoverEffect={false} className="p-12 text-center text-zinc-500 flex flex-col gap-4 items-center">
            <span className="text-4xl">🗓️</span>
            <h3 className="font-bold text-zinc-300">No Bookings Placed</h3>
            <p className="text-sm">You haven't requested any services yet.</p>
            <Link to="/">
              <Button variant="primary">Explore Services</Button>
            </Link>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <Card key={booking._id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-zinc-200 text-base">
                      {booking.service?.title || 'Service Booking'}
                    </h3>
                    <Badge status={booking.status}>
                      {booking.status?.toUpperCase() || 'PENDING'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-zinc-500" />
                      {booking.scheduledDate ? format(new Date(booking.scheduledDate), 'PPP') : 'N/A'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-zinc-500" />
                      {booking.scheduledTime || 'N/A'}
                    </span>
                    <span className="font-medium text-zinc-300">
                      ₹{booking.totalAmount}
                    </span>
                  </div>
                </div>

                <Link to={`/bookings/${booking._id}`}>
                  <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                    View Details <ArrowRight size={14} />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BookingHistory;
