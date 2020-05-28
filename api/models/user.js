const mongoose = require('mongoose');

const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'User name required'],
  },
  password: {
    type: String,
    required: [true, 'Password required'],
  },
  email: {
    type: String,
    required: [true, 'Email required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number required'],
  },
  notificationType: {
    type: String,
    required: [true, 'Notification type required'],
  },
});

userSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

module.exports = mongoose.model('users', userSchema);
