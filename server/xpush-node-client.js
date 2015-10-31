var request = require("request");
var _ = require("lodash");

var REST_CON = {
  SIGNIN: "/auth",
  SIGNUP: "/user/register",
  USER_SEARCH: "/user/search",
  USER_UPDATE: "/user/update"
}

var XPUSH = function (opts) {
  this._opts = {
    A: "stalk",
    url: "http://www.notdol.com"
  }

  this._opts = _.merge(this._opts, opts);
}

XPUSH.prototype.signup = function (id, password, device, cb) {
  var self = this;
  this._callRest(REST_CON.SIGNUP, "POST",
    {A: self._opts.A, U: id, D: device, PW: password, DT: {}}, cb)
}

XPUSH.prototype.signin = function (id, password, device, cb) { // A,U,D,PW
  var self = this;
  this._callRest(REST_CON.SIGNIN, "POST",
    {A: self._opts.A, U: id, D: device, PW: password, DT: {}}, cb)
}

XPUSH.prototype.updateUserInfo = function (id, password, device, dt, cb) {
  var self = this;
  this._callRest(REST_CON.USER_UPDATE, "POST",
    {A: self._opts.A, U: id, D: device, PW: password, DT: dt}, cb)
}

XPUSH.prototype.searchUser = function (idLike, cb) {
  var self = this;
  this._callRest(REST_CON.USER_SEARCH, "POST",
    {A: self._opts.A, K: idLike}, cb)
}

XPUSH.prototype._callRest = function (url, method, data, cb) {
  var self = this;
  request({
    url: self._opts.url + url,
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    json: true,
    body: data
  }, cb);
}

module.exports = function (opts) {
  return new XPUSH(opts);
}
