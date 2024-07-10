const request = require('supertest');
const app = require('../../app'); // Adjust the path as per your project structure
const mongoose = require('mongoose');
const User = require('../../models/User'); // Adjust the path as per your project structure
const Chat = require('../../models/Chat'); // Adjust the path as per your project structure
const Message = require('../../models/Message'); // Adjust the path as per your project structure

describe('Chat Endpoints', () => {
  let token;
  let chatId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a new user and save to database
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
    await user.save();

    // Log in the user to obtain a JWT token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    token = res.body.token;

    // Create a chat room and save its ID
    const chat = new Chat({
      members: [user._id],
      isGroupChat: false,
    });
    await chat.save();
    chatId = chat._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should send a message', async () => {
    const res = await request(app)
      .post('/api/chat/send')
      .set('x-auth-token', token)
      .send({ chatId, content: 'Hello, world!' });

    expect(res.statusCode).toEqual(201); // Assuming 201 for created message
    expect(res.body).toHaveProperty('content', 'Hello, world!');

    // Cleanup: Delete the message after the test
    await Message.deleteOne({ _id: res.body._id });
  });
});
