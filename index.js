const express = require('express');
const socket = require('socket.io');

const app = express();
const PORT = 4000;

const server = app.listen(PORT, function() {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use(express.static('public'));

const io = socket(server);

io.on('connection', function(socket) {
    console.log('Usuario conectado:', socket.id);

    socket.on('chat', function(data) {
        io.sockets.emit('chat', data);
    });

    socket.on('typing', function(data) {
        socket.broadcast.emit('typing', data);
    });
});
