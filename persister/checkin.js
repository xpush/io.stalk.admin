var mongoose = require('mongoose');


/**
 * 체크인 정보를 담기 위한 Mongo DB model
 * @name checkInModel
 */
var checkInModel = function () {

    var replySchema = mongoose.Schema({
        mongoid:String,
        comment:String,
        username: String,
        email: String,
        date: String
    }, { _id : true });

    var checkInSchema;
    checkInSchema = mongoose.Schema({
        group:String,
        email:String,
        point: Number,
        username: String,
        positive: String,
        negative: String,
        date: String,
        fileId: String,
        reply:[replySchema]
    });


  return mongoose.model('CheckIn', checkInSchema);
};

module.exports = new checkInModel();