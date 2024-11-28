// models/booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true
    },
    guestName:
    {
        type: String,
        required: true
    },
    checkInDate:
    {
        type: Date,
        required: true
    },
    checkOutDate:
    {
        type: Date,
        required: true
    },
    totalPrice:
    {
        type: Number,
        required: true
    },
    status:
    {
        type: String,
        enum: ['Confirmed', 'Pending'],
        default: 'Pending'
    },
});

module.exports = mongoose.model('Booking', BookingSchema);
