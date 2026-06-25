import twilio from 'twilio';

/**
 * Formats a phone number to E.164 format with the whatsapp: prefix.
 * Defaults to country code +91 (India) if no country code is present.
 * @param {string} phone - The raw phone number
 * @returns {string|null} - Formatted WhatsApp string or null
 */
export const formatWhatsAppNumber = (phone) => {
  if (!phone) return null;
  
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  if (!cleaned.startsWith('+')) {
    // If it's a 10-digit number, prepend +91
    if (cleaned.length === 10) {
      cleaned = '+91' + cleaned;
    } else {
      cleaned = '+' + cleaned;
    }
  }
  
  return `whatsapp:${cleaned}`;
};

/**
 * Sends a WhatsApp message via Twilio or falls back to console logging if credentials are not configured.
 * @param {string} to - Recipient phone number
 * @param {string} message - Message body
 */
export const sendWhatsAppMessage = async (to, message) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g. whatsapp:+14155238886

  const formattedTo = formatWhatsAppNumber(to);
  if (!formattedTo) {
    console.error('WhatsApp Error: Invalid recipient phone number.');
    return;
  }

  // Check if Twilio keys are configured
  if (accountSid && authToken && fromWhatsAppNumber) {
    try {
      const client = twilio(accountSid, authToken);
      const payload = {
        body: message,
        from: fromWhatsAppNumber.startsWith('whatsapp:') ? fromWhatsAppNumber : `whatsapp:${fromWhatsAppNumber}`,
        to: formattedTo
      };
      
      const response = await client.messages.create(payload);
      console.log(`[WhatsApp] Message successfully sent via Twilio to ${formattedTo}. Message SID: ${response.sid}`);
      return response;
    } catch (error) {
      console.error(`[WhatsApp] Twilio failed to send message to ${formattedTo}:`, error.message);
      // Fallback to logging for visibility even if Twilio request fails
      logMockNotification(formattedTo, message);
    }
  } else {
    // Development fallback
    logMockNotification(formattedTo, message);
  }
};

/**
 * Helper to log mock notification cleanly to terminal for developer inspection.
 */
const logMockNotification = (to, message) => {
  const line = '═'.repeat(60);
  const border = '─'.repeat(60);
  console.log(`\n${line}`);
  console.log(`📱 [MOCK WHATSAPP NOTIFICATION]`);
  console.log(`TO:     ${to}`);
  console.log(`FROM:   whatsapp:Rozseva`);
  console.log(border);
  console.log(message);
  console.log(`${line}\n`);
};

/**
 * Sends booking status update WhatsApp notifications based on the event type.
 * @param {Object} booking - The Mongoose booking document, fully populated
 * @param {string} event - The booking event ('created' | 'new_request' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled')
 * @param {Object} [options] - Extra options (e.g. cancellationReason, cancelledBy)
 */
export const sendBookingWhatsAppNotification = async (booking, event, options = {}) => {
  try {
    const customer = booking.customer;
    const provider = booking.provider; // Expected to be populated Provider object (which has user populated)
    const serviceName = booking.service?.title || 'Requested Service';
    const amount = booking.totalAmount;
    
    // Format date/time nicely
    const dateStr = booking.scheduledDate 
      ? new Date(booking.scheduledDate).toLocaleDateString('en-IN', { dateStyle: 'medium' }) 
      : 'N/A';
    const timeStr = booking.scheduledTime || 'N/A';

    const customerName = customer?.name || 'Customer';
    const customerPhone = customer?.phone;
    
    const providerName = provider?.user?.name || 'Provider';
    const providerPhone = provider?.user?.phone;

    switch (event) {
      case 'created': {
        // Notification to Customer
        if (customerPhone) {
          const msg = `*Rozseva Booking Update* 🛠️\n\n` +
                      `Hello *${customerName}*,\n` +
                      `Your booking for *${serviceName}* has been received and is pending provider confirmation.\n\n` +
                      `📅 *Date:* ${dateStr}\n` +
                      `🕒 *Time:* ${timeStr}\n` +
                      `💰 *Amount:* ₹${amount}\n` +
                      `📌 *Status:* Pending\n\n` +
                      `Thank you for choosing Rozseva!`;
          await sendWhatsAppMessage(customerPhone, msg);
        }
        break;
      }
      
      case 'new_request': {
        // Notification to Provider
        if (providerPhone) {
          const msg = `*Rozseva New Booking Alert* 🔔\n\n` +
                      `Hello *${providerName}*,\n` +
                      `You have received a new booking request!\n\n` +
                      `🛠️ *Service:* ${serviceName}\n` +
                      `👤 *Customer:* ${customerName}\n` +
                      `📅 *Date:* ${dateStr}\n` +
                      `🕒 *Time:* ${timeStr}\n` +
                      `💰 *Payout:* ₹${amount}\n\n` +
                      `Please open the Rozseva app to accept or reject this request.`;
          await sendWhatsAppMessage(providerPhone, msg);
        }
        break;
      }

      case 'accepted': {
        // Notification to Customer
        if (customerPhone) {
          const msg = `*Rozseva Booking Confirmed* ✅\n\n` +
                      `Hello *${customerName}*,\n` +
                      `Your booking for *${serviceName}* has been *ACCEPTED*!\n\n` +
                      `🧑‍🔧 *Provider:* ${providerName} (${providerPhone || 'N/A'})\n` +
                      `📅 *Date:* ${dateStr}\n` +
                      `🕒 *Time:* ${timeStr}\n\n` +
                      `Your provider is scheduled to arrive at your address.`;
          await sendWhatsAppMessage(customerPhone, msg);
        }
        break;
      }

      case 'rejected': {
        // Notification to Customer
        if (customerPhone) {
          const msg = `*Rozseva Booking Status* ❌\n\n` +
                      `Hello *${customerName}*,\n` +
                      `Unfortunately, your booking request for *${serviceName}* was rejected by the provider. If any advance payment was made, it will be refunded shortly.`;
          await sendWhatsAppMessage(customerPhone, msg);
        }
        break;
      }

      case 'in_progress': {
        // Notification to Customer
        if (customerPhone) {
          const msg = `*Rozseva Service Started* 🚀\n\n` +
                      `Hello *${customerName}*,\n` +
                      `Your service for *${serviceName}* by *${providerName}* is now in progress.`;
          await sendWhatsAppMessage(customerPhone, msg);
        }
        break;
      }

      case 'completed': {
        // Notification to Customer
        if (customerPhone) {
          const msg = `*Rozseva Service Completed* 🎉\n\n` +
                      `Hello *${customerName}*,\n` +
                      `Your service *${serviceName}* has been marked as *COMPLETED* by *${providerName}*.\n\n` +
                      `💰 *Total Paid:* ₹${amount}\n\n` +
                      `Thank you for using Rozseva! We hope you had a great experience.`;
          await sendWhatsAppMessage(customerPhone, msg);
        }
        break;
      }

      case 'cancelled': {
        const reason = options.cancellationReason || 'No reason specified';
        const cancelledBy = options.cancelledBy || 'user';

        // Notify Customer
        if (customerPhone) {
          const msg = `*Rozseva Booking Cancelled* ⚠️\n\n` +
                      `Hello *${customerName}*,\n` +
                      `The booking for *${serviceName}* on ${dateStr} at ${timeStr} has been cancelled by ${cancelledBy}.\n\n` +
                      `💬 *Reason:* ${reason}`;
          await sendWhatsAppMessage(customerPhone, msg);
        }

        // Notify Provider
        if (providerPhone) {
          const msg = `*Rozseva Booking Cancelled* ⚠️\n\n` +
                      `Hello *${providerName}*,\n` +
                      `The booking for *${serviceName}* on ${dateStr} at ${timeStr} has been cancelled by ${cancelledBy}.\n\n` +
                      `💬 *Reason:* ${reason}`;
          await sendWhatsAppMessage(providerPhone, msg);
        }
        break;
      }

      default:
        console.warn(`[WhatsApp] Unhandled booking notification event type: ${event}`);
    }
  } catch (error) {
    console.error('[WhatsApp] Error building booking notification:', error);
  }
};
