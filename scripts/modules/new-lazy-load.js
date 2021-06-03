define('modules/new-lazy-load', ["modules/jquery-mozu", "underscore"], function($, _) {
  var loadImages = _.once(function() {
    var images = document.getElementsByClassName("new-lazy-load");
    lazyLoad(images);
  });

  try {
    console.log(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
    if ((window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0) > 2) {
      loadImages();
    }
  } catch (e) {
    console.log(e);
  }

  var megaMenu = document.getElementById("megaMenu");
  if(megaMenu){
    megaMenu.addEventListener("mouseover", loadImages);
    megaMenu.addEventListener("touchstart", loadImages);
    megaMenu.addEventListener("keyup", loadImages);
    window.addEventListener("scroll", loadImages);
  }
  $("#megaMenuMob .head-list-item.view-products").on("click",function(){
    loadImages();
  });
  
  function lazyLoad(llClassName) {
    for (var i = 0; i < llClassName.length; i++) {
      if (llClassName[i].getAttribute('data-src')) {
        llClassName[i].setAttribute('src', llClassName[i].getAttribute('data-src'));
      }
    }
  }

});
