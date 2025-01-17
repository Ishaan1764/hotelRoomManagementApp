const Booking = require("../models/booking");
const { Room, ROOM_STATUS } = require("../models/room");

// Create a booking
async function createBooking(req, res) {
    try {
        const { roomNumber, guestName, checkInDate, checkOutDate, totalPrice } = req.body;

        // Check if all required fields are provided
        if (!roomNumber || !guestName || !checkInDate || !checkOutDate || !totalPrice) {
            return res.status(400).send({ message: 'Please fill in all the required fields.' });
        }
        // Create the booking in the database
        const newBooking = await Booking.create({
            roomNumber,
            guestName,
            checkInDate,
            checkOutDate,
            totalPrice,
        });

        const updateResult = await Room.updateOne(
            { roomNumber }, // Filter to find the room by its number
            { $set: { status: ROOM_STATUS.BOOKED }  } // Set status to "Booked"
        );

        // Check if the update was successful
        if (updateResult.modifiedCount === 0) {
            return (
                res.status(400),
                res.json({ message: 'Room status update failed.' })
            );
        }

        // Respond with the new booking details
        res.status(201);
        res.send({ message: 'Booking created successfully!', booking: newBooking });
    } catch (err) {
        console.error('Error creating booking:', err);
        res.status(500);
        res.send({ message: 'Error creating booking', error: err.message });
    }
}

// Get all bookings
const getBooking = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200);
    res.send(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500);
    res.send({ message: 'Error fetching bookings.' });
  }
};

module.exports = { createBooking, getBooking };
