const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/auth');

const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Check if owner has registered yet — frontend uses this to decide which page to show
router.get('/status', async (req, res) => {
  const count = await User.countDocuments();
  res.json({ registered: count > 0 });
});

// REGISTER — only allowed once (first time setup)
router.post('/register', async (req, res) => {
  try {
    const existing = await User.countDocuments();
    if (existing > 0)
      return res.status(403).json({ error: 'Owner already registered. Please login instead.' });

    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const user = await User.create({ name, email, password });
    const safeUser = { _id: user._id, name: user.name, email: user.email };
    res.status(201).json({ token: makeToken(user._id), user: safeUser });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ error: 'Invalid email or password' });

    const safeUser = { _id: user._id, name: user.name, email: user.email, avatar: user.avatar };
    res.json({ token: makeToken(user._id), user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET CURRENT USER
router.get('/me', protect, (req, res) => res.json({ user: req.user }));

module.exports = router;
