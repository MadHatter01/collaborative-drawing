const express = require('express');
const http = require('http');

const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);



const cors = require('cors');
app.use(cors());

const io  = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:['GET', 'POST']
    }
} );

let drawingHistory = [];

io.on("connection", (socket)=>{
    console.log('connected')

    socket.emit('history', drawingHistory);


    socket.on('joinRoom', (room)=>{
        socket.join(room);
        console.log(`user joined ${room}`);
    })

    socket.on('draw', (data)=>{
        const {room, ...drawData} = data;
        socket.to(room).emit('draw', drawData)
        drawingHistory.push(data);
        // io.emit('draw', data);
      
    });

    socket.on('clearCanvas', ()=>{
        console.log('clearing')
        drawingHistory = [];
        io.emit('clearCanvas');
    });
});

server.listen(3001, ()=>{
    console.log('server running');
})