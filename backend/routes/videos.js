const router = require('express').Router();
const Video = require('../models/Video');
const protect = require('../middleware/auth');

router.get('/', async (req, res) => {
  try { res.json(await Video.find().sort('-createdAt')); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try { res.status(201).json(await Video.create(req.body)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try { res.json(await Video.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try { await Video.findByIdAndDelete(req.params.id); res.json({ ok: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id/view', async (req, res) => {
  await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
  res.json({ ok: true });
});

module.exports = router;
