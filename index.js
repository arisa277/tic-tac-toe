var express = require('express');
const http = require('http');
var socket = require('socket.io');
const { addUser, getUser, removeUser } = require('./public/utils/users');

var app = express();
var server = http.createServer(app)

const port = process.env.PORT || 3000

app.use(express.static('public'));

// socket setup
var io = socket(server);
io.on('connection', function (socket) {
  console.log("made socket connection", socket.id);

  socket.on('join', ({ player, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, player, room })

    if (error) {
      return callback(error)
    }

    socket.join(room)

    const roomSize = io.sockets.adapter.rooms.get(room).size

    if (roomSize === 2) {
      io.to(room).emit('removeModal', roomSize)
    }

    if (user.player === 'o') {
      io.to(user.id).emit('waiting')
    }
  })

  socket.on('box', function (id, currentPlayer) {
    const user = getUser(socket.id)
    io.to(user.room).emit('box', id, currentPlayer);
  });

  socket.on('waiting', function (currentClass) {
    const user = getUser(socket.id)
    io.to(user.room).emit('waiting', currentClass);
  })

  socket.on('resetGame', function (currentClass) {
    const user = getUser(socket.id)
    io.to(user.room).emit('resetGame', currentClass);
  })

  socket.on('disconnect', async () => {
    const user = getUser(socket.id)
    io.to(user.room).emit('leave')
    await removeUser(socket.id)
  })

});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})