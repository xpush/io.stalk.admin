var nodemailer = require('nodemailer');
var config = require('./../config/environment');
var _ = require('lodash');

var smtpTransport = nodemailer.createTransport("SMTP", config.auth.email.smtc);

var sendVerifyMail = function (name, emailAddress, authId) {

  var mailContents = config.email.verify.options; // from, subject, text

  mailContents['to'] = emailAddress;
  mailContents['text'] = mailContents['text'] + '\n' +
    config.auth.email.verify.callbackUrl + name + "/" + emailAddress + "/" + authId;
  console.log(config.auth.email.smtc, mailContents);

  smtpTransport.sendMail(mailContents, function (error, response) {

    if (error) {
      console.log(error);
    } else {
      console.log("Message sent : " + response.message);
    }
    smtpTransport.close();

  });


};

module.exports = {
  sendVerifyMail: sendVerifyMail
}
