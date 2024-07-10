const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/database.config');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./api/chat/chat.routes');
const messageRoutes = require('./routes/messageRoutes');
const { protect } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/errorHandler');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./api/auth/auth.routes');
const apiLimiter = require('./middleware/rateLimit.middleware');
const socketHandlers = require('./socketHandlers'); // Import socket handlers

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use('/api/', apiLimiter);
app.use(express.json());
app.use('/api/messages', require('./routes/message.route'));
app.use(errorHandler);
app.use('/api/chats', protect, chatRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


// Socket.io connection
io.on('connection', socket => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    socket.on('joinChat', ({ chatId }) => {
        socket.join(chatId);
    });

    socket.on('sendMessage', async ({ chatId, content }) => {
        const message = await Message.create({ sender: socket.user._id, content, chat: chatId });
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });
        io.to(chatId).emit('message', message);
    });

    socket.on('typing', ({ chatId }) => {
        socket.to(chatId).emit('typing', socket.user._id);
    });

    socket.on('stopTyping', ({ chatId }) => {
        socket.to(chatId).emit('stopTyping', socket.user._id);
    });
});

// src/server.js
// socketHandlers.js
module.exports = function(io) {
    io.on('connection', socket => {
        socket.on('joinChat', ({ chatId }) => {
            socket.join(chatId);
        });

        socket.on('sendMessage', async ({ chatId, content }) => {
            const message = await Message.create({ sender: socket.user._id, content, chat: chatId });
            await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });
            io.to(chatId).emit('message', message);
        });

        socket.on('typing', ({ chatId }) => {
            socket.to(chatId).emit('typing', socket.user._id);
        });

        socket.on('stopTyping', ({ chatId }) => {
            socket.to(chatId).emit('stopTyping', socket.user._id);
        });
    });
};


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
