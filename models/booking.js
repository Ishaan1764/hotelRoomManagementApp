const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
  },
  guestName: {
    type: String,
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Booking', BookingSchema);
