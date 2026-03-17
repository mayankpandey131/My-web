const mongoose = require('mongoose');
module.exports = mongoose.model('Certificate', new mongoose.Schema({
  image:       { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true }));
