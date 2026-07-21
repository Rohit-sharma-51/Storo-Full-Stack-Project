const Partner = require("../models/Partner");
const Booking = require("../models/Booking");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//create new partner and user account
exports.createPartner = async (req, res) => {
  try {
    const {
      name, address, capacity, location, base, perKg, perHour, // Partner details
      userName, userEmail, userPassword // User details
    } = req.body;

    // Validate user details
    if (!userName || !userEmail || !userPassword) {
      return res.status(400).json({ error: "User details (Name, Email, Password) are required" });
    }

    // Check if user already exists
    const emailLower = userEmail.toLowerCase();
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Create Partner (isApproved defaults to false)
    const partner = await Partner.create({
      name,
      address,
      capacity,
      location,
      base,
      perKg,
      perHour
    });

    // Create User linked to Partner
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const user = await User.create({
      name: userName,
      email: emailLower,
      password: hashedPassword,
      role: 'partner',
      partnerId: partner._id
    });

    // Generate Token
    const token = jwt.sign(
      { id: user._id, role: user.role, partnerId: user.partnerId },
      process.env.JWT_SECRET,
      // { expiresIn: process.env.SECRET_EXPIRY }
      // { expiresIn: process.env.SECRET_EXPIRY || "1h" }
      { expiresIn: "1h" }  
    );

    res.json({
      message: "Partner request submitted successfully. Awaiting admin approval.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        partnerId: user.partnerId
      },
      partner
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//nearby partners - only show approved partners
// exports.findNearby = async (req, res) => {
//   try {
//     const { lng, lat, radius } = req.body;
//     const partners = await Partner.find({
//       isApproved: true, // Only show approved partners
//       location: {
//         $near: {
//           $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
//           $maxDistance: radius ? parseInt(radius) : 2000// 2km
//         }

//       }
  
 
//     res.json(partners)
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
exports.findNearby = async (req, res) => {
  try {
    const partners = await Partner.find({}); // ✅ SHOW ALL PARTNERS
    res.json(partners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get partner statistics (bookings count and earnings)
exports.getPartnerStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const partnerId = req.user.partnerId;

    if (!partnerId) {
      return res.status(400).json({ error: 'User is not associated with a partner' });
    }

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const filter = {
      partner: partnerId,
      status: { $in: ['booked', 'collected'] }
    };

    if (Object.keys(dateFilter).length > 0) {
      filter.createdAt = dateFilter;
    }

    // Get bookings
    const bookings = await Booking.find(filter);

    // Calculate stats
    const totalBookings = bookings.length;
    const totalEarnings = bookings.reduce((sum, booking) => sum + (booking.price || 0), 0);
    const paidBookings = bookings.filter(b => b.paymentStatus === 'paid').length;
    const pendingPayments = bookings.filter(b => b.paymentStatus === 'pending').length;

    res.json({
      totalBookings,
      totalEarnings,
      paidBookings,
      pendingPayments,
      averageBookingValue: totalBookings > 0 ? totalEarnings / totalBookings : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get partner bookings with filters
exports.getPartnerBookings = async (req, res) => {
  try {
    const { filter, startDate, endDate } = req.query;
    const partnerId = req.user.partnerId;

    if (!partnerId) {
      return res.status(400).json({ error: 'User is not associated with a partner' });
    }

    // Build query
    const query = {
      partner: partnerId,
      status: { $in: ['booked', 'collected'] }
    };

    // Apply date filter
    if (filter) {
      const now = new Date();
      let filterStartDate;

      switch (filter) {
        case 'day':
          filterStartDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          filterStartDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          filterStartDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case 'year':
          filterStartDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        case 'custom':
          if (startDate) filterStartDate = new Date(startDate);
          break;
      }

      if (filterStartDate) {
        query.createdAt = { $gte: filterStartDate };
      }

      if (filter === 'custom' && endDate) {
        query.createdAt = query.createdAt || {};
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Get bookings with user details
    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get partner profile
exports.getPartnerProfile = async (req, res) => {
  try {
    const partnerId = req.user.partnerId;

    if (!partnerId) {
      return res.status(400).json({ error: 'User is not associated with a partner' });
    }

    const partner = await Partner.findById(partnerId);

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.json(partner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};