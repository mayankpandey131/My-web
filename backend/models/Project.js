const mongoose = require('mongoose');
module.exports = mongoose.model('Project', new mongoose.Schema({
  title:        { type: String, required: true },
  description:  { type: String, required: true },
  thumbnail:    { type: String, default: '' },
  technologies: [String],
  githubUrl:    { type: String, default: '' },
  liveUrl:      { type: String, default: '' },
  status:       { type: String, enum: ['Completed', 'In Progress', 'On Hold'], default: 'Completed' },
  featured:     { type: Boolean, default: false },
}, { timestamps: true }));
