const mongoose = require('mongoose');
module.exports = mongoose.model('Video', new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  videoUrl:    { type: String, required: true },
  thumbnail:   { type: String, default: '' },
  duration:    { type: String, default: '' },
  tags:        [String],
  views:       { type: Number, default: 0 },
}, { timestamps: true }));
