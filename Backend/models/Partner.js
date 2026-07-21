const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema({
  name: String,
  address: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number] //[long,lat]
  },
  capacity: Number,
  base: Number,
  perKg: Number,
  perHour: Number,
  isApproved: { type: Boolean, default: false } // Admin approval required

}, { timestamps: true });

partnerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Partner', partnerSchema);