require([
    "modules/jquery-mozu"
    //"shim!vendor/owl.carousel[jquery=jQuery]>jQuery"
    ], function ($) {
	 
	$(document).ready(function () {   

        

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
    
	});









