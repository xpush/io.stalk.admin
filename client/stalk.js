/*! stalk javascript library - v0.1.2 - 2014-05-19
* https://stalk.io
* Copyright (c) 2014 John Kim; Licensed MIT */
/*! stalk javascript library - v0.1.2 - 2014-04-12
* https://stalk.io
* Copyright (c) 2014 John Kim; Licensed MIT */

var LSTALK_CONFIGURATION = {
  APP: 'stalk',
  STALK_URL: 'http://macbook.notdol.com:8000', // http://link.stalk.io:8080
  APP_URL: 'http://macbook.notdol.com:8000',
  CSS_URL: 'http://macbook.notdol.com:9000/stalk.css',
  MESSAGE: {
    title: 'Leave us a Message',
    default_message: 'Questions? Come chat with us! We\'re here, send us a message!',
  }
};

var STALK_UTILS = {
  getUniqueKey : function () {
    var s = [], itoh = '0123456789ABCDEF';
    for (var i = 0; i < 36; i++) s[i] = Math.floor(Math.random()*0x10);
    s[14] = 4;
    s[19] = (s[19] & 0x3) | 0x8;

    for (var x = 0; x < 36; x++) s[x] = itoh[s[x]];
    s[8] = s[13] = s[18] = s[23] = '-';

    return s.join('');
  },
  getEscapeHtml : function(html) {
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  },
  getHashCode : function (s) {
    var hash = 0;
    if (s.length === 0) return hash;
    for (var i = 0; i < s.length; i++) {
      var char1 = s.charCodeAt(i);
      hash = ((hash<<5)-hash)+char1;
      hash = hash & hash;
    }
    return hash;
  },
  loadScript :  function(url, callback){
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState){  //IE
      script.onreadystatechange = function(){
        if (script.readyState == "loaded" ||
            script.readyState == "complete"){
          //script.onreadystatechange = null;
          callback();
        }
      };
    } else {  //Others
      script.onload = function(){
        callback();
      };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  },

  loadCss : function (url) {
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
    return link;
  },

  loadJson : function(url, callbackStr){
    var script = document.createElement("script");
    // Add script object attributes
    script.type     = "text/javascript";
    script.charset  = "utf-8";
    script.id       = this.getHashCode(url);

    if (script.readyState){  //IE
      script.onreadystatechange = function(){
        if (script.readyState == "loaded" ||
            script.readyState == "complete"){
          //script.onreadystatechange = null;
          // DO Something?
        }
      };
    } else {  //Others
      script.onload = function(){
        // DO Something?
      };
    }
    script.src = url + '&callback='+callbackStr+'&_noCacheIE=' + (new Date()).getTime();
    document.getElementsByTagName("head")[0].appendChild(script);
  },

  hasClass : function(el, val) {
    var pattern = new RegExp("(^|\\s)" + val + "(\\s|$)");
    return pattern.test(el.className);
  },
  addClass : function(ele, cls) {
    if (!this.hasClass(ele, cls)) ele.className += " " + cls;
  },
  removeClass : function(ele, cls) {
    if (this.hasClass(ele, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      ele.className = ele.className.replace(reg, ' ');
    }
  },

  setUserInfo : function(userInfo) {
    //var date = new Date();
    //date.setDate(date.getDate() + 10);
    document.cookie = 'STALK_USER=' + escape(JSON.stringify(userInfo)) + ';path=/';
    //';expires=' + date.toGMTString()+';path=/';
  },

  delUserInfo : function() {
    var date = new Date();
    var validity = -1;
    date.setDate(date.getDate() + validity);
    document.cookie = "STALK_USER=;expires=" + date.toGMTString()+';path=/';
  },

  getUserInfo : function() {
    var allcookies = document.cookie;
    var cookies = allcookies.split("; ");
    for ( var i = 0; i < cookies.length; i++) {
      var keyValues = cookies[i].split("=");
      if (keyValues[0] == "STALK_USER") {

        return JSON.parse(unescape(keyValues[1]));
      }
    }
    return {};
  },

  isIE : function(){
    return (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
  },

  deepCopy : function  deepObjCopy(dupeObj) {
    var retObj = new Object();
    if (typeof(dupeObj) == 'object') {
      if (typeof(dupeObj.length) != 'undefined')
        var retObj = new Array();
      for (var objInd in dupeObj) { 
        if (typeof(dupeObj[objInd]) == 'object') {
          retObj[objInd] = deepObjCopy(dupeObj[objInd]);
        } else if (typeof(dupeObj[objInd]) == 'string') {
          retObj[objInd] = dupeObj[objInd];
        } else if (typeof(dupeObj[objInd]) == 'number') {
          retObj[objInd] = dupeObj[objInd];
        } else if (typeof(dupeObj[objInd]) == 'boolean') {
          ((dupeObj[objInd] == true) ? retObj[objInd] = true : retObj[objInd] = false);
        }
      }
    }
    return retObj;
  },

  Browser : {
      getUserAgent : function(){
          return navigator.userAgent.toLowerCase();
      }
      , getBrowserName : function(){
          var BrowserKey = {ie: "msie", ie6: "msie 6", ie7 : "msie 7", ie8 : "msie 8", ie9 :"msie 9", ie10: "msie 10",chrome : "chrome", safari: "safari", safari3: "applewebkir/5", mac : "mac",  firefox: "firefox"
          }

          var ua = this.getUserAgent();
          var re = /\S*\/[\d.]*/g;
          var m;
           
          while ((m = re.exec(ua)) != null) {
              if (m.index === re.lastIndex) {
                  re.lastIndex++;
              }
              for(var k in BrowserKey) {
                  if(m[0].indexOf( BrowserKey[k] ) != -1) return k;
              }
          }
      }
      ,getOSName : function(){

              var uanaVigatorOs = navigator.userAgent;
              var AgentUserOs= uanaVigatorOs.replace(/ /g,'');
              var Ostxt="";
              var OSName="";
              var OsVers="";
              new function() {
              var OsNo = navigator.userAgent.toLowerCase(); 
              jQuery = {};
                  jQuery.os = {
                      Linux: /linux/.test(OsNo),
                      Unix: /x11/.test(OsNo),
                      Mac: /mac/.test(OsNo),
                      Windows: /win/.test(OsNo)
                  }
              }
              // Android의 단말 이름을 반환
              function getAndroidDevName() {
              var uaAdata = navigator.userAgent;
              var regex = /Android (.*);.*;\s*(.*)\sBuild/;
              var match = regex.exec(uaAdata);
              if(match) {
              var ver = match[1];
              var dev_name = match[2];
              return "Android " + ver + " " + dev_name;
              }
              return "Android OS";
              }
          if(jQuery.os.Windows) {
          if(AgentUserOs.indexOf("WindowsCE") != -1) OSName="Windows CE";
          else if(AgentUserOs.indexOf("Windows95") != -1) OSName="Windows 95";
          else if(AgentUserOs.indexOf("Windows98") != -1) {
          if (AgentUserOs.indexOf("Win9x4.90") != -1) OSName="Windows Millennium Edition (Windows Me)" 
          else OSName="Windows 98"; 
          }
          else if(AgentUserOs.indexOf("WindowsNT4.0") != -1) OSName="Microsoft Windows NT 4.0";
          else if(AgentUserOs.indexOf("WindowsNT5.0") != -1) OSName="Windows 2000";
          else if(AgentUserOs.indexOf("WindowsNT5.01") != -1) OSName="Windows 2000, Service Pack 1 (SP1)";
          else if(AgentUserOs.indexOf("WindowsNT5.1") != -1) OSName="Windows XP";
          else if(AgentUserOs.indexOf("WindowsNT5.2") != -1) OSName="Windows 2003";
          else if(AgentUserOs.indexOf("WindowsNT6.0") != -1) OSName="Windows Vista/Server 2008";
          else if(AgentUserOs.indexOf("WindowsNT6.1") != -1) OSName="Windows 7";
          else if(AgentUserOs.indexOf("WindowsNT6.2") != -1) OSName="Windows 8";
          else if(AgentUserOs.indexOf("WindowsNT6.3") != -1) OSName="Windows 8.1";
          else if(AgentUserOs.indexOf("WindowsPhone8.0") != -1) OSName="Windows Phone 8.0";
          else if(AgentUserOs.indexOf("WindowsPhoneOS7.5") != -1) OSName="Windows Phone OS 7.5";
          else if(AgentUserOs.indexOf("Xbox") != -1) OSName="Xbox 360";
          else if(AgentUserOs.indexOf("XboxOne") != -1) OSName="Xbox One";
          else if(AgentUserOs.indexOf("Win16") != -1) OSName="Windows 3.x";
          else if(AgentUserOs.indexOf("ARM") != -1) OSName="Windows RT";
          else OSName="Windows (Unknown)";
          
          if(AgentUserOs.indexOf("WOW64") != -1) OsVers=" 64-bit(s/w 32-bit)";
          else if(AgentUserOs.indexOf("Win64;x64;") != -1) OsVers=" 64-bit(s/w 64-bit)";
          else if(AgentUserOs.indexOf("Win16") != -1) OsVers=" 16-bit";
          else OsVers=" 32-bit";
          
          } else if (jQuery.os.Linux) {
          if(AgentUserOs.indexOf("Android") != -1) { OSName = getAndroidDevName(); }
          else if(AgentUserOs.indexOf("BlackBerry9000") != -1) OSName="BlackBerry9000";
          else if(AgentUserOs.indexOf("BlackBerry9300") != -1) OSName="BlackBerry9300";
          else if(AgentUserOs.indexOf("BlackBerry9700") != -1) OSName="BlackBerry9700";
          else if(AgentUserOs.indexOf("BlackBerry9780") != -1) OSName="BlackBerry9780";
          else if(AgentUserOs.indexOf("BlackBerry9900") != -1) OSName="BlackBerry9900";
          else if(AgentUserOs.indexOf("BlackBerry;Opera Mini") != -1) OSName="Opera/9.80";
          else if(AgentUserOs.indexOf("Symbian/3") != -1) OSName="Symbian OS3";
          else if(AgentUserOs.indexOf("SymbianOS/6") != -1) OSName="Symbian OS6";
          else if(AgentUserOs.indexOf("SymbianOS/9") != -1) OSName="Symbian OS9";
          else if(AgentUserOs.indexOf("Ubuntu") != -1) OSName="Ubuntu";
          else if(AgentUserOs.indexOf("PDA") != -1) OSName="PDA";
          else if(AgentUserOs.indexOf("NintendoWii") != -1) OSName="Nintendo Wii"; 
          else if(AgentUserOs.indexOf("PSP") != -1) OSName="PlayStation Portable";
          else if(AgentUserOs.indexOf("PS2;") != -1) OSName="PlayStation 2";
          else if(AgentUserOs.indexOf("PLAYSTATION3") != -1) OSName="PlayStation 3"; 
          else OSName="Linux (Unknown)";
          
          if(AgentUserOs.indexOf("x86_64") != -1) OsVers=" 64-bit";
          else if(AgentUserOs.indexOf("i386") != -1) OsVers=" 32-bit";
          else if(AgentUserOs.indexOf("IA-32") != -1) OsVers=" 32-bit";
          else OsVers="";
          
          } else if (jQuery.os.Unix) {
          OSName="UNIX";
          } else if (jQuery.os.Mac) {
          if(AgentUserOs.indexOf("iPhoneOS3") != -1) OSName="iPhone OS 3";
          else if(AgentUserOs.indexOf("iPhoneOS4") != -1) OSName="iPhone OS 4";
          else if(AgentUserOs.indexOf("iPhoneOS5") != -1) OSName="iPhone OS 5";
          else if(AgentUserOs.indexOf("iPhoneOS6") != -1) OSName="iPhone OS 6";
          else if(AgentUserOs.indexOf("iPad") != -1) OSName="iPad";
          else if((AgentUserOs.indexOf("MacOSX10_9")||AgentUserOs.indexOf("MacOSX10.1")) != -1) OSName="Mac OS X Puma";
          else if((AgentUserOs.indexOf("MacOSX10_9")||AgentUserOs.indexOf("MacOSX10.2")) != -1) OSName="Mac OS X Jaguar";
          else if((AgentUserOs.indexOf("MacOSX10_9")||AgentUserOs.indexOf("MacOSX10.3")) != -1) OSName="Mac OS X Panther";
          else if((AgentUserOs.indexOf("MacOSX10_9")||AgentUserOs.indexOf("MacOSX10.4")) != -1) OSName="Mac OS X Tiger";
          else if((AgentUserOs.indexOf("MacOSX10_9")||AgentUserOs.indexOf("MacOSX10.5")) != -1) OSName="Mac OS X Leopard";
          else if((AgentUserOs.indexOf("MacOSX10_9")||AgentUserOs.indexOf("MacOSX10.6")) != -1) OSName="Mac OS X Snow Leopard";
          else if((AgentUserOs.indexOf("MacOSX10_9")||AgentUserOs.indexOf("MacOSX10.7")) != -1) OSName="Mac OS X Lion";
          else if((AgentUserOs.indexOf("MacOSX10_9")||AgentUserOs.indexOf("MacOSX10.8")) != -1) OSName="Mac OS X Mountain Lion";
          else if((AgentUserOs.indexOf("MacOSX10_9")||AgentUserOs.indexOf("MacOSX10.9")) != -1) OSName="Mac OS X Mavericks";
          else OSName="MacOS (Unknown)";
          } else {
          OSName="Unknown OS";
          }
          var OSDev = OSName + OsVers;
          return OSDev;
      }
  },

  getUserStayTime: function(){
    function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }
    var ms = (new Date()) - this.enterDate;
    var seconds = ms / 1000;
    var hh = Math.floor(seconds / 3600);
    var mm = Math.floor(seconds / 60) % 60;
    var ss = Math.floor(seconds) % 60;
    var mss = ms % 1000;
    return pad(hh,2)+':'+pad(mm,2)+':'+pad(ss,2)+'.'+pad(mss,3);
  },
  
  getReferrerSite : function(){ // if referrer site is other site, then return value is url. but undefined.
    var referrer = document.referrer || '';
    var otherSite;
    if( document.referrer.indexOf( location.host ) < 0 ){
      otherSite = document.referrer;
    }
    return otherSite;
  },

  onChangeUrl : function(cb){
    window.addEventListener('hashchange', function(e){
      var data = {oldURL : e.oldURL, newURL: e.newURL};
      sendClientInfo('urlChange', data);
      if(cb) cb();
    });
  },

  onLeaveSite : function(cb){
    var data = {url: location.href};
    data.st = this.getUserStayTime();
    window.addEventListener('beforeunload',function(){
      //LSTALK.sendClientInfoAjax({a:'L',st: data.st}); 
      //LSTALK.sendClientInfo('leavePage', data);
    });
  },

  ajax : function(url, method, data, async, cb){
    method = typeof method !== 'undefined' ? method : 'GET';
    async = typeof async !== 'undefined' ? async : false;

    if (window.XMLHttpRequest)
    {
        var xhReq = new XMLHttpRequest();
    }
    else
    {
        var xhReq = new ActiveXObject("Microsoft.XMLHTTP");
    }


    if (method == 'POST')
    {
        xhReq.open(method, url, async);
        xhReq.setRequestHeader("Content-type", "application/json");
        xhReq.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhReq.onload = function () {
          if(this.status == 200){
            cb(JSON.parse(this.response));
          }else{
            console.log("error : ajax call post error "+this.status);
          }
        };
        xhReq.send(JSON.stringify(data));
        return xhReq;
    }
    else
    {
        if(typeof data !== 'undefined' && data !== null)
        {
            var dataArr = [] ;
            for(var k in data){
              dataArr.push(k+'='+data[k]);
            }
            url = url+'?'+dataArr.join('&');
        }
        this.loadJson(url);
        //xhReq.open(method, url, async);
        //xhReq.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        //xhReq.send(null);
    }
  }

};


var LSTALK_WINDOW = {
  initWin : function(){

    var div_root = document.createElement('div');
    div_root.id = 'stalk';
    div_root.className = 'stalk_status_compressed';
    div_root.innerHTML = 
'<div id="stalk-container" class="stalk-container stalk-reset stalk-acquire">'+

'    <!-- launcher -->'+
'    <div id="stalk-launcher" class="stalk-launcher stalk-launcher-enabled stalk-launcher-active">'+
'        <div id="stalk-launcher-button" class="stalk-launcher-button"></div>'+
'    </div>'+

'    <!-- chatbox -->'+
'    <div id="stalk-chatbox" class="stalk-chatbox" style="display: none;">'+
'        <div id="stalk-conversation"'+
'             class="stalk-conversation stalk-sheet stalk-sheet-active">'+
'            <div class="stalk-sheet-header">'+
'                <a class="stalk-sheet-header-button stalk-sheet-header-conversations-button" href="#">'+
'                    <div class="stalk-sheet-header-button-icon"></div>'+
'                </a>'+

'                <div class="stalk-sheet-header-title-container">'+
'                    <b class="stalk-sheet-header-title stalk-sheet-header-with-presence">정진영</b>'+
''+
'                    <div class="stalk-last-active" style="display: block;"><span class="relative-time-in-text">Last active 1 hour ago</span>'+
'                    </div>'+
'                </div>'+
'                <div class="stalk-sheet-header-generic-title"><!-- 타이틀! --></div>'+
'                <a id="btnClose" class="stalk-sheet-header-button stalk-sheet-header-close-button" href="#">'+
'                    <div class="stalk-sheet-header-button-icon"></div>'+
'                </a>'+
'                <a class="stalk-sheet-header-button stalk-sheet-header-minimize-button" href="#">'+
'                    <div class="stalk-sheet-header-button-icon"></div>'+
'                </a>'+
'            </div>'+
'            <div class="stalk-sheet-body"></div>'+
'            <div class="stalk-sheet-content" style="bottom: 74px;">'+
'                <div class="stalk-sheet-content-container">'+
'                    <div class="stalk-conversation-parts-container">'+
'                        <div class="stalk-conversation-parts" id="stalk_conversation">'+
''+
''+
'                            <div class="stalk-conversation-part stalk-conversation-part-grouped-first">'+
'                                <div class="stalk-comment stalk-comment-by-user">'+
'                                    <div class="stalk-comment-body-container">'+
'                                        <div class="stalk-comment-body stalk-embed-body">'+
'                                            <p>안녕하세요</p>'+
'                                        </div>'+
'                                        <div class="stalk-comment-caret"></div>'+
'                                    </div>'+
'                                </div>'+
'                            </div>'+
''+
'                            <div class="stalk-conversation-part stalk-conversation-part-grouped">'+
'                                <div class="stalk-comment stalk-comment-by-user">'+
''+
'                                    <div class="stalk-comment-body-container">'+
'                                        <div class="stalk-comment-body stalk-embed-body">'+
'                                            <p>안녕하세요</p>'+
'                                        </div>'+
'                                        <div class="stalk-comment-caret"></div>'+
''+
'                                    </div>'+
'                                    <div class="stalk-comment-metadata-container">'+
'                                        <div class="stalk-comment-metadata">'+
'                                            <span class="stalk-comment-state"> <!-- 상태 정보 --> </span>'+
'                                            <span class="stalk-relative-time">9h ago</span>. Seen.'+
'                                        </div>'+
'                                    </div>'+
'                                </div>'+
'                            </div>'+
''+
'                            <div class="stalk-conversation-part stalk-conversation-part-grouped-first">'+
'                                <div class="stalk-comment stalk-comment-by-admin">'+
''+
'                                    <img src="https://static.intercomcdn.com/avatars/160835/square_128/profile_resized.jpg?1439950132"'+
'                                         class="stalk-comment-avatar">'+
''+
'                                    <div class="stalk-comment-body-container">'+
'                                        <div class="stalk-comment-body stalk-embed-body">'+
'                                            <p>안녕하세요! Hellocafe를 찾아주셔서 감사합니다~</p>'+
'                                        </div>'+
'                                        <div class="stalk-comment-caret"></div>'+
'                                    </div>'+
'                                </div>'+
'                            </div>'+
''+
''+
'                            <div class="stalk-conversation-part stalk-conversation-part-grouped">'+
'                                <div class="stalk-comment stalk-comment-by-admin">'+
''+
'                                    <div class="stalk-comment-body-container">'+
'                                        <div class="stalk-comment-body stalk-embed-body">'+
'                                            <p>안녕하세요! Hellocafe를 찾아주셔서 감사합니다~</p>'+
'                                        </div>'+
'                                        <div class="stalk-comment-caret"></div>'+
'                                    </div>'+
'                                </div>'+
'                            </div>'+
''+
'                            <div class="stalk-conversation-part stalk-conversation-part-grouped-last">'+
'                                <div class="stalk-comment stalk-comment-by-admin">'+
'                                    <div class="stalk-comment-body-container">'+
'                                        <div class="stalk-comment-body stalk-embed-body">'+
'                                            <p>제가 도울수있을까요?</p>'+
'                                        </div>'+
'                                        <div class="stalk-comment-caret"></div>'+
'                                    </div>'+
'                                    <div class="stalk-comment-metadata-container">'+
'                                        <div class="stalk-comment-metadata">'+
'                                            <span class="stalk-comment-state"></span>'+
'                                            <span class="stalk-relative-time">9h ago</span></div>'+
'                                        <div class="stalk-comment-readstate"></div>'+
'                                    </div>'+
'                                </div>'+
'                            </div>'+
'                        </div>'+
'                    </div>'+
'                </div>'+
'            </div>'+
'            <div class="stalk-composer-container">'+
'                <form action="" method="POST" id="stalk-composer" class="stalk-composer"'+
'                      style="transform: translate(0px, 0px);">'+
'                    <div class="stalk-composer-upload-error">The maximum upload size is 40MB</div>'+
'                    <div class="stalk-composer-textarea-container">'+
'                        <input type="submit" class="stalk-composer-send-button" value="Send" disabled="">'+
'                        <input style="display:none" type="file">'+
''+
'                        <div class="stalk-composer-textarea stalk-composer-focused">'+
'                            <strong class="stalk-composer-upload-button" title="Send attachment"'+
'                                    style="display: inline;"></strong>'+
'                            <pre><span></span><br></pre>'+
'                            <textarea id="stalk_input_textarea" placeholder="Write a reply…"></textarea>'+
'                        </div>'+
'                    </div>'+
'                    <div class="stalk-composer-press-enter-to-send" style="height: auto; display: none;">Press Enter'+
'                        to send'+
'                    </div>'+
'                </form>'+
'            </div>'+
'        </div>'+
'    </div>'+
'</div>';




/*    
    div_root.innerHTML =
'  <div id="stalk_window" style="margin: 0px 20px; bottom: 0px; right: 0px; display: none; position: fixed;" class="stalk_window_base stalk_window_width stalk_window_fixed_bottom stalk_window_fixed_right "> ' +
'  <div id="stalk_room_cnt" class="fade"><span id="stalk_room_cnt_txt"></span> people are now seeing!</div>'+



'    <div id="stalk_panel" class="stalk_panel_border stalk_panel_bg" style="display: block;"> ' +
''+
'     <div id="stalk_title" style="display: block;"> ' +
'        <div id="stalk_topbar" class="stalk_panel_title_fg stalk_panel_title_bg"> ' +
'          <a id="stalk_sizebutton" class="stalk_button">^</a> ' +
'          <a id="stalk_logoutbutton" class="stalk_button" style="display: none">X</a> ' +
'          <a id="stalk_oplink" class="stalk_panel_title_fg" > '+ LSTALK_CONFIGURATION.MESSAGE.title+' </a> ' +
'        </div> ' +
'      </div> ' +
''+
'      <div id="stalk_contents" style="display: none;"> ' +
'        <div id="stalk_body"> ' +
''+
'          <div id="stalk_conversation" class="stalk_conversation stalk_panel_height stalk_panel_bg" style="height: 200px; display: block;"></div>' +

'          <form id="stalk_chatform" action="#" method="GET" autocomplete="off" style="display: none;"> ' +
'            <div id="stalk_input" class="stalk_input "> ' +
'              <textarea id="stalk_input_textarea" name="stalk_input_textarea" size="undefined" class="stalk_input_textarea_pre stalk_input_textarea_normal" placeholder="Type here and hit &lt;enter&gt; to chat" style="line-height: 21px; height: 21px; display: block;"></textarea> ' +
'            </div> ' +
'          </form> ' +

'          <div id="stalk_loginform" style="display: block;">' +
'            <a href="#" onclick="return !window.open(LSTALK.getOAuthUrl(\'facebook\'),\'STALK_OAUTH\',\'menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes,width=350,height=350\')" target="_blank" id="stalk_login_facebook"   class="stalk_login_button" style="background-position: -0px -88px; width: 64px; height: 34px">&nbsp;</a>' +
//'            <a href="#" onclick="return !window.open(STALK.getOAuthUrl(\'twitter\'),\'STALK_OAUTH\',\'menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes,width=700,height=450\')" target="_blank" id="stalk_login_twitter"    class="stalk_login_button" style="background-position: -0px -148px; width: 64px; height: 64px">&nbsp;</a>' +
'            <a href="#" onclick="return !window.open(LSTALK.getOAuthUrl(\'google\'),\'STALK_OAUTH\',\'menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes,width=800,height=450\')" target="_blank" id="stalk_login_googleplus" class="stalk_login_button" style="background-position: -0px -14px; width: 64px; height: 34px">&nbsp;</a>' +
'          </div> ' +

'        </div> ' +
'        <div style="text-transform: uppercase; font-size: 9px; letter-spacing: 2px; font-weight: bold; padding: 8px 0px !important; font-family: helvetica, sans-serif !important; text-align: center !important; color: rgb(131, 136, 135) !important; clear: both;"> ' +
'          <a style="font-family: helvetica, sans-serif !important; text-transform: uppercase; font-size: 9px !important; letter-spacing: 2px; font-weight: bold; color: #c9362f !important; text-decoration: none; text-align:center !important;" ' +
'          href="http://link.stalk.io" target="_blank">link.stalk.io</a> ' +
'        </div> ' +
'      </div> ' +
''+
'    </div> ' +
'    <div style="display: none;"></div> ' +
'  </div> ';
*/
    document.getElementsByTagName('body')[0].appendChild(div_root);


  var divLauncher = document.getElementById('stalk-launcher');
  var btnLauncher = document.getElementById('stalk-launcher-button');
  var divChatbox = document.getElementById('stalk-chatbox');
  
  //var txMessage = document.getElementById('stalk_input_textarea');
  
  var utils = {
    hasClass: function (el, val) {
      var pattern = new RegExp("(^|\\s)" + val + "(\\s|$)");
      return pattern.test(el.className);
    },
    addClass: function (ele, cls) {
      if (!this.hasClass(ele, cls)) ele.className += " " + cls;
    },
    removeClass: function (ele, cls) {
      if (this.hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
      }
    }
  };
  
  var layout = {
    open: function (){
      utils.removeClass(divLauncher, 'stalk-launcher-active');
      utils.addClass(divLauncher, 'stalk-launcher-inactive');
      divChatbox.style.display = 'block';
    },
    close: function (){
      utils.removeClass(divLauncher, 'stalk-launcher-inactive');
      utils.addClass(divLauncher, 'stalk-launcher-active');
      divChatbox.style.display = 'none';
    }
  };
  
  btnLauncher.onclick = function (event) {
    layout.open();
  };
  
  document.getElementById('btnClose').onclick = function (event) {
    layout.close();
  };


    var div_fade = document.createElement('div');
    div_fade.id = 'stalk_fade';

    var div_overlay = document.createElement('div');
    div_overlay.id = 'stalk_overlay';

    div_root.appendChild(div_fade);
    div_root.appendChild(div_overlay);
    //document.getElemeny('body')[0].appendChild(div_modal);

    var self = this;
    //var div_titlebar = document.getElementById('stalk_title');
    var div_contents = document.getElementById('stalk_contents');
    var div_chatform = document.getElementById('stalk_chatform');
    var el_textarea  = document.getElementById('stalk_input_textarea');
    //var div_logout   = document.getElementById('stalk_logoutbutton');

    /*
    if(LSTALK_CONFIGURATION._user.name) {
      self.setTitleBar('login');
    }
    */
    /*
    div_logout.onclick = function(event){

      STALK_UTILS.delUserInfo();
      self.setTitleBar('logout');

      LSTALK_CONFIGURATION._user = {};

      event.preventDefault();
      event.stopPropagation();

    };

    div_titlebar.onclick = function(){

      if(div_contents.style.display != 'none'){
        div_contents.style.display = 'none';
        document.getElementById('stalk').className = 'stalk_status_compressed';
      }else{
        div_contents.style.display = 'block';
        document.getElementById('stalk').className = 'stalk_status_expanded';

        el_textarea.focus();
        el_textarea.value = el_textarea.value;
      }
    };
    */
    console.log("=============== el_textarea");

    console.log(el_textarea);
    el_textarea.onkeydown = function(e) {
      //self.blinkHeader(true);

      var e = window.event || e;
      var keyCode = (e.which) ? e.which : e.keyCode;

      if(keyCode == 13 && !e.shiftKey) {

        if(e.preventDefault) {
          e.preventDefault();
        }else{
          e.returnValue = false;
        }

        var message = el_textarea.value;
        message = STALK_UTILS.getEscapeHtml(message.replace(/^\s+|\s+$/g, ''));

        if(message.length > 0){

          STALK.sendMessage(encodeURIComponent(message));
          el_textarea.value = '';
          
        }
      }
    };
    //LSTALK_WINDOW.initWin();
  },

  addMessage : function(message, from, sender){

    var div_message = document.getElementById('stalk_conversation');

    LSTALK_CONFIGURATION._last_id = from.id;
    LSTALK_CONFIGURATION._last_sender = sender;
    LSTALK_CONFIGURATION._last_count = LSTALK_CONFIGURATION._last_count + 1;
    var messageId = LSTALK_CONFIGURATION._last_id+'-'+LSTALK_CONFIGURATION._last_count;




    var msg = '';
    var msg0 = 
'<div class="stalk-conversation-part stalk-conversation-part-grouped">'+
'    <div class="stalk-comment stalk-comment-by-'
    var msg1 = '">'+
''+
'        <div class="stalk-comment-body-container">'+
'            <div class="stalk-comment-body stalk-embed-body">'+
'                <p>';
    var msg2 =
'</p>'+
'            </div>'+
'            <div class="stalk-comment-caret"></div>'+
''+
'        </div>'+
'        <div class="stalk-comment-metadata-container">'+
'            <div class="stalk-comment-metadata">'+
'                <span class="stalk-comment-state"> <!-- 상태 정보 --> </span>'+
'                <span class="stalk-relative-time">';
    var msg3 = '</span>. Seen.'+
'            </div>'+
'        </div>'+
'    </div>'+
'</div>';

    if( sender == 'operator' ){
      msg = msg0 +'admin' + msg1 + decodeURIComponent(message) + msg2 + msg3;

      /*      
      msg = msg + '<span class="stalk_message_from stalk_message_fg ">'+
	'<span class="small_name">'+ from.name+'</span>'+
        '<a href="'+from.url+'" target="_blank" style="float:left">'+
        '<img src="'+from.image+'" style="width: 30px;" /></a>';
      msg += '<span id="'+messageId+'" class="messages_from">'+decodeURIComponent(message)+'</span></span>';
      */


    } else {
      msg = msg0 +'user' + msg1 + decodeURIComponent(message) + msg2 + msg3;
      //msg += '<span id="'+messageId+'" class="messages_to">'+decodeURIComponent(message)+'</span>';
    }

    var chatDiv = document.createElement("p");
    chatDiv.className = 'stalk_message_clearfix';
    chatDiv.innerHTML = msg;

    if( sender != 'operator' ){
      chatDiv.className = 'stalk_messages_to';
      chatDiv.style.textAlign = "right";
    }

    div_message.appendChild(chatDiv);


    div_message.scrollTop = div_message.scrollHeight;

    if(document.getElementById('stalk_contents').style.display != 'block'){
      this.blinkHeader();
    }

  },

  addNotification : function(message) {
    LSTALK_CONFIGURATION._last_id = '';
    LSTALK_CONFIGURATION.msg += '<span id="'+messageId+'">'+decodeURIComponent(message)+'</span>';_last_sender = '';
    var chatDiv = document.createElement("p");
    chatDiv.className = 'stalk_message';
    chatDiv.innerHTML = '<span class="stalk_message_notification">'+message+'</span>';

    var div_message = document.getElementById('stalk_conversation');
    div_message.appendChild(chatDiv);
    div_message.scrollTop = div_message.scrollHeight;

    if(document.getElementById('stalk_contents').style.display != 'block'){
      this.blinkHeader();
    }
  },

  addSysMessage : function(message) {
    LSTALK_CONFIGURATION._last_id = '';
    LSTALK_CONFIGURATION._last_sender = '';
    var chatDiv = document.createElement("span");
    chatDiv.className = 'stalk_message_note_link';
    chatDiv.innerHTML = message;

    var div_message = document.getElementById('stalk_conversation');
    div_message.appendChild(chatDiv);
    div_message.scrollTop = div_message.scrollHeight;

  },

  blinkTimeout : '',
  blinkHeader : function(isDone){
    if(isDone){
      clearInterval(this.blinkTimeout);
      var titleDivForBlick = document.getElementById('stalk_topbar');
      STALK_UTILS.removeClass(titleDivForBlick, 'stalk_panel_title_bg_blink');
    }else{
      clearInterval(this.blinkTimeout);
      this.blinkTimeout =
        setInterval(function(){
          var titleDivForBlick = document.getElementById('stalk_topbar');
          if(STALK_UTILS.hasClass(titleDivForBlick, 'stalk_panel_title_bg_blink')){
            STALK_UTILS.removeClass(titleDivForBlick, 'stalk_panel_title_bg_blink');
          }else{
            STALK_UTILS.addClass(titleDivForBlick, 'stalk_panel_title_bg_blink');
          }
        },1000);
    }
  },

  focusTextarea : function(){


    if(STALK_UTILS.isIE()){
      setTimeout(function() {
        if(document.getElementById('stalk_chatform').style.display == 'block'){
          document.getElementById('stalk_input_textarea').focus();
        }
      }, 1000);
    }else{
      var el_textarea  = document.getElementById('stalk_input_textarea');
      el_textarea.focus();
      el_textarea.value = el_textarea.value;
    }

  },

  setTitleBar : function(_event, data){

    if(_event == 'login'){
      //document.getElementById('stalk_logoutbutton').style.display = 'block';
      document.getElementById('stalk_chatform').style.display     = 'block';
      document.getElementById('stalk_loginform').style.display    = 'none';

      this.focusTextarea();

    }else if(_event == 'logout'){
      document.getElementById('stalk_logoutbutton').style.display = 'none';
      document.getElementById('stalk_chatform').style.display     = 'none';
      document.getElementById('stalk_loginform').style.display    = 'block';
      this.addNotification('Logout completely. Try logging on again.');

    }else if(_event == 'title'){
      document.getElementById('stalk_oplink').innerHTML = 'Online : '+data+'';

    }

  },

  startAnonymousChat : function(){
    LSTALK_CONFIGURATION._user = {
      id: 'anonymous',
      name: 'anonymous',
      url: 'anonymous',
      image: 'anonymous'
    };

    //STALK_UTILS.setUserInfo(LSTALK_CONFIGURATION._user);
    //this.setTitleBar('login');
  }
};


var STALK = (function(CONF, UTILS, WIN) {

  return {

    init: function(data) {
      var self = this;
      if(CONF._isReady) return false;

      CONF._isReady = true;
      CONF._userId  = data.userId || 'unknown';
      CONF._app     = CONF.APP; // +':'+data.key;
      CONF._channel = data.key+'^'+UTILS.getUniqueKey();//+'^'+data.id+'^'+CONF._userId;
      CONF._last_count = 0;
      CONF.enterDate = new Date();

      if( !CONF._channel ) return;

      //UTILS.loadJson(CONF.STALK_URL+'/api/operators/live/'+data.key+'?1=1', 'LSTALK.callbackOperator');
      var xhr = UTILS.ajax(CONF.STALK_URL+'/user/list/active','POST', {"A":"[appId]"}, true, function(result){
        console.log("==== this is operator response!");
        console.log(result);
        if(result.status == "ok"){
          self.callbackOperator(result.result);
        }
      });

    },

    callbackOperator : function(data, userInfo){
      console.log("================== callbackoperator")
      console.log(data);
      console.log(userInfo);

      if(data.error){
        console.log(" error : "+data.error);
        return;
      }


      CONF._clientInfo = userInfo || {};

      CONF._operators = data;

      //var userInfo = UTILS.deepCopy(CONF._clientInfo);
      //userInfo.a = 'V';
      //LSTALK.sendClientInfoAjax({a:'V'});
      UTILS.onLeaveSite();
      /*
      if(data.length === 0) {
        alert("접속 가능한 operator 가 없습니다.")
        return;
      }
      */
      UTILS.loadCss( CONF.CSS_URL);
      UTILS.loadJson(CONF.APP_URL+'/node/'+encodeURIComponent(CONF._app)+'/'+CONF._channel+'?1=1', 'STALK.callbackInit');
    },

    callbackInit : function(data){
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

      var _user = UTILS.getUserInfo();
      if(_user.name){
        CONF._user = _user;
      }else{
        CONF._user = {};
      }

      CONF._socket = io.connect(data.result.server.url+'/channel?'+query, {
        'force new connection': true,
        transports: ['polling']
      });


      console.log( data.result.server.url );
      console.log( query );
      var isJoin = false;
      CONF._socket.on('connect', function () {
          console.log( 'connected' );
          if(isJoin == false)
          CONF._socket.emit("channel.join",{C:CONF._channel, U:"3a8c654d-6241-48e9-8c40-da6d0e440a10"},function(){
            isJoin = true;
            console.log("===== channel.join");
            console.log(arguments);
          })

      });

      CONF._socket.on('message', function (data) {
      	console.log( data );
        WIN.addMessage(data.message, data.user, data.sender);
      });
        // UTILS.setUserInfo(CONF._user);
        // WIN.setTitleBar('login');

      CONF._socket.on('_event', function (data) {
        console.log( "======= _event" , data );
        if (data.event == 'CONNECTION') {
          if( data.U == CONF._userId ) {
            console.log("======== join " , CONF._operators);

            // choice operator 
            var operators = [];
            for(var i = 0 ; i < CONF._operators.length;i++){
              operators.push( CONF._operators[i].login );
            }
      	    console.log("===== =join");
            console.log( operators );
            CONF._socket.emit('join', /*{U:CONF._operators}*/ {U:operators}, function (data) {
              console.log("======== join " , data);
            });

            WIN.addSysMessage(CONF.MESSAGE.default_message);


          }else{

            WIN.addSysMessage('operator is connected.');
          }

          //LSTALK.sendClientInfo(CONF._clientInfo);

        }else if (data.event == 'DISCONNECT') {
          if( data.userId == 'CONF._userId' ) {
            WIN.addSysMessage('disconnected.');
          }else{
            WIN.addSysMessage('operator was disconnected.');
          }

        }
      });
      
      /** create Chat window (HTML) **/
      WIN.initWin();

      WIN.startAnonymousChat();
    },

    sendMessage : function(msg){
      var param = {
        A:      CONF._app,
        C:  CONF._channel,
        NM:     'message',
        DT:     {
          user:     CONF._user,
          message:  msg,
          sender : 'client'
        }
      };

      CONF._socket.emit('send', param, function (data) {
      });
    },

    sendClientInfo : function(key, data){
      var param = {
        A:      CONF._app,
        C:  CONF._channel,
        NM:     key,
        DT:     {
          user:     CONF._user,
          message:  data,
          sender : 'client'
        }
      }
      CONF._socket.emit('send', param, function (data) {
      });
    },

    sendClientInfoAjax: function(data){
      var userInfo = UTILS.deepCopy(CONF._clientInfo);
      data = data || {};
      for(var k in data){
	if(data.hasOwnProperty(k)){
		userInfo[k] = data[k];
	}
	}

      userInfo.os = UTILS.Browser.getOSName();
      userInfo.bs = UTILS.Browser.getBrowserName();
      userInfo.re = UTILS.getReferrerSite();
      userInfo.ip = userInfo.clientIp;
      userInfo.url = location.href;
      
	UTILS.ajax(CONF.STALK_URL+'/api/visitors/','GET', userInfo);
 
    },
 
    sendClientInitInfo : function(info){
      info = info || {};

      info.os = UTILS.Browser.getOSName();
      info.browser = UTILS.Browser.getBrowserName();
      info.referrer = UTILS.getReferrerSite();
      info.url = location.href;
      sendClientInfo('info', info);
    },
    getOAuthUrl : function(targetName){
      return CONF.APP_URL + '/auth/'+targetName+'/check?app='+CONF._app+'&channel='+CONF._channel+'&socketId='+CONF._socket.io.engine.id;//CONF._socket.socket.sessionid;
    }

  };


})(LSTALK_CONFIGURATION, STALK_UTILS, LSTALK_WINDOW);

!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;"undefined"!=typeof window?e=window:"undefined"!=typeof global?e=global:"undefined"!=typeof self&&(e=self),e.io=t()}}(function(){var t;return function e(t,n,r){function o(s,a){if(!n[s]){if(!t[s]){var c="function"==typeof require&&require;if(!a&&c)return c(s,!0);if(i)return i(s,!0);throw new Error("Cannot find module '"+s+"'")}var u=n[s]={exports:{}};t[s][0].call(u.exports,function(e){var n=t[s][1][e];return o(n?n:e)},u,u.exports,e,t,n,r)}return n[s].exports}for(var i="function"==typeof require&&require,s=0;s<r.length;s++)o(r[s]);return o}({1:[function(t,e){e.exports=t("./lib/")},{"./lib/":2}],2:[function(t,e,n){function r(t,e){"object"==typeof t&&(e=t,t=void 0),e=e||{};var n,r=o(t),i=r.source,u=r.id;return e.forceNew||e["force new connection"]||!1===e.multiplex?(a("ignoring socket cache for %s",i),n=s(i,e)):(c[u]||(a("new io instance for %s",i),c[u]=s(i,e)),n=c[u]),n.socket(r.path)}var o=t("./url"),i=t("socket.io-parser"),s=t("./manager"),a=t("debug")("socket.io-client");e.exports=n=r;var c=n.managers={};n.protocol=i.protocol,n.connect=r,n.Manager=t("./manager"),n.Socket=t("./socket")},{"./manager":3,"./socket":5,"./url":6,debug:9,"socket.io-parser":43}],3:[function(t,e){function n(t,e){return this instanceof n?(t&&"object"==typeof t&&(e=t,t=void 0),e=e||{},e.path=e.path||"/socket.io",this.nsps={},this.subs=[],this.opts=e,this.reconnection(e.reconnection!==!1),this.reconnectionAttempts(e.reconnectionAttempts||1/0),this.reconnectionDelay(e.reconnectionDelay||1e3),this.reconnectionDelayMax(e.reconnectionDelayMax||5e3),this.timeout(null==e.timeout?2e4:e.timeout),this.readyState="closed",this.uri=t,this.connected=[],this.attempts=0,this.encoding=!1,this.packetBuffer=[],this.encoder=new s.Encoder,this.decoder=new s.Decoder,this.autoConnect=e.autoConnect!==!1,this.autoConnect&&this.open(),void 0):new n(t,e)}var r=(t("./url"),t("engine.io-client")),o=t("./socket"),i=t("component-emitter"),s=t("socket.io-parser"),a=t("./on"),c=t("component-bind"),u=(t("object-component"),t("debug")("socket.io-client:manager")),p=t("indexof");e.exports=n,n.prototype.emitAll=function(){this.emit.apply(this,arguments);for(var t in this.nsps)this.nsps[t].emit.apply(this.nsps[t],arguments)},i(n.prototype),n.prototype.reconnection=function(t){return arguments.length?(this._reconnection=!!t,this):this._reconnection},n.prototype.reconnectionAttempts=function(t){return arguments.length?(this._reconnectionAttempts=t,this):this._reconnectionAttempts},n.prototype.reconnectionDelay=function(t){return arguments.length?(this._reconnectionDelay=t,this):this._reconnectionDelay},n.prototype.reconnectionDelayMax=function(t){return arguments.length?(this._reconnectionDelayMax=t,this):this._reconnectionDelayMax},n.prototype.timeout=function(t){return arguments.length?(this._timeout=t,this):this._timeout},n.prototype.maybeReconnectOnOpen=function(){this.openReconnect||this.reconnecting||!this._reconnection||0!==this.attempts||(this.openReconnect=!0,this.reconnect())},n.prototype.open=n.prototype.connect=function(t){if(u("readyState %s",this.readyState),~this.readyState.indexOf("open"))return this;u("opening %s",this.uri),this.engine=r(this.uri,this.opts);var e=this.engine,n=this;this.readyState="opening",this.skipReconnect=!1;var o=a(e,"open",function(){n.onopen(),t&&t()}),i=a(e,"error",function(e){if(u("connect_error"),n.cleanup(),n.readyState="closed",n.emitAll("connect_error",e),t){var r=new Error("Connection error");r.data=e,t(r)}n.maybeReconnectOnOpen()});if(!1!==this._timeout){var s=this._timeout;u("connect attempt will timeout after %d",s);var c=setTimeout(function(){u("connect attempt timed out after %d",s),o.destroy(),e.close(),e.emit("error","timeout"),n.emitAll("connect_timeout",s)},s);this.subs.push({destroy:function(){clearTimeout(c)}})}return this.subs.push(o),this.subs.push(i),this},n.prototype.onopen=function(){u("open"),this.cleanup(),this.readyState="open",this.emit("open");var t=this.engine;this.subs.push(a(t,"data",c(this,"ondata"))),this.subs.push(a(this.decoder,"decoded",c(this,"ondecoded"))),this.subs.push(a(t,"error",c(this,"onerror"))),this.subs.push(a(t,"close",c(this,"onclose")))},n.prototype.ondata=function(t){this.decoder.add(t)},n.prototype.ondecoded=function(t){this.emit("packet",t)},n.prototype.onerror=function(t){u("error",t),this.emitAll("error",t)},n.prototype.socket=function(t){var e=this.nsps[t];if(!e){e=new o(this,t),this.nsps[t]=e;var n=this;e.on("connect",function(){~p(n.connected,e)||n.connected.push(e)})}return e},n.prototype.destroy=function(t){var e=p(this.connected,t);~e&&this.connected.splice(e,1),this.connected.length||this.close()},n.prototype.packet=function(t){u("writing packet %j",t);var e=this;e.encoding?e.packetBuffer.push(t):(e.encoding=!0,this.encoder.encode(t,function(t){for(var n=0;n<t.length;n++)e.engine.write(t[n]);e.encoding=!1,e.processPacketQueue()}))},n.prototype.processPacketQueue=function(){if(this.packetBuffer.length>0&&!this.encoding){var t=this.packetBuffer.shift();this.packet(t)}},n.prototype.cleanup=function(){for(var t;t=this.subs.shift();)t.destroy();this.packetBuffer=[],this.encoding=!1,this.decoder.destroy()},n.prototype.close=n.prototype.disconnect=function(){this.skipReconnect=!0,this.readyState="closed",this.engine&&this.engine.close()},n.prototype.onclose=function(t){u("close"),this.cleanup(),this.readyState="closed",this.emit("close",t),this._reconnection&&!this.skipReconnect&&this.reconnect()},n.prototype.reconnect=function(){if(this.reconnecting||this.skipReconnect)return this;var t=this;if(this.attempts++,this.attempts>this._reconnectionAttempts)u("reconnect failed"),this.emitAll("reconnect_failed"),this.reconnecting=!1;else{var e=this.attempts*this.reconnectionDelay();e=Math.min(e,this.reconnectionDelayMax()),u("will wait %dms before reconnect attempt",e),this.reconnecting=!0;var n=setTimeout(function(){t.skipReconnect||(u("attempting reconnect"),t.emitAll("reconnect_attempt",t.attempts),t.emitAll("reconnecting",t.attempts),t.skipReconnect||t.open(function(e){e?(u("reconnect attempt error"),t.reconnecting=!1,t.reconnect(),t.emitAll("reconnect_error",e.data)):(u("reconnect success"),t.onreconnect())}))},e);this.subs.push({destroy:function(){clearTimeout(n)}})}},n.prototype.onreconnect=function(){var t=this.attempts;this.attempts=0,this.reconnecting=!1,this.emitAll("reconnect",t)}},{"./on":4,"./socket":5,"./url":6,"component-bind":7,"component-emitter":8,debug:9,"engine.io-client":10,indexof:39,"object-component":40,"socket.io-parser":43}],4:[function(t,e){function n(t,e,n){return t.on(e,n),{destroy:function(){t.removeListener(e,n)}}}e.exports=n},{}],5:[function(t,e,n){function r(t,e){this.io=t,this.nsp=e,this.json=this,this.ids=0,this.acks={},this.io.autoConnect&&this.open(),this.receiveBuffer=[],this.sendBuffer=[],this.connected=!1,this.disconnected=!0}var o=t("socket.io-parser"),i=t("component-emitter"),s=t("to-array"),a=t("./on"),c=t("component-bind"),u=t("debug")("socket.io-client:socket"),p=t("has-binary");e.exports=n=r;var f={connect:1,connect_error:1,connect_timeout:1,disconnect:1,error:1,reconnect:1,reconnect_attempt:1,reconnect_failed:1,reconnect_error:1,reconnecting:1},h=i.prototype.emit;i(r.prototype),r.prototype.subEvents=function(){if(!this.subs){var t=this.io;this.subs=[a(t,"open",c(this,"onopen")),a(t,"packet",c(this,"onpacket")),a(t,"close",c(this,"onclose"))]}},r.prototype.open=r.prototype.connect=function(){return this.connected?this:(this.subEvents(),this.io.open(),"open"==this.io.readyState&&this.onopen(),this)},r.prototype.send=function(){var t=s(arguments);return t.unshift("message"),this.emit.apply(this,t),this},r.prototype.emit=function(t){if(f.hasOwnProperty(t))return h.apply(this,arguments),this;var e=s(arguments),n=o.EVENT;p(e)&&(n=o.BINARY_EVENT);var r={type:n,data:e};return"function"==typeof e[e.length-1]&&(u("emitting packet with ack id %d",this.ids),this.acks[this.ids]=e.pop(),r.id=this.ids++),this.connected?this.packet(r):this.sendBuffer.push(r),this},r.prototype.packet=function(t){t.nsp=this.nsp,this.io.packet(t)},r.prototype.onopen=function(){u("transport is open - connecting"),"/"!=this.nsp&&this.packet({type:o.CONNECT})},r.prototype.onclose=function(t){u("close (%s)",t),this.connected=!1,this.disconnected=!0,this.emit("disconnect",t)},r.prototype.onpacket=function(t){if(t.nsp==this.nsp)switch(t.type){case o.CONNECT:this.onconnect();break;case o.EVENT:this.onevent(t);break;case o.BINARY_EVENT:this.onevent(t);break;case o.ACK:this.onack(t);break;case o.BINARY_ACK:this.onack(t);break;case o.DISCONNECT:this.ondisconnect();break;case o.ERROR:this.emit("error",t.data)}},r.prototype.onevent=function(t){var e=t.data||[];u("emitting event %j",e),null!=t.id&&(u("attaching ack callback to event"),e.push(this.ack(t.id))),this.connected?h.apply(this,e):this.receiveBuffer.push(e)},r.prototype.ack=function(t){var e=this,n=!1;return function(){if(!n){n=!0;var r=s(arguments);u("sending ack %j",r);var i=p(r)?o.BINARY_ACK:o.ACK;e.packet({type:i,id:t,data:r})}}},r.prototype.onack=function(t){u("calling ack %s with %j",t.id,t.data);var e=this.acks[t.id];e.apply(this,t.data),delete this.acks[t.id]},r.prototype.onconnect=function(){this.connected=!0,this.disconnected=!1,this.emit("connect"),this.emitBuffered()},r.prototype.emitBuffered=function(){var t;for(t=0;t<this.receiveBuffer.length;t++)h.apply(this,this.receiveBuffer[t]);for(this.receiveBuffer=[],t=0;t<this.sendBuffer.length;t++)this.packet(this.sendBuffer[t]);this.sendBuffer=[]},r.prototype.ondisconnect=function(){u("server disconnect (%s)",this.nsp),this.destroy(),this.onclose("io server disconnect")},r.prototype.destroy=function(){if(this.subs){for(var t=0;t<this.subs.length;t++)this.subs[t].destroy();this.subs=null}this.io.destroy(this)},r.prototype.close=r.prototype.disconnect=function(){return this.connected&&(u("performing disconnect (%s)",this.nsp),this.packet({type:o.DISCONNECT})),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}},{"./on":4,"component-bind":7,"component-emitter":8,debug:9,"has-binary":35,"socket.io-parser":43,"to-array":47}],6:[function(t,e){(function(n){function r(t,e){var r=t,e=e||n.location;return null==t&&(t=e.protocol+"//"+e.hostname),"string"==typeof t&&("/"==t.charAt(0)&&(t="/"==t.charAt(1)?e.protocol+t:e.hostname+t),/^(https?|wss?):\/\//.test(t)||(i("protocol-less url %s",t),t="undefined"!=typeof e?e.protocol+"//"+t:"https://"+t),i("parse %s",t),r=o(t)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port="80":/^(http|ws)s$/.test(r.protocol)&&(r.port="443")),r.path=r.path||"/",r.id=r.protocol+"://"+r.host+":"+r.port,r.href=r.protocol+"://"+r.host+(e&&e.port==r.port?"":":"+r.port),r}var o=t("parseuri"),i=t("debug")("socket.io-client:url");e.exports=r}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{debug:9,parseuri:41}],7:[function(t,e){var n=[].slice;e.exports=function(t,e){if("string"==typeof e&&(e=t[e]),"function"!=typeof e)throw new Error("bind() requires a function");var r=n.call(arguments,2);return function(){return e.apply(t,r.concat(n.call(arguments)))}}},{}],8:[function(t,e){function n(t){return t?r(t):void 0}function r(t){for(var e in n.prototype)t[e]=n.prototype[e];return t}e.exports=n,n.prototype.on=n.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks[t]=this._callbacks[t]||[]).push(e),this},n.prototype.once=function(t,e){function n(){r.off(t,n),e.apply(this,arguments)}var r=this;return this._callbacks=this._callbacks||{},n.fn=e,this.on(t,n),this},n.prototype.off=n.prototype.removeListener=n.prototype.removeAllListeners=n.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var n=this._callbacks[t];if(!n)return this;if(1==arguments.length)return delete this._callbacks[t],this;for(var r,o=0;o<n.length;o++)if(r=n[o],r===e||r.fn===e){n.splice(o,1);break}return this},n.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),n=this._callbacks[t];if(n){n=n.slice(0);for(var r=0,o=n.length;o>r;++r)n[r].apply(this,e)}return this},n.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks[t]||[]},n.prototype.hasListeners=function(t){return!!this.listeners(t).length}},{}],9:[function(t,e){function n(t){return n.enabled(t)?function(e){e=r(e);var o=new Date,i=o-(n[t]||o);n[t]=o,e=t+" "+e+" +"+n.humanize(i),window.console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}:function(){}}function r(t){return t instanceof Error?t.stack||t.message:t}e.exports=n,n.names=[],n.skips=[],n.enable=function(t){try{localStorage.debug=t}catch(e){}for(var r=(t||"").split(/[\s,]+/),o=r.length,i=0;o>i;i++)t=r[i].replace("*",".*?"),"-"===t[0]?n.skips.push(new RegExp("^"+t.substr(1)+"$")):n.names.push(new RegExp("^"+t+"$"))},n.disable=function(){n.enable("")},n.humanize=function(t){var e=1e3,n=6e4,r=60*n;return t>=r?(t/r).toFixed(1)+"h":t>=n?(t/n).toFixed(1)+"m":t>=e?(t/e|0)+"s":t+"ms"},n.enabled=function(t){for(var e=0,r=n.skips.length;r>e;e++)if(n.skips[e].test(t))return!1;for(var e=0,r=n.names.length;r>e;e++)if(n.names[e].test(t))return!0;return!1};try{window.localStorage&&n.enable(localStorage.debug)}catch(o){}},{}],10:[function(t,e){e.exports=t("./lib/")},{"./lib/":11}],11:[function(t,e){e.exports=t("./socket"),e.exports.parser=t("engine.io-parser")},{"./socket":12,"engine.io-parser":24}],12:[function(t,e){(function(n){function r(t,e){if(!(this instanceof r))return new r(t,e);if(e=e||{},t&&"object"==typeof t&&(e=t,t=null),t&&(t=p(t),e.host=t.host,e.secure="https"==t.protocol||"wss"==t.protocol,e.port=t.port,t.query&&(e.query=t.query)),this.secure=null!=e.secure?e.secure:n.location&&"https:"==location.protocol,e.host){var o=e.host.split(":");e.hostname=o.shift(),o.length&&(e.port=o.pop())}this.agent=e.agent||!1,this.hostname=e.hostname||(n.location?location.hostname:"localhost"),this.port=e.port||(n.location&&location.port?location.port:this.secure?443:80),this.query=e.query||{},"string"==typeof this.query&&(this.query=h.decode(this.query)),this.upgrade=!1!==e.upgrade,this.path=(e.path||"/engine.io").replace(/\/$/,"")+"/",this.forceJSONP=!!e.forceJSONP,this.jsonp=!1!==e.jsonp,this.forceBase64=!!e.forceBase64,this.enablesXDR=!!e.enablesXDR,this.timestampParam=e.timestampParam||"t",this.timestampRequests=e.timestampRequests,this.transports=e.transports||["polling","websocket"],this.readyState="",this.writeBuffer=[],this.callbackBuffer=[],this.policyPort=e.policyPort||843,this.rememberUpgrade=e.rememberUpgrade||!1,this.open(),this.binaryType=null,this.onlyBinaryUpgrades=e.onlyBinaryUpgrades}function o(t){var e={};for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}var i=t("./transports"),s=t("component-emitter"),a=t("debug")("engine.io-client:socket"),c=t("indexof"),u=t("engine.io-parser"),p=t("parseuri"),f=t("parsejson"),h=t("parseqs");e.exports=r,r.priorWebsocketSuccess=!1,s(r.prototype),r.protocol=u.protocol,r.Socket=r,r.Transport=t("./transport"),r.transports=t("./transports"),r.parser=t("engine.io-parser"),r.prototype.createTransport=function(t){a('creating transport "%s"',t);var e=o(this.query);e.EIO=u.protocol,e.transport=t,this.id&&(e.sid=this.id);var n=new i[t]({agent:this.agent,hostname:this.hostname,port:this.port,secure:this.secure,path:this.path,query:e,forceJSONP:this.forceJSONP,jsonp:this.jsonp,forceBase64:this.forceBase64,enablesXDR:this.enablesXDR,timestampRequests:this.timestampRequests,timestampParam:this.timestampParam,policyPort:this.policyPort,socket:this});return n},r.prototype.open=function(){var t;if(this.rememberUpgrade&&r.priorWebsocketSuccess&&-1!=this.transports.indexOf("websocket"))t="websocket";else{if(0==this.transports.length){var e=this;return setTimeout(function(){e.emit("error","No transports available")},0),void 0}t=this.transports[0]}this.readyState="opening";var t;try{t=this.createTransport(t)}catch(n){return this.transports.shift(),this.open(),void 0}t.open(),this.setTransport(t)},r.prototype.setTransport=function(t){a("setting transport %s",t.name);var e=this;this.transport&&(a("clearing existing transport %s",this.transport.name),this.transport.removeAllListeners()),this.transport=t,t.on("drain",function(){e.onDrain()}).on("packet",function(t){e.onPacket(t)}).on("error",function(t){e.onError(t)}).on("close",function(){e.onClose("transport close")})},r.prototype.probe=function(t){function e(){if(h.onlyBinaryUpgrades){var e=!this.supportsBinary&&h.transport.supportsBinary;f=f||e}f||(a('probe transport "%s" opened',t),p.send([{type:"ping",data:"probe"}]),p.once("packet",function(e){if(!f)if("pong"==e.type&&"probe"==e.data){if(a('probe transport "%s" pong',t),h.upgrading=!0,h.emit("upgrading",p),!p)return;r.priorWebsocketSuccess="websocket"==p.name,a('pausing current transport "%s"',h.transport.name),h.transport.pause(function(){f||"closed"!=h.readyState&&(a("changing transport and sending upgrade packet"),u(),h.setTransport(p),p.send([{type:"upgrade"}]),h.emit("upgrade",p),p=null,h.upgrading=!1,h.flush())})}else{a('probe transport "%s" failed',t);var n=new Error("probe error");n.transport=p.name,h.emit("upgradeError",n)}}))}function n(){f||(f=!0,u(),p.close(),p=null)}function o(e){var r=new Error("probe error: "+e);r.transport=p.name,n(),a('probe transport "%s" failed because of error: %s',t,e),h.emit("upgradeError",r)}function i(){o("transport closed")}function s(){o("socket closed")}function c(t){p&&t.name!=p.name&&(a('"%s" works - aborting "%s"',t.name,p.name),n())}function u(){p.removeListener("open",e),p.removeListener("error",o),p.removeListener("close",i),h.removeListener("close",s),h.removeListener("upgrading",c)}a('probing transport "%s"',t);var p=this.createTransport(t,{probe:1}),f=!1,h=this;r.priorWebsocketSuccess=!1,p.once("open",e),p.once("error",o),p.once("close",i),this.once("close",s),this.once("upgrading",c),p.open()},r.prototype.onOpen=function(){if(a("socket open"),this.readyState="open",r.priorWebsocketSuccess="websocket"==this.transport.name,this.emit("open"),this.flush(),"open"==this.readyState&&this.upgrade&&this.transport.pause){a("starting upgrade probes");for(var t=0,e=this.upgrades.length;e>t;t++)this.probe(this.upgrades[t])}},r.prototype.onPacket=function(t){if("opening"==this.readyState||"open"==this.readyState)switch(a('socket receive: type "%s", data "%s"',t.type,t.data),this.emit("packet",t),this.emit("heartbeat"),t.type){case"open":this.onHandshake(f(t.data));break;case"pong":this.setPing();break;case"error":var e=new Error("server error");e.code=t.data,this.emit("error",e);break;case"message":this.emit("data",t.data),this.emit("message",t.data)}else a('packet received with socket readyState "%s"',this.readyState)},r.prototype.onHandshake=function(t){this.emit("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this.upgrades=this.filterUpgrades(t.upgrades),this.pingInterval=t.pingInterval,this.pingTimeout=t.pingTimeout,this.onOpen(),"closed"!=this.readyState&&(this.setPing(),this.removeListener("heartbeat",this.onHeartbeat),this.on("heartbeat",this.onHeartbeat))},r.prototype.onHeartbeat=function(t){clearTimeout(this.pingTimeoutTimer);var e=this;e.pingTimeoutTimer=setTimeout(function(){"closed"!=e.readyState&&e.onClose("ping timeout")},t||e.pingInterval+e.pingTimeout)},r.prototype.setPing=function(){var t=this;clearTimeout(t.pingIntervalTimer),t.pingIntervalTimer=setTimeout(function(){a("writing ping packet - expecting pong within %sms",t.pingTimeout),t.ping(),t.onHeartbeat(t.pingTimeout)},t.pingInterval)},r.prototype.ping=function(){this.sendPacket("ping")},r.prototype.onDrain=function(){for(var t=0;t<this.prevBufferLen;t++)this.callbackBuffer[t]&&this.callbackBuffer[t]();this.writeBuffer.splice(0,this.prevBufferLen),this.callbackBuffer.splice(0,this.prevBufferLen),this.prevBufferLen=0,0==this.writeBuffer.length?this.emit("drain"):this.flush()},r.prototype.flush=function(){"closed"!=this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length&&(a("flushing %d packets in socket",this.writeBuffer.length),this.transport.send(this.writeBuffer),this.prevBufferLen=this.writeBuffer.length,this.emit("flush"))},r.prototype.write=r.prototype.send=function(t,e){return this.sendPacket("message",t,e),this},r.prototype.sendPacket=function(t,e,n){if("closing"!=this.readyState&&"closed"!=this.readyState){var r={type:t,data:e};this.emit("packetCreate",r),this.writeBuffer.push(r),this.callbackBuffer.push(n),this.flush()}},r.prototype.close=function(){function t(){r.onClose("forced close"),a("socket closing - telling transport to close"),r.transport.close()}function e(){r.removeListener("upgrade",e),r.removeListener("upgradeError",e),t()}function n(){r.once("upgrade",e),r.once("upgradeError",e)}if("opening"==this.readyState||"open"==this.readyState){this.readyState="closing";var r=this;this.writeBuffer.length?this.once("drain",function(){this.upgrading?n():t()}):this.upgrading?n():t()}return this},r.prototype.onError=function(t){a("socket error %j",t),r.priorWebsocketSuccess=!1,this.emit("error",t),this.onClose("transport error",t)},r.prototype.onClose=function(t,e){if("opening"==this.readyState||"open"==this.readyState||"closing"==this.readyState){a('socket close with reason: "%s"',t);var n=this;clearTimeout(this.pingIntervalTimer),clearTimeout(this.pingTimeoutTimer),setTimeout(function(){n.writeBuffer=[],n.callbackBuffer=[],n.prevBufferLen=0},0),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),this.readyState="closed",this.id=null,this.emit("close",t,e)}},r.prototype.filterUpgrades=function(t){for(var e=[],n=0,r=t.length;r>n;n++)~c(this.transports,t[n])&&e.push(t[n]);return e}}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./transport":13,"./transports":14,"component-emitter":8,debug:21,"engine.io-parser":24,indexof:39,parsejson:31,parseqs:32,parseuri:33}],13:[function(t,e){function n(t){this.path=t.path,this.hostname=t.hostname,this.port=t.port,this.secure=t.secure,this.query=t.query,this.timestampParam=t.timestampParam,this.timestampRequests=t.timestampRequests,this.readyState="",this.agent=t.agent||!1,this.socket=t.socket,this.enablesXDR=t.enablesXDR}var r=t("engine.io-parser"),o=t("component-emitter");e.exports=n,o(n.prototype),n.timestamps=0,n.prototype.onError=function(t,e){var n=new Error(t);return n.type="TransportError",n.description=e,this.emit("error",n),this},n.prototype.open=function(){return("closed"==this.readyState||""==this.readyState)&&(this.readyState="opening",this.doOpen()),this},n.prototype.close=function(){return("opening"==this.readyState||"open"==this.readyState)&&(this.doClose(),this.onClose()),this},n.prototype.send=function(t){if("open"!=this.readyState)throw new Error("Transport not open");this.write(t)},n.prototype.onOpen=function(){this.readyState="open",this.writable=!0,this.emit("open")},n.prototype.onData=function(t){var e=r.decodePacket(t,this.socket.binaryType);this.onPacket(e)},n.prototype.onPacket=function(t){this.emit("packet",t)},n.prototype.onClose=function(){this.readyState="closed",this.emit("close")}},{"component-emitter":8,"engine.io-parser":24}],14:[function(t,e,n){(function(e){function r(t){var n,r=!1,a=!1,c=!1!==t.jsonp;if(e.location){var u="https:"==location.protocol,p=location.port;p||(p=u?443:80),r=t.hostname!=location.hostname||p!=t.port,a=t.secure!=u}if(t.xdomain=r,t.xscheme=a,n=new o(t),"open"in n&&!t.forceJSONP)return new i(t);if(!c)throw new Error("JSONP disabled");return new s(t)}var o=t("xmlhttprequest"),i=t("./polling-xhr"),s=t("./polling-jsonp"),a=t("./websocket");n.polling=r,n.websocket=a}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./polling-jsonp":15,"./polling-xhr":16,"./websocket":18,xmlhttprequest:19}],15:[function(t,e){(function(n){function r(){}function o(t){i.call(this,t),this.query=this.query||{},a||(n.___eio||(n.___eio=[]),a=n.___eio),this.index=a.length;var e=this;a.push(function(t){e.onData(t)}),this.query.j=this.index,n.document&&n.addEventListener&&n.addEventListener("beforeunload",function(){e.script&&(e.script.onerror=r)},!1)}var i=t("./polling"),s=t("component-inherit");e.exports=o;var a,c=/\n/g,u=/\\n/g;s(o,i),o.prototype.supportsBinary=!1,o.prototype.doClose=function(){this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),this.form&&(this.form.parentNode.removeChild(this.form),this.form=null,this.iframe=null),i.prototype.doClose.call(this)},o.prototype.doPoll=function(){var t=this,e=document.createElement("script");this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),e.async=!0,e.src=this.uri(),e.onerror=function(e){t.onError("jsonp poll error",e)};var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n),this.script=e;var r="undefined"!=typeof navigator&&/gecko/i.test(navigator.userAgent);r&&setTimeout(function(){var t=document.createElement("iframe");document.body.appendChild(t),document.body.removeChild(t)},100)},o.prototype.doWrite=function(t,e){function n(){r(),e()}function r(){if(o.iframe)try{o.form.removeChild(o.iframe)}catch(t){o.onError("jsonp polling iframe removal error",t)}try{var e='<iframe src="javascript:0" name="'+o.iframeId+'">';i=document.createElement(e)}catch(t){i=document.createElement("iframe"),i.name=o.iframeId,i.src="javascript:0"}i.id=o.iframeId,o.form.appendChild(i),o.iframe=i}var o=this;if(!this.form){var i,s=document.createElement("form"),a=document.createElement("textarea"),p=this.iframeId="eio_iframe_"+this.index;s.className="socketio",s.style.position="absolute",s.style.top="-1000px",s.style.left="-1000px",s.target=p,s.method="POST",s.setAttribute("accept-charset","utf-8"),a.name="d",s.appendChild(a),document.body.appendChild(s),this.form=s,this.area=a}this.form.action=this.uri(),r(),t=t.replace(u,"\\\n"),this.area.value=t.replace(c,"\\n");try{this.form.submit()}catch(f){}this.iframe.attachEvent?this.iframe.onreadystatechange=function(){"complete"==o.iframe.readyState&&n()}:this.iframe.onload=n}}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./polling":17,"component-inherit":20}],16:[function(t,e){(function(n){function r(){}function o(t){if(c.call(this,t),n.location){var e="https:"==location.protocol,r=location.port;r||(r=e?443:80),this.xd=t.hostname!=n.location.hostname||r!=t.port,this.xs=t.secure!=e}}function i(t){this.method=t.method||"GET",this.uri=t.uri,this.xd=!!t.xd,this.xs=!!t.xs,this.async=!1!==t.async,this.data=void 0!=t.data?t.data:null,this.agent=t.agent,this.isBinary=t.isBinary,this.supportsBinary=t.supportsBinary,this.enablesXDR=t.enablesXDR,this.create()}function s(){for(var t in i.requests)i.requests.hasOwnProperty(t)&&i.requests[t].abort()}var a=t("xmlhttprequest"),c=t("./polling"),u=t("component-emitter"),p=t("component-inherit"),f=t("debug")("engine.io-client:polling-xhr");e.exports=o,e.exports.Request=i,p(o,c),o.prototype.supportsBinary=!0,o.prototype.request=function(t){return t=t||{},t.uri=this.uri(),t.xd=this.xd,t.xs=this.xs,t.agent=this.agent||!1,t.supportsBinary=this.supportsBinary,t.enablesXDR=this.enablesXDR,new i(t)},o.prototype.doWrite=function(t,e){var n="string"!=typeof t&&void 0!==t,r=this.request({method:"POST",data:t,isBinary:n}),o=this;r.on("success",e),r.on("error",function(t){o.onError("xhr post error",t)}),this.sendXhr=r},o.prototype.doPoll=function(){f("xhr poll");var t=this.request(),e=this;t.on("data",function(t){e.onData(t)}),t.on("error",function(t){e.onError("xhr poll error",t)}),this.pollXhr=t},u(i.prototype),i.prototype.create=function(){var t=this.xhr=new a({agent:this.agent,xdomain:this.xd,xscheme:this.xs,enablesXDR:this.enablesXDR}),e=this;try{if(f("xhr open %s: %s",this.method,this.uri),t.open(this.method,this.uri,this.async),this.supportsBinary&&(t.responseType="arraybuffer"),"POST"==this.method)try{this.isBinary?t.setRequestHeader("Content-type","application/octet-stream"):t.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch(r){}"withCredentials"in t&&(t.withCredentials=!0),this.hasXDR()?(t.onload=function(){e.onLoad()},t.onerror=function(){e.onError(t.responseText)}):t.onreadystatechange=function(){4==t.readyState&&(200==t.status||1223==t.status?e.onLoad():setTimeout(function(){e.onError(t.status)},0))},f("xhr data %s",this.data),t.send(this.data)}catch(r){return setTimeout(function(){e.onError(r)},0),void 0}n.document&&(this.index=i.requestsCount++,i.requests[this.index]=this)},i.prototype.onSuccess=function(){this.emit("success"),this.cleanup()},i.prototype.onData=function(t){this.emit("data",t),this.onSuccess()},i.prototype.onError=function(t){this.emit("error",t),this.cleanup()},i.prototype.cleanup=function(){if("undefined"!=typeof this.xhr&&null!==this.xhr){this.hasXDR()?this.xhr.onload=this.xhr.onerror=r:this.xhr.onreadystatechange=r;try{this.xhr.abort()}catch(t){}n.document&&delete i.requests[this.index],this.xhr=null}},i.prototype.onLoad=function(){var t;try{var e;try{e=this.xhr.getResponseHeader("Content-Type").split(";")[0]}catch(n){}t="application/octet-stream"===e?this.xhr.response:this.supportsBinary?"ok":this.xhr.responseText}catch(n){this.onError(n)}null!=t&&this.onData(t)},i.prototype.hasXDR=function(){return"undefined"!=typeof n.XDomainRequest&&!this.xs&&this.enablesXDR},i.prototype.abort=function(){this.cleanup()},n.document&&(i.requestsCount=0,i.requests={},n.attachEvent?n.attachEvent("onunload",s):n.addEventListener&&n.addEventListener("beforeunload",s,!1))}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./polling":17,"component-emitter":8,"component-inherit":20,debug:21,xmlhttprequest:19}],17:[function(t,e){function n(t){var e=t&&t.forceBase64;(!c||e)&&(this.supportsBinary=!1),r.call(this,t)}var r=t("../transport"),o=t("parseqs"),i=t("engine.io-parser"),s=t("component-inherit"),a=t("debug")("engine.io-client:polling");e.exports=n;var c=function(){var e=t("xmlhttprequest"),n=new e({xdomain:!1});return null!=n.responseType}();s(n,r),n.prototype.name="polling",n.prototype.doOpen=function(){this.poll()},n.prototype.pause=function(t){function e(){a("paused"),n.readyState="paused",t()}var n=this;if(this.readyState="pausing",this.polling||!this.writable){var r=0;this.polling&&(a("we are currently polling - waiting to pause"),r++,this.once("pollComplete",function(){a("pre-pause polling complete"),--r||e()})),this.writable||(a("we are currently writing - waiting to pause"),r++,this.once("drain",function(){a("pre-pause writing complete"),--r||e()}))}else e()},n.prototype.poll=function(){a("polling"),this.polling=!0,this.doPoll(),this.emit("poll")},n.prototype.onData=function(t){var e=this;a("polling got data %s",t);var n=function(t){return"opening"==e.readyState&&e.onOpen(),"close"==t.type?(e.onClose(),!1):(e.onPacket(t),void 0)};i.decodePayload(t,this.socket.binaryType,n),"closed"!=this.readyState&&(this.polling=!1,this.emit("pollComplete"),"open"==this.readyState?this.poll():a('ignoring poll - transport state "%s"',this.readyState))},n.prototype.doClose=function(){function t(){a("writing close packet"),e.write([{type:"close"}])}var e=this;"open"==this.readyState?(a("transport open - closing"),t()):(a("transport not open - deferring close"),this.once("open",t))},n.prototype.write=function(t){var e=this;this.writable=!1;var n=function(){e.writable=!0,e.emit("drain")},e=this;i.encodePayload(t,this.supportsBinary,function(t){e.doWrite(t,n)})},n.prototype.uri=function(){var t=this.query||{},e=this.secure?"https":"http",n="";return!1!==this.timestampRequests&&(t[this.timestampParam]=+new Date+"-"+r.timestamps++),this.supportsBinary||t.sid||(t.b64=1),t=o.encode(t),this.port&&("https"==e&&443!=this.port||"http"==e&&80!=this.port)&&(n=":"+this.port),t.length&&(t="?"+t),e+"://"+this.hostname+n+this.path+t
}},{"../transport":13,"component-inherit":20,debug:21,"engine.io-parser":24,parseqs:32,xmlhttprequest:19}],18:[function(t,e){function n(t){var e=t&&t.forceBase64;e&&(this.supportsBinary=!1),r.call(this,t)}var r=t("../transport"),o=t("engine.io-parser"),i=t("parseqs"),s=t("component-inherit"),a=t("debug")("engine.io-client:websocket"),c=t("ws");e.exports=n,s(n,r),n.prototype.name="websocket",n.prototype.supportsBinary=!0,n.prototype.doOpen=function(){if(this.check()){var t=this.uri(),e=void 0,n={agent:this.agent};this.ws=new c(t,e,n),void 0===this.ws.binaryType&&(this.supportsBinary=!1),this.ws.binaryType="arraybuffer",this.addEventListeners()}},n.prototype.addEventListeners=function(){var t=this;this.ws.onopen=function(){t.onOpen()},this.ws.onclose=function(){t.onClose()},this.ws.onmessage=function(e){t.onData(e.data)},this.ws.onerror=function(e){t.onError("websocket error",e)}},"undefined"!=typeof navigator&&/iPad|iPhone|iPod/i.test(navigator.userAgent)&&(n.prototype.onData=function(t){var e=this;setTimeout(function(){r.prototype.onData.call(e,t)},0)}),n.prototype.write=function(t){function e(){n.writable=!0,n.emit("drain")}var n=this;this.writable=!1;for(var r=0,i=t.length;i>r;r++)o.encodePacket(t[r],this.supportsBinary,function(t){try{n.ws.send(t)}catch(e){a("websocket closed before onclose event")}});setTimeout(e,0)},n.prototype.onClose=function(){r.prototype.onClose.call(this)},n.prototype.doClose=function(){"undefined"!=typeof this.ws&&this.ws.close()},n.prototype.uri=function(){var t=this.query||{},e=this.secure?"wss":"ws",n="";return this.port&&("wss"==e&&443!=this.port||"ws"==e&&80!=this.port)&&(n=":"+this.port),this.timestampRequests&&(t[this.timestampParam]=+new Date),this.supportsBinary||(t.b64=1),t=i.encode(t),t.length&&(t="?"+t),e+"://"+this.hostname+n+this.path+t},n.prototype.check=function(){return!(!c||"__initialize"in c&&this.name===n.prototype.name)}},{"../transport":13,"component-inherit":20,debug:21,"engine.io-parser":24,parseqs:32,ws:34}],19:[function(t,e){var n=t("has-cors");e.exports=function(t){var e=t.xdomain,r=t.xscheme,o=t.enablesXDR;try{if("undefined"!=typeof XMLHttpRequest&&(!e||n))return new XMLHttpRequest}catch(i){}try{if("undefined"!=typeof XDomainRequest&&!r&&o)return new XDomainRequest}catch(i){}if(!e)try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(i){}}},{"has-cors":37}],20:[function(t,e){e.exports=function(t,e){var n=function(){};n.prototype=e.prototype,t.prototype=new n,t.prototype.constructor=t}},{}],21:[function(t,e,n){function r(){return"WebkitAppearance"in document.documentElement.style||window.console&&(console.firebug||console.exception&&console.table)||navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31}function o(){var t=arguments,e=this.useColors;if(t[0]=(e?"%c":"")+this.namespace+(e?" %c":" ")+t[0]+(e?"%c ":" ")+"+"+n.humanize(this.diff),!e)return t;var r="color: "+this.color;t=[t[0],r,"color: inherit"].concat(Array.prototype.slice.call(t,1));var o=0,i=0;return t[0].replace(/%[a-z%]/g,function(t){"%"!==t&&(o++,"%c"===t&&(i=o))}),t.splice(i,0,r),t}function i(){return"object"==typeof console&&"function"==typeof console.log&&Function.prototype.apply.call(console.log,console,arguments)}function s(t){try{null==t?localStorage.removeItem("debug"):localStorage.debug=t}catch(e){}}function a(){var t;try{t=localStorage.debug}catch(e){}return t}n=e.exports=t("./debug"),n.log=i,n.formatArgs=o,n.save=s,n.load=a,n.useColors=r,n.colors=["lightseagreen","forestgreen","goldenrod","dodgerblue","darkorchid","crimson"],n.formatters.j=function(t){return JSON.stringify(t)},n.enable(a())},{"./debug":22}],22:[function(t,e,n){function r(){return n.colors[p++%n.colors.length]}function o(t){function e(){}function o(){var t=o,e=+new Date,i=e-(u||e);t.diff=i,t.prev=u,t.curr=e,u=e,null==t.useColors&&(t.useColors=n.useColors()),null==t.color&&t.useColors&&(t.color=r());var s=Array.prototype.slice.call(arguments);s[0]=n.coerce(s[0]),"string"!=typeof s[0]&&(s=["%o"].concat(s));var a=0;s[0]=s[0].replace(/%([a-z%])/g,function(e,r){if("%"===e)return e;a++;var o=n.formatters[r];if("function"==typeof o){var i=s[a];e=o.call(t,i),s.splice(a,1),a--}return e}),"function"==typeof n.formatArgs&&(s=n.formatArgs.apply(t,s));var c=o.log||n.log||console.log.bind(console);c.apply(t,s)}e.enabled=!1,o.enabled=!0;var i=n.enabled(t)?o:e;return i.namespace=t,i}function i(t){n.save(t);for(var e=(t||"").split(/[\s,]+/),r=e.length,o=0;r>o;o++)e[o]&&(t=e[o].replace(/\*/g,".*?"),"-"===t[0]?n.skips.push(new RegExp("^"+t.substr(1)+"$")):n.names.push(new RegExp("^"+t+"$")))}function s(){n.enable("")}function a(t){var e,r;for(e=0,r=n.skips.length;r>e;e++)if(n.skips[e].test(t))return!1;for(e=0,r=n.names.length;r>e;e++)if(n.names[e].test(t))return!0;return!1}function c(t){return t instanceof Error?t.stack||t.message:t}n=e.exports=o,n.coerce=c,n.disable=s,n.enable=i,n.enabled=a,n.humanize=t("ms"),n.names=[],n.skips=[],n.formatters={};var u,p=0},{ms:23}],23:[function(t,e){function n(t){var e=/^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(t);if(e){var n=parseFloat(e[1]),r=(e[2]||"ms").toLowerCase();switch(r){case"years":case"year":case"y":return n*p;case"days":case"day":case"d":return n*u;case"hours":case"hour":case"h":return n*c;case"minutes":case"minute":case"m":return n*a;case"seconds":case"second":case"s":return n*s;case"ms":return n}}}function r(t){return t>=u?Math.round(t/u)+"d":t>=c?Math.round(t/c)+"h":t>=a?Math.round(t/a)+"m":t>=s?Math.round(t/s)+"s":t+"ms"}function o(t){return i(t,u,"day")||i(t,c,"hour")||i(t,a,"minute")||i(t,s,"second")||t+" ms"}function i(t,e,n){return e>t?void 0:1.5*e>t?Math.floor(t/e)+" "+n:Math.ceil(t/e)+" "+n+"s"}var s=1e3,a=60*s,c=60*a,u=24*c,p=365.25*u;e.exports=function(t,e){return e=e||{},"string"==typeof t?n(t):e.long?o(t):r(t)}},{}],24:[function(t,e,n){(function(e){function r(t,e,r){if(!e)return n.encodeBase64Packet(t,r);var o=t.data,i=new Uint8Array(o),s=new Uint8Array(1+o.byteLength);s[0]=l[t.type];for(var a=0;a<i.length;a++)s[a+1]=i[a];return r(s.buffer)}function o(t,e,r){if(!e)return n.encodeBase64Packet(t,r);var o=new FileReader;return o.onload=function(){t.data=o.result,n.encodePacket(t,e,!0,r)},o.readAsArrayBuffer(t.data)}function i(t,e,r){if(!e)return n.encodeBase64Packet(t,r);if(h)return o(t,e,r);var i=new Uint8Array(1);i[0]=l[t.type];var s=new g([i.buffer,t.data]);return r(s)}function s(t,e,n){for(var r=new Array(t.length),o=p(t.length,n),i=function(t,n,o){e(n,function(e,n){r[t]=n,o(e,r)})},s=0;s<t.length;s++)i(s,t[s],o)}var a=t("./keys"),c=t("arraybuffer.slice"),u=t("base64-arraybuffer"),p=t("after"),f=t("utf8"),h=navigator.userAgent.match(/Android/i);n.protocol=3;var l=n.packets={open:0,close:1,ping:2,pong:3,message:4,upgrade:5,noop:6},d=a(l),y={type:"error",data:"parser error"},g=t("blob");n.encodePacket=function(t,n,o,s){"function"==typeof n&&(s=n,n=!1),"function"==typeof o&&(s=o,o=null);var a=void 0===t.data?void 0:t.data.buffer||t.data;if(e.ArrayBuffer&&a instanceof ArrayBuffer)return r(t,n,s);if(g&&a instanceof e.Blob)return i(t,n,s);var c=l[t.type];return void 0!==t.data&&(c+=o?f.encode(String(t.data)):String(t.data)),s(""+c)},n.encodeBase64Packet=function(t,r){var o="b"+n.packets[t.type];if(g&&t.data instanceof g){var i=new FileReader;return i.onload=function(){var t=i.result.split(",")[1];r(o+t)},i.readAsDataURL(t.data)}var s;try{s=String.fromCharCode.apply(null,new Uint8Array(t.data))}catch(a){for(var c=new Uint8Array(t.data),u=new Array(c.length),p=0;p<c.length;p++)u[p]=c[p];s=String.fromCharCode.apply(null,u)}return o+=e.btoa(s),r(o)},n.decodePacket=function(t,e,r){if("string"==typeof t||void 0===t){if("b"==t.charAt(0))return n.decodeBase64Packet(t.substr(1),e);if(r)try{t=f.decode(t)}catch(o){return y}var i=t.charAt(0);return Number(i)==i&&d[i]?t.length>1?{type:d[i],data:t.substring(1)}:{type:d[i]}:y}var s=new Uint8Array(t),i=s[0],a=c(t,1);return g&&"blob"===e&&(a=new g([a])),{type:d[i],data:a}},n.decodeBase64Packet=function(t,n){var r=d[t.charAt(0)];if(!e.ArrayBuffer)return{type:r,data:{base64:!0,data:t.substr(1)}};var o=u.decode(t.substr(1));return"blob"===n&&g&&(o=new g([o])),{type:r,data:o}},n.encodePayload=function(t,e,r){function o(t){return t.length+":"+t}function i(t,r){n.encodePacket(t,e,!0,function(t){r(null,o(t))})}return"function"==typeof e&&(r=e,e=null),e?g&&!h?n.encodePayloadAsBlob(t,r):n.encodePayloadAsArrayBuffer(t,r):t.length?(s(t,i,function(t,e){return r(e.join(""))}),void 0):r("0:")},n.decodePayload=function(t,e,r){if("string"!=typeof t)return n.decodePayloadAsBinary(t,e,r);"function"==typeof e&&(r=e,e=null);var o;if(""==t)return r(y,0,1);for(var i,s,a="",c=0,u=t.length;u>c;c++){var p=t.charAt(c);if(":"!=p)a+=p;else{if(""==a||a!=(i=Number(a)))return r(y,0,1);if(s=t.substr(c+1,i),a!=s.length)return r(y,0,1);if(s.length){if(o=n.decodePacket(s,e,!0),y.type==o.type&&y.data==o.data)return r(y,0,1);var f=r(o,c+i,u);if(!1===f)return}c+=i,a=""}}return""!=a?r(y,0,1):void 0},n.encodePayloadAsArrayBuffer=function(t,e){function r(t,e){n.encodePacket(t,!0,!0,function(t){return e(null,t)})}return t.length?(s(t,r,function(t,n){var r=n.reduce(function(t,e){var n;return n="string"==typeof e?e.length:e.byteLength,t+n.toString().length+n+2},0),o=new Uint8Array(r),i=0;return n.forEach(function(t){var e="string"==typeof t,n=t;if(e){for(var r=new Uint8Array(t.length),s=0;s<t.length;s++)r[s]=t.charCodeAt(s);n=r.buffer}o[i++]=e?0:1;for(var a=n.byteLength.toString(),s=0;s<a.length;s++)o[i++]=parseInt(a[s]);o[i++]=255;for(var r=new Uint8Array(n),s=0;s<r.length;s++)o[i++]=r[s]}),e(o.buffer)}),void 0):e(new ArrayBuffer(0))},n.encodePayloadAsBlob=function(t,e){function r(t,e){n.encodePacket(t,!0,!0,function(t){var n=new Uint8Array(1);if(n[0]=1,"string"==typeof t){for(var r=new Uint8Array(t.length),o=0;o<t.length;o++)r[o]=t.charCodeAt(o);t=r.buffer,n[0]=0}for(var i=t instanceof ArrayBuffer?t.byteLength:t.size,s=i.toString(),a=new Uint8Array(s.length+1),o=0;o<s.length;o++)a[o]=parseInt(s[o]);if(a[s.length]=255,g){var c=new g([n.buffer,a.buffer,t]);e(null,c)}})}s(t,r,function(t,n){return e(new g(n))})},n.decodePayloadAsBinary=function(t,e,r){"function"==typeof e&&(r=e,e=null);for(var o=t,i=[],s=!1;o.byteLength>0;){for(var a=new Uint8Array(o),u=0===a[0],p="",f=1;255!=a[f];f++){if(p.length>310){s=!0;break}p+=a[f]}if(s)return r(y,0,1);o=c(o,2+p.length),p=parseInt(p);var h=c(o,0,p);if(u)try{h=String.fromCharCode.apply(null,new Uint8Array(h))}catch(l){var d=new Uint8Array(h);h="";for(var f=0;f<d.length;f++)h+=String.fromCharCode(d[f])}i.push(h),o=c(o,p)}var g=i.length;i.forEach(function(t,o){r(n.decodePacket(t,e,!0),o,g)})}}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./keys":25,after:26,"arraybuffer.slice":27,"base64-arraybuffer":28,blob:29,utf8:30}],25:[function(t,e){e.exports=Object.keys||function(t){var e=[],n=Object.prototype.hasOwnProperty;for(var r in t)n.call(t,r)&&e.push(r);return e}},{}],26:[function(t,e){function n(t,e,n){function o(t,r){if(o.count<=0)throw new Error("after called too many times");--o.count,t?(i=!0,e(t),e=n):0!==o.count||i||e(null,r)}var i=!1;return n=n||r,o.count=t,0===t?e():o}function r(){}e.exports=n},{}],27:[function(t,e){e.exports=function(t,e,n){var r=t.byteLength;if(e=e||0,n=n||r,t.slice)return t.slice(e,n);if(0>e&&(e+=r),0>n&&(n+=r),n>r&&(n=r),e>=r||e>=n||0===r)return new ArrayBuffer(0);for(var o=new Uint8Array(t),i=new Uint8Array(n-e),s=e,a=0;n>s;s++,a++)i[a]=o[s];return i.buffer}},{}],28:[function(t,e,n){!function(t){"use strict";n.encode=function(e){var n,r=new Uint8Array(e),o=r.length,i="";for(n=0;o>n;n+=3)i+=t[r[n]>>2],i+=t[(3&r[n])<<4|r[n+1]>>4],i+=t[(15&r[n+1])<<2|r[n+2]>>6],i+=t[63&r[n+2]];return o%3===2?i=i.substring(0,i.length-1)+"=":o%3===1&&(i=i.substring(0,i.length-2)+"=="),i},n.decode=function(e){var n,r,o,i,s,a=.75*e.length,c=e.length,u=0;"="===e[e.length-1]&&(a--,"="===e[e.length-2]&&a--);var p=new ArrayBuffer(a),f=new Uint8Array(p);for(n=0;c>n;n+=4)r=t.indexOf(e[n]),o=t.indexOf(e[n+1]),i=t.indexOf(e[n+2]),s=t.indexOf(e[n+3]),f[u++]=r<<2|o>>4,f[u++]=(15&o)<<4|i>>2,f[u++]=(3&i)<<6|63&s;return p}}("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")},{}],29:[function(t,e){(function(t){function n(t,e){e=e||{};for(var n=new r,o=0;o<t.length;o++)n.append(t[o]);return e.type?n.getBlob(e.type):n.getBlob()}var r=t.BlobBuilder||t.WebKitBlobBuilder||t.MSBlobBuilder||t.MozBlobBuilder,o=function(){try{var t=new Blob(["hi"]);return 2==t.size}catch(e){return!1}}(),i=r&&r.prototype.append&&r.prototype.getBlob;e.exports=function(){return o?t.Blob:i?n:void 0}()}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],30:[function(e,n,r){(function(e){!function(o){function i(t){for(var e,n,r=[],o=0,i=t.length;i>o;)e=t.charCodeAt(o++),e>=55296&&56319>=e&&i>o?(n=t.charCodeAt(o++),56320==(64512&n)?r.push(((1023&e)<<10)+(1023&n)+65536):(r.push(e),o--)):r.push(e);return r}function s(t){for(var e,n=t.length,r=-1,o="";++r<n;)e=t[r],e>65535&&(e-=65536,o+=b(e>>>10&1023|55296),e=56320|1023&e),o+=b(e);return o}function a(t,e){return b(t>>e&63|128)}function c(t){if(0==(4294967168&t))return b(t);var e="";return 0==(4294965248&t)?e=b(t>>6&31|192):0==(4294901760&t)?(e=b(t>>12&15|224),e+=a(t,6)):0==(4292870144&t)&&(e=b(t>>18&7|240),e+=a(t,12),e+=a(t,6)),e+=b(63&t|128)}function u(t){for(var e,n=i(t),r=n.length,o=-1,s="";++o<r;)e=n[o],s+=c(e);return s}function p(){if(v>=m)throw Error("Invalid byte index");var t=255&g[v];if(v++,128==(192&t))return 63&t;throw Error("Invalid continuation byte")}function f(){var t,e,n,r,o;if(v>m)throw Error("Invalid byte index");if(v==m)return!1;if(t=255&g[v],v++,0==(128&t))return t;if(192==(224&t)){var e=p();if(o=(31&t)<<6|e,o>=128)return o;throw Error("Invalid continuation byte")}if(224==(240&t)){if(e=p(),n=p(),o=(15&t)<<12|e<<6|n,o>=2048)return o;throw Error("Invalid continuation byte")}if(240==(248&t)&&(e=p(),n=p(),r=p(),o=(15&t)<<18|e<<12|n<<6|r,o>=65536&&1114111>=o))return o;throw Error("Invalid UTF-8 detected")}function h(t){g=i(t),m=g.length,v=0;for(var e,n=[];(e=f())!==!1;)n.push(e);return s(n)}var l="object"==typeof r&&r,d="object"==typeof n&&n&&n.exports==l&&n,y="object"==typeof e&&e;(y.global===y||y.window===y)&&(o=y);var g,m,v,b=String.fromCharCode,w={version:"2.0.0",encode:u,decode:h};if("function"==typeof t&&"object"==typeof t.amd&&t.amd)t(function(){return w});else if(l&&!l.nodeType)if(d)d.exports=w;else{var k={},A=k.hasOwnProperty;for(var x in w)A.call(w,x)&&(l[x]=w[x])}else o.utf8=w}(this)}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],31:[function(t,e){(function(t){var n=/^[\],:{}\s]*$/,r=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,o=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,i=/(?:^|:|,)(?:\s*\[)+/g,s=/^\s+/,a=/\s+$/;e.exports=function(e){return"string"==typeof e&&e?(e=e.replace(s,"").replace(a,""),t.JSON&&JSON.parse?JSON.parse(e):n.test(e.replace(r,"@").replace(o,"]").replace(i,""))?new Function("return "+e)():void 0):null}}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],32:[function(t,e,n){n.encode=function(t){var e="";for(var n in t)t.hasOwnProperty(n)&&(e.length&&(e+="&"),e+=encodeURIComponent(n)+"="+encodeURIComponent(t[n]));return e},n.decode=function(t){for(var e={},n=t.split("&"),r=0,o=n.length;o>r;r++){var i=n[r].split("=");e[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}return e}},{}],33:[function(t,e){var n=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,r=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];e.exports=function(t){var e=t,o=t.indexOf("["),i=t.indexOf("]");-1!=o&&-1!=i&&(t=t.substring(0,o)+t.substring(o,i).replace(/:/g,";")+t.substring(i,t.length));for(var s=n.exec(t||""),a={},c=14;c--;)a[r[c]]=s[c]||"";return-1!=o&&-1!=i&&(a.source=e,a.host=a.host.substring(1,a.host.length-1).replace(/;/g,":"),a.authority=a.authority.replace("[","").replace("]","").replace(/;/g,":"),a.ipv6uri=!0),a}},{}],34:[function(t,e){function n(t,e){var n;return n=e?new o(t,e):new o(t)}var r=function(){return this}(),o=r.WebSocket||r.MozWebSocket;e.exports=o?n:null,o&&(n.prototype=o.prototype)},{}],35:[function(t,e){(function(n){function r(t){function e(t){if(!t)return!1;if(n.Buffer&&n.Buffer.isBuffer(t)||n.ArrayBuffer&&t instanceof ArrayBuffer||n.Blob&&t instanceof Blob||n.File&&t instanceof File)return!0;if(o(t)){for(var r=0;r<t.length;r++)if(e(t[r]))return!0}else if(t&&"object"==typeof t){t.toJSON&&(t=t.toJSON());for(var i in t)if(t.hasOwnProperty(i)&&e(t[i]))return!0}return!1}return e(t)}var o=t("isarray");e.exports=r}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{isarray:36}],36:[function(t,e){e.exports=Array.isArray||function(t){return"[object Array]"==Object.prototype.toString.call(t)}},{}],37:[function(t,e){var n=t("global");try{e.exports="XMLHttpRequest"in n&&"withCredentials"in new n.XMLHttpRequest}catch(r){e.exports=!1}},{global:38}],38:[function(t,e){e.exports=function(){return this}()},{}],39:[function(t,e){var n=[].indexOf;e.exports=function(t,e){if(n)return t.indexOf(e);for(var r=0;r<t.length;++r)if(t[r]===e)return r;return-1}},{}],40:[function(t,e,n){var r=Object.prototype.hasOwnProperty;n.keys=Object.keys||function(t){var e=[];for(var n in t)r.call(t,n)&&e.push(n);return e},n.values=function(t){var e=[];for(var n in t)r.call(t,n)&&e.push(t[n]);return e},n.merge=function(t,e){for(var n in e)r.call(e,n)&&(t[n]=e[n]);return t},n.length=function(t){return n.keys(t).length},n.isEmpty=function(t){return 0==n.length(t)}},{}],41:[function(t,e){var n=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,r=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];e.exports=function(t){for(var e=n.exec(t||""),o={},i=14;i--;)o[r[i]]=e[i]||"";return o}},{}],42:[function(t,e,n){(function(e){var r=t("isarray"),o=t("./is-buffer");n.deconstructPacket=function(t){function e(t){if(!t)return t;if(o(t)){var i={_placeholder:!0,num:n.length};return n.push(t),i}if(r(t)){for(var s=new Array(t.length),a=0;a<t.length;a++)s[a]=e(t[a]);return s}if("object"==typeof t&&!(t instanceof Date)){var s={};for(var c in t)s[c]=e(t[c]);return s}return t}var n=[],i=t.data,s=t;return s.data=e(i),s.attachments=n.length,{packet:s,buffers:n}},n.reconstructPacket=function(t,e){function n(t){if(t&&t._placeholder){var o=e[t.num];return o}if(r(t)){for(var i=0;i<t.length;i++)t[i]=n(t[i]);return t}if(t&&"object"==typeof t){for(var s in t)t[s]=n(t[s]);return t}return t}return t.data=n(t.data),t.attachments=void 0,t},n.removeBlobs=function(t,n){function i(t,c,u){if(!t)return t;if(e.Blob&&t instanceof Blob||e.File&&t instanceof File){s++;var p=new FileReader;p.onload=function(){u?u[c]=this.result:a=this.result,--s||n(a)},p.readAsArrayBuffer(t)}else if(r(t))for(var f=0;f<t.length;f++)i(t[f],f,t);else if(t&&"object"==typeof t&&!o(t))for(var h in t)i(t[h],h,t)}var s=0,a=t;i(a),s||n(a)}}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./is-buffer":44,isarray:45}],43:[function(t,e,n){function r(){}function o(t){var e="",r=!1;return e+=t.type,(n.BINARY_EVENT==t.type||n.BINARY_ACK==t.type)&&(e+=t.attachments,e+="-"),t.nsp&&"/"!=t.nsp&&(r=!0,e+=t.nsp),null!=t.id&&(r&&(e+=",",r=!1),e+=t.id),null!=t.data&&(r&&(e+=","),e+=f.stringify(t.data)),p("encoded %j as %s",t,e),e}function i(t,e){function n(t){var n=l.deconstructPacket(t),r=o(n.packet),i=n.buffers;i.unshift(r),e(i)}l.removeBlobs(t,n)}function s(){this.reconstructor=null}function a(t){var e={},r=0;if(e.type=Number(t.charAt(0)),null==n.types[e.type])return u();if(n.BINARY_EVENT==e.type||n.BINARY_ACK==e.type){for(e.attachments="";"-"!=t.charAt(++r);)e.attachments+=t.charAt(r);e.attachments=Number(e.attachments)}if("/"==t.charAt(r+1))for(e.nsp="";++r;){var o=t.charAt(r);if(","==o)break;if(e.nsp+=o,r+1==t.length)break}else e.nsp="/";var i=t.charAt(r+1);if(""!=i&&Number(i)==i){for(e.id="";++r;){var o=t.charAt(r);if(null==o||Number(o)!=o){--r;break}if(e.id+=t.charAt(r),r+1==t.length)break}e.id=Number(e.id)}if(t.charAt(++r))try{e.data=f.parse(t.substr(r))}catch(s){return u()}return p("decoded %s as %j",t,e),e}function c(t){this.reconPack=t,this.buffers=[]}function u(){return{type:n.ERROR,data:"parser error"}}var p=t("debug")("socket.io-parser"),f=t("json3"),h=(t("isarray"),t("component-emitter")),l=t("./binary"),d=t("./is-buffer");n.protocol=4,n.types=["CONNECT","DISCONNECT","EVENT","BINARY_EVENT","ACK","BINARY_ACK","ERROR"],n.CONNECT=0,n.DISCONNECT=1,n.EVENT=2,n.ACK=3,n.ERROR=4,n.BINARY_EVENT=5,n.BINARY_ACK=6,n.Encoder=r,n.Decoder=s,r.prototype.encode=function(t,e){if(p("encoding packet %j",t),n.BINARY_EVENT==t.type||n.BINARY_ACK==t.type)i(t,e);else{var r=o(t);e([r])}},h(s.prototype),s.prototype.add=function(t){var e;if("string"==typeof t)e=a(t),n.BINARY_EVENT==e.type||n.BINARY_ACK==e.type?(this.reconstructor=new c(e),0==this.reconstructor.reconPack.attachments&&this.emit("decoded",e)):this.emit("decoded",e);else{if(!d(t)&&!t.base64)throw new Error("Unknown type: "+t);if(!this.reconstructor)throw new Error("got binary data when not reconstructing a packet");e=this.reconstructor.takeBinaryData(t),e&&(this.reconstructor=null,this.emit("decoded",e))}},s.prototype.destroy=function(){this.reconstructor&&this.reconstructor.finishedReconstruction()},c.prototype.takeBinaryData=function(t){if(this.buffers.push(t),this.buffers.length==this.reconPack.attachments){var e=l.reconstructPacket(this.reconPack,this.buffers);return this.finishedReconstruction(),e}return null},c.prototype.finishedReconstruction=function(){this.reconPack=null,this.buffers=[]}},{"./binary":42,"./is-buffer":44,"component-emitter":8,debug:9,isarray:45,json3:46}],44:[function(t,e){(function(t){function n(e){return t.Buffer&&t.Buffer.isBuffer(e)||t.ArrayBuffer&&e instanceof ArrayBuffer}e.exports=n}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],45:[function(t,e){e.exports=t(36)},{}],46:[function(e,n,r){!function(e){function n(t){if(n[t]!==s)return n[t];var e;if("bug-string-char-index"==t)e="a"!="a"[0];else if("json"==t)e=n("json-stringify")&&n("json-parse");else{var r,o='{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';if("json-stringify"==t){var i=p.stringify,c="function"==typeof i&&f;if(c){(r=function(){return 1}).toJSON=r;try{c="0"===i(0)&&"0"===i(new Number)&&'""'==i(new String)&&i(a)===s&&i(s)===s&&i()===s&&"1"===i(r)&&"[1]"==i([r])&&"[null]"==i([s])&&"null"==i(null)&&"[null,null,null]"==i([s,a,null])&&i({a:[r,!0,!1,null,"\x00\b\n\f\r "]})==o&&"1"===i(null,r)&&"[\n 1,\n 2\n]"==i([1,2],null,1)&&'"-271821-04-20T00:00:00.000Z"'==i(new Date(-864e13))&&'"+275760-09-13T00:00:00.000Z"'==i(new Date(864e13))&&'"-000001-01-01T00:00:00.000Z"'==i(new Date(-621987552e5))&&'"1969-12-31T23:59:59.999Z"'==i(new Date(-1))}catch(u){c=!1}}e=c}if("json-parse"==t){var h=p.parse;if("function"==typeof h)try{if(0===h("0")&&!h(!1)){r=h(o);var l=5==r.a.length&&1===r.a[0];if(l){try{l=!h('" "')}catch(u){}if(l)try{l=1!==h("01")}catch(u){}if(l)try{l=1!==h("1.")}catch(u){}}}}catch(u){l=!1}e=l}}return n[t]=!!e}var o,i,s,a={}.toString,c="function"==typeof t&&t.amd,u="object"==typeof JSON&&JSON,p="object"==typeof r&&r&&!r.nodeType&&r;p&&u?(p.stringify=u.stringify,p.parse=u.parse):p=e.JSON=u||{};var f=new Date(-0xc782b5b800cec);try{f=-109252==f.getUTCFullYear()&&0===f.getUTCMonth()&&1===f.getUTCDate()&&10==f.getUTCHours()&&37==f.getUTCMinutes()&&6==f.getUTCSeconds()&&708==f.getUTCMilliseconds()}catch(h){}if(!n("json")){var l="[object Function]",d="[object Date]",y="[object Number]",g="[object String]",m="[object Array]",v="[object Boolean]",b=n("bug-string-char-index");if(!f)var w=Math.floor,k=[0,31,59,90,120,151,181,212,243,273,304,334],A=function(t,e){return k[e]+365*(t-1970)+w((t-1969+(e=+(e>1)))/4)-w((t-1901+e)/100)+w((t-1601+e)/400)};(o={}.hasOwnProperty)||(o=function(t){var e,n={};return(n.__proto__=null,n.__proto__={toString:1},n).toString!=a?o=function(t){var e=this.__proto__,n=t in(this.__proto__=null,this);return this.__proto__=e,n}:(e=n.constructor,o=function(t){var n=(this.constructor||e).prototype;return t in this&&!(t in n&&this[t]===n[t])}),n=null,o.call(this,t)});var x={"boolean":1,number:1,string:1,undefined:1},B=function(t,e){var n=typeof t[e];return"object"==n?!!t[e]:!x[n]};if(i=function(t,e){var n,r,s,c=0;(n=function(){this.valueOf=0}).prototype.valueOf=0,r=new n;for(s in r)o.call(r,s)&&c++;return n=r=null,c?i=2==c?function(t,e){var n,r={},i=a.call(t)==l;for(n in t)i&&"prototype"==n||o.call(r,n)||!(r[n]=1)||!o.call(t,n)||e(n)}:function(t,e){var n,r,i=a.call(t)==l;for(n in t)i&&"prototype"==n||!o.call(t,n)||(r="constructor"===n)||e(n);(r||o.call(t,n="constructor"))&&e(n)}:(r=["valueOf","toString","toLocaleString","propertyIsEnumerable","isPrototypeOf","hasOwnProperty","constructor"],i=function(t,e){var n,i,s=a.call(t)==l,c=!s&&"function"!=typeof t.constructor&&B(t,"hasOwnProperty")?t.hasOwnProperty:o;for(n in t)s&&"prototype"==n||!c.call(t,n)||e(n);for(i=r.length;n=r[--i];c.call(t,n)&&e(n));}),i(t,e)},!n("json-stringify")){var C={92:"\\\\",34:'\\"',8:"\\b",12:"\\f",10:"\\n",13:"\\r",9:"\\t"},S="000000",E=function(t,e){return(S+(e||0)).slice(-t)},T="\\u00",_=function(t){var e,n='"',r=0,o=t.length,i=o>10&&b;for(i&&(e=t.split(""));o>r;r++){var s=t.charCodeAt(r);switch(s){case 8:case 9:case 10:case 12:case 13:case 34:case 92:n+=C[s];break;default:if(32>s){n+=T+E(2,s.toString(16));break}n+=i?e[r]:b?t.charAt(r):t[r]}}return n+'"'},R=function(t,e,n,r,c,u,p){var f,h,l,b,k,x,B,C,S,T,P,N,O,j,q,D;try{f=e[t]}catch(I){}if("object"==typeof f&&f)if(h=a.call(f),h!=d||o.call(f,"toJSON"))"function"==typeof f.toJSON&&(h!=y&&h!=g&&h!=m||o.call(f,"toJSON"))&&(f=f.toJSON(t));else if(f>-1/0&&1/0>f){if(A){for(k=w(f/864e5),l=w(k/365.2425)+1970-1;A(l+1,0)<=k;l++);for(b=w((k-A(l,0))/30.42);A(l,b+1)<=k;b++);k=1+k-A(l,b),x=(f%864e5+864e5)%864e5,B=w(x/36e5)%24,C=w(x/6e4)%60,S=w(x/1e3)%60,T=x%1e3}else l=f.getUTCFullYear(),b=f.getUTCMonth(),k=f.getUTCDate(),B=f.getUTCHours(),C=f.getUTCMinutes(),S=f.getUTCSeconds(),T=f.getUTCMilliseconds();f=(0>=l||l>=1e4?(0>l?"-":"+")+E(6,0>l?-l:l):E(4,l))+"-"+E(2,b+1)+"-"+E(2,k)+"T"+E(2,B)+":"+E(2,C)+":"+E(2,S)+"."+E(3,T)+"Z"}else f=null;if(n&&(f=n.call(e,t,f)),null===f)return"null";if(h=a.call(f),h==v)return""+f;if(h==y)return f>-1/0&&1/0>f?""+f:"null";if(h==g)return _(""+f);if("object"==typeof f){for(j=p.length;j--;)if(p[j]===f)throw TypeError();if(p.push(f),P=[],q=u,u+=c,h==m){for(O=0,j=f.length;j>O;O++)N=R(O,f,n,r,c,u,p),P.push(N===s?"null":N);D=P.length?c?"[\n"+u+P.join(",\n"+u)+"\n"+q+"]":"["+P.join(",")+"]":"[]"}else i(r||f,function(t){var e=R(t,f,n,r,c,u,p);e!==s&&P.push(_(t)+":"+(c?" ":"")+e)}),D=P.length?c?"{\n"+u+P.join(",\n"+u)+"\n"+q+"}":"{"+P.join(",")+"}":"{}";return p.pop(),D}};p.stringify=function(t,e,n){var r,o,i,s;if("function"==typeof e||"object"==typeof e&&e)if((s=a.call(e))==l)o=e;else if(s==m){i={};for(var c,u=0,p=e.length;p>u;c=e[u++],s=a.call(c),(s==g||s==y)&&(i[c]=1));}if(n)if((s=a.call(n))==y){if((n-=n%1)>0)for(r="",n>10&&(n=10);r.length<n;r+=" ");}else s==g&&(r=n.length<=10?n:n.slice(0,10));return R("",(c={},c[""]=t,c),o,i,r,"",[])}}if(!n("json-parse")){var P,N,O=String.fromCharCode,j={92:"\\",34:'"',47:"/",98:"\b",116:" ",110:"\n",102:"\f",114:"\r"},q=function(){throw P=N=null,SyntaxError()},D=function(){for(var t,e,n,r,o,i=N,s=i.length;s>P;)switch(o=i.charCodeAt(P)){case 9:case 10:case 13:case 32:P++;break;case 123:case 125:case 91:case 93:case 58:case 44:return t=b?i.charAt(P):i[P],P++,t;case 34:for(t="@",P++;s>P;)if(o=i.charCodeAt(P),32>o)q();else if(92==o)switch(o=i.charCodeAt(++P)){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:t+=j[o],P++;break;case 117:for(e=++P,n=P+4;n>P;P++)o=i.charCodeAt(P),o>=48&&57>=o||o>=97&&102>=o||o>=65&&70>=o||q();t+=O("0x"+i.slice(e,P));break;default:q()}else{if(34==o)break;for(o=i.charCodeAt(P),e=P;o>=32&&92!=o&&34!=o;)o=i.charCodeAt(++P);t+=i.slice(e,P)}if(34==i.charCodeAt(P))return P++,t;q();default:if(e=P,45==o&&(r=!0,o=i.charCodeAt(++P)),o>=48&&57>=o){for(48==o&&(o=i.charCodeAt(P+1),o>=48&&57>=o)&&q(),r=!1;s>P&&(o=i.charCodeAt(P),o>=48&&57>=o);P++);if(46==i.charCodeAt(P)){for(n=++P;s>n&&(o=i.charCodeAt(n),o>=48&&57>=o);n++);n==P&&q(),P=n}if(o=i.charCodeAt(P),101==o||69==o){for(o=i.charCodeAt(++P),(43==o||45==o)&&P++,n=P;s>n&&(o=i.charCodeAt(n),o>=48&&57>=o);n++);n==P&&q(),P=n}return+i.slice(e,P)}if(r&&q(),"true"==i.slice(P,P+4))return P+=4,!0;if("false"==i.slice(P,P+5))return P+=5,!1;if("null"==i.slice(P,P+4))return P+=4,null;q()}return"$"},I=function(t){var e,n;if("$"==t&&q(),"string"==typeof t){if("@"==(b?t.charAt(0):t[0]))return t.slice(1);if("["==t){for(e=[];t=D(),"]"!=t;n||(n=!0))n&&(","==t?(t=D(),"]"==t&&q()):q()),","==t&&q(),e.push(I(t));return e}if("{"==t){for(e={};t=D(),"}"!=t;n||(n=!0))n&&(","==t?(t=D(),"}"==t&&q()):q()),(","==t||"string"!=typeof t||"@"!=(b?t.charAt(0):t[0])||":"!=D())&&q(),e[t.slice(1)]=I(D());return e}q()}return t},U=function(t,e,n){var r=L(t,e,n);r===s?delete t[e]:t[e]=r},L=function(t,e,n){var r,o=t[e];if("object"==typeof o&&o)if(a.call(o)==m)for(r=o.length;r--;)U(o,r,n);else i(o,function(t){U(o,t,n)});return n.call(t,e,o)};p.parse=function(t,e){var n,r;return P=0,N=""+t,n=I(D()),"$"!=D()&&q(),P=N=null,e&&a.call(e)==l?L((r={},r[""]=n,r),"",e):n}}}c&&t(function(){return p})}(this)},{}],47:[function(t,e){function n(t,e){var n=[];e=e||0;for(var r=e||0;r<t.length;r++)n[r-e]=t[r];return n}e.exports=n},{}]},{},[1])(1)});



