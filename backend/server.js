require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// ✅ CORS FIX (allow all for now)
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ✅ Root route (Render test)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Create uploads directory
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'))
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// ✅ MongoDB Atlas Connection (FIXED)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// =================== MODELS ===================

const verifiedColleges = ["IIT Bombay", "IIT Delhi", "NIT Trichy", "Mumbai University"];

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  collegeName: { type: String, required: true },
  isCollegeVerified: { type: Boolean, default: false },
  degree: { type: String, required: true },
  stream: { type: String, required: true },
  passingYear: { type: Number, required: true }
});

const User = mongoose.model('User', UserSchema);

// =================== AUTH ===================

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// =================== ROUTES ===================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, fullName, collegeName, degree, stream, passingYear } = req.body;

    if (!username || !email || !password || !fullName || !collegeName || !degree || !stream || !passingYear) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ error: 'User exists' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashed,
      fullName,
      collegeName,
      isCollegeVerified: verifiedColleges.includes(collegeName),
      degree,
      stream,
      passingYear
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername }
      ]
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =================== SERVER ===================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));