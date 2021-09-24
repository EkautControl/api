const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'User name required'],
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

module.exports = mongoose.model('users', userSchema);
