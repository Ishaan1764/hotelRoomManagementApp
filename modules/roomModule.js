const { Room, ROOM_STATUS } = require("../models/room");

async function addRoom(req, res) {
  try {
    const roomData = req.body;

    // Ensure the room status is set to "Available" if not provided
    if (!roomData.status) {
      roomData.status = ROOM_STATUS.AVAILABLE;
    }

    // Create the new room
    const savedRoom = await Room.create(roomData);

    // Respond with the saved room
    res.status(201).json(savedRoom);
  } catch (err) {
    // Handle errors
    if (err.code === 11000) {
      // Duplicate room number error (if room number already exists)
      res.status(400).json({ message: 'Room number must be unique.' });
    } else {
      // General error handling
      res.status(500).json({ message: err.message });
    }
  }
}

async function getRooms(req,res){
  try{
    const {status}=req.query;
    let filters={};

    if(status){
      if(Object.values(ROOM_STATUS).includes(status)){
        filters.status=status;
      }
    }
    const rooms=await Room.find(filters);
    res.status(200).json(rooms);
  }catch(err){
    res.status(500).json({ message: err.message });
  }
}

async function updateRoom(req, res) {
  try {
    const roomNumber = req.params.roomNumber; // Optional parameter for single-room update
    const filter = req.body.filter || {}; // Filter for multiple-room update
    const updateData = req.body; // Fields to update
    const options = req.body.options || {}; // Options (optional)

    if (roomNumber) {
      // Single-room update using roomNumber
      const updatedRoom = await Room.updateOne(
        { roomNumber },
        { $set: updateData },
      );

      if (!updatedRoom) {
        return res.status(404).json({ message: 'Room not found.' });
      }

      return res.status(200).json(updatedRoom);
    }

    // Multi-room update using filter
    const updateResult = await Room.updateMany(
      filter,
      { $set: updateData },
      options // Additional options like { upsert: true }
    );

    return res.status(200).json({
      message: `${updateResult.modifiedCount} room(s) updated.`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteRoom(req, res) {
  try {
    const roomNumber = req.params.roomNumber; // Optional parameter for single-room delete
    const filter = req.body.filter || {}; // Filter for multiple-room delete

    if (roomNumber) {
      // Single-room delete using roomNumber
      const deletedRoom = await Room.deleteOne({ roomNumber });

      if (!deletedRoom.deletedCount) {
        return res.status(404).json({ message: 'Room not found.' });
      }

      return res.status(200).json({ message: `Room ${roomNumber} deleted successfully.` });
    }

    // Multi-room delete using filter
    const deleteResult = await Room.deleteMany(filter);

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: 'No rooms found matching the criteria.' });
    }

    return res.status(200).json({
      message: `${deleteResult.deletedCount} room(s) deleted successfully.`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { addRoom, getRooms,updateRoom,deleteRoom};
