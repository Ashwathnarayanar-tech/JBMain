require([
    "modules/jquery-mozu"
    //"shim!vendor/owl.carousel[jquery=jQuery]>jQuery"
    ], function ($) {
	 
	$(document).ready(function () {   

        // var slideCount = $('.viewport_gallery_slide').length;
        // var slideContent = $('.viewport_gallery_slide').html();
        // //var owlDsk = $('#home_gallery .slides');
        // runSlideShow();
        
        // setInterval(function () {
        //     if($('.viewport_gallery_slide').length > 0 ){ 
        //         if( slideCount != $('.viewport_gallery_slide').length ){
        //             runSlideShow();            
        //         }else if(slideContent !=  $('.viewport_gallery_slide').html()){
        //             runSlideShow();            
        //         }  
        //     }else{
        //         slideCount = $('.viewport_gallery_slide').length;
        //     }
        // }, 1000);

        //var owl = $('#header-image-desktop');

        $(window).resize(function(){
            if($(window).width() > 1440){
                $(document).find('#header-image-desktop').find('img').css('left',($(window).width()-$(document).find('#header-image-desktop').find('img').width())/2);
                $(document).find('#header-image-desktop').find('a').css('height', "500px");
            }else{
                var newHeigth = 500-((1440 - $(window).width())/3);
                $(document).find('#header-image-desktop').find('img').css('height', newHeigth);
                $(document).find('#header-image-desktop').find('a').css('height', newHeigth);
                $(document).find('#header-image-desktop').find('img').css('left',($(window).width()-$(document).find('#header-image-desktop').find('img').width())/2);
            }
        });

        if($(window).width() > 1440){ 
            $(document).find('#header-image-desktop').find('img').css('left',($(window).width()-$(document).find('#header-image-desktop').find('img').width())/2);
            $(document).find('#header-image-desktop').find('a').css('height', "500px");
        }else{
            var newHeigth = 500-((1440 - $(window).width())/3);
            $(document).find('#header-image-desktop').find('img').css('height', newHeigth);
            $(document).find('#header-image-desktop').find('a').css('height', newHeigth);
            $(document).find('#header-image-desktop').find('img').css('left',($(window).width()-$(document).find('#header-image-desktop').find('img').width())/2);
        }
        
        // function runSlideShow(){
        //     var owl = $('#home_gallery .slides');
        //     owl.owlCarousel({
        //         center:true,
        //         loop:true,
        //         margin:10,
        //         nav:true,
        //         dots: true,
        //         pagination: true,
                
        //         items:1,
        //         responsive:{
        //             0:{
        //                 items:1
        //             },
        //             600:{
        //                 items:1
        //             },
        //             1000:{
        //                 items:1
        //             }
        //         },
        //         enableResizeTime: 500
        //     });
        // }
        // function handel_courosel(){
        //     var sliderinput = $(document).find('#home_gallery').find('.owl-prev,.owl-next,.owl-dot');
        //     var count = 0;
        //     sliderinput.each(function(){
        //         $(this).attr('tabindex',"0");
        //         if($(this).hasClass('owl-dot')){
        //             $(this).attr('aria-label', "slide "+(count+1));
        //             count++;
        //         }else if($(this).hasClass('owl-prev')){
        //             $(this).attr('aria-label', "slide left");    
        //         }else if($(this).hasClass('owl-next')){
        //             $(this).attr('aria-label', "slide rite");   
        //         }
        //     });
             
        //     sliderinput.first().focus();
        // }$(document).find('#home_gallery').on('keydown','.owl-next',function(e){
        //     if(e.which == 13 || e.which == 32){
        //         e.preventDefault();  
        //         owl.trigger('next.owl');
        //     }   
        // });
        
        // $(document).find('#home_gallery').on('keydown','.owl-prev',function(e){
        //     if(e.which == 13 || e.which == 32){
        //         e.preventDefault();  
        //         owl.trigger('prev.owl');
        //     }   
        // });
        
        // $(document).find('#home_gallery').on('keydown','.owl-dot',function(e){
        //     if(e.which == 13 || e.which == 32){
        //         e.preventDefault();  
        //         $(document.activeElement).click(); 
        //         setTimeout(function(){ 
        //             $(document).find('.owl-item.active').find('.viewport_gallery_slide').focus(); 
        //         }, 500);
        //     }      
        // });
     
        // 
        
        // $(document).find('.jb-slide-show').find('.mz-cms-content').find('p').last().find('a').on('keydown',function(e){
        //     if(e.which == 9 && !e.shiftKey){console.log('hello');
        //         e.preventDefault();    
        //         handel_courosel();       
        //     }
        // });
            
        /*$(document).on('focus','.brand-details', function() {
            console.log($(this));
            $(this).find('p').show();
            $(this).find('figure').hide();
            $(this).trigger('mouseover');
        });*/
        
        /*$(document).on('keyup','.brand-lister', function(e) {
            
        });*/
        
        $(document).on('keyup','#homepage-brands-listing', function(e) {
            console.log(e.currentTarget);
            
            if($(e.target).is(':focus')) {
                console.log($(e.target));
                $('.brand-details').removeClass('hover');
                $(e.target).children('.brand-details').addClass('hover');
            }
            else {
                $('.brand-details').removeClass('hover');
                if($(e.currentTarget)[0] == $(e.target).parents('#homepage-brands-listing')[0]) {
                    $(e.target).removeClass('hover').blur();
                }
            }
        });

        var getRenderProductContext=function (substituteModel) {
            var model = (substituteModel || this.model).toJSON({ helpers: true });
            return {
                Model: model,
                model: model
            };
        };
	});

    // $(window).on('load', function(){
    //     $('.owl-prev').html('<img src="../../resources/images/icons/left-arrow-nav.png" width="20">');
    //     $('.owl-next').html('<img src="../../resources/images/icons/right-arrow-nav.png" width="20">');
    // });

	});









