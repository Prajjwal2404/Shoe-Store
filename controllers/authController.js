const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.verifyToken = (req, res) => {
    res.json({ message: "Token is valid", userId: req.user.userId })
}

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields: username, email, password' });
    }

    try {
        const [existing] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        const userId = result.insertId;
        console.log(`User ${userId} registered in MySQL.`);

        const token = jwt.sign({ userId: userId, username: username }, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({ message: 'User registered successfully', token: token });

    } catch (error) {
        console.error('Error registering user in MySQL:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing required fields: email, password' });
    }

    try {
        const [users] = await pool.query(
            'SELECT id, username, password_hash FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

        res.json({ message: 'Login successful', token: token });

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Failed to log in' });
    }
};

exports.requestPasswordReset = async (req, res) => {
    const { username, email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Missing required field: email' });
    }

    try {
        const [users] = await pool.query(
            'SELECT id FROM users WHERE username = ? AND email = ?',
            [username, email]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Username or Email not found' });
        }

        res.json({ message: 'Password reset link sent to your email' });

    } catch (error) {
        console.error('Error requesting password reset:', error);
        res.status(500).json({ error: 'Failed to request password reset' });
    }
};

