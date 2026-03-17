const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  technologies: { type: [String], default: [] },
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  status: { type: String, enum: ['Completed', 'In Progress', 'On Hold'], default: 'Completed' },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
