
$(function () {
  "use strict";
  $('#newsite').click(function(){

    $('#myModal').modal('show');
  });

  $('#addNewSite').click(function(){
    $.ajax({
      url : "/site",
      type: "POST",
      data : {'site_name':$('#site_name').val(),'site_url':$('#site_url').val()},
      success: function(data, textStatus, jqXHR)
      {
        console.log(data);

        if(data.result){
          toastr.success("Save Success");
          getSiteList();
        }else{
          toastr.error("Save Failure");
        }


        //data - response from server
      },
      error: function (jqXHR, textStatus, errorThrown)
      {

      }
    });
  });


  function getSiteList(){
    $.ajax({
      url : "/sitelist",
      type: "GET",
      data : {},
      success: function(data, textStatus, jqXHR)
      {
        console.log(data);
        var markup = "<tr><td>${site_name}</td><td>${site_url}</td><td>${site_code}</td><td>${date}</td></tr>";

        /* Compile the markup as a named template */
        $.template( "siteTemplate", markup );

        /* Render the template with the movies data and insert
         the rendered HTML under the "movieList" element */
        $.tmpl( "siteTemplate", data )
        .html( "#siteTableBody" );

      },
      error: function (jqXHR, textStatus, errorThrown)
      {

      }
    });
  }


  $("#message").keydown(function (key) {
    if (key.keyCode == 13) {
      sendMessage();
    }
  });

  $('#send').click(function(){
    sendMessage();
  });

  function sendMessage() {

    var data = {message:$("#message").val()};
    var markup = '<div class="direct-chat-msg right">'
    +'   <div class="direct-chat-info pull-right clearfix">'
    +'     <span class="direct-chat-name pull-right"></span>'
    +'     <span class="direct-chat-timestamp pull-left">'+currentTime()+'</span>'
    +'   </div><br/>'
    +'   <div class="direct-chat-text">${message}</div>'
    +'</div>';

    /* Compile the markup as a named template */
    $.template( "sendTemplate", markup );

    $.tmpl( "sendTemplate", data ).appendTo( "#chatArea" );

    receiveMessage(data);
    message:$("#message").val("");
    chatScroll();
  }
  function currentTime(){
    var d = new Date;
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var dd = d.getDate();
    var m = monthNames[d.getMonth()];
    var time = d.toLocaleTimeString().replace(/:\d+ /, ' ');

    return dd+" "+m+" "+time;

  };


  function receiveMessage(data){


    var markup = '<div class="direct-chat-msg">'
              +'   <div class="direct-chat-info pull-left clearfix">'
              +'     <span class="direct-chat-name pull-left">${userid}</span>'
              +'     <span class="direct-chat-timestamp pull-right">'+currentTime()+'</span>'
              +'   </div><br/>'
              +'   <div class="direct-chat-text">${message}</div>'
              +'</div>';

    /* Compile the markup as a named template */
    $.template( "receiveTemplate", markup );

    /* Render the template with the movies data and insert
     the rendered HTML under the "movieList" element */
    $.tmpl( "receiveTemplate", data ).appendTo( "#chatArea" );

    chatScroll();
  };

  function chatScroll(){
    $("#chatArea").scrollTop($("#chatArea")[0].scrollHeight);
  }

}(jQuery));
