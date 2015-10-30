var XPUSH = require("./xpush-node-client")({url: "http://www.notdol.com:8000", A: "withtalk"});

XPUSH.signup("notdol12312", "win1234", "WEB", function(){
	console.log("signup complete ***");
	console.log(arguments);
})