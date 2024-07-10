const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const connectDB = require('./config/database.config');
const userRoutes = require('./api/auth/auth.routes');
const chatRoutes = require('./api/chat/chat.routes');
const auth = require('./middleware/auth.middleware');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/chat', chatRoutes);

// WebSocket connection
global.io = io;
io.on('connection', socket => {
  console.log('New WebSocket connection');

  socket.on('joinRoom', ({ userId }) => {
    socket.join(userId);
    io.emit('userOnline', userId);
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });
});
socket.on('disconnect', () => {
    // Optionally: Use a delay to handle cases where the user might reconnect quickly
    setTimeout(() => {
      io.emit('userOffline', socket.userId); // Notify all users that this user is offline
    }, 5000);
  });



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
