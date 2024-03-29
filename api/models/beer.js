const mongoose = require('mongoose');

const { Schema } = mongoose;

const beerSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Beer name required'],
  },
  active: {
    type: Boolean,
    default: false,
    required: [true, 'Beer status required'],
  },
  averageTime: {
    type: Number,
    required: [true, 'Average production time required'],
  },
  brewery: {
    type: String,
    required: [true, 'Brewery name required'],
  },
  type: {
    type: Number,
    required: [true, 'Beer type required'],
  },
});

module.exports = mongoose.model('beers', beerSchema);
