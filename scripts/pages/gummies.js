define(["modules/jquery-mozu"], function ($) {
  var candies = document.querySelectorAll('.bc-assort-list-item .sm-candy');
  var navBar = $("#header-gummies-nav").offset().top;

  // Adds nav bar to top of page after scroll
  $(window).scroll(function() {
    var currentScroll = $(window).scrollTop();

    if (currentScroll > navBar) {
      $('#header-gummies-nav').css({
        position: 'fixed',
        top: '0',
        left: 'calc(50% - 0px)',
        transform: 'translateX(-50%)',
        height: '80px'
      });

      $(".gummies-nav-item a .jb-logo img").css("max-width", "83px");

      $('.hgg-hero-img').css("margin", "80px 0 0 0");
    } else if (currentScroll == navBar) {
      if (window.innerWidth <= 800) {
        $('#header-gummies-nav').css({
          left: '0%',
          position: 'static',
          transform: 'translateX(0%)',
          height: '80px'
        });

        $(".gummies-nav-item a .jb-logo img").css("max-width", "83px");

        $('.hgg-hero-img').css("margin", "0 0 0 0");
      } else {
        $('#header-gummies-nav').css({
          left: '0%',
          position: 'static',
          transform: 'translateX(0%)',
          height: '130px'
        });

        $(".gummies-nav-item a .jb-logo img").css("max-width", "113px");

        $('#hero-wrapper').css("margin", "0 0 0 0");
      }
    }
  });

  function showBigCandy(e) {
    var candyNum = e.target.classList[1].split('-')[e.target.classList[1].split('-').length - 1];
    var bigCandy = document.querySelector('.big-candy-' + candyNum);
    var allBigCandy = document.querySelectorAll('.big-candy');

    if (!bigCandy.classList.contains('hidden')) {
      return;
    } else {
      for (var curBigCandy of allBigCandy) { // jshint ignore:line
        curBigCandy.style.opacity = 0;
        curBigCandy.classList.add('hidden');
      }
      bigCandy.classList.remove('hidden');
      bigCandy.style.opacity = 1;
    }
  }

  for (var candy of candies) { // jshint ignore:line
    candy.addEventListener('mouseover', showBigCandy);
    candy.addEventListener('click', showBigCandy);
  }

  document.onkeydown = function(e) {
    if(e.key === "Enter") {
      document.activeElement.click();
    }
  };

  window.onunload = function() {
    for (var candy of candies) { // jshint ignore:line
      candy.removeEventListener('mouseover', showBigCandy);
      candy.removeEventListener('click', showBigCandy);
    }
  };
});
