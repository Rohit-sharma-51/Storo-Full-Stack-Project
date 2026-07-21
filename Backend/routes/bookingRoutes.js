const express = require("express");
const { createBooking, updateBookingStatus, getUserBookings, deleteBooking } = require("../controllers/bookingController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get('/', authMiddleware, getUserBookings);
router.post('/', authMiddleware, createBooking);
router.put('/:bookingId', authMiddleware, updateBookingStatus);
router.delete('/:bookingId', authMiddleware, deleteBooking);

module.exports = router;