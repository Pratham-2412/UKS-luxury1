const twilio = require("twilio");

/**
 * Sends an SMS message using Twilio
 * @param {Object} options - { to: string, message: string }
 */
const sendSMS = async ({ to, message }) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.warn("⚠️ Twilio credentials missing. SMS not sent.");
    return;
  }

  const client = twilio(accountSid, authToken);

  try {
    await client.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    });
    console.log(`✅ SMS sent successfully to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send SMS: ${error.message}`);
    // We don't throw the error to prevent the main admin update from failing
  }
};

module.exports = sendSMS;
