define('modules/new-lazy-load', ["modules/jquery-mozu", "underscore"], function($, _) {
  var loadImages = _.once(function() {
    var images = document.getElementsByClassName("new-lazy-load");
    lazyLoad(images);
  });

  try {
    if (window.pageYOffset > 2) {
      loadImages();
    }
  } catch (e) {
    console.log(e);
  }

  var megaMenu = document.getElementById("megaMenu");
  megaMenu.addEventListener("mouseover", loadImages);
  megaMenu.addEventListener("touchstart", loadImages);
  megaMenu.addEventListener("keyup", loadImages);
  window.addEventListener("scroll", loadImages);

  function lazyLoad(llClassName) {
    for (var i = 0; i < llClassName.length; i++) {
      if (llClassName[i].getAttribute('data-src')) {
        llClassName[i].setAttribute('src', llClassName[i].getAttribute('data-src'));
      }
    }
  }

});