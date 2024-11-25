const mongoose = require('mongoose');

// Enum for Room Types
const ROOM_TYPES = {
    SINGLE: 'Single',
    DOUBLE: 'Double',
    SUITE: 'Suite',
};

// Enum for Room Status
const ROOM_STATUS = {
    AVAILABLE: 'Available',
    BOOKED: 'Booked',
    UNDER_MAINTENANCE: 'Under Maintenance',
};

// Room Schema
const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    roomType: {
        type: String,
        required: true,
        enum: Object.values(ROOM_TYPES),
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: ROOM_STATUS.AVAILABLE,
        enum: Object.values(ROOM_STATUS),
    },
});

// Export the Room model and enums
module.exports = {
    Room: mongoose.model('Room', roomSchema),
    ROOM_TYPES,
    ROOM_STATUS,
};
