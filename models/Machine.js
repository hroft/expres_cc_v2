const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const MachineSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  photo_url: {
    type: String,
    required: false
  },
  document_url: {
    type: String,
    required: false
  },
  details: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('machines', MachineSchema);
