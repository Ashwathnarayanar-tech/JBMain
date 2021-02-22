require([    
  "modules/jquery-mozu", "underscore", "modules/api", 'modules/minicart',
  'modules/cart-monitor',
  "hyprlive", 'hyprlivecontext', "modules/backbone-mozu", "modules/models-product",
  'shim!vendor/jquery-colorbox/jquery.colorbox[jquery=jQuery]' 
], function($, _, api, MiniCart, CartMonitor, Hypr, HyprLiveContext, Backbone, ProductModels, NewsLetter) {

  //Add to wishlist 
  $(document).on('click', function() {
    window.wl_re = false;
  });

  $(document).on('click', '.close-icon', function() {
    $('.atw-modal').hide();
    if ($('[data-mz-productPage]').length > 0) {
      $('[data-mz-productPage][data-mz-prdcode="' + window.productCode + '"]').filter(':visible').focus();
    } else {
      $('.add-to-wishlist[data-mz-prdcode="' + window.productCode + '"]').filter(':visible').focus();
    }
  });

  // wishlist functionality
  $(document).on('click', '[data-mz-productlist] .add-to-wishlist , [data-mz-productPage]', function(e) {
    e.preventDefault();
    var productCode = $(this).data('mz-prdcode');
    //console.log(productCode);
    window.productCode = productCode;
    var me = $(this);
    addToWishList.addWishlistOnAuth(productCode, me);
  });

  var wl_re = window.wl_re = true;
  var addToWishList = {
    logKey: function() {
      var value = $.trim($("#email").val());
      var passvalue = $.trim($("#password").val());
      if (value.length > 0 && passvalue.length > 0) {
        $('#addbutton').addClass('active-button').removeAttr('disabled');
      }

    },
    loginCheckout: function(e) {
      e.preventDefault();
      var self = this;
      var valid = this.validData();
      if (valid) {
        api.action('customer', 'loginStorefront', {
          email: $('.user-email').val(),
          password: $('.user-password').val()
        }).then(self.loginProcess, self.LoginErrorMessage);
      }
    },
    LoginErrorMessage: function() {
      $('.loginError').text(Hypr.getLabel('loginFailedMessage', $("#email").val()));
      $('.loginError').prev('input').focus();
    },
    validData: function() {
      var validity = true;
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var patt = new RegExp(re);
      if ($('.user-email').val().length === 0) {
        $('.user-email').css({
          'border': '1px solid #e9000f'
        });
        $('.error-user').text(Hypr.getThemeSetting('validEmialSignUp'));
        $('.error-user').prev('input').focus();
        validity = false;
      } else if (patt.test($('.user-email').val())) {
        $('.user-email').css({
          'border': '1px solid #c2c2c2'
        });
        $('.error-user').text('');
      } else {
        $('.user-email').css({
          'border': '1px solid #e9000f'
        });
        $('.error-user').text(Hypr.getThemeSetting('validEmialSignUp'));
        $('.error-user').prev('input').focus();
        validity = false;
      }
      if ($('.user-password').val().length === 0) {
        $('.user-password').css({
          'border': '1px solid #e9000f'
        });
        validity = false;
      } else {
        $('.user-password').css({
          'border': '1px solid #c2c2c2'
        });
      }
      return validity;
    },
    activateloopinginmodal: function() {
      window.inputs = $(document).find('#email-dialog').find('select, input, textarea, button, a, .labelmodel').filter(':visible');
      window.firstInput = window.inputs.first();
      window.lastInput = window.inputs.last();

      // if current element is last, get focus to first element on tab press.
      window.lastInput.on('keydown', function(e) {
        if ((e.which === 9 && !e.shiftKey)) {
          e.preventDefault();
          window.firstInput.focus();
        }
      });

      // if current element is first, get focus to last element on tab+shift press.
      window.firstInput.on('keydown', function(e) {
        if ((e.which === 9 && e.shiftKey)) {
          e.preventDefault();
          window.lastInput.focus();
        }
      });
    },
    addWishlistOnAuth: function(productCode, me) { 
      var user = require.mozuData('user');
      if (!user.isAnonymous) {
         $('.jb-inner-overlay').show();
         var getGiftcardPrice = me.closest(".mz-productlist-item").find("select").val();
         if(getGiftcardPrice !== "Select Gift Card Amount" && getGiftcardPrice !== '') {
            getGiftcardPrice = parseInt(getGiftcardPrice);  
            api.request('get', '/api/commerce/catalog/storefront/products/' + productCode).then(function(res) {
            var getattributeValueId;
            var getselectedValuefromresponse = _.map(res.options[0].values, function(num, key){ 
                if(num.value == getGiftcardPrice) {
                  res.options[0].values[key].isSelected = true;
                  getattributeValueId = num.attributeValueId;
                }
            });
            var getattributeValuesequence;
            var getselectedValuesequence = _.map(res.variations, function(num, key){ 
                _.map(num.options, function(getid, key){
                    if(getid.valueSequence == getattributeValueId) {
                        getattributeValuesequence = num.productCode;
                    }
                    
                });
            });
            res.variationProductCode = getattributeValuesequence; 
            var model = new ProductModels.Product(res);
            model.addToWishlist();
            model.on('addedtowishlist', function(cartitem) {
             $('.jb-inner-overlay').hide();
              me.prop('disabled', 'disabled').text(Hypr.getLabel('addedToWishlist'));
              me.removeClass('add-to-wishlist');
              me.addClass('added-to-wishlist');
            });

            me.addClass('added-to-wishlist');
            me.removeClass('add-to-wishlist');
            me.css('cursor','not-allowed');
            
            model.on("error", function(err) { 
               $('.jb-inner-overlay').hide(); 
              //console.error(err);
            });
          });
         } else {
            $('.jb-inner-overlay').hide(); 
            $('[data-mz-message-bar]').empty();
            var emsg = '<div class="mz-messagebar" data-mz-message-bar="">'+
                        '<ul class="is-showing mz-errors" tabindex="-1" id="mz-errors-list"><li>Please choose the Gift Card amount before adding it to your wishlist. <br> Thanks for choosing to give a Jelly Belly Gift Card!</li>'+
                        '</ul></div>';
            $('[data-mz-message-bar]').append(emsg);
            $('[data-mz-message-bar]').fadeIn();
            $('#mz-errors-list').attr({tabindex:0});
            $('#mz-errors-list').find('li').attr({tabindex:0,role:'contentinfo'});
            $('#mz-errors-list').find('li').focus();
            $('.jb-pagecontrols').animate({scrollTop:$('[data-mz-message-bar]').position().top}, 'slow');
            setTimeout(function(){
                $('[data-mz-message-bar]').hide();
                $('.jb-inner-overlay').remove();
            },6000);
            $('.jb-inner-overlay').remove();
         }
        
      } else {
        document.cookie = 'wl_prod=' + productCode + ';path=/;expires=3';
        $('.atw-modal').show();
        $('#email-dialog').focus();
        this.activateloopinginmodal();
      }
    },
    wishlistRender: function() {
      var uri = window.location.href;
      var uri_parts = uri.split('?'),
        ctx;
      if (uri_parts[1] == 'wl=pop' && window.wl_re) {
        if ($.cookie('wl_prod')) {
          /*$(document).find('.mz-productlist-item [data-mz-prdcode=' + $.cookie("wl_prod") + '].add-to-wishlist').not('.quickview').click();*/
          if ($('[data-mz-productPage]').length > 0) {
            ctx = $(document).find('[data-mz-productPage][data-mz-prdcode=' + $.cookie("wl_prod") + ']');
          } else {
            ctx = $(document).find('.mz-productlist-item [data-mz-prdcode=' + $.cookie("wl_prod") + '].add-to-wishlist');
          }
          this.addWishlistOnAuth($.cookie('wl_prod'), ctx);
          $.removeCookie('wl_prod', {
            path: '/'
          });
        } else {
          return false;
        }
      }
    },
    loginProcess: function() {
      /* wishlistRender();
       $('.atw-modal').hide();*/
      window.location.href = window.location.pathname + "?wl=pop";
    }
  };

  $('.login_submit').find('#email').on('keyup', function() {
    addToWishList.logKey();
  });

  $('.login_submit').on('submit', function(e) {
    addToWishList.loginCheckout(e);
  });

  addToWishList.wishlistRender();
  var inputs = window.inputs;
  var firstInput = window.firstInput;
  var lastInput = window.lastInput;
  addToWishList.activateloopinginmodal();

  // close add to wishlist login with escape key
  $(document).keyup(function(e) {
    if (e.keyCode === 27)
      $('.atw-modal .close-img').click();
  });

});