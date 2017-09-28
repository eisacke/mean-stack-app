const mongoose = require('mongoose');

const inviteeSchema = mongoose.Schema({
  name: String,
  email: String
});

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
});

const locationSchema = new mongoose.Schema({
  name: String,
  address: String,
  website: String,
  phone: String,
  time: String,
  lat: Number,
  lng: Number
});

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  locations: [ locationSchema ],
  invitees: [ inviteeSchema ],
  comments: [ commentSchema ]
});

module.exports = mongoose.model('Event', eventSchema);
