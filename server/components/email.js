var nodemailer = require('nodemailer');
var config = require('./../config/environment');
var _ = require('lodash');
var xoauth2 = require('xoauth2') ;
var xoauth2gen;

//var smtpTransport = nodemailer.createTransport("SMTP", config.auth.email.smtc);

var transporter;
var mailConfig;

if( config.email && config.email.service && config.email.auth && config.email.auth.xoauth2){
  
  mailConfig = config.email;

  xoauth2gen = xoauth2.createXOAuth2Generator({
      user: config.email.auth.xoauth2.user,
      clientId: config.email.auth.xoauth2.clientId,
      clientSecret: config.email.auth.xoauth2.clientSecret,
      refreshToken: config.email.auth.xoauth2.refreshToken
  });

  var smtpConfig = {
    service: config.email.service,
    auth:{
      xoauth2: xoauth2gen
    }
  };

  xoauth2gen.getToken( function(err,token,accessToken){
    console.log('New token for %s: %s', accessToken);
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

function makeUnreadMessageBodyText(messages){
  var contents = "<p>";

  contents += "<h1>You have unread messages</h1>";
  contents += "<br />";
  contents += "<h4>"+ messages.length + " unread messages (showing 3 most recent) </h4>";
  contents += "<br />";
  contents += "<ul>"
 
  for( var inx = 0 ; inx < messages.length && inx < 3 ; inx ++ ){
    contents += "<li>";
    contents += messages[inx].message;
    contents += "</li>";
  }  

  contents += "</ul>";
  contents += "<a href='"+mailConfig.siteUrl+ "'>"+mailConfig.siteName+"</a>"
  contents += "<p>";

  return contents;
}

var sendUnreadMessageMail = function (emailAddress, messages) {
  console.log("*** send unread messages mail : " + emailAddress);
  console.log( mailConfig );

  var mailOptions = {
    from: mailConfig.senderName + '<'+mailConfig.senderEmail+'>', // sender address
    to: emailAddress, // list of receivers
    subject: 'Unread messages in '+mailConfig.siteName,
    text: '', // plaintext body
    html: makeUnreadMessageBodyText(messages)
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
