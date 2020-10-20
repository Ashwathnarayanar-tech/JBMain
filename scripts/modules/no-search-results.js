define([
		"modules/jquery-mozu","shim!vendor/owl.carousel[jquery=jQuery]>jQuery"
	], function ($) {
	$(document).ready(function () {
		$("#popularLink").click(function(e){
    var aTag = $("#popularSearch");
    $('html,body').animate({scrollTop: aTag.offset().top - 105}, 2000 );
});

		var numElements = $(".404-no-search-result-item").length;
		if (numElements > 0) {
			var randomIndex = Math.round((Math.random() * (numElements - 1)));
			$(".404-no-search-result-item").eq(randomIndex).fadeIn(500);
		}
		
        var isCarousalLoaded = false;
        setInterval(function(){
            if(!isCarousalLoaded){
                var xx = $('.recommended-product').find('.MB_KS2');
                if(xx.length>0){
                    var x= xx.children()[0];
                    x.innerHTML = ''; // '<h3 style="padding-left: 0px;width: 100%;">Jelly Belly Also Recommends</h3>';
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
	});
});
