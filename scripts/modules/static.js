require([
		"modules/jquery-mozu",
		"shim!vendor/owl.carousel[jquery=jQuery]>jQuery",
		'shim!vendor/jquery-colorbox/jquery.colorbox[jquery=jQuery]','modules/candy-calculator'
	], function ($) {
        // doc ready
        $(document).ready(function () { 
            
            if(require.mozuData('pagecontext').url.indexOf("recipes-and-diy") > 0){
            //ADA for recipes and diy 
                $(document).find('.recipe').on('keydown',function(e){
                    if(e.which == 13 || e.which == 32){
                        e.preventDefault();
                        $(document.activeElement).click();
                        setTimeout(function(){
                            $(document).find('.filtr-container').find('.mz-cms-col-6-12').filter(function() {
                                return $(this).find('.filtr-item').css('opacity') == '1';
                            }).first().find('.filtr-item').children().first().focus();  
                        },1000);
                    }
                }); 
                
                $(document).find('.mz-cms-col-6-12').find('.description a').on('keydown',function(e){
                    if ((e.which === 9 && !e.shiftKey)) {
                        if($(document.activeElement).parents('.mz-cms-col-6-12').nextAll().filter(function(){return $(this).find('.filtr-item').css('opacity') == '1';}).length > 0){
                            e.preventDefault();
                            $(document.activeElement).parents('.mz-cms-col-6-12').nextAll().filter(function(){return $(this).find('.filtr-item').css('opacity') == '1';}).first().find('.filtr-item').children().first().focus();
                        }else{
                            e.preventDefault();
                            setTimeout(function(){$(document).find('.jb-footer-evrgreen').find('a').first().focus();},10);
                            
                        }  
                    }
                });
                
                $(document).find('.recipe').last().on('keydown',function(e){
                    if ((e.which === 9 && !e.shiftKey)) {
                        e.preventDefault();
                        $(document).find('.filtr-container').find('.mz-cms-col-6-12').filter(function() {
                            return $(this).find('.filtr-item').css('opacity') == '1';
                        }).first().find('.filtr-item').children().first().focus();
                   } 
                });
                
                $(document).find('.jb-footer-evrgreen').find('a').first().on('keydown',function(e){
                    if ((e.which === 9 && e.shiftKey)) {
                        $(document).find('.filtr-container').find('.mz-cms-col-6-12').filter(function() {
                            return $(this).find('.filtr-item').css('opacity') == '1';
                        }).last().find('.filtr-item').find('.description').last().find('a').focus(); 
                    }	
                });
                
                $(document).find('.mz-cms-col-6-12').find('.heading').on('keydown',function(e){ 
                if ((e.which === 9 && e.shiftKey)) {
                    if($(document.activeElement).parents('.mz-cms-col-6-12').prevAll().filter(function(){return $(this).find('.filtr-item').css('opacity') == '1';}).length > 0){
                        e.preventDefault();
                        $(document.activeElement).parents('.mz-cms-col-6-12').prevAll().filter(function(){return $(this).find('.filtr-item').css('opacity') == '1';}).first().find('.filtr-item').find('.description').last().find('a').focus();
                    }else{
                        e.preventDefault();
                        $(document).find('.recipe').last().focus();
                    }
                }
            }); 
            }
            
            if(require.mozuData('pagecontext').url.indexOf("jelly-belly-university") > 0 || require.mozuData('pagecontext').url.indexOf("wisconsin-warehouse") > 0 || require.mozuData('pagecontext').url.indexOf("california-factory-tours") > 0){
            // ADA for JB tour and JB university pages   
                $(document).on('click', '#accordian h2', function () {
                    accordianFunction($(this));
                }); 
                
                $(document).on('keydown', '#accordian h2', function (e) {
                    e.preventDefault();
                    if(e.which==13 || e.which == 32){
                        accordianFunction($(this));
                    }  
                });	
        
                //accordian fucntionality
                var accordianFunction = function($ele){
                if (!$ele.parent().hasClass("active")) {
                    $ele.parent().find('.new-icon-plus').hide();
                    $ele.parent().find('.new-icon-minus').show();
                    $('#accordian li').removeClass('active');
                    $('#accordian li').attr("aria-expanded", "false");
                    $ele.parent().addClass("active");
                    $ele.parent().attr("aria-expanded", "true");
                    $("#accordian ul ul").slideUp();
                    if (!$ele.next().is(":visible")) {
                        $ele.next().slideDown();
                        $ele.next().find('div').focus();
                    }
                } else {
                    $ele.parent().find('.new-icon-plus').show();
                    $ele.parent().find('.new-icon-minus').hide();
                    $('#accordian li').removeClass('active');
                    $('#accordian li').attr("aria-expanded", "false");
                    $("#accordian ul ul").slideUp();
                }
            }; 
            }
            
            if(require.mozuData('pagecontext').url.indexOf("company-history") > 0){ 
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
                    enableResizeTime: 500
                });
                
                $(document).find('.mz-company-history').on('keydown','.mz-breadcrumb-link[title="Home"]',function(e){
                    if(e.which == 9 && !e.shiftKey){
                        e.preventDefault();    
                        handel_courosel();       
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
            } 
            
                // company history ADA code starts
                function handel_courosel(){
                    var sliderinput = $(document).find('.company-sliders-history').find('.owl-prev,.owl-next,.owl-dot');
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
            
            if(require.mozuData('pagecontext').url.indexOf("donations") > 0){
            // Donations
                $('#step2a input').click(function (e) {
                    switch ($(e.target).val()) {
                        case 'Yes':
                            $('#step3a').slideDown();
                            break;
                        case 'No':
                            showAlertMessage();
                            break;
                    }
                });
                
                $('#step3a input').click(function (e) {
                    switch ($(e.target).val()) {
                        case 'Yes':
                            showAlertMessage();
                            break;
                        case 'No':
                            $('#step4a').slideDown();
                            break;
                    }
                });
                
                $('#step4a input').click(function (e) {
                    switch ($(e.target).val()) {
                        case 'Yes':
                            $('#step5a').slideDown();
                            break;
                        case 'No':
                            showAlertMessage();
                            break;
                    }
                });
                
                $('#step5a input').click(function (e) {
                    switch ($(e.target).val()) {
                        case 'Yes':
                            showAlertMessage();
                            break;
                        case 'No':
                            $('#step6a').slideDown();
                            break;
                    }
                });
                
                $('#step6a input').click(function (e) {
                    $('#step7a').slideDown();
                });
                
            } 
            
                function showAlertMessage() {
                    alert('Thank you for your interest in Jelly Belly Candy Company. Based on the information you have provided, we regret we cannot proceed any further. We currently consider requests for certain types of support from organizations within our outreach focus and meeting eligibility requirements.');
                }     
            
            if(require.mozuData('pagecontext').url.indexOf("California-Factory-Conference-Space") > 0){    
            // Conference Space
                $('.conferencePricing').click(function (e) {
                    $('.conferencePricing .carnival-details .contentList').slideToggle();
                });  
                
                $('a[href="mailto:jbevents@jellybelly.com"]').click(function (e) {
                    e.preventDefault();
                    $('.conferencePricing .carnival-details .contentList').slideToggle();
                });
            } 
            
            
            if(require.mozuData('pagecontext').url.indexOf("wedding-center") > 0){
            // Wedding center & Ideas
                var wedding_URL = GetURLParameter('wedding');
                
                if (wedding_URL) {
                    $('#' + wedding_URL).show();
                    var owlWedding = $('#' + wedding_URL + ' .slider');
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
                }  
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
            
            if(require.mozuData('pagecontext').url.indexOf("artgallery") > 0){    
            //Art gallery
                $('.art-galleries .art-galleries-head').click(function (e) {
                    $('.art-galleries .art-galleries-head').removeClass('active');
                    $('.art-gallery-item .art-gallery-details').hide();
                    $(e.target).addClass('active');
                    var galleryName = e.target.getAttribute('galleryname');
                    var galleryItemURL = e.target.getAttribute('galleryItemURL');
                    $('.art-gallery-item .galleryItemURL').fadeOut(400, function () {
                        $('.art-gallery-item .galleryItemURL').attr('src', galleryItemURL);
                    })
                    .fadeIn(400);
                    $('.art-gallery-item-thumbs').hide();
                    $('.' + galleryName).show();
                });
                
                $(document).on('keypress', ".faq", function(e) {
                    if(e.keyCode == 13) {
                        $(this).find('h2').trigger('click');
                    }
                });
                
                var owlArtThump = $('.art-gallery-item-thumbs');
                
                owlArtThump.owlCarousel({
                    loop : true,
                    nav : true,
                    margin : 2,
                    dots : false,
                    responsiveClass : true,
                    responsive : {
                        0 : {
                            items : 1
                        },
                        400 : {
                            items : 3
                        },
                        600 : {
                            items : 4
                        },
                        1000 : {
                            items : 7 
                        }
                    }
                });
                
                // ADA fixed for art gallery
                $(document).on('keydown','.art-galleries-head',function(e){
                    if(e.which == 13 || e.which == 32){
                        e.preventDefault();  
                        $(document.activeElement).click();   
                        $(document).find('.owl-item.active').filter(':visible').first().focus();
                        updatetabindex();  
                    }
                });

                $(document).find('.owl-item').each(function(){
                    $(this).attr('aria-label',$(this).find('img').attr('alt'));
                });

                $(document).find('.owl-prev,.owl-next').each(function(){
                    if($(this).hasClass('owl-prev')){
                        $(this).attr('aria-label','slide previous');
                        $(this).attr('tabindex',0);     
                    }else{
                        $(this).attr('aria-label','slide next');
                        $(this).attr('tabindex',0);         
                    }
                }); 

                $(document).on('keydown','.owl-next',function(e){
                    if(e.which == 13 || e.which == 32){
                        e.preventDefault();  
                        owlArtThump.trigger('next.owl');
                        setTimeout(function(){updatetabindex(); $(document).find('.owl-item.active').filter(':visible').last().focus();},500); 
                    }   
                });

                $(document).on('keydown','.owl-prev',function(e){
                    if(e.which == 13 || e.which == 32){
                        e.preventDefault();  
                        owlArtThump.trigger('prev.owl');
                        setTimeout(function(){updatetabindex(); $(document).find('.owl-item.active').filter(':visible').first().focus();},500);
                    }   
                });

                $(document).on('click','.owl-next,.owl-prev',function(e){
                    setTimeout(function(){updatetabindex();},500);
                });

                updatetabindex();

                $(document).on('click', '.owl-item', function (e) {
                    showslidedetails($(e.currentTarget));
                }); 

                $(document).on('keydown','.owl-item',function(e){
                    if(e.which == 13 || e.which == 32){
                        e.preventDefault();  
                        showslidedetails($(document.activeElement));    
                    }
                }); 
            }
            
                function updatetabindex(){
                    $(document).find('.owl-item').each(function(){
                        if($(this).hasClass('active') && $(this).is(':visible')){
                            $(this).attr('tabindex',0);    
                        }else{
                            $(this).attr('tabindex',-1);    
                        }
                    });
                }

                function showslidedetails(ele){
                    var AGD = ele.find('img').attr('AGD'); 
                    
                    $('.art-gallery-item .galleryItemURL').hide();
                    $('.art-gallery-item .art-gallery-details').hide();
                    $('.art-gallery-item .art-gallery-details[AGD=' + AGD + ']').show();
                    $('.art-gallery-item .art-gallery-details[AGD=' + AGD + ']').find('.banner-detail').find('h3').focus();
                } 
            
            
            if(require.mozuData('pagecontext').url.indexOf("recipes-and-diy") > 0){    
            //Cooking Ideas
                $('[close-open-coocking-ideas]').click(function (e) {
                    $(e.target.parentElement).find('.baking-recipe').slideToggle();
                });
            }
            
            // if(require.mozuData('pagecontext').url.indexOf("flavor-guides") > 0){    
            // //FLAVOUR GUIDE
            //     $(".jb-colapsing-title").bind("click", function (e) {
            //         var meThis = this;
                    
            //         //close all opening other than clicked
            //         $.each($(".jb_contentfolder"), function (ind, val) {
            //             if (val != $(meThis).parent().find(".jb_contentfolder")[0]) {
            //                 $(val).slideUp();
            //             }
            //         });
                    
            //         $(this).parent().find(".jb_contentfolder").slideToggle();
            //         if ($(this).find(".mz-mobile").css("display") == "block") {
            //             var temphtml = $(this).find(".mz-mobile").text();
            //             if (temphtml == "+") {
            //                 $(this).find(".mz-mobile").text("-");
            //             } else {
            //                 $(this).find(".mz-mobile").text("+");
            //             }
            //         }
                    
                    
            //     });
            // } 
            
        });
	});
	
	
	
