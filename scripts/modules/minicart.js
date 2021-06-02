define([
    "modules/jquery-mozu", 
    "hyprlive",
	"underscore",
    "modules/backbone-mozu",
    'modules/cart-monitor',
    'modules/models-cart'
    ],function ($, Hypr, _, Backbone, CartMonitor, CartModels) {

        /**
         * Mini cart mozu view 
         **/ 
        var utag_data,checkMy = false,myCart,
            ThresholdMessageView = Backbone.MozuView.extend({
          templateName: 'modules/cart/cart-discount-threshold-messages'
        });
        var MiniCartView = window.MiniCartView = Backbone.MozuView.extend({
            templateName: "modules/page-header/softcart",
            initialize: function () { 
                var me = this;
                me.messageView = new ThresholdMessageView({
                  el: $('#mz-discount-threshold-messages'),
                  model: this.model
                });
            },
            getRenderContext: function () {
                var noShippingProducts = Hypr.getThemeSetting('noFreeShippingSkuList').replace(/ /g, "").split(','); 
                var noshippingTotal = 0;
                // console.log(noShippingProducts); 
                if(require.mozuData("pagecontext").pageType != "cart") {                    
                    window.cartModel.checkBOGA();
                }
                CartMonitor.update(); 
                var c = Backbone.MozuView.prototype.getRenderContext.apply(this, arguments);
                c.model.isNoShipping = false;
                var cartId = [],cartQty = [], cartPrice = [];
                for(var i=0; i<c.model.items.length;i++) {
                    var data = ""+c.model.items[i].quantity;
                    var data1 = ""+c.model.items[i].product.price.salePrice;
                    c.model.items[i].isNoShipping = noShippingProducts.indexOf(c.model.items[i].product.productCode) >= 0 ? true : false; 
                    if(noShippingProducts.indexOf(c.model.items[i].product.productCode) == -1){
                        noshippingTotal = noshippingTotal+c.model.items[i].total;
                    }
                    if(noShippingProducts.indexOf(c.model.items[i].product.productCode) >= 0) c.model.isNoShipping = true;
                    cartId.push(c.model.items[i].product.productCode);
                    cartQty.push(data);
                    cartPrice.push(data1); 
                }
                
                var total=c.model.discountedTotal;
                var amt = 0;      
                if(!c.model.isNoShipping){
                    if(total<Hypr.getThemeSetting('freeshippingBoundingValue')){                                          
                        amt=(Hypr.getThemeSetting('freeshippingBoundingValue')-parseFloat(total,10)).toFixed(2);
                        c.model.remainingfreeshippinng=amt;
                    }else{
                        c.model.remainingfreeshippinng=0; 
                    }
                }else{
                    if(noshippingTotal<Hypr.getThemeSetting('freeshippingBoundingValue')){
                        amt=(Hypr.getThemeSetting('freeshippingBoundingValue')-parseFloat(noshippingTotal,10)).toFixed(2);
                        c.model.remainingfreeshippinng=amt;
                    }else{
                        c.model.remainingfreeshippinng=0; 
                    }
                }
				c.model.hasHeatSensitive = false;
				if(Hypr.getThemeSetting('showHeatSensitiveText')) {
					_.each(c.model.items, function(item) {
						_.each(item.product.categories, function(category) {
							if(category.id == Hypr.getThemeSetting("heatSensitiveCategoryId"))
								{ c.model.hasHeatSensitive = true; }
						});
					});
				}

                $(".softCartId").html(JSON.stringify(cartId));
                $(".softCartQty").html(JSON.stringify(cartQty));
                $(".softCartPrice").html(JSON.stringify(cartPrice));
                //$('.mz-utilitynav-link-cart').data('tealium',JSON.stringify(cartItem));
                if(checkMy) c.model.items[0].initMybuys = true;

                // Progress bar
                var self = this;
                if(c.model.total > 0){
                    $(document).find('.progress-bar').show();
                    setTimeout(function(){
                        if(c.model.isNoShipping){
                            self.progressbar(noshippingTotal, c.model.hasHeatSensitive, c.model.isNoShipping);
                        }else{
                            self.progressbar(c.model.total, c.model.hasHeatSensitive, c.model.isNoShipping);    
                        }
                        self.addClasstodivs();
                    },1000);                    
                }else{
                    setTimeout(function(){
                        if(c.model.isNoShipping){
                            self.progressbar(noshippingTotal, c.model.hasHeatSensitive, c.model.isNoShipping);
                        }else{
                            self.progressbar(c.model.total, c.model.hasHeatSensitive, c.model.isNoShipping);    
                        }
                        $(document).find('.progress-bar').hide();
                        self.addClasstodivs();
                    },1000);                       
                }
                
                
                $( window ).on( "orientationchange", function( event ) {
                    $(document).find('.progress-bar').show();
                    setTimeout(function(){
                        if(c.model.isNoShipping){
                            self.progressbar(noshippingTotal, c.model.hasHeatSensitive, c.model.isNoShipping);
                        }else{
                            self.progressbar(c.model.total, c.model.hasHeatSensitive, c.model.isNoShipping);    
                        } 
                        self.addClasstodivs();
                    },500);                    
                });
                return c;             
            },       
            progressbar: function(total,hasheatsensitive,isNoFreeShip){
                $(document).find(".meter").find("span").each(function() {
                    var currentWidth = $(this).width();
                    var per = total * 100/Hypr.getThemeSetting('freeshippingBoundingValue');
                    per = Math.floor(per).toFixed(0);  
                    window.progressBar = false;
                    if(per < 100){     
                        $(document).find('.progress-bar').show(); 
                        $(document).find('.progress-bar').css("visibility","visible");
                        $(this).css('width',per+"%");                      
                        $(this)
                            .data("origWidth", $(this).width())
                            .width(currentWidth)
                            .animate({
                                width: $(this).data("origWidth") 
                            }, 1200);   
                        $(document).find('.meter').removeClass('green');   
                        if(!$(document).find('.meter').hasClass('blue')){
                            $(document).find('.meter').addClass('blue');
                        }  
                        if(per > 0){  
                        //if(per > 0 && !hasheatsensitive){
                            if(isNoFreeShip){
                                $(document).find('.text-content').html("<strong>"+per+"% complete.</strong> Add $"+(Hypr.getThemeSetting('freeshippingBoundingValue')-total).toFixed(2)+" more to get Discounted Shipping. Click for Details");
                            }else{
                                $(document).find('.text-content').html("<strong>"+per+"% complete.</strong> Add $"+(Hypr.getThemeSetting('freeshippingBoundingValue')-total).toFixed(2)+" more to get Free Ground Shipping. Click for Details");
                            }
                            if($(document).find('body').hasClass('mz-category') || $(document).find('body').hasClass('mz-searchresults')){
                                $(document).find('.mz-pageheader-desktop').addClass('topZero');
                                $(document).find('.mz-sitenav.mz-desktop').addClass('topZero'); 
                                if($(document).find('body').hasClass('mz-category')){
                                    $(document).find('.mz-l-pagecontent').addClass('topZero');
                                }
                                if($(document).find('body').hasClass('mz-category') && !$(document).find('body').hasClass('mz-searchresults') && !$(document).find('body').hasClass('mz-noresults') && $(window).width() > 767){
                                    $(document).find('.mz-breadcrumbs').addClass('topZero');
                                }else if($(window).width() > 767){
                                    $(document).find('.mz-l-container').addClass('topZero');    
                                }   
                            } 
                            if($(window).width() <= 767){ 
                                if(isNoFreeShip){
                                    $(document).find('.text-content').html("Add $"+(Hypr.getThemeSetting('freeshippingBoundingValue')-total).toFixed(2)+" for Discounted Shipping. Details <p class='underline'>Here</p>.");       
                                }else{
                                    $(document).find('.text-content').html("Add $"+(Hypr.getThemeSetting('freeshippingBoundingValue')-total).toFixed(2)+" for Free Ground Shipping. Details <p class='underline'>Here</p>.");  
                                }
                                $(document).find('.mz-pageheader-mobile').addClass('zerotag-mobile');
                                $(document).find('.mz-l-pagecontent').addClass('zerotag-mobile');
                                if($(document).find('body').hasClass('mz-myaccount')){
                                    $(document).find('.mobile-popupmenu-myaccount.mz-mobile').addClass('zerotag-mobile');
                                }
                            }else if($(document).find('body').hasClass('Mobile-device')){
                                if(isNoFreeShip){
                                    $(document).find('.text-content').html("Add $"+(Hypr.getThemeSetting('freeshippingBoundingValue')-total).toFixed(2)+" for Discounted Shipping. Details <p class='underline'>Here</p>.");      
                                }else{
                                    $(document).find('.text-content').html("Add $"+(Hypr.getThemeSetting('freeshippingBoundingValue')-total).toFixed(2)+" for Free Ground Shipping. Details <p class='underline'>Here</p>.");  
                                }
                                $(document).find('.mz-pageheader-mobile').addClass('zerotag-mobile');
                                $(document).find('.mz-l-pagecontent').addClass('zerotag-mobile');
                                if($(document).find('body').hasClass('mz-myaccount')){
                                    $(document).find('.mobile-popupmenu-myaccount.mz-mobile').addClass('zerotag-mobile');
                                }    
                            }    
                        }else{
                            $(document).find('.progress-bar').hide();
                            $(document).find('.progress-bar').css("visibility","hidden");
                            if(isNoFreeShip){
                                $(document).find('.text-content').html("Add $"+Hypr.getThemeSetting('freeshippingBoundingValue')+" to get Discounted Shipping. Click for Details");
                            }else{
                                $(document).find('.text-content').html("Add $"+Hypr.getThemeSetting('freeshippingBoundingValue')+" to get Free Ground Shipping. Click for Details");
                            }
                            if($(document).find('body').hasClass('mz-category') || $(document).find('body').hasClass('mz-searchresults')){
                                $(document).find('.mz-pageheader-desktop').removeClass('topZero');
                                $(document).find('.mz-sitenav.mz-desktop').removeClass('topZero');
                                if($(document).find('body').hasClass('mz-category')){
                                    $(document).find('.mz-l-pagecontent').removeClass('topZero');
                                }
                                if($(document).find('body').hasClass('mz-category') && !$(document).find('body').hasClass('mz-searchresults') && !$(document).find('body').hasClass('mz-noresults') && $(window).width() > 767){
                                    $(document).find('.mz-breadcrumbs').removeClass('topZero');
                                }else if($(window).width() > 767){
                                    $(document).find('.mz-l-container').removeClass('topZero');    
                                }   
                            } 
                            if($(window).width() <= 767){
                                $(document).find('.mz-pageheader-mobile').removeClass('zerotag-mobile');
                                $(document).find('.mz-l-pagecontent').removeClass('zerotag-mobile');
                                if($(document).find('body').hasClass('mz-myaccount')){
                                    $(document).find('.mobile-popupmenu-myaccount.mz-mobile').removeClass('zerotag-mobile');
                                }
                            }else if($(document).find('body').hasClass('Mobile-device')){
                                $(document).find('.mz-pageheader-mobile').removeClass('zerotag-mobile');
                                $(document).find('.mz-l-pagecontent').removeClass('zerotag-mobile');
                                if($(document).find('body').hasClass('mz-myaccount')){
                                    $(document).find('.mobile-popupmenu-myaccount.mz-mobile').removeClass('zerotag-mobile');
                                }  
                            }     
                        }
                    }else if(!hasheatsensitive || hasheatsensitive){ 
                        $(document).find('.progress-bar').show();
                        $(document).find('.progress-bar').css("visibility","visible");
                        $(this).css('width',"100%");
                        $(this)
                            .data("origWidth", $(this).width())
                            .width(currentWidth)
                            .animate({
                                width: $(this).data("origWidth")
                            }, 1200); 
                            $(document).find('.meter').removeClass('blue');
                            if(!$(document).find('.meter').hasClass('green')){
                                $(document).find('.meter').addClass('green');   
                            }     
                            if(isNoFreeShip){
                                $(document).find('.text-content').html("<strong>Congratulations,</strong> you qualify for Discounted Shipping! Click for Details.");
                            }else{
                                $(document).find('.text-content').html("<strong>Congratulations,</strong> you qualify for Free Ground Shipping! Click for Details.");
                            }
                            if($(document).find('body').hasClass('mz-category') || $(document).find('body').hasClass('mz-searchresults')){
                                $(document).find('.mz-pageheader-desktop').addClass('topZero');
                                $(document).find('.mz-sitenav.mz-desktop').addClass('topZero');
                                if($(document).find('body').hasClass('mz-category')){
                                    $(document).find('.mz-l-pagecontent').addClass('topZero');
                                }
                                if($(document).find('body').hasClass('mz-category') && !$(document).find('body').hasClass('mz-searchresults') && !$(document).find('body').hasClass('mz-noresults') && $(window).width() > 767){
                                    $(document).find('.mz-breadcrumbs').addClass('topZero');
                                }else if($(window).width() > 767){
                                    $(document).find('.mz-l-container').addClass('topZero');    
                                }  
                            }
                            if($(window).width() <= 767){
                                if(isNoFreeShip){
                                    $(document).find('.text-content').html("<strong>Congratulations,</strong> you qualify for Discounted Shipping!");
                                }else{
                                    $(document).find('.text-content').html("<strong>Congratulations,</strong> you qualify for Free Ground Shipping!");
                                }
                                $(document).find('.mz-pageheader-mobile').addClass('zerotag-mobile');
                                $(document).find('.mz-l-pagecontent').addClass('zerotag-mobile');
                                if($(document).find('body').hasClass('mz-myaccount')){
                                    $(document).find('.mobile-popupmenu-myaccount.mz-mobile').addClass('zerotag-mobile');
                                }
                            }else if($(document).find('body').hasClass('Mobile-device')){
                                if(isNoFreeShip){
                                    $(document).find('.text-content').html("<strong>Congratulations,</strong> you qualify for Discounted Shipping!");   
                                }else{
                                    $(document).find('.text-content').html("<strong>Congratulations,</strong> you qualify for Free Ground Shipping!");
                                }
                                $(document).find('.mz-pageheader-mobile').addClass('zerotag-mobile');
                                $(document).find('.mz-l-pagecontent').addClass('zerotag-mobile');
                                if($(document).find('body').hasClass('mz-myaccount')){
                                    $(document).find('.mobile-popupmenu-myaccount.mz-mobile').addClass('zerotag-mobile');
                                } 
                            }    
                    }else{
                        $(document).find('.progress-bar').hide();
                        $(document).find('.progress-bar').css("visibility","hidden");
                        if(isNoFreeShip){
                            $(document).find('.text-content').html("Add $"+Hypr.getThemeSetting('freeshippingBoundingValue')+" to get Discounted Shipping. Click for Details");      
                        }else{
                            $(document).find('.text-content').html("Add $"+Hypr.getThemeSetting('freeshippingBoundingValue')+" to get Free Ground Shipping. Click for Details");   
                        }
                        if($(document).find('body').hasClass('mz-category') || $(document).find('body').hasClass('mz-searchresults')){
                            $(document).find('.mz-pageheader-desktop').removeClass('topZero');
                            $(document).find('.mz-sitenav.mz-desktop').removeClass('topZero'); 
                            
                            if($(document).find('body').hasClass('mz-category') && !$(document).find('body').hasClass('mz-searchresults') && !$(document).find('body').hasClass('mz-noresults') && $(window).width() > 767){
                                $(document).find('.mz-breadcrumbs').removeClass('topZero');
                            }else if($(window).width() > 767){
                                $(document).find('.mz-l-container').removeClass('topZero');    
                            }   
                        }    
                        if($(window).width() <= 767){
                            $(document).find('.mz-pageheader-mobile').removeClass('zerotag-mobile');
                            $(document).find('.mz-l-pagecontent').removeClass('zerotag-mobile');
                            if($(document).find('body').hasClass('mz-myaccount')){
                                $(document).find('.mobile-popupmenu-myaccount.mz-mobile').removeClass('zerotag-mobile');
                            }
                        }else if($(document).find('body').hasClass('Mobile-device')){
                            $(document).find('.mz-pageheader-mobile').removeClass('zerotag-mobile');
                            $(document).find('.mz-l-pagecontent').removeClass('zerotag-mobile'); 
                            if($(document).find('body').hasClass('mz-myaccount')){
                                $(document).find('.mobile-popupmenu-myaccount.mz-mobile').removeClass('zerotag-mobile');
                            }
                        } 
                    }    
                }); 
            }, 
            addClasstodivs: function(){
                setTimeout(function(){
                    if($(document).find('body').hasClass('mz-searchresults') || $(document).find('body').hasClass('mz-category') && $(window).width() > 767){
                        if($(document).find('.progress-bar').filter(':visible').length > 0){
                            $(document).find('.skipto').on('focus', function(e){
                                $(document).find('.progress-bar').removeClass('skiptomaincontentnopb');
                                $(document).find('.mz-pageheader-desktop').removeClass('skiptomaincontentnopb');
                                $(document).find('.skipto').removeClass('skiptomaincontentnopb'); 
                                $(document).find('.mz-sitenav.mz-desktop').removeClass('skiptomaincontentnopb');
                                $(document).find('.mz-pageheader-mobile').removeClass('skiptomaincontentnopb');
                                $(document).find('.progress-bar').addClass('skiptomaincontent');
                                $(document).find('.mz-pageheader-desktop').addClass('skiptomaincontent');
                                $(document).find('.skipto').addClass('skiptomaincontent');
                                $(document).find('.mz-sitenav.mz-desktop').addClass('skiptomaincontent');
                                $(document).find('.mz-pageheader-mobile').addClass('skiptomaincontent');    
                            
                            });
                            $(document).find('.skipto').on('focusout', function(e){
                                $(document).find('.progress-bar').removeClass('skiptomaincontent');
                                $(document).find('.mz-pageheader-desktop').removeClass('skiptomaincontent');
                                $(document).find('.skipto').removeClass('skiptomaincontent'); 
                                $(document).find('.mz-sitenav.mz-desktop').removeClass('skiptomaincontent');
                                $(document).find('.mz-pageheader-mobile').removeClass('skiptomaincontent');
                            });
                        }else{
                            $(document).find('.skipto').on('focus', function(e){
                                $(document).find('.progress-bar').removeClass('skiptomaincontent');
                                $(document).find('.mz-pageheader-desktop').removeClass('skiptomaincontent');
                                $(document).find('.skipto').removeClass('skiptomaincontent'); 
                                $(document).find('.mz-sitenav.mz-desktop').removeClass('skiptomaincontent');
                                $(document).find('.mz-pageheader-mobile').removeClass('skiptomaincontent');
                                $(document).find('.progress-bar').addClass('skiptomaincontentnopb');
                                $(document).find('.mz-pageheader-desktop').addClass('skiptomaincontentnopb');
                                $(document).find('.skipto').addClass('skiptomaincontentnopb');
                                $(document).find('.mz-sitenav.mz-desktop').addClass('skiptomaincontentnopb');
                                $(document).find('.mz-pageheader-mobile').addClass('skiptomaincontentnopb');    
                            
                            });
                            $(document).find('.skipto').on('focusout', function(e){
                                $(document).find('.progress-bar').removeClass('skiptomaincontentnopb');
                                $(document).find('.mz-pageheader-desktop').removeClass('skiptomaincontentnopb');
                                $(document).find('.skipto').removeClass('skiptomaincontentnopb'); 
                                $(document).find('.mz-sitenav.mz-desktop').removeClass('skiptomaincontentnopb');
                                $(document).find('.mz-pageheader-mobile').removeClass('skiptomaincontentnopb');
                            });
                        }
                    }
                    if($(window).width() <= 767){
                        if($(document).find('.progress-bar').filter(':visible').length > 0){
                            $(document).find('.skipto').on('focus', function(e){
                                $(document).find('.progress-bar').removeClass('skiptomaincontentnopb');
                                $(document).find('.skipto').removeClass('skiptomaincontentnopb'); 
                                $(document).find('.mz-pageheader-mobile').removeClass('skiptomaincontentnopb');
                                $(document).find('.progress-bar').addClass('skiptomaincontent');
                                $(document).find('.skipto').addClass('skiptomaincontent');
                                $(document).find('.mz-pageheader-mobile').addClass('skiptomaincontent');    
                            
                            });
                            $(document).find('.skipto').on('focusout', function(e){
                                $(document).find('.progress-bar').removeClass('skiptomaincontent');
                                $(document).find('.skipto').removeClass('skiptomaincontent'); 
                                $(document).find('.mz-pageheader-mobile').removeClass('skiptomaincontent');
                            });
                        }else{
                            $(document).find('.skipto').on('focus', function(e){
                                $(document).find('.progress-bar').removeClass('skiptomaincontent');
                                $(document).find('.skipto').removeClass('skiptomaincontent'); 
                                $(document).find('.mz-pageheader-mobile').removeClass('skiptomaincontent');
                                $(document).find('.progress-bar').addClass('skiptomaincontentnopb');
                                $(document).find('.skipto').addClass('skiptomaincontentnopb');
                                $(document).find('.mz-pageheader-mobile').addClass('skiptomaincontentnopb');    
                            
                            });
                            $(document).find('.skipto').on('focusout', function(e){
                                $(document).find('.progress-bar').removeClass('skiptomaincontentnopb');
                                $(document).find('.skipto').removeClass('skiptomaincontentnopb'); 
                                $(document).find('.mz-pageheader-mobile').removeClass('skiptomaincontentnopb');
                            });
                        }
                    }
                },500);
            },   
            showMiniCart: function($target){
                checkMy = true;
                this.model.apiGet();
                if($(window).width() < 768) {
                    $('.jb-mobile-minicart-popups').fadeToggle('slow', function(){ 
                        $('.jb-mobile-minicart-popups').attr('tabindex','-1');
                        $('.jb-mobile-minicart-popups').focus();
                        $('.jb-mobile-minicart-popups').delay(Hypr.getThemeSetting('mobileAddToCartPopupTimer') * 1000).fadeOut(500, function(){
                            if($target)
                                $target.focus();
                        });
                    });
                }
                else {
                    setTimeout(function(){ 
                        $('.jb-minicart-popup').fadeToggle('slow',function() {
                            $('.jb-minicart-popup').delay(6000).fadeOut(500, function(){   
                                if($target)
                                    $target.focus();
                            });
                            if( $('.jb-minicart-popup').is(':visible') ) {
                                $(this).focus();
                            }
                        });
                    }, 1000);
                }
                //$(window).scrollTop(0);
            },
            updateMiniCart: function(){
              if(require.mozuData("pagecontext").pageType != "checkout") {
                this.model.apiGet().then(function(){
                    window.hideGlobalOverlay();
                }).catch(function(err){
                    console.log(" update minicart api get error ",err);
                });
              }
            },
            showCartval: function() {
            },
            render:function() {
            //console.log(" this--- render minicart",this);
               Backbone.MozuView.prototype.render.apply(this);
           }
        });
        var cartModel = window.cartModel = new CartModels.Cart(),
        miniCartView = new MiniCartView({
            el: $('[data-mz-minicart]'),
            model: cartModel
        });

    $(document).ready(function(){
        if(require.mozuData("pagecontext").pageType != "checkout") {
          cartModel.apiGet();
        }
        var myDomElement = null; 
        $(document).mousemove(function(e) {
            // console.log($(e.target));
            myDomElement = $(e.target); 
        });
        
        // var progressBar = window.progressBar = true;

        // $(document).on('click',function(){
        //     setTimeout(function(){
        //         window.progressBar = true;
        //     },2000);    
        // });

        //Show hide mincart
        if(!!('ontouchstart' in window)){
            $(document).on({
                click: function (e) { 
                    if($('.jb-minicart-popup').css('display') == 'none'){
                        e.preventDefault();
                        e.stopPropagation();
                        cartModel.apiGet();
                        $('.jb-minicart-popup').show();
                        if(!require.mozuData('user').isAuthenticated && !require.mozuData('user').isAnonymous){
                            $(document).find('.popover-content.login').hide();
                        } else {
                            $(document).find('.popover-content.myaccount').hide();
                        }
                    }
                }
            }, ".mz-utilitynav-link-cart,.jb-minicart-popup,.jb-mobile-minicart-popups");    
            $(document).click(function(e) {
                if(! ($('.jb-minicart-popup').is(e.target) || $('.mz-utilitynav-link-cart').is(e.target)) ){
                    if($('.jb-minicart-popup').css('display') == 'block'){
                        $('.jb-minicart-popup').hide();
                    }
                }else{
                    e.preventDefault();
                    cartModel.apiGet();
                    $('.jb-minicart-popup').show();
                    if(!require.mozuData('user').isAuthenticated && !require.mozuData('user').isAnonymous){
                            $(document).find('.popover-content.login').hide();
                        } else {
                            $(document).find('.popover-content.myaccount').hide();
                        }
                }
            });
        }else{
            $(document).on({
                mouseenter: function (e) { 
                    // cartModel.apiGet();
                    $('.jb-minicart-popup').show();
                    if((require.mozuData("user").isAuthenticated) && !(require.mozuData("user").isAnonymous)){
                            $(document).find('.popover-content.myaccount').hide();
                        } else {
                         $(document).find('.popover-content.login').hide();
                        }
                },
                mouseleave: function (e) {
                    setTimeout(function(){
                        if(!(myDomElement.hasClass('jb-minicart-popup') || myDomElement.parents().hasClass('jb-minicart-popup') || myDomElement.parents().hasClass('mz-utilitynav-link-cart') || myDomElement.hasClass('mz-utilitynav-link-cart') || myDomElement.hasClass('jb-minicart-popup') || myDomElement.parents().hasClass('jb-minicart-popup'))){
                            $('.jb-minicart-popup').hide();
                        }
                    },100);  
                }
            }, ".mz-utilitynav-link-cart,.jb-minicart-popup");
            
            $(document).on('focus','.mz-utilitynav-link-cart', function(e) {
                //$('.jb-minicart-popup').show();
                $(this).trigger('mouseover');
                $(this).parents('.mz-utilitynav').next().focus();
            });
            
            $(document).on('keydown','.jb-minicart-popup', function(e){
                var $prevFocusEl = $(document).find('.mz-utilitynav');
                if(e.keyCode == 27) {
                    $(".jb-minicart-popup").hide();
                }
                
                if(e.which == 9 && e.shiftKey) {
                    if( ( $(document.activeElement)[0] == $(this)[0] ) || ( $(document.activeElement)[0] == $(this).find('.jb-minicart-items-container li')[0] ) ) {
                        if((require.mozuData("user").isAuthenticated) && !(require.mozuData("user").isAnonymous)){
                            $(document).find('.mz-utilitynav-content span').focus(); 
                        } else {

                            $(document).find('.mz-utilitynav-content span').focus(); 
                        }
                        $(".jb-minicart-popup").hide();
                        e.preventDefault();
                    }
                }
                else if(e.keyCode == 9) {
                    if($(document.activeElement)[0] == $(this).find('.submitButton')[0]) { 
                        $(".jb-minicart-popup").hide(); 
                        $(document).find('.mz-sitenav-list').find('.mz-sitenav-item').first().find('a').focus();
                        e.preventDefault();
                    } 
                    else if( $(this).find('.no-items-found-message')[0] ) {
                        $(".jb-minicart-popup").hide();
                        $(document).find('.mz-sitenav-list').find('.mz-sitenav-item').first().find('a').focus();
                        e.preventDefault();
                    }
                }
            });
        }
        //  miniCartView.render();
       
    window.miniCartView = miniCartView;  
              
        // $('.jb-mobile-minicart-popups').css({ display: "block" });

        $('body').delegate('.close-mobile-minicart-popup','click', function(){
            $(".jb-mobile-minicart-popups").hide();
        });
    });
    
    return { MiniCart:miniCartView };
});



