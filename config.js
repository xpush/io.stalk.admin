module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://127.0.0.1/STALK'
  },

  // Session Server url of XPUSH
  xpush: {
    url: "http://127.0.0.1:8000",
    A: "STALK"
  },

  seedDB: true
};
