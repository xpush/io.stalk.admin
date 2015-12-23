'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ChannelSchema = new Schema({
  channel: {type: String, required: true},
  name: String,
  origin: String,
  active: {type: Boolean, default: true},
  startTime: {type: Date},
  endTime:{type: Date},
  data: {},
  uid: {type: String, required: true}
});

module.exports = mongoose.model('Channel', ChannelSchema);
