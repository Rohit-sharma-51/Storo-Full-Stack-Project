const nodemailer = require('nodemailer');

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email service error:', error.message);
    console.log('⚠️  Please configure EMAIL_USER and EMAIL_PASSWORD in .env file');
  } else {
    console.log('✅ Email service is ready to send messages');
  }
});

// Send booking confirmation email
const sendBookingConfirmation = async (userEmail, userName, bookingDetails) => {
  try {
    const { bookingId, partnerName, partnerCity, startDate, endDate, weightKg, totalAmount, status, paymentStatus } = bookingDetails;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Storo <noreply@storo.com>',
      to: userEmail,
      subject: `Booking Confirmation - Storo #${bookingId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1e40af; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { font-weight: bold; color: #6b7280; }
            .detail-value { color: #1a202c; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            .button { background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🧳 Booking Confirmed!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for choosing Storo</p>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Great news! Your luggage storage booking has been confirmed. Here are your booking details:</p>
              
              <div class="booking-details">
                <h3 style="margin-top: 0; color: #1e40af;">Booking Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Booking ID:</span>
                  <span class="detail-value">#${bookingId}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value" style="color: #10b981; font-weight: bold;">${status.toUpperCase()}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Payment:</span>
                  <span class="detail-value" style="color: ${paymentStatus === 'paid' ? '#10b981' : '#f59e0b'}; font-weight: bold;">${paymentStatus === 'paid' ? 'PAID' : 'PAY LATER'}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Partner:</span>
                  <span class="detail-value">${partnerName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Location:</span>
                  <span class="detail-value">${partnerCity}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Storage Period:</span>
                  <span class="detail-value">${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Weight:</span>
                  <span class="detail-value">${weightKg} kg</span>
                </div>
                <div class="detail-row" style="border-bottom: none;">
                  <span class="detail-label">Total Amount:</span>
                  <span class="detail-value" style="font-size: 18px; font-weight: bold; color: #1e40af;">₹${totalAmount}</span>
                </div>
              </div>

              <p><strong>What's Next?</strong></p>
              <ul>
                <li>Visit the partner location during your storage period</li>
                <li>Present your Booking ID: <strong>#${bookingId}</strong></li>
                <li>Drop off or pick up your luggage as scheduled</li>
              </ul>

              <center>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">View My Bookings</a>
              </center>

              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                Need help? Contact us at <a href="mailto:support@storo.com" style="color: #1e40af;">support@storo.com</a>
              </p>
            </div>
            <div class="footer">
              <p>© 2025 Storo. All rights reserved.</p>
              <p>Secure Luggage Storage Solutions</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Booking confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending booking email:', error.message);
    return { success: false, error: error.message };
  }
};

// Send support ticket confirmation email
const sendSupportTicketConfirmation = async (userEmail, userName, ticketDetails) => {
  try {
    const { ticketId, subject, message, status } = ticketDetails;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Storo <noreply@storo.com>',
      to: userEmail,
      subject: `Support Ticket Received - #${ticketId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .ticket-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .detail-row { padding: 10px 0; }
            .detail-label { font-weight: bold; color: #6b7280; display: block; margin-bottom: 5px; }
            .detail-value { color: #1a202c; }
            .message-box { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">💬 Support Ticket Received</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">We're here to help!</p>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Thank you for contacting Storo Support. We've received your support request and our team will get back to you shortly.</p>
              
              <div class="ticket-details">
                <h3 style="margin-top: 0; color: #1e40af;">Ticket Information</h3>
                <div class="detail-row">
                  <span class="detail-label">Ticket ID:</span>
                  <span class="detail-value">#${ticketId}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value" style="color: #10b981; font-weight: bold;">${status.toUpperCase()}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Subject:</span>
                  <span class="detail-value">${subject}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Your Message:</span>
                  <div class="message-box">${message}</div>
                </div>
              </div>

              <p><strong>What Happens Next?</strong></p>
              <ul>
                <li>Our support team will review your request</li>
                <li>You'll receive a response within 24-48 hours</li>
                <li>Keep your Ticket ID handy for reference: <strong>#${ticketId}</strong></li>
              </ul>

              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                <strong>Need immediate assistance?</strong><br>
                Email: <a href="mailto:support@storo.com" style="color: #1e40af;">support@storo.com</a><br>
                Phone: +91 1800-XXX-XXXX
              </p>
            </div>
            <div class="footer">
              <p>© 2025 Storo. All rights reserved.</p>
              <p>Secure Luggage Storage Solutions</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Support ticket confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending support ticket email:', error.message);
    return { success: false, error: error.message };
  }
};

// Send password reset email
const sendPasswordResetEmail = async (userEmail, userName, resetUrl) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Storo <noreply@storo.com>',
      to: userEmail,
      subject: 'Password Reset Request - Storo',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { background: #1e40af; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🔐 Password Reset Request</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Storo Account Security</p>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>We received a request to reset your password for your Storo account. Click the button below to create a new password:</p>
              
              <center>
                <a href="${resetUrl}" class="button">Reset Password</a>
              </center>

              <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
              <p style="background: #f3f4f6; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 12px;">${resetUrl}</p>

              <div class="warning">
                <p style="margin: 0; font-weight: bold; color: #92400e;">⚠️ Important Security Information</p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #92400e;">
                  <li>This link will expire in <strong>1 hour</strong></li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Never share this link with anyone</li>
                </ul>
              </div>

              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
              </p>
            </div>
            <div class="footer">
              <p>© 2025 Storo. All rights reserved.</p>
              <p>Secure Luggage Storage Solutions</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmation,
  sendSupportTicketConfirmation,
  sendPasswordResetEmail
};
