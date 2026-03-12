const router = require('express').Router();
const User = require('../models/User');
const protect = require('../middleware/auth');

// PUBLIC - anyone can read the owner's profile
router.get('/', async (req, res) => {
  try {
    const user = await User.findOne().select('-password');
    if (!user) return res.status(404).json({ error: 'No profile found' });
    res.json({ user });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PROTECTED - only owner can update
router.put('/', protect, async (req, res) => {
  try {
    const allowed = ['name','bio','headline','location','website','github','linkedin','twitter','skills','avatar'];
    const update = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-password');
    res.json({ user });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
