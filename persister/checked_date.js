var mongoose = require('mongoose');


/**
 * 체크인 정보를 담기 위한 Mongo DB model
 * @name checkInModel
 */
var DatesModel = function () {

    var datesSchema;
    datesSchema = mongoose.Schema({
        group:String,
        date: String
    });


  return mongoose.model('Dates', datesSchema);
};

module.exports = new DatesModel();