import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  fetchServiceDetail,
  clearCurrentService,
} from "../../store/serviceSlice.js";
import Navbar from "../../components/layout/Navbar.jsx";
import Footer from "../../components/layout/Footer.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import { Clock, Tag, MapPin, ShieldCheck, Star, Briefcase } from "lucide-react";

const ServiceDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentService, loading, error } = useSelector(
  (state) => state.services
);
  const { user, isAuthenticated } = useSelector((state) => state.auth);


  useEffect(() => {
    dispatch(fetchServiceDetail(id));
    return () => {
      dispatch(clearCurrentService());
    };
  }, [dispatch, id]);

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <Spinner size="lg" />
    </div>
  );
}
if (error) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white">
      <h1 className="text-3xl font-bold">404</h1>

      <p className="mt-2 text-zinc-400">
        {error}
      </p>

      <Link to="/services">
        <Button className="mt-6">
          Back to Services
        </Button>
      </Link>
    </div>
  );
}
if (!currentService) {
  return null;
}

  const {
    title,
    description,
    price,
    duration,
    isEmergency,
    category,
    provider,
    serviceArea,
  } = currentService;
  const providerUser = provider?.user || {};

const canBook =
  isAuthenticated &&
  user?.address?.city &&
  serviceArea?.city &&
  (!serviceArea?.pincode ||
    !user?.address?.pincode ||
    user.address.pincode.trim() === serviceArea.pincode.trim());

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
        {/* Header Breadcrumb / Category Badges */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[0.625rem] sm:text-xs font-semibold tracking-wide text-indigo-400 uppercase">
              {category?.name || "Category"}
            </span>
            {isEmergency && (
              <span className="px-3 py-1 rounded-xl bg-red-500/10 border border-red-500/20 text-[0.625rem] sm:text-xs font-semibold tracking-wide text-red-400 uppercase animate-pulse">
                Emergency Service
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-50 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Details Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Service Description Card */}
            <Card
              hoverEffect={false}
              className="p-6 sm:p-8 flex flex-col gap-4 bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md rounded-2xl"
            >
              <h2 className="text-xl font-bold tracking-tight text-zinc-50">
                Service Description
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </Card>

            {/* Service Provider Card */}
            <Card
              hoverEffect={false}
              className="p-6 sm:p-8 flex flex-col gap-6 bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md rounded-2xl"
            >
              <h2 className="text-xl font-bold tracking-tight text-zinc-50">
                About the Service Provider
              </h2>

              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/10 shrink-0">
                  {providerUser?.name?.substring(0, 2).toUpperCase() || "SP"}
                </div>

                <div className="flex-1 flex flex-col gap-3 w-full">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-zinc-100">
                        {providerUser?.name || "Local Expert"}
                      </h3>
                      {provider?.isApproved && (
                        <ShieldCheck
                          size={18}
                          className="text-emerald-400 fill-emerald-400/10"
                        />
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-400">
                      <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                        <Star size={16} className="fill-amber-400" />
                        {provider?.rating?.toFixed(1) || "0.0"}
                        <span className="text-zinc-500 font-normal">
                          ({provider?.totalReviews || 0} reviews)
                        </span>
                      </span>
                      <span className="text-zinc-700">•</span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={16} className="text-zinc-500" />
                        {provider?.experience || 0} Years Experience
                      </span>
                    </div>
                  </div>

                  {provider?.bio && (
                    <p className="text-sm text-zinc-400 bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/60 leading-relaxed">
                      {provider.bio}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Pricing & Booking Sticky Sidebar */}
          <div className="lg:col-span-1">
            <Card
              hoverEffect={false}
              className="p-6 sm:p-8 flex flex-col gap-6 lg:sticky lg:top-28 bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl"
            >
              <div className="flex justify-between items-baseline border-b border-zinc-800 pb-5">
                <span className="text-zinc-400 text-sm font-medium">
                  Estimated Price
                </span>
                <span className="text-3xl font-extrabold tracking-tight text-indigo-400">
                  ₹{price}
                </span>
              </div>

              <div className="flex flex-col gap-4 py-2 text-sm text-zinc-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800/60 text-zinc-400">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-medium">
                      Duration
                    </p>
                    <p className="font-medium">~{duration} minutes</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800/60 text-zinc-400">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-medium">
                      Service Area
                    </p>
                    <p className="font-medium">
                      {serviceArea?.city || "Local area"}
                      {serviceArea?.pincode ? ` - ${serviceArea.pincode}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800/60 text-zinc-400">
                    <Tag size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-medium">
                      Pricing Type
                    </p>
                    <p className="font-medium">Fixed Rate</p>
                  </div>
                </div>
              </div>

              {!isAuthenticated ? (
  <Link to="/login" className="w-full pt-2">
    <Button
      variant="primary"
      className="w-full py-3 font-semibold text-base shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all duration-200"
    >
      Login to Book Service
    </Button>
  </Link>
) : canBook ? (
  <Link
    to={`/bookings/new?serviceId=${currentService._id}`}
    className="w-full pt-2"
  >
    <Button
      variant="primary"
      className="w-full py-3 font-semibold text-base shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all duration-200"
    >
      Book This Service
    </Button>
  </Link>
) : (
  <>
    <Button
      variant="primary"
      disabled
      className="w-full py-3 font-semibold text-base cursor-not-allowed opacity-50"
      title="You can only book services available in your city and pincode."
    >
      Service Not Available in Your Area
    </Button>

    <div className="w-full py-3 text-center text-sm text-gray-400">
      Your address doesn't match the provider's service area.
      <br />
      Please update your profile address to book this service.
    </div>

    <Link to="/profile" className="w-full">
      <Button
        variant="secondary"
        className="w-full py-3 font-semibold"
      >
        Update Address
      </Button>
    </Link>
  </>
)}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
