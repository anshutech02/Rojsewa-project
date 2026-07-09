import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchServiceDetail } from '../../store/serviceSlice.js';
import { createBooking } from '../../store/bookingSlice.js';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import toast from 'react-hot-toast';

const BookingFlow = () => {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('serviceId');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentService, loading: serviceLoading } = useSelector((state) => state.services);
  const { loading: bookingLoading } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (serviceId) {
      dispatch(fetchServiceDetail(serviceId));
    }
  }, [dispatch, serviceId]);

  const onSubmit = (data) => {
    const bookingData = {
      serviceId,
      bookingType: currentService?.isEmergency ? 'emergency' : 'scheduled',
      scheduledDate: data.date,
      scheduledTime: data.time,
      address: {
        street: data.street,
        city: data.city,
        pincode: data.pincode,
      },
      notes: data.notes,
      paymentMethod: data.paymentMethod,
    };

    dispatch(createBooking(bookingData))
      .unwrap()
      .then(() => {
        toast.success('Booking requested successfully!');
        navigate('/bookings');
      })
      .catch((err) => toast.error(err));
  };

  if (serviceLoading || !currentService) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Confirm Booking</h2>
          <p className="text-zinc-500 text-sm">Schedule and confirm your service booking</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-6">
            <Card hoverEffect={false} className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    className="text-white [&::-webkit-calendar-picker-indicator]:invert"
                    label="Scheduled Date"
                    type="date"
                    error={errors.date}
                    {...register('date', { required: 'Date is required' })}
                  />
                  <Input
                    className="text-white [&::-webkit-calendar-picker-indicator]:invert"
                    label="Scheduled Time"
                    type="time"
                    error={errors.time}
                    {...register('time', { required: 'Time is required' })}
                  />
                </div>

                <div className="border-t border-zinc-800/80 pt-4 flex flex-col gap-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Service Address</h3>
                  <Input
                    label="Street Address"
                    error={errors.street}
                    {...register('street', { required: 'Street is required' })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City"
                      error={errors.city}
                      {...register('city', { required: 'City is required' })}
                    />
                    <Input
                      label="Pincode"
                      error={errors.pincode}
                      {...register('pincode', { required: 'Pincode is required' })}
                    />
                  </div>
                </div>

                <div className="border-t border-zinc-800/80 pt-4 flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Notes (Optional)</label>
                  <textarea
                    placeholder="Provide any specific details (e.g. key location, gate code, exact issue)"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[80px]"
                    {...register('notes')}
                  />
                </div>

                <div className="border-t border-zinc-800/80 pt-4 flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Payment Method</span>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/30 cursor-pointer">
                      <input 
                        type="radio" 
                        value="cash" 
                        defaultChecked
                        className="text-indigo-600 focus:ring-indigo-500" 
                        {...register('paymentMethod')}
                      />
                      <span className="text-sm text-zinc-300">Cash on Delivery</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/30 cursor-pointer opacity-50">
                      <input 
                        type="radio" 
                        value="online" 
                        disabled
                        className="text-indigo-600 focus:ring-indigo-500" 
                        {...register('paymentMethod')}
                      />
                      <span className="text-sm text-zinc-400">Online Pay (COD Only)</span>
                    </label>
                  </div>
                </div>

                <Button type="submit" variant="primary" loading={bookingLoading} className="w-full mt-2">
                  Request Booking
                </Button>
              </form>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card hoverEffect={false} className="p-6 flex flex-col gap-4 sticky top-24">
              <h3 className="font-bold border-b border-zinc-800 pb-2">Booking Summary</h3>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-500 uppercase">Service</span>
                <span className="text-sm font-medium text-zinc-300">{currentService.title}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-500 uppercase">Provider</span>
                <span className="text-sm font-medium text-zinc-300">{currentService.provider?.user?.name || 'Local Expert'}</span>
              </div>
              <div className="border-t border-zinc-800 pt-3 flex justify-between items-baseline mt-2">
                <span className="text-sm text-zinc-400">Total Amount</span>
                <span className="text-xl font-extrabold text-indigo-400">₹{currentService.price}</span>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingFlow;
