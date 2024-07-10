// utils/logger.js

const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'app.log');

const logger = (message) => {
  const logMessage = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
};

module.exports = logger;
