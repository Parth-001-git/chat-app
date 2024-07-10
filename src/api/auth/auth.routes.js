const express = require('express');
const { check, validationResult } = require('express-validator');
const authController = require('./auth.controller');

const router = express.Router();

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
};

// Registration route
router.post(
  '/register',
  validate([
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ]),
  authController.register
);

// Login route
router.post(
  '/login',
  validate([
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ]),
  authController.login
);

module.exports = router;
