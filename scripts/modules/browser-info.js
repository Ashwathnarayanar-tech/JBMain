require([
  "modules/jquery-mozu"
], function($) {

  $(document).ready(function() {

    function osDetect(event) {
      var OSName = "Unknown";
      var $userAgent = '';
      if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1)
        OSName = "Windows 10";
      if (window.navigator.userAgent.indexOf("Windows NT 6.3") != -1)
        OSName = "Windows 8.1";
      if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1)
        OSName = "Windows 8";
      if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1)
        OSName = "Windows 7";
      if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1)
        OSName = "Windows Vista";
      if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1)
        OSName = "Windows XP";
      if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1)
        OSName = "Windows 2000";
      if (window.navigator.userAgent.indexOf("Mac") != -1)
        OSName = "Mac/iOS";
      if (window.navigator.userAgent.indexOf("X11") != -1)
        OSName = "UNIX";
      if (window.navigator.userAgent.indexOf("Linux") != -1)
        OSName = "Linux";

      //alert('Your OS is: ' + OSName);
      //To detect Browser and Version //
      var nVer = window.navigator.appVersion;
      var nAgt = window.navigator.userAgent;
      var browserName = window.navigator.appName;
      var fullVersion = '' + parseFloat(window.navigator.appVersion);
      var majorVersion = parseInt(window.navigator.appVersion, 10);
      var nameOffset,
        verOffset,
        ix;

      // In Opera 15+, the true version is after "OPR/"
      if ((verOffset = nAgt.indexOf("OPR/")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 4);
      }
      // In older Opera, the true version is after "Opera" or after "Version"
      else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
          fullVersion = nAgt.substring(verOffset + 8);
      }
      // In MSIE, the true version is after "MSIE" in userAgent
      // else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
      //   alert("asd");
      // browserName = "Microsoft Internet Explorer";
      // fullVersion = nAgt.match(/Trident\/7.0; rv 11.0/);
      // }
      // In Chrome, the true version is after "Chrome"
      else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset + 7);
      }
      // In Safari, the true version is after "Safari" or after "Version"
      else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
          fullVersion = nAgt.substring(verOffset + 8);
      }
      // In Firefox, the true version is after "Firefox"
      else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
      }

      var a = window.navigator.appVersion;
      var b = a.split(' ');
      if (b[b.length - 1] == "Edge/12.10240") {
        var c = b[b.length - 1].split('/');
        browserName = c[0];
        fullVersion = c[1];

      }
      if (browserName != "Firefox") {
        if ((/MSIE/i).test(window.navigator.userAgent) === true || (/rv/i).test(window.navigator.userAgent) === true) {
          var keep = window.navigator.appVersion;

          var x = keep.split(';');
          var y = x[10].split(")");
          var z = y[0].split(":");
          fullVersion = z[1];

          $userAgent = 'Internet Explorer';
        } // alert( $userAgent)
      }

      // trim the fullVersion string at semicolon/space if present
      if ((ix = fullVersion.indexOf(";")) != -1)
        fullVersion = fullVersion.substring(0, ix);
      if ((ix = fullVersion.indexOf(" ")) != -1)
        fullVersion = fullVersion.substring(0, ix);
      majorVersion = parseInt('' + fullVersion, 10);
      if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(window.navigator.appVersion);
        majorVersion = parseInt(window.navigator.appVersion, 10);
      }

      //$(".jb-userdetails").show();
      $('#osview').append('<dt class="detail-title">OS is:</dt><dd class="detail-data"> ' + OSName + '</dd>');
      if ($userAgent === 'Internet Explorer') {
        $('#osview2').append('<dt class="detail-title">Browser name:</dt><dd class="detail-data"> ' + $userAgent + ' Version ' + fullVersion + '</dd><br>');
      } else {
        $('#osview2').append('<dt class="detail-title">Browser name:</dt><dd class="detail-data"> ' + browserName + ' Version ' + fullVersion + '</dd><br>');
      }
      $(this).off(event);
    }

    //To detect OS //
    $(".jb-center-logo-img").on("click", osDetect);
    $(".jb-center-logo-img").keypress(function(e){
      if (e.which == 13) {
        $(".jb-center-logo-img").click();
      }
    });
    //$.getJSON("//jsonip.com/?callback=?", function (data) {
    // alert("Your ip: " + data.ip);
    // $('#osview3').append('IP Address: ' + data.ip);
    //});
    $('#osview3').append('<dt class="detail-title">IP Address:</dt><dd class="detail-data">TEMPORARILY UNAVAILABLE</dd>');
    //     $(".img-overlay").css('display','none');
  });
});