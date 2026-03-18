const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generating JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found. Check if you've made an account." });
    }

    if (await user.matchPassword(password)) {
        const token = generateToken(user.id || user._id);
        
        // Set HTTP-Only Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.json({
            id: user.id || user._id,
            name: user.name,
            email: user.email,
            isAdmin: Boolean(user.isAdmin),
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// @desc    Register a new user
// @route   POST /api/auth/signup
router.post('/signup', async (req, res) => {
    const { name, email, password, securityQuestion, securityAnswer } = req.body;

    if (!name || !email || !password || !securityQuestion || !securityAnswer) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, securityQuestion, securityAnswer });

    if (user) {
        const token = generateToken(user.id || user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            id: user.id || user._id,
            name: user.name,
            email: user.email,
            isAdmin: Boolean(user.isAdmin),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
router.get('/profile', async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (user) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: Boolean(user.isAdmin),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user security question
// @route   POST /api/auth/forgot-password/question
router.post('/forgot-password/question', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        res.json({ question: user.securityQuestion });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @desc    Reset password
// @route   POST /api/auth/forgot-password/reset
router.post('/forgot-password/reset', async (req, res) => {
    const { email, securityAnswer, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchAnswer(securityAnswer))) {
        user.password = newPassword;
        await User.save(user);
        res.json({ message: 'Password reset successful' });
    } else {
        res.status(401).json({ message: 'Incorrect security answer or user not found' });
    }
});

// @desc    Get logged in user orders
// @route   GET /api/auth/my-orders
router.get('/my-orders', async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const db = require('../config/db'); // Better-sqlite3 instance
        
        const orders = db.prepare('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC').all(decoded.id);
        res.json(orders);
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
});

module.exports = router;
