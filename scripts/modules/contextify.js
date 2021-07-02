define(['modules/jquery-mozu',
        "modules/api",  
        'shim!vendor/jquery.hoverIntent[jquery=jQuery]>jQuery'], function ($,api) {
    $(document).ready(function () {
        // mega new menu functions 
        window.invokeContextify = function invokeContextify(){
           console.log(" invokeContextify called");
            var myDomElement = null; 
            $(document).mousemove(function(e) {
                myDomElement = $(e.target);
            });
            if($(window).width() >= 768){
                    $(document).find('.isDesktop .nav-cointainer,.head-list-item').on({
                        mouseleave: function (e) { 
                            //stuff to do on mouse leave 
                            setTimeout(function(){  
                                if(!(myDomElement.hasClass('.isDesktop head-list-item-li') || myDomElement.parents().hasClass('head-list-item-li') || myDomElement.parents().hasClass('mz-sitenav') || myDomElement.hasClass('mz-sitenav') || myDomElement.hasClass('nav-list-head-cointainer'))){
                                    megamenufunctions.closemenu(); 
                                }
                            },1000); 
                        } 
                    });    
                    $(document).find('.isDesktop .head-list-item').on({
                        mouseenter: function (e) {
                            setTimeout(function(){
                                megamenufunctions.showMenuNav($(e.currentTarget));
                            }, 400);
                        }
                    });
        
                    $(document).find('.isDesktop .menu').find('.sunmenu-container').on({
                        mouseenter: function (e) {                    
                            setTimeout(function(){
                                if(myDomElement.hasClass('nav-sub-ele') || myDomElement.parents().hasClass('nav-sub-ele')){   
                                    megamenufunctions.showSubmenu($(e.currentTarget));
                                }
                            }, 200);
                        }
                    });
        
                    $(document).find('.isDesktop .item-name-list').on({
                    mouseenter: function (e) {
                       megamenufunctions.togglemicroMenu($(e.currentTarget));
                    }
                });
            }else{
                $(document).find('.isMobile .head-list-item').on('click',function(e){
                    megamenufunctions.mobileFunc.showMenuNav($(e.currentTarget));
                });
                $(document).find('.isMobile .close-menu-icon').on('click',function(e){
                    megamenufunctions.mobileFunc.closemenu($(e.currentTarget));    
                });
                $(document).find('.isMobile .menu').find('.sunmenu-container').on('click',function(e){
                    megamenufunctions.mobileFunc.showSubmenu($(e.currentTarget));   
                });
                $(document).find('.isMobile .back-to-main-menu').on('click',function(e){ 
                    megamenufunctions.mobileFunc.backToMainMenu($(e.currentTarget));   
                });
            } 
            
            //On scroll hide header and footer in mobile ladscape
            // Hide Header on on scroll down
            var didScroll;
            var lastScrollTop = 0;
            var delta = 5;
            var navbarHeight = $('header').outerHeight();
            
            $(window).scroll(function(event){
                if($(window).width()<1025 && ($(window).width() > $(window).height())){    
                    didScroll = true;
                }
            });
            
            setInterval(function() {
                if (didScroll) {
                    hasScrolled();
                    didScroll = false;
                }
            }, 250);
            
            function hasScrolled() {
                var st = $(this).scrollTop();
                
                // Make sure they scroll more than delta
                if(Math.abs(lastScrollTop - st) <= delta)
                    return;
                
                // If they scrolled down and are past the navbar, add class .nav-up.
                // This is necessary so you never see what is "behind" the navbar.
                if (st > lastScrollTop && st > navbarHeight){
                    // Scroll Down
                   $(".mz-pageheader-mobile").fadeOut(100); 
                } else {
                    // Scroll Up
                    if(st + $(window).height() < $(document).height()) {
                        $(".mz-pageheader-mobile").fadeIn(100);
                    }
                }
        
                lastScrollTop = st;
            }
            $( window ).on( "orientationchange", function( event ) {
                if($(window).width()<1025 && ($(window).width() < $(window).height())){  
                    $(".mz-pageheader-mobile").fadeIn(100);
                }
            });
            $(document).on('click', '.item-name-list', function(e){
                megamenufunctions.togglemicroMenu($(e.currentTarget));
            });
            var megamenufunctions = {
                showMenuNav : function(ele){
                    $(document).find('.mz-sitenav').addClass('active');
                    var menu = ele.attr('attr-menuname');
                    if(menu && menu !== "store-locator" && menu != "store-branding"){  
                        $(document).find('.head-list-item').removeClass('active'); 
                        $(document).find('.head-list-item[attr-menuname="'+menu+'"]').addClass('active');
                        $(document).find('.mz-sitenav').find('.jb-megamenu').removeClass('active');
                        $(document).find('.mz-sitenav').find('.'+menu).addClass('active');
                        $(document).find('.mz-sitenav').find('.'+menu).find('.menu').find('.sunmenu-container').removeClass('active');
                        $(document).find('.mz-sitenav').find('.'+menu).find('.menu').find('.sunmenu-container').first().addClass('active');
                        $(document).find('.mz-sitenav').find('.'+menu).find('.submenu').find('.sunmenu-container').removeClass('active');
                        $(document).find('.mz-sitenav').find('.'+menu).find('.submenu').find('.sunmenu-container').first().addClass('active');
                    }else if(menu === "store-locator" || menu === "store-branding"){ 
                        $(document).find('.head-list-item').removeClass('active');
                        $(document).find('.mz-sitenav').removeClass('active');
                        $(document).find('.mz-sitenav').find('.jb-megamenu').removeClass('active');
                        $(document).find('.mz-sitenav').find('.jb-megamenu').find('.menu').find('.sunmenu-container').removeClass('active');
                        $(document).find('.mz-sitenav').find('.jb-megamenu').find('.submenu').find('.sunmenu-container').removeClass('active');
                    }
                },
                closemenu : function(){ 
                    $(document).find('.head-list-item').removeClass('active');
                    $(document).find('.mz-sitenav').removeClass('active');
                    $(document).find('.mz-sitenav').find('.jb-megamenu').removeClass('active');
                    $(document).find('.mz-sitenav').find('.jb-megamenu').find('.menu').find('.sunmenu-container').removeClass('active');
                    $(document).find('.mz-sitenav').find('.jb-megamenu').find('.submenu').find('.sunmenu-container').removeClass('active');   
                }, 
                showSubmenu : function(ele){
                    if(ele.hasClass('nav-sub-ele')){
                        var visibleDom = $(document).find('.mz-sitenav').find('.jb-megamenu').filter(':visible');
                        visibleDom.find('.menu').find('.sunmenu-container').removeClass('active');
                        ele.addClass('active');
                        visibleDom.find('.submenu').find('.sunmenu-container').removeClass('active');
                        visibleDom.find('.submenu').find('.sunmenu-container[data-attr="'+ele.attr('id')+'"]').first().addClass('active');
                    }
                },
                togglemicroMenu : function(ele){
                    if($(window).width() >= 768){
                        if(ele.hasClass('active')){
                            // ele.next('.micromenu').removeClass('active');
                            // ele.removeClass('active'); 
                        }else{
                            $(document).find('.micromenu').removeClass('active');
                            $(document).find('.item-name-list').removeClass('active');
                            ele.next('.micromenu').addClass('active');
                            ele.addClass('active');
                        }
                    }else{
                        if(ele.hasClass('active')){
                            ele.next('.micromenu').removeClass('active');
                            ele.removeClass('active'); 
                        }else{
                            $(document).find('.micromenu').removeClass('active');
                            $(document).find('.item-name-list').removeClass('active');
                            ele.next('.micromenu').addClass('active');
                            ele.addClass('active');
                        } 
                    }
                },
                loopinMenu : function(ele){
                    var inputs = window.inputs = null;
                    var firstInput = window.firstInput = null;
                    var lastInput = window.lastInput = null;
                    inputs = window.inputs = ele.find('select, input, textarea, button, a, [tabindex="0"]').filter(':visible');
                    firstInput = window.firstInput = window.inputs.first();
                    lastInput = window.lastInput = window.inputs.last();

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

                // go back to parent menu
                window.inputs.on('keydown', function(e){
                    if(e.which === 27){
                        e.preventDefault();
                        if($(e.target).parents().hasClass('micromenu')){
                            $(e.target).parents('.micromenu').prev('.item-name-list').focus();
                            megamenufunctions.togglemicroMenu($(e.target).parents('.micromenu').prev('.item-name-list'));
                        }else if($(e.target).parents().hasClass('submenu')){
                            $(e.target).parents('.submenu').prev('.menu').find('.sunmenu-container.active').find('select, input, textarea, button, a, [tabindex="0"]').focus(); 
                            megamenufunctions.loopinMenu($(e.target).parents('.submenu').prev('.menu'));
                        }else if($(e.target).parents().hasClass('menu')){
                            $(document).find('.nav-header').find('.head-list-item.active').focus();    
                            megamenufunctions.closemenu();
                        } 
                    }
                });
            },
            mobileFunc : {  
                showMenuNav : function(ele){
                    $(document).find('.mz-sitenav.mz-mobile').addClass('active');
                        $("html").addClass("removeScroll");
                    var menuName = ele.attr('attr-menuname');
                    $(document).find('.jb-megamenu').removeClass('active');
                    $(document).find('.'+menuName).addClass('active').find('.menu').addClass('active');                    
                    $(document).find('.mz-sitenav.mz-mobile').css("top","611px");
                    $(document).find('.mz-sitenav.mz-mobile').animate({
                        top: "-2px"
                    },500);                    
                },
                closemenu : function(ele){
                    $(document).find('.mz-sitenav.mz-mobile').animate({
                        top: "611px"
                    },500); 
                    setTimeout(function(){
                             $("html").removeClass("removeScroll");
                        $(document).find('.mz-sitenav.mz-mobile').removeClass('active');
                        $(document).find('.jb-megamenu').removeClass('active');
                        $(document).find('.jb-megamenu').find('.menu').removeClass('active');
                        $(document).find('.jb-megamenu').find('.submenu').removeClass('active');
                        $(document).find('.jb-megamenu').find('.submenu').find('.sunmenu-container').removeClass('active');
                    },1000);
                },
                showSubmenu : function(ele){
                    var navMenu = ele.attr('id');
                    $(document).find('.jb-megamenu').find('.menu').removeClass('active');
                    $(document).find('.jb-megamenu').find('.submenu').removeClass('active');
                    $(document).find('.jb-megamenu').find('.submenu').find('.sunmenu-container').removeClass('active');
                    ele.parents('.menu').next('.submenu').addClass('active');
                    ele.parents('.menu').next('.submenu').find('.sunmenu-container[data-attr="'+navMenu+'"]').addClass('active');
                },    
                backToMainMenu : function(ele){
                    $(document).find('.jb-megamenu').find('.menu').removeClass('active');
                    $(document).find('.jb-megamenu').find('.submenu').removeClass('active');
                    $(document).find('.jb-megamenu').find('.submenu').find('.sunmenu-container').removeClass('active');
                    ele.parents('.submenu').prev('.menu').addClass('active');
                }
            }
        };

        //header login layover
        $(document).mousemove(function(e) { 
            if($(e.target).hasClass('mz-utilitynav-content') || $(e.target).parents().hasClass('mz-utilitynav-content')){
                $(document).find('.popover-content').addClass('active');
                }
                else{
                setTimeout(function(){if(!(myDomElement.hasClass('mz-utilitynav-content') || myDomElement.parents().hasClass('mz-utilitynav-content'))){$(document).find('.popover-content').removeClass('active');}},150);
                }
            });
            /* $(document).find('.isDesktop .mz-utilitynav-content').on({
            mouseenter: function (e) {
                $(document).find('.isDesktop .popover-content').addClass('active');
                $(document).find('..isDesktop .popover-content').show();
            }
        });
        $(document).find('.isMobile .mz-utilitynav-content').on({
            mouseenter: function (e) {
                $(document).find('.isMobile .popover-content').addClass('active');
                $(document).find('..isMobile .popover-content').show();
            }
        });*/

        // search function in mobile        
        $(document).on('submit', '#searchbox', function(e){
            if($(window).width() <= 767 && !($(e.target).parents('.page-header').hasClass('search-active'))){
                e.preventDefault(); 
                $(document).find('.page-header').addClass('search-active');
            }
        });
        $(document).on('click',function(e){
            if(!($(e.target).hasClass('mz-searchbox') || $(e.target).parents().hasClass('mz-searchbox'))){
                $(document).find('.page-header').removeClass('search-active');   
            }
        });
        $(document).on('touchstart','.close-serch',function(e){
            setTimeout(function(){
                $(document).find('.page-header').removeClass('search-active');
                $(document).find('.mz-searchbox-field').val('');
            },200);            
        });

        // trigger sweet riwards
        $(document).find('.popover-content').on('click','.sweetRewards',function(e){
            $(document).find('.zinrelo-tab').click();
        });

        $(document).on('click','.zinrelo-container', function(e){
            $(document).find('.zinrelo-tab').click();
        });

        $(document).on('click','.sweetrewardstextcontent', function(e){
            $(document).find('.zinrelo-tab').click();
        });

        // ADA for my account nav head
        $(document).on('keydown','.mz-sitenav-link',function(e){
            if(e.which == 13 || e.which == 32){
                e.preventDefault();
                megamenufunctions.showMenuNav($(e.target));
                $(document).find('.'+$(e.target).attr('attr-menuname')).find('.menu').find('.subheade').first().focus();
                megamenufunctions.loopinMenu($(document).find('.'+$(e.target).attr('attr-menuname')).find('.menu'));
            }
        });

        $(document).on('keydown', '.subheade', function(e){
            if(e.which == 13 || e.which == 32){
                e.preventDefault();
                megamenufunctions.showSubmenu($(e.target).parents('.nav-sub-ele'));
                $(document).find('.submenu').find('.sunmenu-container[data-attr="'+$(e.target).parents('.nav-sub-ele').attr('id')+'"]').find('select, input, textarea, button, a, [tabindex="0"]').filter(':visible').first().focus();
                megamenufunctions.loopinMenu($(document).find('.submenu').find('.sunmenu-container[data-attr="'+$(e.target).parents('.nav-sub-ele').attr('id')+'"]')); 
            }
        }); 

        $(document).on('keydown', '.item-name-list', function(e){
            if(e.which == 13 || e.which == 32){
                e.preventDefault();
                console.log($(e.target).parent()); 
                megamenufunctions.togglemicroMenu($(e.target));
                $(e.target).next('.micromenu').find('a').first().focus();
                megamenufunctions.loopinMenu($(e.target).next('.micromenu')); 
            }   
        });

        $(document).on('keydown', '.popover-content .sweetRewards', function(e){
            if(e.which == 13 || e.which == 32){
                $(document).find('.zinrelo-tab').click();
            }
        });

        $(document).on('keydown', '.zinrelo-container', function(e){
            if(e.which == 13 || e.which == 32){
                $(document).find('.zinrelo-tab').click();
            }
        });

        $(document).on('keydown', '.sweetrewardstextcontent', function(e){
            if(e.which == 13 || e.which == 32){
                $(document).find('.zinrelo-tab').click();
            }
        });
        $(document).on('keydown', '.head-list-item-new.view-products', function(e){
            if ((e.which === 9 && e.shiftKey)){
                e.preventDefault();
                $(document).find('.mz-utilitynav-link-cart').focus();
                if($(e.currentTarget).parent().hasClass("menuactivelinks")) {
                    $(e.currentTarget).parent().removeClass("menuactivelinks");  
                }
            }   
        });
        $(document).on('keydown', '.head-list-item-new.flavorsandmore', function(e){
            if ((e.which === 9 && e.shiftKey)){
                if($(e.currentTarget).parent().hasClass("menuactivelinks")) {
                    $(e.currentTarget).parent().removeClass("menuactivelinks");  
                }
            }   
        });
        $(document).on('keydown', '.head-list-item-new.visitus', function(e){
            if ((e.which === 9 && e.shiftKey)){
                if($(e.currentTarget).parent().hasClass("menuactivelinks")) {
                    $(e.currentTarget).parent().removeClass("menuactivelinks");  
                }
            }   
        });
        $(".head-list-item-li-new").keydown(function(event) {
            if (event.which == 13) {
                $(this).addClass("menuactivelinks");
                $(this).find(".submenuContainer").focus();
            }
        });
        
        
        
            $(".head-list-item-li-new").on("click",function(e){
                if($(window).width() <= 767){
                    e.stopPropagation();
                    if($(this).hasClass("menuactivelinks")) {
                       $(".head-list-item-li-new").removeClass("menuactivelinks"); 
                    } else {
                        $(this).addClass("menuactivelinks").siblings().removeClass("menuactivelinks");
                    }
                }
            });
            $(document).on("click",".fixedmenuclose .close-menu-icon",function(e){
                if($(window).width() <= 767){
                    $(".head-list-item-li-new").removeClass("mobilemenuactive");
                    $(".head-list-item-li-new").removeClass("menuactivelinks"); 
                    $(".micromenu-cointainer").removeClass("mobilesubmenuactive");
                }
            });
            $(".head-list-item-li-new .micromenu-cointainer li.mobileclicksubmenu").on("click",function(e){
                
                if($(window).width() <= 767){
                    e.stopPropagation();
                    if($(this).closest("ul").hasClass("mobilesubmenuactive")) {
                        $(".head-list-item-li-new .micromenu-cointainer").removeClass("mobilesubmenuactive");
                    } else {
                        $(".head-list-item-li-new .micromenu-cointainer").removeClass("mobilesubmenuactive");
                        $(this).closest("ul").addClass("mobilesubmenuactive");
                    }
                }
            });
            $(".head-list-item-li-new .micromenu-cointainer li.mobileclicksubmenu").keyup(function(event) {
                if($(window).width() <= 767){
                    if (event.keyCode === 13) {
                        if($(this).closest("ul").hasClass("mobilesubmenuactive")) {
                            $(".head-list-item-li-new .micromenu-cointainer").removeClass("mobilesubmenuactive");
                        } else {
                            $(".head-list-item-li-new .micromenu-cointainer").removeClass("mobilesubmenuactive");
                            $(this).closest("ul").addClass("mobilesubmenuactive");
                        }
                    }
                }
            });
            $(".fixedmenuclose .close-menu-icon").keyup(function(event) {
                if($(window).width() <= 767){
                    if (event.keyCode === 13) {
                        $(".head-list-item-li-new").removeClass("mobilemenuactive");
                        $(".head-list-item-li-new").removeClass("menuactivelinks");
                        $(".micromenu-cointainer").removeClass("mobilesubmenuactive");
                    }
                }
            });
        
        
        var touchstart;
        if('ontouchstart' in window){
            touchstart = 'touchstart';
        } else {
            touchstart = 'click';
        }
        $(document).on(touchstart,function (e)
        {
            var mega_menu = $('.head-list-item-li-new');
            if ((!mega_menu.is(e.target) && mega_menu.has(e.target).length === 0))
            {
                    mega_menu.removeClass('menuactivelinks');
            }
        });
        $('[data-mz-contextify]').each(function () {    
            var $this = $(this),
                config = $this.data();

            $this.find(config.mzContextify).each(function () {
                var $item = $(this);
                if (config.mzContextifyAttr === "class") {
                    $item.addClass(config.mzContextifyVal);
                } else {
                    $item.prop(config.mzContextifyAttr, config.mzContextifyVal);
                }
            });
        });
        /**
         * Create mega menu sub menu
         **/
         
         var t = api.context.tenant;
         var s = api.context.site;
         var filepath="//cdn-sb.mozu.com/"+t+"-"+s+"/cms/"+s+"/files/";
         var imagediv;
        };
         window.invokeContextify();
    });
    var navigation_link_activated;
    
    
});





