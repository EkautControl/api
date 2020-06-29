const mongoose = require('mongoose');
// const dataValue = require('./dataValue');

const { Schema } = mongoose;

const dataValueSchema = new Schema({
  type: { type: Number },
  value: { type: Number },
});

const dataSchema = new Schema({
  data: { type: [dataValueSchema] },
  analysis: { type: String },
  phase: { type: Number, required: [true, 'Phase required'] },
  reporter: {
    type: String,
    required: [true, 'Reporter name required'],
  },
  creationDate: {
    type: Date,
    default: Date,
    required: [true, 'Creation date required'],
  },
});

module.exports = dataSchema;
