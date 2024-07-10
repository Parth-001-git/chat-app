const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const connectDB = require('./database.config'); // Assuming database configuration
const redisClient = require('./redis.config'); // Assuming Redis configuration
const authRoutes = require('./routes/auth.route'); // Example route file
const notificationRoutes = require('./routes/notification.route'); // Example route file

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('combined')); // Example logging middleware

// Connect to database
connectDB();

// Redis connection (if applicable)
// redisClient; // Uncomment if redisClient needs to be used globally

// Routes
app.use('/api/auth', authRoutes); // Example authentication routes
app.use('/api/notifications', notificationRoutes); // Example notification routes

// Handle production environment
if (process.env.NODE_ENV === 'production') {
  // Serve static files from React frontend app
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Route all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
  });
}

module.exports = app;
