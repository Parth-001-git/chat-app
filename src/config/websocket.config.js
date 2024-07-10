const socketIo = require('socket.io');
const http = require('http'); // Assuming HTTP server is used
const connectDB = require('./database.config'); // Assuming database configuration

let io;

const initializeWebSocket = (server) => {
  io = socketIo(server);

  // Socket.io logic
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Example event handlers
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Additional event handlers can be defined here as needed
  });

  // Example of integrating with MongoDB (if needed)
  connectDB(); // Assuming connectDB initializes MongoDB connection

  return io;
};

module.exports = initializeWebSocket;
