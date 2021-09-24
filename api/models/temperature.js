const mongoose = require('mongoose');

const { Schema } = mongoose;

const temperatureSchema = new Schema({
  productionId: {
    type: mongoose.Types.ObjectId,
    required: [true, 'Production id required'],
  },
  creationDate: {
    type: Date,
    default: new Date(),
    required: [true, 'Creation date required'],
  },
  value: {
    type: Number,
    required: [true, 'Data required'],
  },
});

module.exports = mongoose.model('temperature', temperatureSchema);
