const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    // const token = req.headers.accessUserToken; // Get the token from the 'accessUserToken' cookie
    const authHeader = req.get('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, 'boobie', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Unauthorized: Invalid token' });
        }
        req.user = user; // Attach user information to the request object
        next();
    });
}

module.exports = authenticateToken;
