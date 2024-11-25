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

module.exports = { addRoom, getRooms };
