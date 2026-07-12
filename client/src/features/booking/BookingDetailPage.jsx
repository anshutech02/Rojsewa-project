import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchBookingDetail,
  cancelBooking,
  clearCurrentBooking,
} from "../../store/bookingSlice.js";
import Navbar from "../../components/layout/Navbar.jsx";
import Footer from "../../components/layout/Footer.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import { Calendar, Clock, MapPin, ClipboardList, Star } from "lucide-react";
import { format } from "date-fns";
import api from "../../utils/api.js";
import toast from "react-hot-toast";
import WhatsAppOrder from "../../utils/whatappClickToChat.jsx";

const BookingDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBooking, loading } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Fetch booking — only re-run when the route ID changes
  useEffect(() => {
    dispatch(fetchBookingDetail(id));

    return () => {
      dispatch(clearCurrentBooking());
    };
  }, [dispatch, id]);

  // Check review status — only runs once the booking's provider is known
  useEffect(() => {
    if (!currentBooking?.provider?._id) return;
    api
      .get(`/reviews/provider/${currentBooking.provider._id}`)
      .then(({ data }) => {
        const reviewed = data.reviews.some((r) => r.booking === id);
        setHasReviewed(reviewed);
      })
      .catch(() => {});
  }, [id, currentBooking?.provider?._id]);

  const handleCancel = () => {
    const reason = prompt("Please enter cancellation reason:");
    if (!reason) return;

    dispatch(cancelBooking({ bookingId: id, cancellationReason: reason }))
      .unwrap()
      .then(() => toast.success("Booking cancelled successfully!"))
      .catch((err) => toast.error(err));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setSubmittingReview(true);

    api
      .post("/reviews", { bookingId: id, rating, comment })
      .then(() => {
        toast.success("Thank you for your feedback!");
        setHasReviewed(true);
      })
      .catch((err) =>
        toast.error(err.response?.data?.error || "Failed to submit review"),
      )
      .finally(() => setSubmittingReview(false));
  };

  if (loading || !currentBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const {
    status,
    scheduledDate,
    scheduledTime,
    address,
    totalAmount,
    notes,
    cancellationReason,
    statusHistory,
    service,
    provider,
  } = currentBooking;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Booking Details
            </h2>
            <p className="text-zinc-500 text-sm">ID: {currentBooking._id}</p>
          </div>
          <Badge status={status}>{status?.toUpperCase() || "PENDING"}</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card hoverEffect={false} className="p-6 flex flex-col gap-4">
              <h3 className="font-bold text-lg border-b border-zinc-800 pb-2 flex items-center gap-2">
                <ClipboardList size={18} className="text-indigo-400" />
                Service Requested
              </h3>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-zinc-200">
                  {service?.title}
                </span>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {service?.description}
                </p>
              </div>
            </Card>

            <Card hoverEffect={false} className="p-6 flex flex-col gap-4">
              <h3 className="font-bold text-lg border-b border-zinc-800 pb-2">
                Schedule & Location
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Calendar size={16} className="text-zinc-500" />
                  <span>
                    {scheduledDate
                      ? format(new Date(scheduledDate), "PPP")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <Clock size={16} className="text-zinc-500" />
                  <span>{scheduledTime}</span>
                </div>
                <div className="flex items-start gap-3 text-zinc-300 sm:col-span-2 mt-2">
                  <MapPin size={16} className="text-zinc-500 mt-0.5" />
                  <div>
                    <span className="font-medium">Address:</span>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {address?.street}, {address?.city} - {address?.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Status History / Timeline */}
            <Card hoverEffect={false} className="p-6 flex flex-col gap-4">
              <h3 className="font-bold text-lg border-b border-zinc-800 pb-2">
                Booking Status History
              </h3>
              <div className="flex flex-col gap-4 relative pl-4 border-l border-zinc-800">
                {statusHistory?.map((hist, idx) => (
                  <div key={idx} className="relative flex flex-col gap-1">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-500 border border-zinc-950" />
                    <span className="text-xs font-bold text-zinc-300 capitalize">
                      {hist.status.replace("_", " ")}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {format(new Date(hist.timestamp), "PPp")}
                    </span>
                    {hist.note && (
                      <p className="text-xs text-zinc-400 bg-zinc-900/50 p-2.5 rounded border border-zinc-800/80 mt-1">
                        {hist.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Leave Review Form */}
            {status === "completed" &&
              !hasReviewed &&
              user?.role === "customer" && (
                <Card
                  hoverEffect={false}
                  className="p-6 border border-indigo-500/20 bg-indigo-500/5 flex flex-col gap-4"
                >
                  <h3 className="font-bold text-lg text-indigo-400">
                    Share Your Feedback
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Rate your experience with{" "}
                    {provider?.user?.name || "Local Expert"}
                  </p>
                  <form
                    onSubmit={handleReviewSubmit}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        Rating
                      </span>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="cursor-pointer transition-colors"
                          >
                            <Star
                              size={24}
                              className={
                                star <= rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-zinc-600"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        Comments
                      </label>
                      <textarea
                        placeholder="Write your review comments here..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[80px]"
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={submittingReview}
                    >
                      Submit Review
                    </Button>
                  </form>
                </Card>
              )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Card hoverEffect={false} className="p-6 flex flex-col gap-4">
              <h3 className="font-bold border-b border-zinc-800 pb-2">
                Financials
              </h3>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">Service Fee</span>
                <span className="font-semibold text-zinc-300">
                  ₹{totalAmount}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-zinc-800/80 pt-3">
                <span className="text-zinc-400 font-bold">Total Paid</span>
                <span className="text-lg font-bold text-indigo-400">
                  ₹{totalAmount}
                </span>
              </div>

              {/* Action Buttons */}
              {["pending", "accepted"].includes(status) && (
                <Button
                  variant="danger"
                  className="w-full mt-2"
                  onClick={handleCancel}
                >
                  Cancel Booking
                </Button>
              )}
            </Card>
          </div>
        </div>
      </main>
      {(status === "accepted" || status === "in_progress") &&
  provider?.user?.phone && (
    <WhatsAppOrder
      phoneNumber={provider.user.phone}
      customerName={user?.name}
      serviceName={service?.title}
      bookingId={currentBooking._id}
      status={status}
    />
)}
      <Footer />
    </div>
  );
};

export default BookingDetailPage;
