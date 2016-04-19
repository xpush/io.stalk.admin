'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ChannelSchema = new Schema({
  channel: {type: String},
  name: String,
  origin: String,
  name: String,
  data:{},
  active: {type: Boolean, default: true},
  startTime: {type: Date},
  endTime:{type: Date},
  uid: {type: String}
});

module.exports = mongoose.model('Channel', ChannelSchema);
