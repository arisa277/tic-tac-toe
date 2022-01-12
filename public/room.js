var socket = io.connect();

let inputPlayer;
let roomName;
let joinButton = document.querySelector('.join-button');


joinButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (document.getElementById('x').checked) {
    inputPlayer = 'x'
  } else {
    inputPlayer = 'o'
  }
  roomName = document.getElementById('room-name').value;

  socket.emit('join', (inputPlayer, roomName))
})


