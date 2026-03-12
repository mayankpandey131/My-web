const router = require('express').Router();
const Certificate = require('../models/Certificate');
const protect = require('../middleware/auth');

router.get('/', async (req, res) => {
  try { res.json(await Certificate.find().sort('-issueDate')); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try { res.status(201).json(await Certificate.create(req.body)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try { res.json(await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try { await Certificate.findByIdAndDelete(req.params.id); res.json({ ok: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
