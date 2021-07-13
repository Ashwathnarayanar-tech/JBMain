require([
    "modules/jquery-mozu",
    'modules/api', 
    'modules/models-product',
    'modules/cart-monitor',
    'modules/minicart'],
    function ($,Api,ProductModels,CartMonitor,MiniCart) {
    $(document).ready(function(){    
        var trigger;
        
        $(document).on('click', '.jb-add-to-cart', function(e) {
            e.preventDefault();
            trigger = e.target;
			$(document).find('[data-mz-productlist]').addClass('is-loading');
			$(document).find('[data-mz-facets]').addClass('is-loading');
            var $target = $(e.currentTarget), productCode = $target.data("mz-prcode");
            $(document).find('[data-mz-message-bar]').hide();             
            $target.addClass('is-loading');            
            var $quantity = $(e.target).parents('.jb-quickviewdetails').find('.quantity').val();
            var count = parseInt($quantity); 
            window.showGlobalOverlay();           
        $(document).on('keypress', '.jb-add-to-cart', function(e) {
            if(e.keyCode == 13 || e.keyCode == 32) {
                e.preventDefault();
                $(this).click();
            }
        });
        
        
        //Gift card option change functionality - set variation product code whle changing the option for product, and set it as main product.
        $('[data-mz-productlist],#mz-drop-zone-rti-category').on('change','.plpquantityinput',function(e){
            if(parseInt($(this).val()) > 1) {
                $(this).parent(".qty").addClass("qtydecrementenable");
            }  else {
                $(this).parent(".qty").removeClass("qtydecrementenable");
            }          
        });
        $('[data-mz-productlist],#mz-drop-zone-rti-category').on('click','.plpquantitydicrement',function(e){
            var findQtyValue = $(this).parent(".qty").find("input");
           if(parseInt($(findQtyValue).val()) > 1) {
                $(this).parent(".qty").addClass("qtydecrementenable");
            }  else {
                $(this).parent(".qty").removeClass("qtydecrementenable");
            }          
        });
        
        $('[data-mz-productlist],#mz-drop-zone-rti-category').on('click','.plpquantityincrement',function(e){
            var findQtyValue = $(this).parent(".qty").find("input");
            if(parseInt($(findQtyValue).val()) > 1) {
                $(this).parent(".qty").addClass("qtydecrementenable");
            }  else {
                $(this).parent(".qty").removeClass("qtydecrementenable");
            }          
        });
        $('[data-mz-productlist]').on('change','[plp-giftcart-prize-change-action]',function(e){
            var $optionEl = $(e.currentTarget);
            var newValue = $optionEl.val();
            var ax = $optionEl.parent().parent().find('.jb-add-to-cart');
            $(e.currentTarget).parent(".jb-product-prize").find('.down-caret-quantity-myacc-add').show();
            $(e.currentTarget).parent(".jb-product-prize").find('.up-caret-quantity-myacc-add').hide();
            if(newValue != "Select Gift Card Amount"){
                ax.text("Add to Cart");
                ax.removeClass('gift-prize-select');
            }else{ 
                ax.text("Shop Gift Card");
                ax.addClass('gift-prize-select');
            }
            
        });

        $('[data-mz-productlist]').on('click','[plp-giftcart-prize-change-action]',function(e){
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
            $('[plp-giftcart-prize-change-action]').focusout(function(){
                for(var i=0;i<$(document).find('.up-caret-quantity-myacc-add').length;i++){
                    $($('.up-caret-quantity-myacc-add')[i]).hide();
                }
                for(i=0;i<$(document).find('.down-caret-quantity-myacc-add').length;i++){
                    $($('.down-caret-quantity-myacc-add')[i]).show();
                }
                caretUp.css('display','none');
                // caretUp.removeClass('up-caret-quantity-myacc-add');
                // caretDown.removeClass('down-caret-quantity-myacc-add');
            });
        });
        
        function additemstoCart(productCode,$target,count){
            Api.get('product', productCode).then(function(sdkProduct) {
                var PRODUCT = new ProductModels.Product(sdkProduct.data);
                var variantOpt = sdkProduct.data.options;                    
                if(variantOpt !== undefined && variantOpt.length>0){  
                 //var newValue = $target.parent().parent().find('[plp-giftcart-prize-change-action]')[0].value;
                  //  var ID =  $target.parent().parent().find('[plp-giftcart-prize-change-action]')[0].getAttribute('data-mz-product-option');
                  var ID=$target.parents('.mz-productlisting ').find('[plp-giftcart-prize-change-action]')[0].getAttribute('data-mz-product-option');
                  var newValue=$target.parents('.mz-productlisting ').find('[plp-giftcart-prize-change-action]')[0].value;
                    if(newValue != "Select Gift Card Amount" && newValue !== ''){
                        if("Tenant~gift-card-prices" !== ID && window.location.host !== "www.jellybelly.com"){
                            ID = "Tenant~gift-card-prices";
                        }
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
                        $target.removeClass('is-loading');
                         window.hideGlobalOverlay();
                    }
                }else{
                    addToCartAndUpdateMiniCart(PRODUCT,count,$target);
                }
            }).catch(function(err){
                console.log("error occurred during add to cart ",err);
                window.hideGlobalOverlay();
            }); 
            setTimeout(function(){ 
                 $target.focus(); 
            },6200); 
        }); 
        
        $(document).on('keypress', '.jb-add-to-cart', function(e) {
            if(e.keyCode == 13 || e.keyCode == 32) {
                e.preventDefault();
                $(this).click();
            }
        });
        
        
        //Gift card option change functionality - set variation product code whle changing the option for product, and set it as main product.
        $('[data-mz-productlist]').on('change','[plp-giftcart-prize-change-action]',function(e){
            var $optionEl = $(e.currentTarget);
            var newValue = $optionEl.val();
            var ax = $optionEl.parent().parent().find('.jb-add-to-cart');
            if(newValue != "Select gift amount"){
                ax.text("Add to Cart");
                ax.removeClass('gift-prize-select');
            }else{ 
                ax.text("Shop Gift Card");
                ax.addClass('gift-prize-select');
            }
            
        });
        
        
        function showErrorMessage(msg){
            $('[data-mz-message-bar]').empty();
            var emsg = '<div class="mz-messagebar" data-mz-message-bar="">'+
                        '<ul class="is-showing mz-errors" tabindex="-1" id="mz-errors-list"><li>'+msg+'</li>'+
                        '</ul></div>';
            $('[data-mz-message-bar]').append(emsg);
            $('[data-mz-message-bar]').fadeIn();
            $('#mz-errors-list').attr({tabindex:0});
            $('#mz-errors-list').find('li').attr({tabindex:0});
            $('#mz-errors-list').find('li').focus();
            $('.jb-pagecontrols').animate({scrollTop:$('[data-mz-message-bar]').position().top}, 'slow');
            setTimeout(function(){
                $('[data-mz-message-bar]').hide();
            },6000);
            $('.jb-inner-overlay').remove();
        }
        
        
        function addToCartAndUpdateMiniCart(PRODUCT,count,$target){
            PRODUCT.set({'quantity':count});
            $target.addClass('is-loading');
            PRODUCT.addToCart(1);
            PRODUCT.on('addedtocart', function(attr) {
                $('[data-mz-productlist],[data-mz-facets]').removeClass('is-loading');
                $target.removeClass('is-loading');
                 window.hideGlobalOverlay();
                CartMonitor.update();
                MiniCart.MiniCart.updateMiniCart();
                var prodName = attr.data.product.name;
                var listPrice = PRODUCT.get('price').get('price');
                var salePrice = PRODUCT.get('price').get('salePrice');
                var img = attr.data.product.imageUrl+"?maxWidth=150";
                var Qty = PRODUCT.get('quantity');
                showAddtoCartPopup(prodName,listPrice,salePrice,img,Qty); 
                // MiniCart.MiniCart.showMiniCart($target);
                PRODUCT = '';
				brontoObj.build(Api);
            });
            Api.on('error', function (badPromise, xhr, requestConf) {
                 window.hideGlobalOverlay();
                showErrorMessage(badPromise.message);
                $target.removeClass('is-loading');
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
            $(document).find('.Add-to-cart-popup').find('.visually-hidden').remove();
            if(price > sprice && sprice !== 0){
                $(document).find('.Add-to-cart-popup').find('.saleprice').html('$'+sprice.toFixed(2));
                $(document).find('.Add-to-cart-popup').find('.listprice').addClass('through');
            }else{
                $(document).find('.Add-to-cart-popup').find('.saleprice').html("");
                $(document).find('.Add-to-cart-popup').find('.listprice').removeClass('through');
            }
            if (!$(document).find('.Add-to-cart-popup').find('.listprice').hasClass('through')) {
                $(document).find('.Add-to-cart-popup').find('.listprice').before("<span class='visually-hidden' style='position:absolute; left:-10000px; top:auto; width:1px; height:1px; overflow:hidden;'>Current price: </span>");
            } else {
                $(document).find('.Add-to-cart-popup').find('.saleprice').before("<span class='visually-hidden' style='position:absolute; left:-10000px; top:auto; width:1px; height:1px; overflow:hidden;'>Current price: </span>");
                $(document).find('.Add-to-cart-popup').find('.listprice').before("<span class='visually-hidden' style='position:absolute; left:-10000px; top:auto; width:1px; height:1px; overflow:hidden;'>Original price: </span>");
            }
            $(document).find('.Add-to-cart-popup').find('.listprice').html('$'+price.toFixed(2));
            $(document).find('.Add-to-cart-popup').find('.qty-count-popup').html(qty);
            $(document).find('.Add-to-cart-popup').addClass("active");
            $(document).find('body').addClass("noScroll");
            if(require.mozuData('pagecontext').url.indexOf('search-results')<0){
                var owl = $(document).find('.rec-prod-list-popup');    
                owl.trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
                owl.find('.owl-stage-outer').children().unwrap();
                $(document).find('#rec-prod-list-popup').html('');
                $(document).find('.recommended-product-container').find('.mz-productlisting').each(function(){
                    $(document).find('#rec-prod-list-popup').append($(this)[0].outerHTML);
                });
                var stagePadding = 25;
                var margindesktop = 14;
                var loop = false,nav=true;
                if($(".rec-prod-list-popup .row.mz-productlisting").length >= 2) {
                  loop = true; 
                } else {
                  loop = false; 
                }
                if($(window).width() <= 767){
                  stagePadding = 20;
                  margindesktop = 4;
                }
                owl.owlCarousel({  
                    loop: loop, 
                    margin: margindesktop,
                    dots: false,
                    autoPlay: false,  
                    pagination: false,   
                    nav: true,     
                    navText:false,
                    slideBy: 1,
                    items: 1,
                    center: false,
                    stagePadding : stagePadding,
                    responsive: {    
                        0: {
                            items: 1
                        },
                        400: {
                            items: 1
                        },
                        767: {
                            items: 2
                        },
                        800: {
                            items: 3  
                        }, 
                        1440: {
                            items: 3
                        }
                    } 
                });
                $(document).find('.Add-to-cart-popup').find('.popup-head h1').focus();
                loopInAddTocart(); 
            }else{
                $(document).find('#addtocart-popup-rec-prod-sec').css({"background":'#fff'});
                $(document).find('#addtocart-popup-rec-prod-sec .head-rec-prod-list').hide();
            }
        } 

        $(document).on('click', '.cross-close-popup',function(){
            $(document).find('.Add-to-cart-popup').hide();
            $(document).find('.Add-to-cart-popup').removeClass("active");
            $(document).find('body').removeClass("noScroll");
            //trigger.focus();
        });

        $(document).keyup(function(e) {
            if ((e.keyCode === 27 ||e.keyCode === 13) && $('.Add-to-cart-popup').hasClass("active") && $(e.target).hasClass('cross-close-popup')) {
                $('.cross-close-popup').trigger('click');
            }
        });

        $(document).on('click', '.continue-shoping  ',function(){
            $(document).find('.Add-to-cart-popup').removeClass("active");
            $(document).find('body').removeClass("noScroll");
        });
    });
});
