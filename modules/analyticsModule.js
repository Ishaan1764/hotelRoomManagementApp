const Booking = require("../models/booking");
const { Room, ROOM_STATUS } = require("../models/room");

async function getMonthlyAnalytics(req, res) {
  try {
    console.log("Incoming request for analytics with query:", req.query);

    const { month, year } = req.query;

    if (!month || !year) {
      console.log("Validation failed: Month and Year are required.");
      return res.status(400).send({ message: 'Month and Year are required' });
    }

    if (month < 1 || month > 12) {
      console.log("Validation failed: Invalid month value.");
      return res.status(400).send({ message: 'Invalid month value' });
    }

    const startOfMonth = new Date(year, month - 1, 1); 
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
    console.log("Start of month:", startOfMonth, "End of month:", endOfMonth);

    // Fetch all bookings in the selected month
    console.log("Fetching bookings for the selected month...");
    const bookings = await Booking.find({
        $or: [
            { checkInDate: { $gte: startOfMonth, $lte: endOfMonth } },
            { checkOutDate: { $gte: startOfMonth, $lte: endOfMonth } },
            { checkInDate: { $lte: startOfMonth }, checkOutDate: { $gte: endOfMonth } },
          ],
    });
    console.log("Bookings fetched:", bookings);

    const monthlyRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    console.log("Monthly revenue calculated:", monthlyRevenue);

    // Calculate Room Occupancy Rate
    console.log("Fetching total rooms...");
    const totalRooms = await Room.find();
    console.log("Total rooms fetched:", totalRooms.length);

    console.log("Fetching booked rooms...");
    const bookedRooms = await Room.find({
      status: ROOM_STATUS.BOOKED,
    });

    const bookedRoomNumbers = bookedRooms.map((room) => room.roomNumber);
    const relevantBookings = await Booking.find({
        roomNumber: { $in: bookedRoomNumbers },
        checkInDate: { $lte: endOfMonth },
        checkOutDate: { $gte: startOfMonth },
      });

      const roomNumbersFromBookings = relevantBookings.map((booking) => booking.roomNumber);

      const BookedRoom = await Room.find({
        roomNumber: { $in: roomNumbersFromBookings}
      })

      console.log(BookedRoom.length);

    const occupancyRate = (BookedRoom.length / totalRooms.length) * 100;
    console.log("Occupancy rate calculated:", occupancyRate);

    // Send the response with both the revenue and occupancy rate
    console.log("Sending response...");
    res.status(200).json({
      monthlyRevenue,
      occupancyRate,
    });
  } catch (error) {
    console.error("Error retrieving analytics:", error);
    res.status(500).json({ message: 'Error retrieving analytics data', error: error.message });
  }
}

module.exports = { getMonthlyAnalytics };
