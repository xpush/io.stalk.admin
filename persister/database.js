var mongoose = require('mongoose');
var Grid = require('gridfs-stream');

// @ TODO remove for production level.
//mongoose.set('debug', true);

var db = function() {
  var initFlag = false;
  var gfs = null;
  return {
    //127.13.135.2
    config: function(addr, dbname, opts, callback) {
      if( !initFlag ){

        var connectUrl =  'mongodb://' + (addr ? addr : '127.0.0.1:27017') + '/' + (dbname ? dbname : 'link');

        console.log(connectUrl+" connecting...");
        mongoose.connect(connectUrl, (opts ? opts : {}));
        //mongoose.createConnection(connectUrl, (opts ? opts : {}));

        var db = mongoose.connection;
        Grid.mongo = mongoose.mongo;


        db.on('error', function(err) {
          // Connection Error
          console.log('Mongodb error encountered [' + err + ']');

          if (callback) {
            callback('ERR-MONGODB', 'mongodb - '+err.message);
          }
        });

        db.once('open', function() {
          initFlag = true;

          gfs = Grid(db.db);

          if (callback) callback(null);
        });
      } else {
        if (callback) callback(null);
      }
    },

    getGfs : function(){
      if(initFlag){
        return gfs;
      }else{

        var fnc = function(){
          if(initFlag){
            clearInterval(interval);
            return gfs;
          }
        }

        var interval = setInterval(fnc,1000);
      }
    }
  };
};

module.exports = db();