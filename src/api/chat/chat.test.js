const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../models/user.model');
const Chat = require('../../models/chat.model');
const Message = require('../../models/message.model');
const jwt = require('jsonwebtoken');

describe('Chat Endpoints', () => {
  let userToken;
  let chatId;
  
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a test user
    const user = new User({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    await user.save();

    // Generate JWT token for authentication
    userToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create a test chat room
    const chat = new Chat({ members: [user.id] });
    await chat.save();
    chatId = chat.id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Chat.deleteMany({});
    await Message.deleteMany({});
    await mongoose.connection.close();
  });

  it('should send a message', async () => {
    const res = await request(app)
      .post('/api/chat/send')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        chatId,
        content: 'Hello, this is a test message!',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('content', 'Hello, this is a test message!');
  });

  it('should get chat history', async () => {
    const res = await request(app)
      .get(`/api/chat/history/${chatId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('content', 'Hello, this is a test message!');
  });

  it('should notify when user is typing', async () => {
    const res = await request(app)
      .post('/api/chat/typing')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        chatId,
        isTyping: true,
      });

    expect(res.statusCode).toEqual(200);
  });

  it('should mark messages as read', async () => {
    const res = await request(app)
      .post('/api/chat/read')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        chatId,
      });

    expect(res.statusCode).toEqual(200);

    const messages = await Message.find({ chatRoom: chatId, read: true });
    expect(messages.length).toBeGreaterThan(0);
  });
});
