var nodemailer = require('nodemailer');
var config = require('./../config/environment');
var _ = require('lodash');
var xoauth2 = require('xoauth2') ;
var xoauth2gen;

//var smtpTransport = nodemailer.createTransport("SMTP", config.auth.email.smtc);

var transporter;
var accessToken;

if( config.email && config.email.service && config.email.auth && config.email.auth.xoauth2){

  accessToken = config.email.auth.xoauth2.accessToken;

  xoauth2gen = xoauth2.createXOAuth2Generator({
      user: config.email.auth.xoauth2.user,
      clientId: config.email.auth.xoauth2.clientId,
      clientSecret: config.email.auth.xoauth2.clientSecret,
      refreshToken: config.email.auth.xoauth2.refreshToken,
      accessToken: accessToken 
  });

  var smtpConfig = {
    service: config.email.service,
    auth:{
      xoauth2: xoauth2gen
    }
  };

  xoauth2gen.on('token', function(token){
    console.log('New token for %s: %s', token.user, token.accessToken);
    accessToken = token.accessToken;
  });

  transporter = nodemailer.createTransport(smtpConfig);
}

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

  if( transporter ){
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);

    });
  }
};

function makeUnreadMessageBodyText(name, email, messageCnt){
  var contents = "<p>";

  contents += "다음의 url에 접속해서 새로운 메세지를 확인하세요!";
  contents += "<p>";
  contents += "<a href='http://admin.stalk.io:9000/login'>stalk.io</a>"
  contents += "<p>";
  return contents;
}

var sendUnreadMessageMail = function (name, emailAddress, messageCnt) {
  console.log("*** send unread messages mail");
  console.log(name, emailAddress);

  var preTitle = messageCnt+ "개의 ";

  var mailOptions = {
    from: 'stalk.io<xpush.io@gmail.com>', // sender address
    to: emailAddress, // list of receivers
    subject: preTitle+' 읽지 않은 메시지가 있습니다.',
    text: '', // plaintext body
    html: makeUnreadMessageBodyText(name,emailAddress,messageCnt)
  };

  if( transporter ){
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
  }
};

module.exports = {
  sendVerifyMail: sendVerifyMail,
  sendUnreadMessageMail : sendUnreadMessageMail,
}
