const router = require('express').Router();
const Project = require('../models/Project');
const protect = require('../middleware/auth');

// PUBLIC - anyone can view all projects
router.get('/', async (req, res) => {
  try { res.json(await Project.find().sort({ featured: -1, createdAt: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// PROTECTED - only owner can add/edit/delete
router.post('/', protect, async (req, res) => {
  try { res.status(201).json(await Project.create(req.body)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try { res.json(await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try { await Project.findByIdAndDelete(req.params.id); res.json({ ok: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
