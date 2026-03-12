const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  // Profile fields
  avatar:   { type: String, default: '' },
  bio:      { type: String, default: '' },
  headline: { type: String, default: '' },
  location: { type: String, default: '' },
  website:  { type: String, default: '' },
  github:   { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter:  { type: String, default: '' },
  skills:   [String],
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.matchPassword = function (pwd) {
  return bcrypt.compare(pwd, this.password);
};

module.exports = mongoose.model('User', UserSchema);
