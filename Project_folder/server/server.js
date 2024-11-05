const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors'); 

const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'], 
    credentials: true 
}));

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
