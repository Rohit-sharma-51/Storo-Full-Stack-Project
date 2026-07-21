const express = require("express");
const { createPartner, findNearby, getPartnerStats, getPartnerBookings, getPartnerProfile } = require("../controllers/partnerController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/', createPartner);
router.post('/nearby', findNearby);

// Partner dashboard routes (protected)
router.get('/stats', authMiddleware, getPartnerStats);
router.get('/bookings', authMiddleware, getPartnerBookings);
router.get('/profile', authMiddleware, getPartnerProfile);

module.exports = router;