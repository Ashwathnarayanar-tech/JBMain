define([
  "modules/jquery-mozu"
], function($) {

  $(document).ready(function() {
    if ($.cookie('browse_us_site') == 'true') {
      console.log("user has cookie. redirect to root.");
      location.href = '/';
    } else {
      console.log("user doesn't have cookie. set cookie and redirect to root.");
      $.cookie('browse_us_site', 'true', {
        expires: 30,
        path: '/'
      });
      location.href = '/';
    }
  });
});