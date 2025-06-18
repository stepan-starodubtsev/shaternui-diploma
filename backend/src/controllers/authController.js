const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {getUserByEmail} = require("../services/userService");
require('dotenv').config();

exports.login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(400).json({message: 'Invalid Credentials'});
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({message: 'Invalid Credentials'});
        }

        const payload = {user: user};

        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 36000}, (err, token) => {
            if (err) throw err;
            console.log(`Created token: ${token}`);
            res.json({token});
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getMe = async (req, res) => {
    try {
        if (!req.user || !req.user.user || !req.user.user.user_id) {
            return res.status(400).json({ message: 'User ID not found in token payload' });
        }
        const userId = req.user.user.user_id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error("GetMe error:", err.message);
        res.status(500).send('Server error');
    }
};
