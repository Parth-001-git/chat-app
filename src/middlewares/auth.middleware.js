const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded user information to the request object
        req.user = decoded.user;
        next();
    } catch (err) {
        // Handle invalid token
        console.error('Token error:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
