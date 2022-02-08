const users = []

const addUser = ({ id, player, room }) => {
  room = room.trim().toLowerCase()

  if (!player || !room) {
    return {
      error: 'Username and room are required!'
    }
  }

  // Check for existing player
  const existingUser = users.find((user) => {
    return user.room === room && user.player === player
  })

  if (existingUser) {
    return {
      error: 'Choose another player!'
    }
  }

  // Store user
  const user = { id, player, room }
  users.push(user)
  return { user }
}

const getUser = (id) => {
  return users.find((user) => user.id === id)
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

module.exports = {
  addUser,
  getUser,
  removeUser
}