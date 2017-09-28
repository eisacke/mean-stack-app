const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const { dbURI } = require('../config/environment');
const Event = require('../models/event');

const eventData = [];

mongoose.connect(dbURI, { useMongoClient: true })
  .then(db => db.dropDatabase())
  .then(() => Event.create(eventData))
  .then(events => console.log(`${events.length} events created`))
  .catch(err => console.log(err))
  .finally(() => mongoose.connection.close());

// Seeds here
