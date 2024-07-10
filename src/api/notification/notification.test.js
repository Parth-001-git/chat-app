const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const Notification = require('../../models/notification.model');
const User = require('../../models/user.model');

describe('Notification Endpoints', () => {
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
  let testUserId;

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
    testUserId = user._id;
  });

  afterEach(async () => {
    // Clean up notifications and users after each test
    await Notification.deleteMany();
    await User.deleteMany();
  });

  it('should send a notification', async () => {
    const res = await request(app)
      .post('/api/notifications/send')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        userId: testUserId,
        message: 'Test notification'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.user).toEqual(testUserId.toString());
    expect(res.body.message).toEqual('Test notification');
  });

  it('should get notifications for a user', async () => {
    // Create some notifications for the user
    await Notification.create({
      user: testUserId,
      message: 'Notification 1'
    });
    await Notification.create({
      user: testUserId,
      message: 'Notification 2'
    });

    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2); // At least 2 notifications
    expect(res.body[0]).toHaveProperty('_id');
    expect(res.body[0].user._id).toEqual(testUserId.toString());
  });

  it('should mark notifications as read', async () => {
    // Create unread notifications for the user
    const notification1 = await Notification.create({
      user: testUserId,
      message: 'Unread notification 1',
      read: false
    });
    const notification2 = await Notification.create({
      user: testUserId,
      message: 'Unread notification 2',
      read: false
    });

    const res = await request(app)
      .post('/api/notifications/read')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toEqual(200);

    // Check if notifications are marked as read
    const updatedNotification1 = await Notification.findById(notification1._id);
    const updatedNotification2 = await Notification.findById(notification2._id);
    expect(updatedNotification1.read).toEqual(true);
    expect(updatedNotification2.read).toEqual(true);
  });
});
