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
  startTimestamp: {type: Number},
  endTimestamp:{type: Number},
  uid: {type: String}
});

module.exports = mongoose.model('Channel', ChannelSchema);
