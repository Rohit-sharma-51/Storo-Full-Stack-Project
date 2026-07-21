// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },//.populate(user) for user details
//   partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
//   weightKg: Number,
//   startAt: { type: Date, required: true },
//   endAt: { type: Date, required: true },
//   price: Number,
//   status: { type: String, enum: ['pending', 'booked', 'collected'], default: 'pending' },
//   paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' }
// }, { timestamps: true });

// module.exports = mongoose.model('Booking', bookingSchema);
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },

  weightKg: Number,

  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },

  price: Number,

  status: { 
    type: String, 
    enum: ['booked', 'collected'], 
    default: 'booked'
  },

  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid'], 
    default: 'paid'
  }

}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);