'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ActivitySchema = new Schema({
},{strict: false});

module.exports = mongoose.model('Activity', ActivitySchema);