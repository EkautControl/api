const mongoose = require('mongoose');

const { Schema } = mongoose;

const activitySchema = new Schema({
  type: {
    type: String,
    required: [true, 'Activity type required'],
  },
  description: {
    type: String,
    required: [true, 'Activity description required'],
  },
  reporter: {
    type: String,
    required: [true, 'Reporter name required'],
  },
  creationDate: {
    type: Date,
    default: Date(),
    required: [true, 'Creation date required'],
  },
});

module.exports = mongoose.model('activities', activitySchema);
