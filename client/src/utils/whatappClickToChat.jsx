import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppOrder = ({
  phoneNumber,
  customerName,
  serviceName,
  bookingId,
  status,
}) => {
  if (!phoneNumber) return null;

  // Remove spaces, +, -, ()
  let cleanedPhone = phoneNumber.replace(/\D/g, "");

  // Add India's country code if missing
  if (cleanedPhone.length === 10) {
    cleanedPhone = `91${cleanedPhone}`;
  }

  const statusMessages = {
    pending: `My booking request is currently *pending approval* ⏳.
I'm reaching out to know if there is any update regarding my booking.`,

    accepted: `My booking has been *accepted* ✅.
I'm contacting you regarding the next steps.`,

    in_progress: `My booking is currently *in progress* 🚀.
I wanted to get an update regarding the service.`,

    completed: `My booking has been *completed* 🎉.
Thank you for your service!`,

    cancelled: `My booking has been *cancelled* ❌.
I'm contacting you regarding the cancellation.`,
  };

  const message = `Hello! 👋

I'm *${customerName}*.

${statusMessages[status] || "I'm contacting you regarding my booking."}

📌 Booking ID: ${bookingId}
🛠️ Service: ${serviceName}

Thank you 😊`;

  const whatsappURL = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed bottom-6 right-6 z-50 group"
    >
      {/* Tooltip */}
      <div
        className="
          absolute right-16 top-1/2 -translate-y-1/2
          whitespace-nowrap rounded-lg
          bg-zinc-900 px-3 py-2 text-sm
          text-white shadow-lg
          opacity-0 group-hover:opacity-100
          transition-all duration-300
          pointer-events-none
        "
      >
        Chat with Provider
      </div>

      <motion.a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.08, rotate: 5 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Contact provider on WhatsApp"
        className="
          relative flex h-16 w-16 items-center justify-center
          rounded-full bg-[#25D366]
          text-white shadow-2xl
          overflow-hidden
        "
      >
        {/* Ripple */}
        <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30"></span>

        {/* Glow */}
        <span className="absolute inset-0 rounded-full bg-green-500 blur-xl opacity-30"></span>

        <FaWhatsapp className="relative z-10 text-4xl" />
      </motion.a>
    </motion.div>
  );
};

export default WhatsAppOrder;