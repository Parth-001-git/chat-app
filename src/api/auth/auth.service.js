const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async ({ username, email, password }) => {
  // Check if the user already exists
  let user = await User.findOne({ email });
  if (user) {
    throw new Error('User already exists');
  }

  // Create a new user
  user = new User({ username, email, password });

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  // Save the user to the database
  await user.save();

  // Generate a JWT token
  const payload = { user: { id: user.id } };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });

  return token;
};

// Authenticate a user
const loginUser = async ({ email, password }) => {
  // Check if the user exists
  let user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid Credentials');
  }

  // Check if the password matches
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid Credentials');
  }

  // Generate a JWT token
  const payload = { user: { id: user.id } };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });

  return token;
};

module.exports = {
  registerUser,
  loginUser
};
