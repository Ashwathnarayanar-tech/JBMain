define([
  "modules/jquery-mozu", "underscore",
  "hyprlive" 
], function($, _, Hypr) {
  $(document).ready(function() {
    // Zinrelo stuff		
    var zuser = require.mozuData('user');
    var zPageContext = require.mozuData('pagecontext');

    var order;
    if (require.mozuData('pagecontext').pageType == 'confirmation') {
      order = JSON.parse(document.getElementById('data-mz-preload-order').innerHTML);
      zuser.email = (zuser.email === '' ? order.email : zuser.email);
    }

    window._zrl = window._zrl || [];
    var init_data = {
      'partner_id': Hypr.getThemeSetting('zinreloPartnerID'),
      /*REQUIRED: Zinrelo Partner ID*/
      'email': zuser.email,
      /*REQUIRED: When User is Logged in.For Non-Logged in users, pass an empty string ('')*/
      'name': zuser.firstName + (zuser.firstName === '' && zuser.lastName === '' ? "" : " ") + zuser.lastName,
      /*REQUIRED: When User is Logged in.For Non-Logged in users, pass an empty string ('')*/
      'user_id': zuser.email || '' /*REQUIRED: When User is Logged in.For Non-Logged in users and guest users who DO NOT have an account, pass an empty string ('')*/
    };
    // console.log(init_data);
    window._zrl.push(['init', init_data]);

    var bsw = document.createElement('script');
    bsw.type = 'text/javascript';
    bsw.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.zinrelo.com/js/all.js';
    var t = document.getElementsByTagName('script')[0];
    t.parentNode.insertBefore(bsw, t);

    if (require.mozuData('pagecontext').pageType == 'confirmation') {
      var products = [];
      order = JSON.parse(document.getElementById('data-mz-preload-order').innerHTML);

      _.each(order.items, function(item) {
        /*Iterate over the purchase items and push them in the products array*/
        products.push({
          'product_id': item.product.productCode,
          /* REQUIRED: Unique Product ID*/
          'price': item.product.price.salePrice.toString(),
          /* REQUIRED: Product Price*/
          'quantity': item.quantity.toString(),
          /* REQUIRED: Quantity Bought*/
          'title': item.product.name,
          /* REQUIRED: Title of the product*/
          'url': 'https://www.jellybelly.com/p/' + item.product.productCode,
          /* OPTIONAL: URL of the product page*/
          'img_url': 'https:' + item.product.imageUrl,
          /* OPTIONAL: URL of the product image*/
          'category': 'candy',
          /*OPTIONAL: Internal Product Category*/
          'tags': 'jelly belly item',
          /*OPTIONAL: Internal Product Tags*/
        });
      });
      var order_data = {
        'order_id': order.orderNumber.toString(),
        /*REQUIRED: Internal Order ID */
        'total': order.total.toString(),
        /*REQUIRED: Total order value*/
        'subtotal': order.total.toString(),
        /*REQUIRED: Order value without shipping, taxes etc.*/
        'coupon_code': order.couponCodes[0] || '',
        /*OPTIONAL: Coupon code used*/
        'currency': 'USD',
        /*OPTIONAL: 3 letter currency code for your store.Defaults to USD*/
        'products': products /*OPTIONAL- Array of products bought*/
      };
      console.log(order_data);
      window._zrl.push(['track_order', order_data]);
      //_zrl.push([ 'made_a_purchase' , order_data ] );
    }
    
    window.get_user_info = function() { 
      if (typeof(zrl_mi) == 'undefined') {
        setTimeout(window.get_user_info, 100);
      } else {
        zrl_mi.get_loyalty_user_info();
      }
    };
        
    window.zrlmi_loyalty_user_info_success_handler = function(data) {
      // $('.mz-pageheader-desktop').css('height', '105px');
      $('#zrl-points').text(data.available_points);
      $('#zrl-points-mobile').text(data.available_points);
      $('.fantext').text(data.loyalty_tier_name); 
      $('.zinrelo-container').css('visibility', 'visible');
      $('.zinrelo-nav-mobile').css('visibility', 'visible');
      
      if (require.mozuData('pagecontext').pageType === 'checkout')
        window.checkoutViews.steps.paymentInfo.updateZinrelo(window.zrl_mi.user_data.available_points);

      setTimeout(function(){$(document).find('.zinrelo-tab').addClass('sweet-rewards');},3000);
    };
    window.get_user_info();
    
    
  });
});