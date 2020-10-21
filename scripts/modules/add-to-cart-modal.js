define([
  "modules/jquery-mozu",
], function($) {
  // close modal if escape key is pressed
  $(document).keyup(function(e) {
    if (e.keyCode === 27)
      $('.Add-to-cart-popup .cross-close-popup').click();
  });
});
