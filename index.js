var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(8000, function () {
  console.log('request is running')
});

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