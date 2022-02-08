// var socket = io();

let roomName;
let joinButton = document.querySelector('.join-button');
let inputPlayer;

document.getElementById('x').addEventListener('change', () => {
  if (document.getElementById('x').checked) {
    inputPlayer = 'x'
  }
})

document.getElementById('o').addEventListener('change', () => {
  if (document.getElementById('o').checked) {
    inputPlayer = 'o'
  }
})

joinButton.addEventListener('click', (e) => {
  // e.preventDefault();

  if (!inputPlayer) {
    // write some error code
    return
  }

  // roomName = document.getElementById('room-name').value.trim().toLowerCase();
  // console.log('join', inputPlayer, roomName)
  // socket.emit('join', { inputPlayer, roomName })
})


