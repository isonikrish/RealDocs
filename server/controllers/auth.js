import User from '../models/user.js';
import { generateTokenandSetCookie } from '../utils/generateToken.js';

export async function signup(req, res) {
    try {
        const { username, password, email } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        const user = await User.create({ username, password, email });
        generateTokenandSetCookie(user._id, res);

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const isPasswordCorrect = password === user.password;
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        generateTokenandSetCookie(user._id, res);
        res.status(200).json({ message: 'Logged in successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie('user');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


