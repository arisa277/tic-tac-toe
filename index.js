var express = require('express');
const http = require('http');
var socket = require('socket.io');

var app = express();
var server = http.createServer(app)

const port = process.env.PORT || 3000

app.use(express.static('public'));

// socket setup
var io = socket(server);

io.on('connection', function (socket) {
  console.log("made socket connection", socket.id);

  socket.on('box', function (id, currentPlayer) {
    io.emit('box', id, currentPlayer);
  });

  socket.on('waiting', function (currentClass) {
    io.emit('waiting', currentClass);
  })

  socket.on('resetGame', function (currentClass) {
    io.emit('resetGame', currentClass);
  })
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})