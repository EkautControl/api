const mongoose = require('mongoose');

const { Schema } = mongoose;

const tankSchema = new Schema({
  tank: {
    type: Number,
    required: [true, 'Tank number required'],
  },
  active: {
    type: Boolean,
    default: false,
    required: [true, 'Tank status required'],
  },
  volume: {
    type: Number,
    required: [true, 'Volume number required'],
  },
  production: { type: mongoose.Types.ObjectId },
});

module.exports = mongoose.model('tanks', tankSchema);
