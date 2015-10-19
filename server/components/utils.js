var uuid = require('node-uuid');
var crypto = require('crypto');

exports.createUniqueId = function(){
	return uuid.v4();
}

exports.encrypto = function(s, t) {
  if (!t) t = "sha256";
  var _c = crypto.createHash(t);
  _c.update(s, "utf8"); //utf8 here
  return _c.digest("base64");
};
