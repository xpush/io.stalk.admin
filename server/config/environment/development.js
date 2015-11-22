'use strict';

module.exports = {


  // MongoDB connection options
  mongo: {
    uri: 'mongodb://127.0.0.1/STALK'
  },

  // Session Server url of XPUSH
  xpush: {
    url: "http://127.0.0.1:8000",
    A: "STALK"
  }

  /* TODO 제거 해야 하는지 확인 필요
  , auth: {
    email: {
      smtc: {
        host: "[SMTC Hostname]", // hostname
        secureConnection: true, // use SSL
        port: 465, // port for secure SMTP
        auth: {
          user: "[USER]",
          pass: "[PASSWORD]"
        }
      },

      verify: {
        options: {
          from: "contact@yourcampany.com",
          subject: "Verify Your Email on LINK Service",
          text: "To complete your sign up, please verify your email using the following link : \n"
        },
        callbackUrl: 'http://localhost:9000/signup/'
      }

    }
  },

  seedDB: true
  */

};
