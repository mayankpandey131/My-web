const mongoose = require('mongoose');
module.exports = mongoose.model('Certificate', new mongoose.Schema({
  title:         { type: String, required: true },
  issuer:        { type: String, required: true },
  issueDate:     { type: Date, required: true },
  expiryDate:    { type: Date, default: null },
  credentialId:  { type: String, default: '' },
  credentialUrl: { type: String, default: '' },
  image:         { type: String, default: '' },
  skills:        [String],
}, { timestamps: true }));
