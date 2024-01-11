const express = require('express');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../repositiory/user');
const bcrypt = require('bcrypt');

// Route for user login or register
authRouter.post('/login', async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Check if the user exists by email
        let user = await User.findOne({ email });

        if (!user) {
            // If user doesn't exist, create a new user with optional username
            user = new User({ email, password });
            if (username) {
                user.username = username; // Set username if provided
            }
            // Encrypt password before saving it to the database
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(String(password), salt); // Ensure password is a string
            user.password = hashedPassword;
            await user.save();
        } else {
            // User exists, compare passwords using bcrypt
            const passwordMatch = await bcrypt.compare(String(password), user.password); // Ensure password is a string
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        }

        const accessToken = jwt.sign({ email: user.email, id: user._id }, 'boobie');

        // res.cookie('accessUserToken', accessToken,);
        res.cookie("accessUserToken", accessToken, {
            path: '/',
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        // Send response with user details and accessToken
        res.json({ user: { email, username: user.username }, accessToken });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in/registering', error: err.message });
    }
});


module.exports = authRouter;
