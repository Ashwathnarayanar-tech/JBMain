define(["modules/jquery-mozu"], function($) {
  var navBar = $("#header-hgg-nav").offset().top;

  // Adds nav bar to top of page after scroll
  $(window).scroll(function() {
    var currentScroll = $(window).scrollTop();

    if (currentScroll > navBar) {
      $('#header-hgg-nav').css({
        position: 'fixed',
        top: '0',
        left: 'calc(50% - 0px)',
        transform: 'translateX(-50%)',
        height: '80px'
      });

      $(".hgg-nav-item h1 img").css("max-width", "83px");

      $('.hgg-hero-img').css("margin", "80px 0 0 0");
    } else if (currentScroll == navBar) {
      if (window.innerWidth <= 800) {
        $('#header-hgg-nav').css({
          left: '0%',
          position: 'static',
          transform: 'translateX(0%)',
          height: '80px'
        });

        $(".hgg-nav-item h1 img").css("max-width", "83px");

        $('.hgg-hero-img').css("margin", "0 0 0 0");
      } else {
        $('#header-hgg-nav').css({
          left: '0%',
          position: 'static',
          transform: 'translateX(0%)',
          height: '130px'
        });

        $(".hgg-nav-item h1 img").css("max-width", "113px");

        $('.hgg-hero-img').css("margin", "0 0 0 0");
      }
    }
  });

  // CATEGORY FUNCTIONS AND LISTENERS
  function productItemClickHandler(el) {
    var product = el.target.closest('.product-item');
    if (product !== null && product.className.indexOf('active') > -1) {
      return false;
    } else if (product !== null) {
      product.className += ' active';
    }
  }

  function closeElementHandler(el) {
    var product = el.className && el.className.indexOf('product-item') > -1 ? el : el.target.closest('.product-item');
    var prodImgWrapper = product !== null ? product.querySelector('.product-img-wrapper') : null;
    var closeSpan;

    if (product === null) {
      return;
    } else if (product.className.indexOf('active') > -1 && !prodImgWrapper.querySelector('.close-product')) {
      closeSpan = document.createElement('SPAN');
      closeSpan.textContent = '[X] Close';
      closeSpan.classList.add('close-product');
      // closeSpan.addEventListener('click', closeElementHandler);
      prodImgWrapper.appendChild(closeSpan);
    } else {
      closeSpan = prodImgWrapper.querySelector('.close-product');
      prodImgWrapper.removeChild(closeSpan);
    }
  }

  function removeActiveProductItem() {
    $('.product-item').each(function(idx, el){
      if (el.className.indexOf('active') > -1) {
        setTimeout(function(){
          if (el.querySelector('.close-product')) {
            closeElementHandler(el);
          }

          el.classList.remove('active');
        }, 50);
      }
    });
  }

  $('.product-item').on('click', function(e) {
    if (window.innerWidth > 800) {
      if (!$(e.target).closest('.product-item').length) {
        removeActiveProductItem();
      } else if (($(e.target)[0] === $(e.target).closest('.product-item-pos-fix')[0] || $(e.target)[0] === $(e.target).closest('.product-img-wrapper img')[0] || $(e.target)[0] === $(e.target).closest('.product-flavors-wrapper')[0]) && $(e.target).closest('.product-item').hasClass('active')) {
        setTimeout(function(){
          $(e.target).closest('.product-item').removeClass('active');
        }, 50);
      } else {
        productItemClickHandler(e);
      }

      if ($(e.target).hasClass('product-item-full-screen-wrapper')) {
        $('.product-item-full-screen-wrapper').removeClass('active');

        $('body').css({
          height: '100%',
          overflowY: 'visible'
        });
      }
    } else if (window.innerWidth <= 800) {
      if ($(e.target).hasClass('close-product') && $(e.target).closest('.product-item').hasClass('active')) {
        $(e.target).closest('.product-item').removeClass('active');
        closeElementHandler(e);
        $('body').css({
          height: '100%',
          overflowY: 'visible'
        });
      } else if (($(e.target) != $('.product-plus-icon') || $(e.target).context != $(e.target).closest('path').context || $(e.target).context != $(e.target).closest('svg#prefix__Layer_1').context) && !$(e.target).closest('.product-item').hasClass('active')) {
        productItemClickHandler(e);
        closeElementHandler(e);

        $('body').css({
          height: '100vh',
          overflowY: 'hidden'
        });
      } else if ($(e.target).closest('.product-item').hasClass('active') && $(e.target).context == $(e.target).closest('.product-item').context && $(e.target).context != $(e.target).closest('.close-product')) {
        return false;
      } else {
        $('body').css({
          height: '100%',
          overflowY: 'visible'
        });
      }
    }
  });

  $('.product-close-icon').on('click', function() {
    $('body').css({
      height: '100%',
      overflowY: 'visible'
    });

    $('.product-item-full-screen-wrapper').removeClass('active');
  });

  $(document).ready(function(){
    if (window.innerWidth <= 800) {
      $('.product-plus-icon').addClass('.mobile-close-prod');
    } else {
      $('.product-plus-icon').removeClass('.mobile-close-prod');
    }
  });

  window.onresize = function() {
    $('.product-item-full-screen-wrapper').removeClass('active');
    removeActiveProductItem();

    $('body').css({
      height: '100%',
      overflowY: 'visible'
    });

    if (window.innerWidth <= 800) {
      $('.product-plus-icon').addClass('.mobile-close-prod');
    } else {
      $('.product-plus-icon').removeClass('.mobile-close-prod');
    }
  };
});
