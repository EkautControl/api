const mongoose = require('mongoose');

const { Schema } = mongoose;

const productionSchema = new Schema({
  tank: {
    type: Number,
    required: [true, 'Tank number required'],
  },
  beerId: {
    type: mongoose.Types.ObjectId,
    required: [true, 'Beer id required'],
  },
  startDate: {
    type: Date,
    default: Date,
    required: [true, 'Production start date required'],
  },
  endDate: { type: Date },
  batch: {
    type: Number,
    required: [true, 'Production batch required'],
  },
  phase: {
    type: Number,
    required: [true, 'Production phase required'],
  },
  hasProblem: {
    type: Boolean,
    default: false,
    required: [true, 'Production problem required'],
  },
  ferment: {
    type: String,
    required: [true, 'Ferment required'],
  },
  leaven: {
    type: String,
    required: [true, 'Leaven required'],
  },
  generation: {
    type: String,
    required: [true, 'Generation required'],
  },
});

module.exports = mongoose.model('productions', productionSchema);
