define(['modules/jquery-mozu', 
        "modules/views-collections",
        "shim!vendor/owl.carousel[jquery=jQuery]>jQuery"
        ], 
    function($, CollectionViewFactory) {

    $(document).ready(function() {
        
        // Shop online button function
        $(document).find('.button-dark[title="Shop Online"]').on('click',function(e){
            e.preventDefault();
            $("#shopping-section").focus();
            if($(window).width() <= 767){ 
                $('html, body').animate({
                    scrollTop: $(document).find('#mz-productlist-list').offset().top-280
                }, 1500);
            }else{
                $('html, body').animate({
                    scrollTop: $(document).find('#mz-productlist-list').offset().top-150
                },  500);
            } 
        });

        // Flover guide navigation from header
        var myFlover = window.location.hash; 
        if(myFlover && myFlover == "#flavor-List"){
            if($(document).find(myFlover).find('.jb-colapsing-title')){
                $(document).find(myFlover).find('.jb-colapsing-title').trigger('click');
            }
            if($(document).find("#flavor-List")){
                if($(window).width() <= 767){ 
                    $('html, body').animate({
                        scrollTop: $(document).find("#flavor-List").offset().top-100
                    }, 1500);
                }else{
                    $('html, body').animate({
                        scrollTop: $(document).find("#flavor-List").offset().top
                    }, 500);
                }
            }
        }

        // Brand landing suc cat list and description list
        $(document).on('click', '.readmore-text', function(e){
            $(document).find('.brand-dicreption-top').find('.shot-dec').removeClass('active');
            $(document).find('.brand-dicreption-top').find('.brand-details').addClass('active');
            $(document).find('.brand-dicreption-top').find('.brand-details').find('p').first().focus();
        });

        $(document).on('click', '.readless-text', function(e){
            $(document).find('.brand-dicreption-top').find('.shot-dec').addClass('active');
            $(document).find('.brand-dicreption-top').find('.brand-details').removeClass('active');
            $(document).find('.brand-dicreption-top').find('.shot-dec').find('p').first().focus();     
        });

        $(document).on('click', '.read-more-bottom', function(e){
            $(document).find('.brand-dicreption-bottom').find('.shot-decreption').removeClass('active');
            $(document).find('.brand-dicreption-bottom').find('.brand-dec-bottom').addClass('active');
            $(document).find('.brand-dicreption-bottom').find('.brand-dec-bottom').find('p').first().focus(); 
        });

        $(document).on('click', '.read-less-bottom', function(e){
            $(document).find('.brand-dicreption-bottom').find('.shot-decreption').addClass('active');
            $(document).find('.brand-dicreption-bottom').find('.brand-dec-bottom').removeClass('active');
            $(document).find('.brand-dicreption-bottom').find('.shot-decreption').find('p').first().focus();   
        });

        // sub category cur.
        var owl2 = $(document).find('.sub-cat-list');
        var navigation = $(window).width() > 1024?false:true;
        if($(window).width() <= 767){
            owl2.owlCarousel({  
                loop: true, 
                margin: 10,
                dots: false,
                autoPlay: false,  
                pagination: false,   
                nav: false,     
                navText:false,
                slideBy: 1,
                items: 2,
                center: true,   
                stagePadding: 80,
                responsive: {    
                    0: {
                        items: 1
                    },
                    400: {
                        items: 1
                    },
                    600: {
                        items: 1
                    },
                    800: {
                        items: 4   
                    } 
                } 
            });  
        }else{
            owl2.owlCarousel({  
                loop: false, 
                margin: 25,
                dots: false,
                autoPlay: false,  
                pagination: false,   
                nav: navigation,     
                navText:false,
                slideBy: 1,
                items: 2,
                center: false,
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
                        items: 4
                    },
                    1440: {
                        items: 4
                    }
                } 
            });   
        }

        // event to trigger browser resize.
        if($(window).width() > 767){
            $(document).find('.a-spot-cointainer').addClass('opacity'); 
            if($(window).width() > 1440){ 
                $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('img').css('left',($(window).width()-$(document).find('.brand-dicreption').find('.a-spot-cointainer').find('img').width())/2);
                $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('.A-spotContent').css('left',($(window).width()-1440)/2);
                $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('.A-spotContent').css('width','600px'); 
            }else{
                if($(window).width() < 1175){
                    $(document).find('.a-spotText').css('font-size',"14px");
                    $(document).find('.a-spotContentHeading').css('font-size',"26px");
                }else{
                    $(document).find('.a-spotText').css('font-size',"1.2vw");
                    $(document).find('.a-spotContentHeading').css('font-size',"2.3vw");   
                }
                var newHeigth = 500-((1440 - $(window).width())/3);
                $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('img').css('height', newHeigth);
                $(document).find('.brand-dicreption').find('.a-spot-cointainer').css('height', newHeigth);   
                $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('.A-spotContent').css('left',0); 
                //$(document).find('.brand-dicreption').find('.a-spot-cointainer').find('img').css('left',($(window).width()-$(document).find('.brand-dicreption').find('.a-spot-cointainer').find('img').width())/2);
                $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('.A-spotContent').css('width','45%');  
            }
            $(window).resize(function(){ 
                if($(window).width() > 1440){
                    $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('img').css('left',($(window).width()-$(document).find('.brand-dicreption').find('.a-spot-cointainer').find('img').width())/2);
                    $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('.A-spotContent').css('left',($(window).width()-1440)/2);
                    $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('.A-spotContent').css('width','600px'); 
                }else{
                    var newHeigth = 500-((1440 - $(window).width())/3);
                    var ratio = Math.min(1440 / $(window).width(), 500 / $(window).height());
                    $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('img').css('height', newHeigth);
                    $(document).find('.brand-dicreption').find('.a-spot-cointainer').css('height', newHeigth);   
                    $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('.A-spotContent').css('left',0); 
                   // $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('img').css('left',($(window).width()-$(document).find('.brand-dicreption').find('.a-spot-cointainer').find('img').width())/2);
                    $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('.A-spotContent').css('width','45%');  
                }
            });
        }else{
            $(document).find('.a-spot-cointainer').addClass('opacity'); 
        }

        // old code.        
        window.facetingViews = CollectionViewFactory.createFacetedCollectionViews({
            $body: $('[data-mz-category]'),
            $facets: $('[data-mz-facets]'),
            data: require.mozuData('facetedproducts') 
        });        
        
        var isCarousalLoaded = false;
        setInterval(function(){
            if(!isCarousalLoaded){
                var xx = $('.recommended-product').find('.MB_CAT2');
                if(xx.length === 0) {
                    xx = $('.recommended-product').find('.MB_HCAT2');
                }
                if(xx.length>0){
                    var x= xx.children()[0];
                    x.innerHTML = ''; // '<h3 style="padding-left: 0%;width: 100%;">Jelly Belly Also Recommends</h3>';
                    isCarousalLoaded = true;
                    mybuyscarousal();
                }
            }
        }, 1000);
        
        function mybuyscarousal(){
            if($(window).width() < 800){
                var owlMBRP = $('.MB_PRODUCTSLOT').parent();
                owlMBRP.owlCarousel({
                    center          :true,
                    loop            :true,
                    nav             :true,
                    margin          :2,
                    dots            :false,
                    responsive:{
                        0:{
                            items:1
                        },
                        400:{
                            items:1
                        },
                        600:{
                            items:1
                        },
                        800:{
                            items:1
                        }
                    }
                });
             }
        }
                
            /*$(".mz-productlisting-image, .img-overlay").mouseenter(function() {
                //alert('sdfsdf');
            $(this).parent().find('.img-overlay').show();
            
            });
             $(".mz-productlisting-image").mouseleave(function(){
                  $('.img-overlay').hide();
             });*/
            var width = $( window ).width();
            if(width > 767){
                $(document).on({
                    mouseenter: function () {
                        if(!$(this).parent().parent().parent().hasClass('mz-productlist-list')){
                        $(this).parent().find('.img-overlay').show();
                        $(".gridder-expanded-content .img-overlay").hide();
                         }
                    },
                    mouseleave: function () {
                        $('.img-overlay').hide();
                    }
                }, ".mz-productlisting-image, .img-overlay");
                $(document).on('focus','a', function(e) {
                    var $el = $(this).parent();
                    if($el.hasClass('mz-productlisting-image')) {
                        $el.next().attr('tabindex',-1).show().focus(); 
                    }
                });

                $(document).on('blur','.img-overlay', function(e) {
                    $(this).hide();
                });
            }

	if($("#mz-drop-zone-main-banner-override img").length > 0)
		$("#mz-drop-zone-main-banner-override").show();
	else 
		$("#mz-drop-zone-main-banner").show();
    
  require(['modules/add-to-wishlist-modal']);
    
    });
    
    
    require(["modules/add-to-cart-plp"]);
});
