const Booking=require("../models/booking");
const {Room,ROOM_STATUS}=require("../models/room");

async function createBooking(req,res){
    try{
        const { roomNumber, guestName, checkInDate, checkOutDate, totalPrice } = req.body;

        //^ making sure that room exists and is available.
        const isroom = await Room.findOne({roomNumber,status:'Available'});
        if(!isroom){
            return res.status(404).json({ message: 'Room not found or not available.' });
        } 

        //^creating Booking
        const booking= await Booking.create({
            roomNumber,
            guestName,
            checkInDate,
            checkOutDate,
            totalPrice,
        });

        const updatedRoom=await Room.updateOne({roomNumber},{status:ROOM_STATUS.BOOKED});

        if (!updatedRoom.modifiedCount) {
            return res.status(404).json({ message: 'Room not found or already booked.' });
        }
          // Respond with the created booking and the updated room status
        res.status(201).json({ booking, message: 'Booking created and room status updated to Booked.' });
    }catch(err){
        console.log('Error creating booking or updating room status:', err);
        res.status(500).json({ message: 'Error creating booking or updating room status.' });
    }
}
module.exports={createBooking};