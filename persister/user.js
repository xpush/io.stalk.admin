var mongoose = require('mongoose');

/**
 * User 정보를 담기 위한 Mongo DB model
 * @name userModel
 */
var userModel = function () {

  var userSchema = mongoose.Schema({
    group:String,
    username: String,
    password: String,
    email: String,
    admin: Boolean

  });
 

  return mongoose.model('User', userSchema);
};

module.exports = new userModel();