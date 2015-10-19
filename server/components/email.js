var nodemailer = require('nodemailer');
var config = require('./../config/environment');
var _ = require('lodash');

var transport = nodemailer.createTransport("SMTP", {
    host: "smtp.naver.com", // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    auth: {
        user: "nixenic@naver.com",
        pass: "1q2w3e4r"
    }
});


var smtpTransport = nodemailer.createTransport("SMTP", {
    service: 'Gmail',
    auth: {
        user: "todos.platform@gmail.com",
        pass: 'qwerLKJH1'
    }
});

/*
mailer.extend(app, {
  from: 'todos.platform@gmail.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'todos.platform@gmail.com',
    pass: 'qwerLKJH1'
  }
});
*/
var mailOptions = {
    from: '백부석 <nixenic@naver.com>',
    to: 'nixenic@gmail.com',
    subject: 'Withtalk 에서 보내는 인증 메일',
    text: '평문 보내기 테스트 '
};

var withtalkContents = '다음의 링크를 클릭해서 계정을 활성화 해주세요. '
withtalkContents += 'http://localhost:9000/signup/';

var sendMail = function(name, emailAddress , contents){
    var mailContents = _.merge(mailOptions, {
        to: emailAddress,
        text: withtalkContents+name+"/"+emailAddress+"/" + contents
    });
    transport.sendMail(mailContents, function(error, response){

        if (error){
            console.log(error);
        } else {
            console.log("Message sent : " + response.message);
        }
        smtpTransport.close();
    });
}

module.exports = {
  sendMail : sendMail  
}
