const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../models/user.model');
const Chat = require('../../models/chat.model');
const Message = require('../../models/message.model');
const jwt = require('jsonwebtoken');

describe('Gateway Endpoints', () => {
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

  it('should get user information', async () => {
    const res = await request(app)
      .get('/api/gateway/user')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'testuser');
  });

  it('should create or join a chat room', async () => {
    const otherUser = new User({ username: 'otheruser', email: 'other@example.com', password: 'password456' });
    await otherUser.save();

    const res = await request(app)
      .post('/api/gateway/chat')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        userId: userToken.id,
        otherUserId: otherUser.id,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('members');
    expect(res.body.members).toContain(userToken.id);
    expect(res.body.members).toContain(otherUser.id);
  });

  it('should get user chat rooms', async () => {
    const res = await request(app)
      .get('/api/gateway/chats')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get chat history', async () => {
    const res = await request(app)
      .get(`/api/gateway/chats/${chatId}/history`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should send a message to a chat room', async () => {
    const res = await request(app)
      .post(`/api/gateway/chats/${chatId}/message`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        chatId,
        content: 'Hello, this is a test message!',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('content', 'Hello, this is a test message!');
  });

  it('should notify typing status in a chat room', async () => {
    const res = await request(app)
      .post(`/api/gateway/chats/${chatId}/typing`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        chatId,
        isTyping: true,
      });

    expect(res.statusCode).toEqual(200);
  });

  it('should mark messages as read in a chat room', async () => {
    const res = await request(app)
      .post(`/api/gateway/chats/${chatId}/read`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        chatId,
      });

    expect(res.statusCode).toEqual(200);
  });
});
