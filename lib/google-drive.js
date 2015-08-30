var googleapis = require('googleapis');
var drive = googleapis.drive('v2');
var default_config = require('config');
var fs = require('fs');

function GoogleDrive(folderId, name, title, overwrite) {
  this.folderId = folderId;
  this.config = default_config.get("drive");
  this.name = name;
  this.title = title||'list.json'
  this.overwrite = overwrite||false;
}

GoogleDrive.prototype.getFolderId = function () {
  return "FOLDER_ID : " + this.folderId;
};

GoogleDrive.prototype.write = function (path,mimetype,cb) {

  this.path = path;
  this.mimetype = mimetype;

  var self = this;

  var jwt = new googleapis.auth.JWT(
    this.config.service_email,
    this.config.service_key,
    null,
    this.config.scope
  );


  jwt.authorize(function (err, tokens) {
    if (!err) { //success
      jwt.credentials = tokens;
    } else { //error
      console.error(err)
    }
    drive.files.list({auth: jwt, q: '"' + self.folderId + '" in parents'}, function (err, resp) {

      if (!err) {

        drive.files.insert({

          resource: {
            title:  self.title,
            mimeType: self.mimetype,
            parents: [{id: self.folderId}]
          },
          media: {
            mimeType: self.mimetype,
            body: fs.createReadStream(path) // read streams are awesome!
          },

          //
          //resource: {
          //  title: self.title,
          //  mimeType: 'application/json',
          //  parents: [{id: self.folderId}]
          //},
          //media: {
          //  mimeType: 'application/json',
          //  body: self.contents
          //},
          auth: jwt
        }, function (err, response) {
          if (err) console.error('error:', err, 'inserted:', response);

          cb();
        });

      }

    });

  });


}


module.exports = GoogleDrive;
