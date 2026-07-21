const Ticket = require("../models/Ticket");
const User = require("../models/User");
const { sendSupportTicketConfirmation } = require("../utils/emailService");

exports.createTicket = async (req, res) => {
    try {
        const { subject, message } = req.body;

        if (!subject || !message) {
            return res.status(400).json({ error: "Subject and message are required" });
        }

        const ticket = await Ticket.create({
            userId: req.user.id,
            subject,
            message
        });

        // Send support ticket confirmation email
        try {
            const user = await User.findById(req.user.id);
            if (user && user.email) {
                await sendSupportTicketConfirmation(user.email, user.name, {
                    ticketId: ticket._id,
                    subject: ticket.subject,
                    message: ticket.message,
                    status: ticket.status
                });
            }
        } catch (emailError) {
            console.error('Email sending failed:', emailError.message);
            // Don't fail the ticket creation if email fails
        }

        res.status(201).json({
            message: "Support ticket created successfully",
            ticket
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
