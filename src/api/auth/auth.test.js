const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../models/user.model');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.error('Failed to connect to MongoDB', err);
    }
  });

  afterAll(async () => {
    try {
      await mongoose.connection.close();
    } catch (err) {
      console.error('Failed to close MongoDB connection', err);
    }
  });

  afterEach(async () => {
    // Cleanup test data
    try {
      await User.deleteOne({ email: 'test@example.com' });
    } catch (err) {
      console.error('Failed to cleanup user data', err);
    }
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not register a user with an existing email', async () => {
    // Create a user first
    await User.create({
      username: 'existinguser',
      email: 'test@example.com',
      password: 'password123',
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'newuser',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('msg', 'User already exists');
  });
});
