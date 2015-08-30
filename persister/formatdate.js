var mongoose = require('mongoose'),
    SchemaTypes = mongoose.SchemaTypes || mongoose.Schema.Types,
    CastError = mongoose.SchemaType.CastError;

var moment = require('moment');


/**
 * FormatDate
 */
function FormatDate(path, options) {
    SchemaTypes.Date.call(this, path, options);

    this.validators.push([function(v) {
        return v instanceof Date;
    }, 'format']);
}
FormatDate.prototype = Object.create(SchemaTypes.Date.prototype);
FormatDate.prototype.cast = function(value) {
    if (value === null || value === '') {
        return null;
    }

    if (value instanceof Date) {
        return value;
    }

    if (value instanceof Number ||
        'number' == typeof value ||
        String(value) == Number(value)) {
        // support for timestamps
        return new Date(Number(value));
    }

    // format date string
    var format = this.options.format || 'YYYY-MM-DD';
    var mdate = moment(value.toString() || '', format);

    if (mdate.format(format) != value) {
        // @todo hmmm....
        //throw new CastError('formatdate', value);
        return value;
    }

    return mdate.toDate();
};

module.exports = mongoose.Schema.Types.FormatDate = FormatDate;