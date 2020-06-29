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
  phase: { type: Number },
  reporter: { type: String },
  creationDate: {
    type: Date,
    default: Date,
  },
});

module.exports = dataSchema;
