const { Room, ROOM_STATUS } = require("../models/room");

async function addRoom(req, res) {
    try {
        const roomData = req.body;
        const savedRoom = await Room.create(roomData);
        res.status(201).json(savedRoom);
        
    } catch (err) {
        if (err.code === 11000) {
            // Duplicate room number error (if room number already exists)
            res.status(400);
            res.send({ message: 'Room number must be unique.' });
        } else {
            res.status(500);
            res.send({ message: err.message });
        }
    }
}

async function getRooms(req, res) {
    try {
        const { status } = req.query;
        let filters = {};

        if (status) {
            if (status === ROOM_STATUS.AVAILABLE || status === ROOM_STATUS.BOOKED || status === ROOM_STATUS.UNDER_MAINTENANCE) {
                filters.status = status;
            }
        }

        const rooms = await Room.find(filters);
        res.status(200);
        res.send(rooms);
    } catch (err) {
        res.status(500);
        res.send({ message: err.message });
    }
}

async function updateRoom(req, res) {
    try {

        const roomNumber = req.params.roomNumber;
        const updateData = req.body;
        if (roomNumber) {
            const updatedRoom = await Room.updateOne(
                { roomNumber },
                { $set: updateData },
            );

            if (!updatedRoom) {
                return (
                    res.status(404),
                    res.send({ message: 'Room not found.' })
                );
            }

            return (
                res.status(200),
                res.send(updatedRoom)
            );
        }
    } catch (err) {
        res.status(500);
        res.send({ message: err.message });
    }
}

async function deleteRoom(req, res) {
    try {
        const roomNumber = req.params.roomNumber;

        if (roomNumber) {
            const deletedRoom = await Room.deleteOne({ roomNumber });

            if (!deletedRoom.deletedCount) {
                return (
                    res.status(404),
                    res.send({ message: 'Room not found.' })
                );
            }

            return (
                res.status(200),
                res.send({ message: `Room ${roomNumber} deleted successfully.` })
            );
        }
    } catch (err) {
        res.status(500);
        res.send({ message: err.message });
    }
}

module.exports = { addRoom, getRooms, updateRoom, deleteRoom };
