const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const Message = require('../../models/message.model');
const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');

describe('Message Endpoints', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  let authToken;
  let testChatId;

  beforeEach(async () => {
    // Create a new user and authenticate
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = response.body.token;

    // Create a chat room for testing
    const chat = await Chat.create({
      members: [user._id],
      name: 'Test Chat Room'
    });

    testChatId = chat._id;
  });

  afterEach(async () => {
    // Clean up messages and chat rooms after each test
    await Message.deleteMany();
    await Chat.deleteMany();
    await User.deleteMany();
  });

  it('should send a message', async () => {
    const res = await request(app)
      .post('/api/messages/send')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        chatId: testChatId,
        content: 'Hello, world!'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.sender).toBeDefined();
    expect(res.body.chatRoom).toEqual(testChatId.toString());
    expect(res.body.content).toEqual('Hello, world!');
  });

  it('should get chat history', async () => {
    // Create some messages for the chat room
    await Message.create({
      sender: 'some-sender-id',
      chatRoom: testChatId,
      content: 'Message 1'
    });
    await Message.create({
      sender: 'some-other-sender-id',
      chatRoom: testChatId,
      content: 'Message 2'
    });

    const res = await request(app)
      .get(`/api/messages/history/${testChatId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2); // At least 2 messages
    expect(res.body[0]).toHaveProperty('_id');
    expect(res.body[0].sender).toBeDefined();
    expect(res.body[0].chatRoom).toEqual(testChatId.toString());
  });

  it('should mark messages as read', async () => {
    // Create a message for the chat room
    const message = await Message.create({
      sender: 'some-sender-id',
      chatRoom: testChatId,
      content: 'Unread message'
    });

    const res = await request(app)
      .post('/api/messages/read')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ chatId: testChatId });

    expect(res.statusCode).toEqual(200);

    // Check if the message is marked as read
    const updatedMessage = await Message.findById(message._id);
    expect(updatedMessage.read).toEqual(true);
  });
});
