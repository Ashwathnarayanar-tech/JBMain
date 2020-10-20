require(["modules/jquery-mozu","shim!vendor/owl.carousel[jquery=jQuery]>jQuery"], 
    function ($) {
    $(document).ready(function () {
    // Company History Slide show 
        var owlCompanyHistory = $('#company-slider-history .company-sliders-history');
        
        owlCompanyHistory.owlCarousel({
            center:true,
            loop:true,
            margin:10,
            nav:true,
            dots: true,
            items:1,
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
            }, 
            enableResizeTime: 500,
            onInitialized: initializationCallback
        });
        
        $(document).find('.mz-company-history').on('keydown','.mz-breadcrumb-link[title="Home"]',function(e){
            if(e.which == 9 && !e.shiftKey){
                e.preventDefault();    
                //handel_courosel();       
            }
        });
            
        $(document).find('.mz-company-history').on('keydown','.owl-next',function(e){
            if(e.which == 13 || e.which == 32){
                e.preventDefault();  
                owlCompanyHistory.trigger('next.owl');
            }   
        });
            
        $(document).find('.mz-company-history').on('keydown','.owl-prev',function(e){
            if(e.which == 13 || e.which == 32){
                e.preventDefault();  
                owlCompanyHistory.trigger('prev.owl');
            }   
        });
            
        $(document).find('.mz-company-history').on('keydown','.owl-dot',function(e){
            if(e.which == 13 || e.which == 32){
                e.preventDefault();  
                $(document.activeElement).click(); 
                setTimeout(function(){ 
                    $(document).find('.owl-item.active').find('.description').focus(); 
                }, 500);
            }      
        });  
        
        // company history ADA code starts
        function handel_courosel(){
          
            var sliderinput = $(document).find('.company-sliders-history').find('.owl-prev,.owl-next,.owl-dot');
            var count = 0;
            sliderinput.each(function(){
                $(this).attr('tabindex',"0");
                $(this).attr('role', 'button');
                if($(this).hasClass('owl-dot')){
                    $(this).attr('aria-label', "Go to slide "+(count+1));
                    count++;
                }else if($(this).hasClass('owl-prev')){
                    $(this).attr('aria-label', "Go to the previous slide");    
                }else if($(this).hasClass('owl-next')){
                    $(this).attr('aria-label', "Go to the next slide");   
                }
            });
            sliderinput.first().focus();
        }
        
        function hideNonActiveSlides(){
          var slides = $(document).find('.owl-item');
          slides.each(function(){
            var viewPort = $(this).find('.view-port');
            if(!$(this).hasClass('active'))
              viewPort.hide();
            else
              viewPort.show();
          });
        }
        
        function initializationCallback() { 
          setTimeout(function(){ 
            handel_courosel();
            hideNonActiveSlides();
          }, 2000); 
        }
        
        $('.owl-next,.owl-prev,.owl-dot').click(function(e){ 
          setTimeout(function(){ 
            hideNonActiveSlides(); 
            $(document).find('div.active img.view-port-slide').focus();
          }, 1000);
            
          });
    });
});
