const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const {addRoom, getRooms,updateRoom, deleteRoom}=require("./modules/roomModule");
const { createBooking } = require('./modules/bookingRoute');

const port=3001;
const app=express();
app.use(cors());
app.use(express.json());

//mongoDb Connection
const DataBase = 'mongodb://0.0.0.0:27017/hotelRoomDb';

mongoose.connect(DataBase);
const db = mongoose.connection;
db.on('error', (err) => { console.log(err); });
db.once('open',()=>{

    //^Creating Rooms
    app.post('/rooms', addRoom);

    //^get Rooms
    app.get('/rooms',getRooms);

    //^Update Rooms
    app.put('/rooms/:roomNumber?', updateRoom);

    //^Delete Rooms
    app.delete('/rooms/:roomNumber?',deleteRoom);

    //^Creating a booking
    app.post('/bookings',createBooking);
});

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`);
});
