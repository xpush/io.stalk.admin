var nodemailer = require('nodemailer');
var config = require('./../config/environment');
var _ = require('lodash');

//var smtpTransport = nodemailer.createTransport("SMTP", config.auth.email.smtc);

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'stalk.puppy@gmail.com',
        pass: '12qwASZX'
    }
});


function makeBodyText (name, email, authId){
  var contents = "<p>";
  contents += "다음의 url 을 클릭해서 비밀번호를 입력후에 시작하세요! <br />";
  contents += "<a href='http://localhost:9000/signup/"+name+"/"+email+"/"+authId+"'>"+name+"</a>"
  contents +="</p>";
  return contents;
}

var sendVerifyMail = function (name, emailAddress, authId) {
  console.log("*** send mail");
  console.log(name, emailAddress, authId);
  /*
  var mailContents = config.email.verify.options; // from, subject, text

  mailContents['to'] = emailAddress;
  mailContents['text'] = mailContents['text'] + '\n' +

  config.auth.email.verify.callbackUrl + name + "/" + emailAddress + "/" + authId;
  console.log(config.auth.email.smtc, mailContents);

  transporter.sendMail(mailContents, function (error, response) {

    if (error) {
      console.log(error);
    } else {
      console.log("Message sent : " + response.message);
    }
    transporter.close();

  });
  */

 var mailOptions = {
    from: 'Stalk Company<stalk.puppy@gmail.com>', // sender address
    to: emailAddress, // list of receivers
    subject: 'Stalk 에서 보내는 메일 입니다.', // Subject line
    text: 'Hello world', // plaintext body
    html: makeBodyText(name,emailAddress,authId)
};

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);

});


};

module.exports = {
  sendVerifyMail: sendVerifyMail
}
