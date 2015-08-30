var mongoose = require('mongoose');

/**
 * User 정보를 담기 위한 Mongo DB model
 * @name userModel
 */
var lateModel = function () {

  var lateSchema = mongoose.Schema({
    group:String,
    email: String,
    date: String
  });
 

  return mongoose.model('LateComer', lateSchema);
};

module.exports = new lateModel();