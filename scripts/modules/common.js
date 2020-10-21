var brontoObj = {   
    runs: 0,
    build: function (api) { 
        var brontoPageType = JSON.parse(document.getElementById("data-mz-preload-pagecontext").innerHTML).pageType;
        var objToGet = 'cart';
        if (brontoPageType === 'confirmation') 
            objToGet = 'order';
        var self = this;

        api.get(objToGet).then(function (resp) {

            if (window.brontoCart) {
                // console.log("DELETING brontoCart");
                delete window.brontoCart;
                // console.log(window.brontoCart);
            } else {
                // console.log("window.brontoCart does not exist yet");
            }
            var brontoMain = (objToGet === 'order' ? resp.data.items[0] : resp.data);
            var brontoItems = (objToGet === 'order' ? resp.data.items[0].items : resp.data.items);
            if (brontoItems.length > 0) {
                // console.log("building brontoCart");
                window.brontoCart = {
                    "currency": brontoMain.currencyCode,
                    "subtotal": brontoMain.subtotal,
                    "discountAmount": brontoMain.discountTotal,
                    "taxAmount": brontoMain.taxTotal.toFixed(2),
                    "grandTotal": brontoMain.total,
                    "orderId": (objToGet == 'cart' ? (brontoMain.orderId !== undefined ? brontoMain.orderId : "") : brontoMain.orderNumber),
                    "cartUrl": "https://www.jellybelly.com/cart",
                    "lineItems": []
                };
                for (var x = 0; x < brontoItems.length; x++) {
                    var item = brontoItems[x];
                    //console.log(item);
                    window.brontoCart.lineItems.push({
                        "sku": item.product.productCode,
                        "name": item.product.name,
                        "description": item.product.name,
                        "category": "General",
                        "other": "",
                        "unitPrice": item.product.price.price,
                        "salePrice": item.product.price.salePrice,
                        "quantity": item.quantity,
                        "totalPrice": item.product.price.price * item.quantity,
                        "imageUrl": "https:" + item.product.imageUrl,
                        "productUrl": "https://www.jellybelly.com/p/" + item.product.productCode
                    });
                }
                if (brontoPageType == "checkout")
                    window.brontoCart.cartPhase = "SHIPPING_INFO";
                else if (brontoPageType == "confirmation")
                    window.brontoCart.cartPhase = "ORDER_COMPLETE";
            } else {
                // console.log("not building or updating brontoCart");
                // do nothing, do not build the bronto cart
            }

            if (self.runs === 0) {
                // console.log(self.runs + " runs. Attaching bronto scripts.");
                var brParent = document.createElement('script');
                brParent.type = 'text/javascript';
                brParent.setAttribute("data-name", "__br_tm");
                brParent.innerHTML = "var _bsw = _bsw || []; _bsw.push(['_bswId', 'ed22e206e79de46748f4277e0bacd405a22542dea868dd883aa71285b5433329']); (function() { var bsw = document.createElement('script'); bsw.type = 'text/javascript'; bsw.async = true; bsw.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'js.bronto.com/c/cqdofiyxcd2h205f9v39wavfnfpiml5mr46owpifvvtp6npqxd/ed22e206e79de46748f4277e0bacd405a22542dea868dd883aa71285b5433329/s/b.min.js'; var t = document.getElementsByTagName('script')[0]; t.parentNode.insertBefore(bsw, t); })();";
                var zzz = document.getElementsByTagName('script')[0];
                zzz.parentNode.insertBefore(brParent, zzz);

                var brRec = document.createElement('script');
                brRec.type = 'text/javascript';
                brRec.innerHTML = '!function(o,t){var e=window.bronto=function(){"string"==typeof arguments[0]&&e.q.push(arguments),e.go&&e.go()};e.q=e.q||[];var n=o.createElement(t),s=o.getElementsByTagName(t)[0];s.parentNode.insertBefore(n,s),n.async=!0,n.onload=e,n.src="https://snip.bronto.com/v2/sites/eyJ0eXBlIjoic2l0ZWhhc2giLCJpZCI6ImU4MjFkMzM1Y2JjYzNmMThkYmRjMjk1MzE5MmJlYzllZjBjNjE0OTUyMWZhMDNmOTYzMTY2NzIzOTgyNDI0MTEifQ==/assets/bundle.js"}(document,"script");';
                var yyy = document.getElementsByTagName('script')[0];
                yyy.parentNode.insertBefore(brRec, yyy);

                self.runs++;
            } else {
                // do nothing, do not attach scripts again
                // console.log(self.runs + " runs. Not attaching bronto scripts.");
                self.runs++;
            }
        }, function (e) {
            console.error(e);
        });
    }
};

var page = window.location.pathname.split('/').pop();
var clicked;
var PageLocation = !window.location.pathname.split("/")[2] ? "" : window.location.pathname.split("/")[2].toLowerCase();
if (PageLocation == "storelocator") {
    if (window.location.protocol == "https:") {
        var restOfUrl = window.location.href.substr(6);
        window.location = "http:" + restOfUrl;
    }
}

require([
    "modules/jquery-mozu", "underscore", "modules/api",'modules/minicart',
    'modules/cart-monitor',
    "hyprlive", 'hyprlivecontext', "modules/backbone-mozu", "modules/models-product",
    "shim!vendor/owl.carousel[jquery=jQuery]>jQuery",
    'shim!vendor/jquery-colorbox/jquery.colorbox[jquery=jQuery]', 'modules/candy-calculator'
], function($, _, api, MiniCart, CartMonitor, Hypr, HyprLiveContext, Backbone, ProductModels, NewsLetter, Cufon) {

    $(document).ready(function () {
        // Shruthi JEL-1433 Qty increase and Decrement
        $(document).on('keydown','.jb-quickviewdetails .increment',function(e){
            if(e.which === 13 || e.which === 32){
                e.preventDefault();
                var cqty= parseInt($(this).parents('.qty').find('.quantity').val(),10);
                var me = this,qty;
                if(cqty){
                    qty = cqty;
                }else{
                    qty = parseInt($(this).parents('.qty').find('.quantity').val(),10);
                }
                if(!qty){
                    qty = 0;
                } 
                if(qty < 25){
                    $(this).parents('.qty').find('.quantity').val(qty + 1);
                }
            }
        });
        $(document).on('keydown','.jb-quickviewdetails .dicrement',function(e){
            if(e.which === 13 || e.which === 32){
                e.preventDefault();
                var cqty= parseInt($(this).parents('.qty').find('.quantity').val(),10);
                var me = this,qty;
                if(cqty){
                    qty = cqty;
                }else{
                    qty = parseInt($(this).parents('.qty').find('.quantity').val(),10);
                }
                if(qty > 1){
                    $(this).parents('.qty').find('.quantity').val(qty - 1);
                }
            }
        });

        // load on scroll
        $(window).scroll(function() {
            var lazyImages = $(document).find('.load-on-scroll');
            lazyImages.filter(function(image,v) {
                var top_of_element = $(v).offset().top;
                var bottom_of_element = $(v).offset().top + $(v).outerHeight();
                var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
                var top_of_screen = $(window).scrollTop();
                if ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element)){
                    $(v).attr('src',$(v).attr('data-src'));
                } else {
                // the element is not in viewport
                }
            });
        }); 
        $(document).on('click','.sweet-rewards-label', function(){
            // if (window.require.mozuData('user').email === '') {
            //     window.location.pathname = '/user/login';
            // } else {
            //     window.location.replace('https://' + location.hostname + '/myaccount#account-loyalty-program');
            // }
            $(document).find('.zinrelo-tab').click();
        });

        //Logout the user when 
        var logout = window.logout = true;
        if(!require.mozuData('user').isAuthenticated && !require.mozuData('user').isAnonymous){
            $.cookie('logout',true);
            window.logout = false;
            window.location.href='/logout';
        } 
        if($.cookie('logout')==="true" && window.logout){ 
            $.removeCookie('logout');
            window.location.href='/user/login';
        }
        
        $(document).on('keypress', '.quantity-field-rti, .quantity-field', function(event){
            if (event.keyCode == 46 || event.keyCode == 8)
            {
                //do nothing
            }
            else 
            {
                if (event.keyCode < 48 || event.keyCode > 57 ) 
                {
                    event.preventDefault(); 
                }   
            }
        });

        // Only runs if page is not on checkout or a user is not logged in.
        // if (window.require.mozuData('user').email !== '' && require.mozuData('pagecontext').pageType !== "checkout") {
        //     var now = new Date();
        //     var time = now.getTime();
        //     var expire = time + (1000*60*30);
        //     now.setTime(expire);
        //     if (typeof $.cookie("zinPoints") !== 'undefined') {
        //         console.log("Setting points from cookie");
        //         $("#zrl-points").html($.cookie("zinPoints"));
        //     } else {
        //         console.log('No cookie available. Retreiving points from ArcJS app');
        //         api.request('GET', '/svc/zinrelo_points?user=' + window.require.mozuData('user').email).then(function(res) {
        //             $.cookie("zinPoints", res.points, {expires: now});
        //             $("#zrl-points").html($.cookie("zinPoints"));
        //         });
        //     }
        // }

        // Fiery Five function.
        

        $(document).on('keyup', '.quantity-field-rti, .quantity-field', function(event){
            if(parseInt($(this).val()) > 25 && require.mozuData('pagecontext').pageType != 'my_account'){
                $(this).val('');
                $(this).val(25);
            }
        });

        $(document).on('click','.plus-prod-qty-rti', function(){
            var qty = parseInt($(this).parent().find('input').val());
            if(!qty){
                qty = 0;
            }
            if(qty < 25){
                $(this).parent().find('input').val(qty+1);
                // $(this).parent().find('input').attr('value', qty+1);
            }
        }); 

        $(document).on('click','.minus-prod-qty-rti', function(){
            var qty = parseInt($(this).parent().find('input').val());
            if(qty > 1){
                $(this).parent().find('input').val(qty-1);
                // $(this).parent().find('input').attr('value', qty-1);
            }
        });

        $(document).on('click', '.mz-productdetail-qty', function(){
            var caretDown = $(this).parent().find('.down-caret-quantity');
            var caretUp = $(this).parent().find('.up-caret-quantity');
            var caretDownRti = $(this).parent().find('.down-caret-quantity-rti');
            var caretUpRti = $(this).parent().find('.up-caret-quantity-rti');
            
            if(caretDown.length == 1 && caretDown.css('display') == 'none'){
                caretDown.css('display','block');
                caretUp.css('display','none');
            }
            else {
                caretUp.css('display','block');
                caretDown.css('display','none');
            }
            $('.mz-productdetail-qty').focusout(function(){
                for(var i=0;i<$(document).find('.up-caret-quantity').length;i++){
                    $($('.up-caret-quantity')[i]).hide();
                }
                for(i=0;i<$(document).find('.down-caret-quantity').length;i++){
                    $($('.down-caret-quantity')[i]).show();
                }
            });

            if(caretDownRti.length == 1 && caretDownRti.css('display') == 'none'){
                caretDownRti.css('display','block');
                caretUpRti.css('display','none');
            }
            else {
                caretUpRti.css('display','block');
                caretDownRti.css('display','none');
            }
            $('.mz-productdetail-qty').focusout(function(){
                for(var i=0;i<$(document).find('.up-caret-quantity-rti').length;i++){
                    $($('.up-caret-quantity-rti')[i]).hide();
                }
                for(i=0;i<$(document).find('.down-caret-quantity-rti').length;i++){
                    $($('.down-caret-quantity-rti')[i]).show();
                }
            });
        });

        $(document).on('click', '.quantity', function(){
            var caretDown = $(this).parent().find('.down-caret-quantity-plp');
            var caretUp = $(this).parent().find('.up-caret-quantity-plp');
            
            if(caretDown.length == 1 && caretDown.css('display') == 'none'){
                caretDown.css('display','block');
                caretUp.css('display','none');
                caretUp.removeClass('up-caret-quantity-rti-imp');
            }
            else {
                caretUp.css('display','block');
                caretUp.addClass('up-caret-quantity-rti-imp');
                caretDown.css('display','none');
            }
            $('.quantity').focusout(function(){
                for(var i=0;i<$(document).find('.up-caret-quantity-plp').length;i++){
                    $($('.up-caret-quantity-plp')[i]).hide();
                }
                for(i=0;i<$(document).find('.down-caret-quantity-plp').length;i++){
                    $($('.down-caret-quantity-plp')[i]).show();
                }
                caretUp.removeClass('up-caret-quantity-rti-imp');
            });
        });

        $(document).on('click', '.myacc-add-form-sel', function(){
            var caretDown = $(this).parent().find('.down-caret-quantity-myacc-add');
            var caretUp = $(this).parent().find('.up-caret-quantity-myacc-add');
            
            if(caretDown.length == 1 && caretDown.css('display') == 'none'){
                caretDown.css('display','block');
                caretUp.css('display','none');
            }
            else {
                caretUp.css('display','block');
                caretDown.css('display','none');
            }
            $('.myacc-add-form-sel').focusout(function(){
                for(var i=0;i<$(document).find('.up-caret-quantity-myacc-add').length;i++){
                    $($('.up-caret-quantity-myacc-add')[i]).hide();
                }
                for(i=0;i<$(document).find('.down-caret-quantity-myacc-add').length;i++){
                    $($('.down-caret-quantity-myacc-add')[i]).show();
                }
                caretUp.removeClass('up-caret-quantity-rti-imp');
            });
        });

        $(document).on('click', '.page-sort-sel', function(){
            var caretDown = $(this).parent().find('.down-caret-quantity-sort');
            var caretUp = $(this).parent().find('.up-caret-quantity-sort');
            
            if(caretDown.length == 1 && caretDown.css('display') == 'none'){
                caretDown.css('display','block');
                caretUp.css('display','none');
            }
            else {
                caretUp.css('display','block');
                caretDown.css('display','none');
            }
            $('.page-sort-sel').focusout(function(){
                for(var i=0;i<$(document).find('.up-caret-quantity-sort').length;i++){
                    $($('.up-caret-quantity-sort')[i]).hide();
                }
                for(i=0;i<$(document).find('.down-caret-quantity-sort').length;i++){
                    $($('.down-caret-quantity-sort')[i]).show();
                }
                caretUp.removeClass('up-caret-quantity-rti-imp');
            });
        });

        $(document).on('click', '.my-acc-saved-add', function(){
            var caretDown = $(this).parent().find('.down-caret-ma-cardType');
            var caretUp = $(this).parent().find('.up-caret-ma-cardType');
            
            if(caretDown.length == 1 && caretDown.css('display') == 'none'){
                caretDown.css('display','block');
                caretUp.css('display','none');
            }
            else {
                caretUp.css('display','block');
                caretDown.css('display','none');
            }
            $('.my-acc-saved-add').focusout(function(){
                $('.up-caret-ma-cardType').hide();
                $('.down-caret-ma-cardType').show();
            });

            var caretDown1 = $(this).parent().find('.down-caret-ma-month');
            var caretUp1 = $(this).parent().find('.up-caret-ma-month');
            
            if($(this).hasClass('month') === true){
                if(caretDown1.length == 1 && caretDown1.css('display') == 'none'){
                    caretDown1.css('display','block');
                    caretUp1.css('display','none');
                }
                else {
                    caretUp1.css('display','block');
                    caretDown1.css('display','none');
                }
            }

            $('.my-acc-saved-add').focusout(function(){
                $('.up-caret-ma-month').hide();
                $('.down-caret-ma-month').show(); 
            });

            var caretDown2 = $(this).parent().find('.down-caret-ma-year');
            var caretUp2 = $(this).parent().find('.up-caret-ma-year');
            
            if($(this).hasClass('year') === true){
                if(caretDown2.length == 1 && caretDown2.css('display') == 'none'){
                    caretDown2.css('display','block');
                    caretUp2.css('display','none');
                }
                else {
                    caretUp2.css('display','block');
                    caretDown2.css('display','none');
                }
            }

            $('.my-acc-saved-add').focusout(function(){
                $('.up-caret-ma-year').hide();
                $('.down-caret-ma-year').show();
            });

        });


        $('.h2-accord-static').click(function(){
            for(var i=0;i<$('.accordian-list > li').length;i++){
                $('.accordian-list > li').find('img').attr('src','../resources/images/icons/facet-close.png');
            }
            if($(this).parent().hasClass('active'))
                $(this).parent().find('img').attr('src','../resources/images/icons/facet-close.png');
            else
                $(this).parent().find('img').attr('src','../resources/images/icons/edit_checkout_icons.png');
        });



        if($(window).width() < 768){ 
            $('.mz-signup-password').focusin(function(){
                $('.mob-pwd-row').css('display','block');     
            });
            $('.mz-signup-password').focusout(function(){
               $('.mob-pwd-row').css('display', 'none');          
            });
        }
        
        function addToCartAndUpdateMiniCart(PRODUCT,count,$target){
            PRODUCT.set({'quantity':count});
            $(document).find('.RTI-overlay').addClass('active');
            PRODUCT.addToCart(1);
            PRODUCT.on('addedtocart', function(attr) {
                $('[data-mz-productlist],[data-mz-facets]').removeClass('is-loading');
                $('.mz-l-pagewrapper').removeClass('is-loading');
                $(document).find('.RTI-overlay').removeClass('active');
                brontoObj.build(api);
                CartMonitor.update();
                var prodName = attr.data.product.name;
                var listPrice = PRODUCT.get('price').get('price');
                var salePrice = PRODUCT.get('price').get('salePrice');
                var img = attr.data.product.imageUrl+"?max=150";
                var Qty = PRODUCT.get('quantity');
                MiniCart.MiniCart.updateMiniCart();
                showAddtoCartPopup(prodName,listPrice,salePrice,img,Qty);
                //MiniCart.MiniCart.showMiniCart();
                PRODUCT = '';
            });
            api.on('error', function (badPromise, xhr, requestConf) {
                showErrorMessage(badPromise.message);
                $('.mz-l-pagewrapper').removeClass('is-loading');
                $(document).find('.RTI-overlay').removeClass('active');
                $(document).find('.Add-to-cart-popup').removeClass("active");
                $(document).find('body').removeClass("noScroll");
            });
        } 

        function loopInAddTocart(){
            var inputs = window.inputs = $(document).find('.Add-to-cart-popup').find('button,[tabindex="0"],a,input');
            var firstInput = window.firstInput = window.inputs.first();
            var lastInput = window.lastInput = window.inputs.last(); 
            
            // if current element is last, get focus to first element on tab press.
            window.lastInput.on('keydown', function (e) {
               if ((e.which === 9 && !e.shiftKey)) {
                   e.preventDefault();
                   window.firstInput.focus(); 
               }
            });
            
            // if current element is first, get focus to last element on tab+shift press.
            window.firstInput.on('keydown', function (e) {
                if ((e.which === 9 && e.shiftKey)) {
                    e.preventDefault();
                    window.lastInput.focus();  
                }
            }); 
        }

        function showAddtoCartPopup(name,price,sprice,img,qty){
            $(document).find('.Add-to-cart-popup').find('.product-image').attr('src',img);
            $(document).find('.Add-to-cart-popup').find('.product-name').html(name);
            if(price > sprice && sprice !== 0){
                $(document).find('.Add-to-cart-popup').find('.saleprice').html('$'+sprice.toFixed(2));
                $(document).find('.Add-to-cart-popup').find('.listprice').addClass('through');
            }else{
                $(document).find('.Add-to-cart-popup').find('.saleprice').html("");  
                $(document).find('.Add-to-cart-popup').find('.listprice').removeClass('through');
            }
            $(document).find('.Add-to-cart-popup').find('.listprice').html('$'+price.toFixed(2));
            $(document).find('.Add-to-cart-popup').find('.qty-count-popup').html(qty);
            $(document).find('.Add-to-cart-popup').addClass("active");
            $(document).find('body').addClass("noScroll");
            var owl = $(document).find('.rec-prod-list-popup');    
            owl.trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
            owl.find('.owl-stage-outer').children().unwrap();
            $(document).find('#rec-prod-list-popup').html('');
            $(document).find('.recommended-product-container').find('.mz-productlisting').each(function(){
                $(document).find('#rec-prod-list-popup').append($(this)[0].outerHTML);
            });
            owl.owlCarousel({  
                loop: true, 
                margin: 14,
                dots: false,
                autoPlay: false,  
                pagination: false,   
                nav: false,     
                navText:false,
                slideBy: 1,
                items: 1,
                center: false,
                stagePadding : 50,
                responsive: {    
                    0: {
                        items: 1
                    },
                    400: {
                        items: 1
                    },
                    600: {
                        items: 3
                    },
                    800: {
                        items: 3  
                    }, 
                    1025: {
                        items: 3
                    },
                    1200:{
                        items: 3
                    },
                    1440: {
                        items: 3
                    }
                } 
            });
            $(document).find('.Add-to-cart-popup').find('.popup-head h1').focus();
            loopInAddTocart(); 
        } 

        $(document).on('click', '.cross-close-popup',function(){
            $(document).find('.Add-to-cart-popup').removeClass("active");
            $(document).find('body').removeClass("noScroll");
        });

        $(document).on('click', '.continue-shoping  ',function(){
            $(document).find('.Add-to-cart-popup').removeClass("active");
            $(document).find('body').removeClass("noScroll");
        });

        $('.input-email-pref').change(function() {
            $('.email-pref-msg').empty();
        });

        $('.btn-email-pref').on('click', function() {
            if ($('.input-email-pref').val() === '') {
                $(".email-pref-msg").css("color", "red");
                $(".email-pref-msg").html("Please enter your email address.");
            } else {
                var cid = $('.input-email-pref').val();

                api.request('GET', '/svc/manage_preferences_link?cid=' + cid)
                    .then(function(res) {
                        window.location.href = res.link;
                    })
                    .catch(function (err) {
                        console.log(err);
                        // $('.email-pref-msg').html(err);
                    });
            }
        });

        function showErrorMessage(msg){
            $('[data-mz-message-bar]').empty();
            var emsg = '<ul class="is-showing mz-errors" tabindex="-1" id="mz-errors-list"><li>'+msg+'</li></ul>';
            $('[data-mz-message-bar]').append(emsg);
            $('[data-mz-message-bar]').fadeIn();
            $('#mz-errors-list').attr({tabindex:0});
            $('#mz-errors-list').find('li').attr({tabindex:0,role:'contentinfo'});
            $('#mz-errors-list').find('li').focus();
            $('html, body').animate({scrollTop:$('[data-mz-message-bar]').filter(':visible').offset().top-200}, 'slow');
            setTimeout(function(){
                $('[data-mz-message-bar]').hide();
            },6000);
            $('.jb-inner-overlay').remove();
            // $("html, body").animate({scrollTop:  $(".mz-l-paginatedlist").offset().top }, 1000);
        }
        if(!$(document).find('body').hasClass('mz-cart')){
            // add to cart function in all carousels.
            $(document).on('click', '.jb-add-to-cart-cur', function(e) {
                //e.preventDefault();
                $('.mz-l-pagewrapper').addClass('is-loading');
                $('[data-mz-productlist],[data-mz-facets]').addClass('is-loading');
                var $target = $(e.currentTarget), productCode = $target.data("mz-prcode");
                $('[data-mz-message-bar]').hide();
                $(document).find('.RTI-overlay').addClass('active');
                // var $quantity = $(e.target.parentNode.parentNode).find('.quantity')[0].options[$(e.target.parentNode.parentNode).find('.quantity')[0].options.selectedIndex];
                var $quantity = $(e.target.parentNode.parentNode).find('.quantity-field-rti').val();
                var count = parseInt($quantity,10);
                api.get('product', productCode).then(function(sdkProduct) {
                    var PRODUCT = new ProductModels.Product(sdkProduct.data);
                    var variantOpt = sdkProduct.data.options;
                    if(variantOpt !== undefined && variantOpt.length>0){
                        var newValue = $target.parent().parent().find('[plp-giftcart-prize-change-action]')[0].value;
                        var ID =  $target.parent().parent().find('[plp-giftcart-prize-change-action]')[0].getAttribute('data-mz-product-option');
                        if(newValue != "Select gift amount" && newValue !== ''){
                            var option = PRODUCT.get('options').get(ID);
                            var oldValue = option.get('value');
                            if (oldValue !== newValue && !(oldValue === undefined && newValue === '')) {
                                option.set('value', newValue);
                            }
                            setTimeout(function(){
                                addToCartAndUpdateMiniCart(PRODUCT,count,$target);
                            },2000);
                        }else{
                            showErrorMessage("Please choose the Gift Card amount before adding it to your cart. <br> Thanks for choosing to give a Jelly Belly Gift Card!");
                            $(document).find('.RTI-overlay').removeClass('active');
                        }
                    }else{
                        var pro = PRODUCT;
                        var qntcheck = 0;
                        $.each(MiniCart.MiniCart.getRenderContext().model.items,function(k,v){
                            if(v.product.productCode == pro.get('productCode') && ((v.quantity + count) > 50)){
                                qntcheck = 1;
                            }
                        });
                        if(pro.get('price.price') === 0 && MiniCart.MiniCart.getRenderContext().model.items.length > 0 ){
                            //console.log(MiniCart);
                            var cartItems = MiniCart.MiniCart.getRenderContext().model.items;
                            var len = cartItems.length;
                            for(var i=0;i<len;i++){
                                if(cartItems[i].product.productCode === pro.get('productCode')){
                                    if(cartItems[i].product.price.price === pro.get('price.price')){
                                        $('[data-mz-productlist],[data-mz-facets]').removeClass('is-loading');
                                        $(document).find('.RTI-overlay').removeClass('active');
                                        $('.zero-popup').show();
                                        return false;
                                    }
                                }
                            }
                            addToCartAndUpdateMiniCart(PRODUCT,count,$target);
                        // }else if(qntcheck){
                        //     $('[data-mz-productlist],[data-mz-facets]').removeClass('is-loading');
                        //     //$(".items-per-order").show();
                        //     $(document).find('.RTI-overlay').removeClass('active');
                        //     showErrorMessage("You cannot add more than 50 products to cart");
                        //   // return false;
                        }else{
                            addToCartAndUpdateMiniCart(PRODUCT,count,$target);
                        }
                    }
                });
            });
            // notify me function
            $(document).on('click','.jb-out-of-stock-cur', function(e) {
                clicked = e.target;
                var emailVal = '';
                if($(document).find('.Add-to-cart-popup').hasClass('active')){
                    $(document).find('.Add-to-cart-popup').removeClass("active");
                    $(document).find('body').removeClass("noScroll");
                }
                if(require.mozuData('user').isAuthenticated){
                    emailVal = require.mozuData('user').email;
                }
                var modal = $(document).find('.notify-me-popup');
                modal.find('input').val(emailVal);
                modal.find('button').attr('data-mz-location-code',e.target.getAttribute('data-mz-location-code'));
                modal.find('button').attr('data-mz-product-code',e.target.getAttribute('data-mz-product-code'));
                modal.show();
                modal.find('.notify-me-body').focus();  
                focusNotify();  
                $(document).find('body').addClass("haspopup"); 
            });
            $(document).on('click', '.notify-me-button', function(e){
                var email = $('.notify-me-email'), 
                    button = $(e.currentTarget),
                    modal = $(document).find('.notify-me-popup');
                if(email.val().trim() !== ""){
               
                    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    var patt = new RegExp(re);
                    
                    if(patt.test(email.val().trim() )){
                        var location = button.attr('data-mz-location-code');
                        var obj = {
                            email: email.val(),
                            customerId: require.mozuData('user').accountId,
                            productCode:button.attr('data-mz-product-code'),
                            locationCode:location
                        };
                        api.create('instockrequest',obj ).then(function () {
                            modal.find('.notify-me-section').fadeOut(500,function(){
                                modal.find('.success-msg').fadeIn(500,function(){focusNotify();});
                            });
                                
                            }, function (xhr) {
                                $('[data-mz-message-bar]').hide();
                                if(xhr.errorCode == "VALIDATION_CONFLICT"){
                                    $('[data-mz-message-bar]').hide(); 
                                    modal.find('.error').text('Error: Please enter valid email address.').focus();
                                }else if(xhr.errorCode != "ITEM_ALREADY_EXISTS"){   
                                     $('[data-mz-message-bar]').hide();
                                    if(xhr.items.length){ 
                                        modal.find('.error').text(xhr.items[0].message).focus();
                                    }else{
                                        modal.find('.error').text(xhr.message);
                                    }    
                                }else{
                                    $('[data-mz-message-bar]').hide(); 
                                    modal.find('.error').text('Error: Email id you have provided already subscribed for back in stock notification.').focus();
                                }
                            });
                    }else{
                        email.focus();
                        modal.find('.error').text('Error: Please enter valid email address.');
                    }
                }else{
                    email.focus();
                    modal.find('.error').text('Error: Please enter valid email address.');
                }
            });
            
            $(document).find('.close').on('click',function(){
                $(document).find('.notify-me-popup').hide();
                modalReset();
                clicked.focus();
            });
            $(window).on('click',function(e){
                if($(e.target).hasClass('notify-me-modal')){
                    $(document).find('.notify-me-popup').hide();
                    modalReset();
                    clicked.focus();
                }    
            });
            $(document).keyup(function(e) {
                if (e.keyCode === 27 && $(".notify-me-popup").is(":visible")) {
                    $(document).find('.notify-me-popup').hide();
                    modalReset();
                    clicked.focus();
                }
            });
            $(document).find('.close').on('keyup',function(e) {
                if (e.keyCode === 13&& $(".notify-me-popup").is(":visible")) {
                    $(document).find('.notify-me-popup').hide();
                    modalReset();
                    clicked.focus();
                }
            });
        }

        function modalReset(){
            var modal = $(document).find('.notify-me-popup');
            modal.find('.notify-me-section').show();
            modal.find('.success-msg').hide();
            $(document).find('body').removeClass("haspopup");
            modal.find('.error').text('');
        }
        function focusNotify(){
            window.notifyinputs = $(document).find('.notify-me-popup').find('input, button, a,.close').filter(':visible');    
            window.notifyfirstInput = window.notifyinputs.first();
            window.notifylastInput = window.notifyinputs.last(); 
            
             // if current element is last, get focus to first element on tab press.
            window.notifylastInput.on('keydown', function (e) {
               if ((e.which === 9 && !e.shiftKey)) {
                   e.preventDefault();
                   window.notifyfirstInput.focus(); 
               }
            });
            
            // if current element is first, get focus to last element on tab+shift press.
            window.notifyfirstInput.on('keydown', function (e) {
                if ((e.which === 9 && e.shiftKey)) {
                    e.preventDefault();
                    window.notifylastInput.focus();  
                }
            });      
        }

        //////////////////////////// Bronto code

        brontoObj.build(api);

        /////////////////////////// end Bronto code end
    
        $(document).on("blur", "#guest_email, #email", function(e) { 
            window.brontoCart.emailAddress = $(this).val(); 
            });
        
        $(document).on("click", ".brontocart-shipping-info, .brontocart-ship-method, .brontocart-billing, .brontocart-place-order", function(e) {
            console.log(e);
            if($(e.currentTarget).hasClass("brontocart-shipping-info")) {
                console.log("shipping info");
                window.brontoCart.cartPhase = "SHIPPING_METHOD";
            }
            if($(e.currentTarget).hasClass("brontocart-ship-method")) {
                console.log("shipping method");
                window.brontoCart.cartPhase = "BILLING";
            }
            if($(e.currentTarget).hasClass("brontocart-billing")) {
                console.log("billing");
                window.brontoCart.cartPhase = "ORDER_REVIEW";
            }
            if($(e.currentTarget).hasClass("brontocart-place-order")) {
                console.log("place order");
                window.brontoCart.cartPhase = "ORDER_SUBMITTED";
            }
            });
        
        // buildBrontoCart();

        $('.skipto').click(function(e) {
            e.preventDefault();
            var aTag = $("#maincontent");
            $('html,body').animate({
                scrollTop: aTag.offset().top - 150
            }, 2000);
            $(document).find("#maincontent").focus();
        });

        $(document).on('keypress', '.skipto', function(e) {
            if (e.keyCode == 13 || e.keyCode == 32) {
                $(".skipto").trigger('click');
            }
        });

        $(document).on('keypress', '.gridder-list .img-overlay', function(e) {
            e.preventDefault();
            if (e.keyCode == 13 || e.keyCode == 32) {
                console.log($(this));
                $(this).trigger('click');
            }
        });
  

        if ($(window).width() < 767) {   
            $('.mz-footer-links').hide();
            // $('.mz-footer-links').first().show();
        }      

        $('#coupon-code').on("invalid", function(e) {
            e.preventDefault();
        });

        //Removing tabindex for color box
        if ($('#colorbox').find('.intl-site')) {
            $('#colorbox').removeAttr('tabindex');
        }

        $(".overlay").click(function() {
            $(".gridder-list").find(".jb-add-to-cart").show();
            if ($(this).parent().hasClass('selectedItem')) {
                $(this).parent().find('.jb-add-to-cart').hide();
            } else {
                $(".gridder-list").find(".jb-add-to-cart").show();
            }
        });

        // social footer function.
        $('.toggleModal').on('click', function(e) {
            e.stopPropagation();
            $('.modal').addClass('active');
            $('#close-popup').focus();
        });

        // Opens modal with 'Enter' key
        $(document).keydown(function(e) {
            if (e.keyCode === 13 && (document.activeElement == $('.toggleModal')[0])) {
                $('toggleModal').click();
            }
        });

        // Modal tab trap
        $(document).keydown(function(e) {
            if (e.keyCode === 9 && $('.modal').hasClass('active')) {
                if (e.shiftKey && (document.activeElement === $('#close-popup')[0])) {
                    e.preventDefault();
                    $('#osview2').focus();
                } else if (e.shiftKey && (document.activeElement === $('#osview2')[0])) {
                    e.preventDefault();
                    $('#osview').focus();
                } else if (document.activeElement === $('#osview2')[0]) {
                    e.preventDefault();
                    $('#close-popup').focus();
                }
            }
        });

        // close Client Details modal with ESC key
        $(document).keyup(function(e) {
            if ((e.keyCode === 27) && $('.modal').hasClass('active')) {
                $('.modal').removeClass('active');
                $('.toggleModal').focus();
            }
        });

        $("#close-popup").click(function(e) {
            $('.modal').removeClass('active');
            $('.toggleModal').focus();
        });

        $(document).on('click', function(e) {
            var target = $(e.target)[0];
            if ($(target).parents('.modal').length)
                return;
            //e.stopPropagation();
            //do your hiding stuff
            $('.modal').removeClass('active');
        });

        //trunkting the product name in all plp.
        $(".jb-product-description").text(function(index, currentText) {
            return currentText.substr(0, 250);
        });

        //trunkting the product name in all plp.
        $(".gridder-list .multiline").text(function(index, currentText) {
            return currentText.substr(0, 200) + '...';
        });

        //newsletter subriction.
        $('#emailConnectPage').on('click', function() {
            NewsLetter.JB.NewsletterSignup.emailFormFooterLinkClicked();
        });

        /**
         * Show and hide header search box in mobile view
         **/
        if ($('#mobile_show_search').length > 0) {
            $('#mobile_show_search').on('click', function(e) {
                $('.jb-mobile-search').slideToggle();
                $('#page-content').toggleClass('mobile-search-content', '');
                $('.mz-breadcrumbs').toggleClass('margin-fix');
                if ($('.jb-mobile-search').is(':visible')) {
                    $('.jb-mobile-search').find('.tt-input').focus();
                }
            });

            $(document).on('click', "#jb-mobile-search-close", function(e) {
                $('.jb-mobile-search').slideUp();
                $('#page-content').removeClass('mobile-search-content', '');
                $('.mz-breadcrumbs').addClass('margin-fix');
                $(document).find('#mobile_show_search').focus();
            });

            $("#jb-mobile-search-close").keypress(function(e) {
                if (e.keyCode == 13 || e.keyCode == 32) {
                    $('.jb-mobile-search').slideUp();
                    $('#page-content').removeClass('mobile-search-content', '');
                    $(document).find('#mobile_show_search').focus();
                }
            });
        }

        $('.jb-mobile-main-menu-items').click(function(e) {
            e.preventDefault();
        });

        // Footer mobile Main
        // $('.mz-column .mz-mobile > .mz-footer-title').click(function(event) {
        //     if (!$(this).hasClass("mz-footer-current")) {
        //         $('.mz-column > ul.mz-footer-links').slideUp();
        //         $('.mz-columnfull > ul.mz-footer-links').slideUp();
        //         $('.mz-columnfull .datalink > li > .mz-footer-links').slideUp();
        //         $('.mz-columnfull .datalink > li > .mz-footer-links').slideUp();
        //         $(".mz-datlinktoogle").html("+");
        //         $(this).parent().next().slideDown();
        //         $('.mz-footer-current').attr("aria-expanded", "false");
        //         $('.mz-footer-current').removeClass('mz-footer-current');
        //         $(this).addClass('mz-footer-current');
        //         $(this).attr("aria-expanded", "true");
        //         return false;
        //     } else {
        //         //event.preventDefault();
        //     }
        // });

        $('.mz-column .mz-mobile > .mz-footer-title').click(function(event) {
            if($(this).parent().next().css('display') != 'block'){
                $(this).parent().next().slideDown();
                $(this).find('.footer-minus').show();
                $(this).find('.footer-plus').hide();
            }
            // $(this).addClass('mz-footer-current');   
            $(this).attr("aria-expanded", "true");
            return false;
        });

        $('.mz-column .mz-mobile > .mz-footer-title > .footer-minus').click(function(event) {
            if($(this).parent().parent().next().css('display') == 'block'){
                $(this).parent().parent().next().slideUp();
                $(this).parent().find('.footer-minus').hide();
                $(this).parent().find('.footer-plus').show();
            }
            $(this).parent().attr("aria-expanded", "true");
            return false;
        });

        $('.mz-column .mz-mobile > .mz-footer-title > a').click(function(event) {
            if($(this).parent().parent().next().css('display') == 'block'){
                window.location.replace($(this).attr('href'));
            }
        });

        // Footer Mobile Sub
        $('.mz-columnfull .mz-mobile > .mz-footer-title').click(function(event) {

            if (!$(this).hasClass("mz-footer-current")) {
                event.preventDefault();
                $('.mz-column > ul.mz-footer-links').slideUp();
                //$('.mz-columnfull .datalink > li > .mz-footer-links').slideUp();
                $(this).parent().next().slideDown();
                $('.mz-footer-current').removeClass('mz-footer-current');
                $(this).addClass('mz-footer-current');
            } else {
                event.preventDefault();
            }
        });

        // Vending page Form
        $('#formtrigger').click(function() {
            $('#fundraisingForm').fadeIn();
        });

        // wrire a review page.
        if (HyprLiveContext.locals.pageContext.title === 'Write Review') {
            $("#pr-headline").find("input[type=text]").attr("placeholder", "Ex. I would buy this again and again");
        }

        // Footer Third Level
        $('.mz-columnfull .datalink > li > .mz-footer-title > .mz-mobile').click(function(event) {
            if (!$(this).parent().hasClass("mz-footer-current")) {
                $('.mz-columnfull .datalink > li > .mz-footer-links').slideUp();
                $(this).parent().parent().find(".mz-footer-links").slideDown();
                $('.mz-footer-current').removeClass('mz-footer-current');
                $(this).parent().addClass('mz-footer-current');
                $(".mz-datlinktoogle").html("+");
                //alert($(this).html());
                $(this).parent().find(".mz-datlinktoogle").html("-");

            } else {
                event.preventDefault();
            }
        });

        // Footer Desktop Sitemap
        $("#siteMapToggle").click(function() {
            $(this).closest("div").parent().find(".datalink").toggle();
            var tempHtml = $("#siteMapToggle").text();
            if (tempHtml == "+") {
                $("#siteMapToggle").html('-');
                $(".mz-footer-row").css('background-position', '136% 107%');
                $("html, body").animate({
                    scrollTop: $(".mz-columnfull").offset().top + 30
                }, 500);
            } else {
                $("#siteMapToggle").html('+');
                $(".mz-footer-row").css('background-position', '136% 147%');
            }

        });

        // FAQ in multiple pages
        function faqInteraction(e) {
            $('.faq-q').attr('aria-expanded', false);
            $('.faq-a').slideUp(function() {
                var xx = $('.faq-q').find('img');
                $.each(xx, function(ind, val) {
                    val.style.setProperty('transform', 'rotate(-90deg)');
                    val.style.setProperty('-webkit-transform', 'rotate(-90deg)');
                    val.style.setProperty('-ms-transform', 'rotate(-90deg)');
                });
            });

            if (e.currentTarget.nextElementSibling.style.display === "none") {
                $(e.currentTarget.nextElementSibling).slideToggle(function() {
                    var x = $(e.currentTarget).find('img')[0];
                    x.style.setProperty('transform', 'rotate(0deg)');
                    x.style.setProperty('-webkit-transform', 'rotate(0deg)');
                    x.style.setProperty('-ms-transform', 'rotate(0deg)');
                });

                if ($(e.currentTarget).next().is(':visible')) {
                    $(e.currentTarget).attr('aria-expanded', true);
                    $(e.currentTarget).next().focus();
                }
            }
        }
        //FAQ WIDGET
        $('.faq-q').click(function(e) {
            faqInteraction(e);
        });

        $('.faq-q').keypress(function(e) {
            if (e.keyCode == 13 || e.keyCode == 32) {
                e.preventDefault();
                faqInteraction(e);
            }
        });

        var myjbTimeout;
        $('a').click(function(e) {
            var href = e.currentTarget.href;
            if (href.indexOf('myjellybelly.com') >= 0) {
                e.preventDefault();
                // apply mobile styling
                if (window.innerWidth < 769) {
                    $('#myjellybelly-modal').css({
                        width: "80%",
                        left: "5%",
                        "font-size": "16px"
                    });
                    $('#myjellybelly-modal span:nth-child(1)').css({
                        "font-size": "18px"
                    });
                    $('#myjellybelly-modal span:nth-child(2)').css({
                        "font-size": "18px"
                    });
                    $('#myjellybelly-modal span:nth-child(3)').css({
                        "font-size": "18px"
                    });

                }
                $('#myjellybelly-modal').fadeIn(500);
                myjbTimeout = setTimeout(function() {
                    window.location.href = 'http://www.myjellybelly.com';
                }, 10000);
            } else if (href.indexOf('/logout') > -1) {
                e.preventDefault();
                console.log("do something quick!");
                //check_and_logout_ss_user();
                window.ss_mi.logout_loyalty_user();
                setTimeout(function() {
                    window.location = href;
                }, 1500);
            }
        });

        $('#myjellybelly-continue').click(function(e) {
            window.location.href = 'http://www.myjellybelly.com';
        });

        $('#myjellybelly-cancel').click(function(e) {
            clearTimeout(myjbTimeout);
            $('#myjellybelly-modal').fadeOut(500);
        });

        $('.MB_PRODUCTNAME').each(function(index, value) {
            var linkText = $(value).text();
        });

        if (window.innerWidth < 768) {
            // mobile
            // do nothng
        } else { // desktop
            $('.mz-flags').show();
        }

        $('.international-footer').click(function(e) {
            $('.mz-flags').show(); 
        });

        $("#footer-email-signup").on('keydown', function(e){
            setTimeout(function(){
                var email = $("#footer-email-signup").val();
                if(EmailCheck(email) && $('#confirm:checked').length === 1){
                    $('.signup-button').attr('disabled',false);
                    $('.signup-button').addClass('sign-up-btn-footer');
                    $('.signup-button').removeClass('sign-up-btn-footer-disable');
                } else {
                    $('.signup-button').attr('disabled',true);
                    $('.signup-button').removeClass('sign-up-btn-footer');
                    $('.signup-button').addClass('sign-up-btn-footer-disable');
                }
            }, 100);
        });

        $(".checkbox-footer-label").on('click', function(e){
            var email = $("#footer-email-signup").val();
            if(EmailCheck(email) && $('#confirm:checked').length === 1){
                $('.signup-button').attr('disabled',false);
                $('.signup-button').addClass('sign-up-btn-footer');
                $('.signup-button').removeClass('sign-up-btn-footer-disable');
            } else {
                $('.signup-button').attr('disabled',true);
                $('.signup-button').removeClass('sign-up-btn-footer');
                $('.signup-button').addClass('sign-up-btn-footer-disable');
            }
        });
        
        function EmailCheck(mail)
        {
         if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
          {
            return (true);
          }
            return (false);
        }
        
        $(".signup-button").click(function(e){
            $("#signup-message-top").html("").hide();
            $("#signup-message-bottom").html("").hide();
            
            if (!$('#confirm').is(':checked')) {
                $("#signup-message-top").html("Error: Please confirm that you are 13 years old or older.").show().focus();
            return;
            } else {
                // CHECKS
                
                // are email and sms both blank?
                if ($("#footer-email-signup").val().length === 0) {
                    $("#signup-message-top").html("Error: Email address or mobile phone must have a value.").show().focus();
                    return;
                }
                
                // is email address valid?
                var x = /^([a-zA-Z0-9])+([\.a-zA-Z0-9_-])*@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+$/.test($("#footer-email-signup").val());
                
                if (x === false && $("#footer-email-signup").val().length > 0) {
                    $("#signup-message-top").html("Error: Please enter a valid email address.").show().focus();
                    return;
                }

                // var newSmSStr = $("#sms-signup").val().replace(/[\s()-]+/gi, ''); // remove parentheses and dashes regex
                // $('#sms-signup').val(newSmSStr);
                
                var br_email = $('#footer-email-signup').val(), br_age_verified = true;
                var br_phone = "";
                
                window.zrl_mi.award_loyalty_points(Hypr.getThemeSetting('zinreloActivityCode'), 100, $("#footer-email-signup").val(), {});
                
                $('body').append('<img src="https://bm5150.com/public/?q=direct_add&fn=Public_DirectAddForm&id=bcmeoxwnoqonwvrsmbhtyrfqskopbjp&email='+br_email+'&mobileNumber='+'1'+br_phone+'&smsKeywordID1=0bd904200000000000000000000000000fcd&field1=is_13_or_over,set,'+br_age_verified+'&field2=phone_mobile,set,'+br_phone+'" width="0" height="0" border="0" alt=""/>');
                
                $("#signup-message-bottom").html("Thank you for your submission!").show().focus();
                $("#footer-email-signup").val("");
                // $('# ').val("");
                $("#confirm").prop( "checked", false );

                $('.sign-up-btn-footer').attr('disabled',true);
                
                $.colorbox({
                        open: true,
                        maxWidth: "95%",
                        maxHeight: "100%",
                        scrolling: false,
                        fadeOut: 500,
                        html: '<div style="background: #fff; width: 100%; padding: 5px;"><div style="font-family: proxima-nova, sans-serif; font-size: 13px; font-weight: 400; text-align: center; margin-bottom: 8px;"><span style="font-size: 20px; word-wrap: wrap">Thank you for your submission!</span></div><div style="text-align: center;"><span style="font-size: 16px;">Use coupon code&nbsp;<span style="color: #ff0000; font-weight: bold;">WELCOME10</span>&nbsp;at checkout to get your 10% discount.</span></div></div>',
                        overlayClose: true,
                        onComplete : function(){
                            $('#cboxLoadedContent').css({
                                background : "#ffffff",
                                padding: "16px"
                            });
                            $('.sign-up-btn-footer').attr('disabled',true);
                        }
                    });
            }
		});

        $(document).on('keypress', '.signup-button', function(e) {
            if (e.keyCode == 13 || e.keyCode == 32) {
                $("#footer-email-signup-button").trigger('click');
            }
        });
        //notify me modal focus ADA
        var notifyinputs = window.notifyinputs ;    
        var notifyfirstInput =  window.notifyfirstInput;
        var notifylastInput = window.notifylastInput;
		
    $(".social-media-icon").hover(function(e){
       e.target.setAttribute("temp", e.target.getAttribute("src"));
       e.target.setAttribute("src", e.target.getAttribute("secondary"));
     },  function(e){ 
       e.target.setAttribute("src", e.target.getAttribute("temp"));
       e.target.setAttribute("temp", "");
   });
        //require(['modules/pepperjam']);
        //if (require.mozuData('pagecontext').pageType === "checkout" ||
        //    require.mozuData('pagecontext').pageType === "my_account") {
            require(['modules/zinrelo']);
        //}

		require(['modules/browser-info']);
		require(['modules/regional-scheme/geodetect2']);
    require(['modules/add-to-cart-modal']);
		//require(['modules/regional-scheme/geodetect2']);
    });
});
