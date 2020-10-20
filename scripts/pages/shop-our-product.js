require([
    "modules/jquery-mozu", 
    "shim!vendor/owl.carousel[jquery=jQuery]>jQuery"],
     function ($) {
	 
	$(document).ready(function () {
        
        var slideCount = $('.viewport_gallery_slide').length;
        var slideContent = $('.viewport_gallery_slide').html();
        var owlDsk;
        runSlideShow();
        
        setInterval(function () {
            if($('.viewport_gallery_slide').length > 0 ){
                if( slideCount != $('.viewport_gallery_slide').length ){
                    runSlideShow();            
                }else if(slideContent !=  $('.viewport_gallery_slide').html()){
                    runSlideShow();            
                }  
            }else{
                slideCount  = $('.viewport_gallery_slide').length;
            }
        }, 1000);
        
        var isCarousalLoaded = false;
        setInterval(function(){
            if(!isCarousalLoaded){
                var xx = $('.recommended-product').find('.MB_HCAT2');
                if(xx.length>0){
                    var x= xx.children()[0];
                    x.innerHTML = '<h3 style="padding-left: 0%;width: 100%;">Jelly Belly Also Recommends</h3>';
                    isCarousalLoaded = true;
                    mybuyscarousal();
                }
            }
        }, 1000);
        
       /* 
        setTimeout(function() {  },2000);
        $('#powerReview-inline-SEO').html($.trim($("#jb-pr-inline").contents().find('body').html()));*/
        // $( window ).resize(function() {
        //     mybuyscarousal(); 
        // });  
        
        function mybuyscarousal(){
            if($(window).width() < 768){
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
        function runSlideShow(){
            owlDsk = $('#shop_our_product_gallery .slides');
            
            owlDsk.owlCarousel({
                center:true,
                loop:true,
                margin:10,
                nav:true,
                responsiveClass:true,
                responsive:{
                    0:{
                        items:1
                    },
                    600:{
                        items:1
                    },
                    1000:{
                        items:1
                    }
                }
            });
        }
        
        function handel_courosel(){
            var sliderinput = $(document).find('.slides').find('.owl-prev,.owl-next,.owl-dot');
            var count = 0;
            sliderinput.each(function(){
                $(this).attr('tabindex',"0");
                if($(this).hasClass('owl-dot')){
                    $(this).attr('aria-label', "slide "+(count+1));
                    count++;
                }else if($(this).hasClass('owl-prev')){
                    $(this).attr('aria-label', "slide left");    
                }else if($(this).hasClass('owl-next')){
                    $(this).attr('aria-label', "slide rite");   
                }
            });
            
            sliderinput.first().focus();
        }
        
        $(document).find('.mz-ourproduct').on('keydown','.mz-breadcrumb-link[title="Home"]',function(e){
            if(e.which == 9 && !e.shiftKey){
                e.preventDefault();    
                handel_courosel();       
            }
        });
        
        $(document).find('.mz-ourproduct').on('keydown','.owl-next',function(e){
            if(e.which == 13 || e.which == 32){
                e.preventDefault();  
                owlDsk.trigger('next.owl');
            }   
        });
        
        $(document).find('.mz-ourproduct').on('keydown','.owl-prev',function(e){
            if(e.which == 13 || e.which == 32){
                e.preventDefault();  
                owlDsk.trigger('prev.owl');
            }   
        });
        
        $(document).find('.mz-ourproduct').on('keydown','.owl-dot',function(e){
            if(e.which == 13 || e.which == 32){
                e.preventDefault();  
                $(document.activeElement).click(); 
                setTimeout(function(){ 
                   // $(document).find('.owl-item.active').find('.description').focus(); 
                    $('.owl-item.active').find(' .viewport_gallery_slide a').focus();
                }, 500);
            }      
        });
	});

});





