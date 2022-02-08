var socket = io();

const playerX = 'X';
const playerO = 'O';
let xTurn;
let squares = Array(9).fill(null);

const boxes = document.querySelectorAll('.box');
const board = document.querySelector('.board');
const playerName = document.querySelector('.player');
const resultModal = document.querySelector('.result-modal');
const waitingModal = document.querySelector('.waiting-modal');
const waitingMessage = document.querySelector('.waiting-message')

playerName.innerHTML = playerX;

for (let i = 0; i < boxes.length; i++) {
  boxes[i].addEventListener('click', clickBox, { once: true })
}

// from index.js
socket.on('box', function (id, currentPlayer) {
  boxes[id].classList.add('disabled');
  changeTurns();
  if (currentPlayer === playerO) {
    boxes[id].innerHTML = playerX;
    boxes[id].classList.add('playerX');
    squares[id] = playerX;
    playerName.innerHTML = playerO;
  } else {
    boxes[id].innerHTML = playerO;
    boxes[id].classList.add('playerO');
    squares[id] = playerO;
    playerName.innerHTML = playerX
  }
  checkWinner();
})

socket.on('waiting', function () {
  checkModal();
})

socket.on('resetGame', function () {
  location.reload();
})

socket.on('removeModal', function (roomSize) {
  waitingModal.classList.remove('waiting-modal')
  waitingMessage.innerHTML = ""
  console.log('remove')
})

socket.on('leave', () => {
  location.href = ('/')
})

const { player, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
console.log(player, room)

socket.emit('join', { player, room }, (error) => {
  if (error) {
    alert(error)
    location.href = ('/')
  }
})

function checkModal() {
  resultModal.classList.contains('is-over') ? resultModal.classList.remove('is-over') : resultModal.classList.add('is-over');
  board.classList.contains('disabled') ? board.classList.remove('disabled') : board.classList.add('disabled');
}

function clickBox(e) {
  let id = e.target.id;

  if (boxes[id].classList.contains('disabled')) {
    return
  }

  let currentClass = xTurn ? playerX : playerO;

  if (squares.every(square => square === null)) {
    resultModal.classList.add('is-over');
    board.classList.add('disabled');
  } else {
    socket.emit('waiting', currentClass)
  }
  socket.emit('box', id, currentClass);
}


function winningCondition() {
  const winningConditions = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
  ];
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null
}

function changeTurns() {
  xTurn = !xTurn;
}

function checkWinner() {
  const winner = winningCondition()
  const draw = squares.filter(square => square !== null)
  const result = document.querySelector('.result');
  const resultWinner = document.querySelector('#winner');

  if (winner) {
    result.style.display = 'grid';
    resultWinner.innerHTML = `${winner} wins!`;
    resultModal.classList.add('is-over');
    board.classList.add('disabled');
  } else if (draw.length === 9) {
    result.style.display = 'grid';
    resultWinner.innerHTML = `It's a draw!`;
    resultModal.classList.add('is-over');
    board.classList.add('disabled');
  }
}

function resetGame() {
  socket.emit('resetGame');
  location.reload();
}