'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AnalyticSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Analytic', AnalyticSchema);