const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const {addRoom, getRooms}=require("./modules/roomModule")

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

    //^Creating rooms
    app.post('/api/v1/createRoom', addRoom);

    //^getRooms
    app.get('/api/v1/rooms',getRooms);
});

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`);
});
