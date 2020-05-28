const mongoose = require('mongoose');

const { Schema } = mongoose;

const dataSchema = new Schema({
  beerId: {
    type: mongoose.Types.ObjectId,
    required: [true, 'Beer id required'],
  },
  creationDate: {
    type: Date,
    default: Date(),
    required: [true, 'Creation date required'],
  },
  data: {
    type: Object,
    required: [true, 'Data required'],
  },
});

module.exports = mongoose.model('data', dataSchema, 'data');
