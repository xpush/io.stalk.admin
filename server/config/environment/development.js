'use strict';

module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost:27017/stalk-dev'
  },

  // XPUSH server
  xpush: {
    url: "http://localhost:8000",
    A: "stalk"
  },

  auth: {
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
};
