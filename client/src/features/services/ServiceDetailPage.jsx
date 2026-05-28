import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchServiceDetail, clearCurrentService } from '../../store/serviceSlice.js';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { Clock, Tag, User, MapPin, ShieldCheck, Heart } from 'lucide-react';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentService, loading } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(fetchServiceDetail(id));
    return () => {
      dispatch(clearCurrentService());
    };
  }, [dispatch, id]);

  if (loading || !currentService) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const { title, description, price, duration, isEmergency, category, provider } = currentService;
  const providerUser = provider?.user;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Details */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
                  {category?.name || 'Category'}
                </span>
                {isEmergency && (
                  <span className="px-3 py-1 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 animate-pulse">
                    Emergency Service
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-100">{title}</h1>
            </div>

            <Card hoverEffect={false} className="p-6 flex flex-col gap-4">
              <h2 className="text-lg font-bold">Service Description</h2>
              <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">{description}</p>
            </Card>

            <Card hoverEffect={false} className="p-6 flex flex-col gap-4">
              <h2 className="text-lg font-bold">About the Service Provider</h2>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-400 font-bold">
                  {providerUser?.name?.substring(0, 2).toUpperCase() || 'SP'}
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-zinc-200">{providerUser?.name || 'Local Expert'}</h3>
                    {provider?.isApproved && (
                      <ShieldCheck size={16} className="text-emerald-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">⭐ {provider?.rating?.toFixed(1) || '0.0'} ({provider?.totalReviews || 0} reviews)</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {provider?.experience || 0} Years Exp</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/80">
                    {provider?.bio || 'No bio provided.'}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Pricing & Booking Card */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Card hoverEffect={false} className="p-6 flex flex-col gap-6 sticky top-24">
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-400 text-sm">Estimated Price</span>
                <span className="text-3xl font-extrabold text-indigo-400">₹{price}</span>
              </div>

              <div className="flex flex-col gap-3 text-sm text-zinc-300">
                <div className="flex items-center gap-2.5">
                  <Clock size={16} className="text-zinc-500" />
                  <span>Duration: ~{duration} minutes</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-zinc-500" />
                  <span>Serving: {provider?.serviceArea?.city || 'Local area'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Tag size={16} className="text-zinc-500" />
                  <span>Price Type: Fixed Price</span>
                </div>
              </div>

              <Link to={`/bookings/new?serviceId=${currentService._id}`}>
                <Button variant="primary" className="w-full">Book This Service</Button>
              </Link>
            </Card>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
