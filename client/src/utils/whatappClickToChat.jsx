import React from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppOrder = ({ phoneNumber, customerName, serviceName, bookingId }) => {
  if (!phoneNumber) return null;

  const message = `Hello! 👋

I'm ${customerName}.

My booking has been accepted.

📌 Booking ID: ${bookingId}
🛠 Service: ${serviceName}

I'm contacting you regarding my booking.`;

  const whatsappURL = `https://wa.me/${phoneNumber.replace(
    /\D/g,
    ""
  )}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center
        w-14 h-14 rounded-full bg-[#25D366]
        text-white shadow-2xl"
      >
        <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-40"></span>

        <FaWhatsapp className="relative z-10 text-3xl" />
      </motion.a>
    </div>
  );
};

export default WhatsAppOrder;