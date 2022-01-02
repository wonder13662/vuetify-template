const http = require('http').createServer();
const io = require('socket.io')(http);
require("dotenv").config();
const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});