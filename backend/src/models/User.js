const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['intern', 'hr', 'pmo', 'admin'], required: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  bio: { type: String, maxlength: 300 },
  college: { type: String },
  joiningDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  profileImage: { type: String },
  githubLink: { type: String },
  projectLink: { type: String },
  project: { type: String, default: 'Not Assigned' },
  bond: { type: Boolean, default: false },
  nda: { type: Boolean, default: false },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
