import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import {
  fetchBookings,
  updateBookingStatus,
} from "../../store/bookingSlice.js";
import {
  fetchProviderServices,
  fetchCategories,
  createService,
  updateService,
  deleteService,
} from "../../store/serviceSlice.js";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import Modal from "../../components/ui/Modal.jsx";
import ServiceForm from "./ServiceForm.jsx";
import {
  LayoutDashboard,
  Check,
  X,
  Play,
  Briefcase,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Clock,
  Star,
  Award,
  Sparkles,
  DollarSign,
} from "lucide-react";
import api from "../../utils/api.js";
import toast from "react-hot-toast";

const ProviderDashboard = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const isServicesTab = location.pathname === "/provider/services";

  const { bookings, loading: bookingsLoading } = useSelector(
    (state) => state.bookings,
  );
  const {
    providerServices,
    categories,
    loading: servicesLoading,
  } = useSelector((state) => state.services);
  const { provider } = useSelector((state) => state.auth);
  

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Modal and service edit/create states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [selectedService, setSelectedService] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    // Load Stats and Bookings for the overview
    api
      .get("/provider/dashboard")
      .then(({ data }) => {
        setStats(data.stats);
      })
      .catch((err) => toast.error("Failed to load dashboard metrics"))
      .finally(() => setStatsLoading(false));

    dispatch(fetchBookings());
  }, [dispatch]);

  useEffect(() => {
    if (isServicesTab) {
      dispatch(fetchProviderServices());
      dispatch(fetchCategories());
    }
  }, [dispatch, isServicesTab]);

  const handleStatusUpdate = (bookingId, nextStatus) => {
    const confirmation = window.confirm(
      `Are you sure you want to update this booking status to: ${nextStatus.replace("_", " ")}?`,
    );
    if (!confirmation) return;

    dispatch(updateBookingStatus({ bookingId, status: nextStatus }))
      .unwrap()
      .then(() => {
        toast.success(`Booking ${nextStatus.replace("_", " ")} successfully!`);
        // Reload dashboard stats
        api.get("/provider/dashboard").then(({ data }) => setStats(data.stats));
      })
      .catch((err) => toast.error(err));
  };

  const handleToggleActive = (service) => {
    const nextStatus = !service.isActive;
    dispatch(
      updateService({
        serviceId: service._id,
        serviceData: { isActive: nextStatus },
      }),
    )
      .unwrap()
      .then(() => {
        toast.success(
          `Service ${nextStatus ? "activated" : "deactivated"} successfully!`,
        );
      })
      .catch((err) => toast.error(err || "Failed to update status"));
  };

  const handleDeleteService = (serviceId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this service? This action cannot be undone.",
    );
    if (!confirmation) return;

    dispatch(deleteService(serviceId))
      .unwrap()
      .then(() => {
        toast.success("Service deleted successfully!");
        // Reload stats to update service counts
        api.get("/provider/dashboard").then(({ data }) => setStats(data.stats));
      })
      .catch((err) => toast.error(err || "Failed to delete service"));
  };

  const handleOpenCreateModal = () => {
    setSelectedService(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service) => {
    setSelectedService(service);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    setFormLoading(true);
    if (modalMode === "create") {
      dispatch(createService(data))
        .unwrap()
        .then(() => {
          toast.success("Service created successfully!");
          setIsModalOpen(false);
          // Reload stats
          api
            .get("/provider/dashboard")
            .then(({ data }) => setStats(data.stats));
        })
        .catch((err) => toast.error(err || "Failed to create service"))
        .finally(() => setFormLoading(false));
    } else {
      dispatch(
        updateService({ serviceId: selectedService._id, serviceData: data }),
      )
        .unwrap()
        .then(() => {
          toast.success("Service updated successfully!");
          setIsModalOpen(false);
        })
        .catch((err) => toast.error(err || "Failed to update service"))
        .finally(() => setFormLoading(false));
    }
  };

  const providerLinks = [
    { label: "Overview", path: "/provider", icon: LayoutDashboard },
    { label: "My Services", path: "/provider/services", icon: Briefcase },
  ];

  const pageLoading =
    (isServicesTab && servicesLoading && providerServices.length === 0) ||
    (!isServicesTab && bookingsLoading && bookings.length === 0);

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Provider Control Panel"
      sidebarLinks={providerLinks}
    >
      {/* Email Verification Banner */}
      {provider.user && !provider.user.isVerified && (
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs md:text-sm font-medium py-2.5 px-4 text-center flex items-center justify-center gap-2 border-t border-amber-500/20">
          <span>⚠️ Your email is not verified. Please verify it to secure your account.</span>
          <Link
            to="/verify-email"
            className="underline hover:text-amber-100 transition-colors ml-1 font-bold"
          >
            Verify Now
          </Link>
        </div>
      )}
      {/* Top metrics bar */}
      {statsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="glass h-24 shimmer rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card
            hoverEffect={false}
            className="p-4 flex flex-col gap-1 relative overflow-hidden bg-gradient-to-br from-zinc-900/60 to-zinc-900/10"
          >
            <span className="text-zinc-500 text-[10px] uppercase font-semibold tracking-wider">
              Total Bookings
            </span>
            <span className="text-2xl font-black text-zinc-100">
              {stats?.totalBookings || 0}
            </span>
            <Clock
              className="absolute right-3 bottom-3 text-zinc-800"
              size={32}
            />
          </Card>
          <Card
            hoverEffect={false}
            className="p-4 flex flex-col gap-1 relative overflow-hidden bg-gradient-to-br from-zinc-900/60 to-zinc-900/10"
          >
            <span className="text-zinc-500 text-[10px] uppercase font-semibold tracking-wider">
              Active Bookings
            </span>
            <span className="text-2xl font-black text-indigo-400">
              {stats?.activeBookings || 0}
            </span>
            <Play
              className="absolute right-3 bottom-3 text-indigo-950/40"
              size={32}
            />
          </Card>
          <Card
            hoverEffect={false}
            className="p-4 flex flex-col gap-1 relative overflow-hidden bg-gradient-to-br from-zinc-900/60 to-zinc-900/10"
          >
            <span className="text-zinc-500 text-[10px] uppercase font-semibold tracking-wider">
              Earnings
            </span>
            <span className="text-2xl font-black text-emerald-400">
              ₹{stats?.totalEarnings || 0}
            </span>
            <DollarSign
              className="absolute right-3 bottom-3 text-emerald-950/40"
              size={32}
            />
          </Card>
          <Card
            hoverEffect={false}
            className="p-4 flex flex-col gap-1 relative overflow-hidden bg-gradient-to-br from-zinc-900/60 to-zinc-900/10"
          >
            <span className="text-zinc-500 text-[10px] uppercase font-semibold tracking-wider">
              Rating
            </span>
            <span className="text-2xl font-black text-yellow-400">
              ★ {stats?.rating?.toFixed(1) || "0.0"}
            </span>
            <Star
              className="absolute right-3 bottom-3 text-yellow-950/40"
              size={32}
            />
          </Card>
          <Card
            hoverEffect={false}
            className="p-4 flex flex-col gap-1 relative overflow-hidden bg-gradient-to-br from-zinc-900/60 to-zinc-900/10 col-span-2 md:col-span-1"
          >
            <span className="text-zinc-500 text-[10px] uppercase font-semibold tracking-wider">
              Total Services
            </span>
            <span className="text-2xl font-black text-purple-400">
              {stats?.totalServices || 0}
            </span>
            <Sparkles
              className="absolute right-3 bottom-3 text-purple-950/40"
              size={32}
            />
          </Card>
        </div>
      )}

      {/* Conditional Content rendering based on path */}
      {!isServicesTab ? (
        /* Overview Panel: Booking Requests Queue */
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold tracking-wide flex items-center gap-2">
            <span>Booking Request Queue</span>
            {bookings.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-xs font-semibold text-indigo-400">
                {bookings.length}
              </span>
            )}
          </h3>

          {bookings.length === 0 ? (
            <Card
              hoverEffect={false}
              className="p-8 text-center text-zinc-500 flex flex-col gap-2 items-center"
            >
              <span className="text-3xl">📭</span>
              <p className="font-semibold text-zinc-400">
                No booking requests received yet.
              </p>
              <p className="text-xs max-w-sm">
                New client request notifications will show up here as soon as
                they are submitted.
              </p>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {bookings.map((booking) => (
                <Card
                  key={booking._id}
                  className="p-5 flex flex-col gap-4 border-l-2 border-l-zinc-700/80 hover:border-l-indigo-500 transition-all duration-300"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-1">
                      <h4 className="font-bold text-zinc-200 text-sm">
                        {booking.service?.title}
                      </h4>
                      <span className="text-xs text-zinc-400">
                        Customer:{" "}
                        <span className="text-zinc-300 font-semibold">
                          {booking.customer?.name}
                        </span>{" "}
                        | {booking.customer?.phone}
                      </span>
                    </div>
                    <Badge status={booking.status}>{booking.status}</Badge>
                  </div>

                  <div className="text-xs text-zinc-400 bg-zinc-900/40 border border-zinc-800/80 p-3 rounded-lg flex flex-col gap-1.5">
                    <div>
                      <span className="font-semibold text-zinc-300">
                        Schedule:
                      </span>{" "}
                      {new Date(booking.scheduledDate).toLocaleDateString()} at{" "}
                      {booking.scheduledTime}
                    </div>
                    <div>
                      <span className="font-semibold text-zinc-300">
                        Address:
                      </span>{" "}
                      {booking.address?.street}, {booking.address?.city}
                    </div>
                    {booking.notes && (
                      <div>
                        <span className="font-semibold text-zinc-300">
                          Notes:
                        </span>{" "}
                        {booking.notes}
                      </div>
                    )}
                  </div>

                  {/* Operations buttons */}
                  {booking.status === "pending" && (
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-red-400 border-red-500/20 hover:bg-red-500/10"
                        onClick={() =>
                          handleStatusUpdate(booking._id, "rejected")
                        }
                      >
                        <X size={14} /> Reject
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="gap-1.5"
                        onClick={() =>
                          handleStatusUpdate(booking._id, "accepted")
                        }
                      >
                        <Check size={14} /> Accept Request
                      </Button>
                    </div>
                  )}

                  {booking.status === "accepted" && (
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="primary"
                        size="sm"
                        className="gap-1.5"
                        onClick={() =>
                          handleStatusUpdate(booking._id, "in_progress")
                        }
                      >
                        <Play size={14} /> Start Service
                      </Button>
                    </div>
                  )}

                  {booking.status === "in_progress" && (
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="primary"
                        size="sm"
                        className="gap-1.5 bg-emerald-600 hover:bg-emerald-500"
                        onClick={() =>
                          handleStatusUpdate(booking._id, "completed")
                        }
                      >
                        <Check size={14} /> Mark Completed
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* My Services Panel: CRUD list & Active/Inactive Toggles */
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold tracking-wide">
              My Service Listing
            </h3>
            <Button
              variant="primary"
              size="sm"
              className="gap-1.5 shadow-indigo-600/10"
              onClick={handleOpenCreateModal}
              disabled={!provider?.isApproved}
            >
              <Plus size={14} />
              Create Service
            </Button>
          </div>

          {providerServices.length === 0 ? (
            <Card
              hoverEffect={false}
              className="p-12 text-center text-zinc-500 flex flex-col gap-3 items-center bg-zinc-950/30"
            >
              <span className="text-4xl">🛠️</span>
              <p className="font-bold text-zinc-300">No Services Listed Yet</p>
              <p className="text-xs max-w-sm leading-relaxed">
                List the services you specialize in, set your hourly rates or
                fixed charges, and define service times to start getting
                bookings.
              </p>
              {!provider?.isApproved ? (
                <Card
                  hoverEffect={false}
                  className="mt-4 p-4 text-center border border-amber-500/20 bg-amber-500/5"
                >
                  <p className="text-amber-400 font-semibold">
                    ⏳ Your account is not yet approved by the admin. Please verify your email and wait for approval to create services.
                  </p>
                  <p className="text-sm text-zinc-400 mt-1">
                    Once your profile is reviewed and approved by the admin,
                    you'll be able to create and manage your services.
                  </p>
                </Card>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleOpenCreateModal}
                >
                  Add Your First Service
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {providerServices.map((service) => (
                <Card
                  key={service._id}
                  className={`p-5 flex flex-col justify-between gap-4 border transition-all duration-300 ${
                    service.isActive
                      ? "border-zinc-800/80 hover:border-indigo-500/40"
                      : "border-dashed border-zinc-800 opacity-65 hover:opacity-90"
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        {service.category?.name || "Category"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {service.isEmergency && (
                          <span className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[9px] font-bold uppercase tracking-widest text-red-400">
                            SOS
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                            service.isActive
                              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    <h4 className="font-bold text-zinc-100 hover:text-indigo-400 transition-colors text-base">
                      {service.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="flex gap-4 items-center text-xs text-zinc-500 border-t border-zinc-900 pt-3 mt-1">
                      <div>
                        Rate:{" "}
                        <span className="font-bold text-indigo-400">
                          ₹{service.price}
                        </span>
                        <span className="text-[10px] text-zinc-500 capitalize">
                          {" "}
                          ({service.priceType?.replace("_", " ")})
                        </span>
                      </div>
                      <div>
                        Duration:{" "}
                        <span className="font-semibold text-zinc-300">
                          {service.duration} mins
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex justify-between items-center border-t border-zinc-900 pt-3 mt-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`gap-1.5 px-2 py-1 ${service.isActive ? "text-zinc-400 hover:text-zinc-300" : "text-indigo-400 hover:text-indigo-300"}`}
                      onClick={() => handleToggleActive(service)}
                    >
                      {service.isActive ? (
                        <>
                          <EyeOff size={13} /> Deactivate
                        </>
                      ) : (
                        <>
                          <Eye size={13} /> Activate
                        </>
                      )}
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-zinc-400 hover:text-white"
                        onClick={() => handleOpenEditModal(service)}
                      >
                        <Edit3 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-red-400 hover:text-red-300"
                        onClick={() => handleDeleteService(service._id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Creation / Edit Form Dialog Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === "create" ? "Create New Service" : "Edit Service"}
      >
        <ServiceForm
          categories={categories}
          initialData={modalMode === "edit" ? selectedService : null}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={formLoading}
        />
      </Modal>
      
    </DashboardLayout>
  );
};

export default ProviderDashboard;
