/* jshint ignore:start */
require([
    "modules/jquery-mozu", 
    "shim!vendor/owl.carousel[jquery=jQuery]>jQuery"], function ($) {
     

    $(document).ready(function(){
            
            $('.company-history-widget').owlCarousel({
                loop:true,
                nav:true,
                dots: true,
                items:1
            });
            var oldElms = $(".company-history-widget");
            setInterval(function(){ 
                if(oldElms != $(".company-history-widget")){
                    $('.company-history-widget').owlCarousel({
                        loop:true,
                        nav:true,
                        dots: true,
                        items:1
                    });
                oldElms = $(".company-history-widget");
                }    
            }, 3000);
    });

});



/* jshint ignore:end */
