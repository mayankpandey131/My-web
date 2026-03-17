const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, default: '' },
  issueDate: { type: Date, default: Date.now },
  expirationDate: { type: Date },
  credentialUrl: { type: String, default: '' },
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
