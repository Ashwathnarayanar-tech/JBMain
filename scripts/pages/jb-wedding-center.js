
require([
        "modules/jquery-mozu",
        "shim!vendor/owl.carousel[jquery=jQuery]>jQuery"
    ], function ($) {
        $(document).ready(function () {

            if(require.mozuData('pagecontext').url.indexOf("California-Factory-Conference-Space") > 0){
            // Conference Space
                $('.carnival-details').click(function (e) {
                    $(this).find('.contentList').slideToggle();
                    if($(this).find('h3').hasClass('open')){
                        $(this).find('h3').removeClass('open');
                        $(this).find('h3').addClass('close');
                    } else {
                        $(this).find('h3').removeClass('close');
                        $(this).find('h3').addClass('open'); 
                    }
                });  
                
                $('a[href="mailto:jbevents@jellybelly.com"]').click(function (e) {
                    e.preventDefault();
                    $('.conferencePricing .carnival-details .contentList').slideToggle();
                });
            } 
            // Wedding center & Ideas
            //else  if(require.mozuData('pagecontext').url.indexOf("wedding-center") > 0 || require.mozuData('pagecontext').url.indexOf("wedding-theme-slider") > 0){
               // var wedding_URL = GetURLParameter('wedding');
                //if (wedding_URL) {
                    //$('#' + wedding_URL).show();
                    //var owlWedding = $('#' + wedding_URL + ' .slider');
             else if($('.weddingBody').length>0 && $('.weddingBody .slider').length>0 ){
                    var owlWedding = $('.weddingBody .slider');
                    owlWedding.owlCarousel({
                        center : true,
                        loop : true,
                        nav : true,
                        dots : true,
                        responsiveClass : true,
                        transitionStyle : "fade",
                        responsive : {
                            0 : {
                                items : 1
                            },
                            600 : {
                                items : 1
                            },
                            1000 : {
                                items : 1
                            }
                        }
                    });
                //}
            }
            

            function GetURLParameter(sParam) {
                var sPageURL = window.location.search.substring(1);
                var sURLVariables = sPageURL.split('&');
                for (var i = 0; i < sURLVariables.length; i++) {
                    var sParameterName = sURLVariables[i].split('=');
                    if (sParameterName[0] == sParam) {
                        return sParameterName[1];
                    }
                }
                return '';
            }

        });
    });
