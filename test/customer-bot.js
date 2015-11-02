var request = require('request');
var uuid = require('uuid');
var io = require('socket.io-client');

var XPUSH_URL = "http://dev.session.stalk.io:8000"; //"http://www.notdol.com:8000";
var APP_NAME = "STALK"; //"zeroapp";
var WITH_USERS = ["3a8c654d-6241-48e9-8c40-da6d0e440a10"]; //["notdol"];
var MESSAGE_INTERVAL = 10000;

var BROWSER_TITLE = "모든 커뮤니티";

callRequest( XPUSH_URL+"/user/list/active","POST", {A:APP_NAME},function(err, response, body){
  console.log("this is real result");
  console.log(body);
});

var CONF = {
  APP_URL : XPUSH_URL,
  _app : APP_NAME,
  _channel : uuid.v4()
}



callRequest( CONF.APP_URL+'/node/'+encodeURIComponent(CONF._app)+'/'+CONF._channel+'?1=1',
  "GET", {}, function(err, response,body){
  console.log(body);
  init(body); 
});

    function init(data){
      console.log("==================== LSTALK callbackInit");
      console.log( data );

      if(data.status != 'ok') return;

      CONF._server = data.server;

      if(!data.result.server) return false;

      var query =
          'A='+CONF._app+'&'+
          'C='+CONF._channel+'&'+
          'S='+data.result.server.name+'&'+
          'U='+CONF._userId+'&'+
          'D=WEB&'+
          'MD=CHANNEL_ONLY';
      /*
      var _user = UTILS.getUserInfo();
      if(_user.name){
        CONF._user = _user;
      }else{
        CONF._user = {};
      }
      */
      CONF._socket = io.connect(data.result.server.url+'/channel?'+query, {
        'force new connection': true
      });
      CONF._socket.on('connect', function () {
          console.log( 'connected' );
                  CONF._socket.on('_event', function (data) {
        console.log( "======= _event" , data );
        if (data.event == 'CONNECTION') {
            CONF._socket.emit("send", {NM:"info",DT:{C:"channel", NM: BROWSER_TITLE}});       

        }
        });
          CONF._socket.emit("channel.join",{C:CONF._channel, U: WITH_USERS},function(){
            console.log("===== channel.join");
            console.log(arguments);
            startMessage();

          })

      });

      CONF._socket.on('message', function (data) {
        console.log("=================== this is receive message");
        console.log( data );
        if(data.UO.U != "client"){
          sendEmit("echo: "+ data.MG);

          if(data.MG == "wait"){
            waitMessage();
          }else if(data.MG == "start"){
            startMessage();
          }else if(data.MG == "info"){
            CONF._socket.emit("send", {NM:"info",DT:{C:"channel", NM: BROWSER_TITLE}});       
          }

        }
      });

    };


var intervals = -1; //{};
var i = 0;
function startMessage(){
  if(intervals > 0) return; 

  
  var id = setInterval(function(){
     sendEmit("this is test : "+ i++ )
  }, MESSAGE_INTERVAL);
  intervals = id;
  //intervals[id] = {};
  return id;
}

function waitMessage(id){
  clearInterval(intervals);
  intervals = -1;
  //clearInterval(id);
}

function sendEmit(msg){
      var param = {
        A:      CONF._app,
        C:  CONF._channel,
        NM:     'message',
        DT:     {
          UO : {NM: 'client', U: "client"},
          //user:   CONF._user,
          MG:  msg// ,
          //sender : 'client'
        }
      };

      CONF._socket.emit('send', param, function (data) {
      });
}


function callRequest(url,method, data, cb){
  console.log(data);
  request({
    url : url,
    method: method,
    headers: {
        'Content-Type': 'application/json'
    },
    json: true,
    body: data
  },cb);
}
