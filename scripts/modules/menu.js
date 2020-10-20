define(["modules/jquery-mozu",
		"modules/api",
		"modules/custom-popup",
		'shim!vendor/jquery.hoverIntent[jquery=jQuery]>jQuery'],
	function ($,api) {
		var Document = $(document);
		$(document).ready(function(){
			//Web Mega Menu
			//Refer Contextify.js

			// Add Dynamic Images

			// Mobile Mega Menu
			//$( '.jb-mobile-megamenu' ).dlmenu();
			$(document).ready(function(){
				// ada for mobile
				var mobilefilter = {
					mobileaccodian : function(ele){
						if(!ele.hasClass('active')){
							$(document).find('.header-submenu-mobile').removeClass('active');
							$(document).find('.header-submenu-mobile').find('.subheade-mobile').attr('aria-expanded',false);
							$(document).find('.submenu-list-mobile').slideUp('slow');
							ele.addClass('active');
							ele.find('.subheade-mobile').attr('aria-expanded',true);
							ele.parents('.sunmenu-container-mobile').find('.submenu-list-mobile').slideDown('slow');
							setTimeout(function(){ele.parents('.sunmenu-container-mobile').find('.submenu-list-mobile').find('.subitem-mobile').first().find('a').focus();},500); 
							this.mobileloopinnerelement();
							setTimeout(function(){
								$(".jb-custom-overlay").animate({ scrollTop: $(document).find('.header-submenu-mobile.active').offset().top-$(document).find('.menu-close-btn').offset().top }, "slow");
							},1000);
						}else{
							ele.removeClass('active');
							ele.find('.subheade-mobile').attr('aria-expanded',false);
							ele.parents('.sunmenu-container-mobile').find('.submenu-list-mobile').slideUp('slow'); 
							ele.find('.subheade-mobile').focus();
						} 
					},
					// loop inner element
					mobileloopinnerelement : function(){
						window.inputs = $(document).find('.menu-mobile').find('.subitem-mobile').filter(':visible');
						window.firstInput = window.inputs.first();
						window.lastInput = window.inputs.last();  

						// if current element is last, get focus to first element on tab press.
						window.lastInput.find('a').on('keydown', function (e) {
							if ((e.which === 9 && !e.shiftKey)) {
								e.preventDefault();
								window.firstInput.find('a').focus(); 
							}
						});

						// if current element is first, get focus to last element on tab+shift press.
						window.firstInput.find('a').on('keydown', function (e) { 
							if ((e.which === 9 && e.shiftKey)) {
								e.preventDefault();
								window.lastInput.find('a').focus(); 
							}
						}); 
					}
				}; 

				// mobile accodrian
				$(document).find('.header-submenu-mobile').on('click',function(e){
					mobilefilter.mobileaccodian($(e.currentTarget));
				});

				$(document).on('click','#jb-mobile-menu',function(e){ 
					$(document).find('.menu-close-btn').focus(); 
				});

				$(document).on('click','.menu-close-btn',function(e){
					$(document).find('#jb-mobile-menu').focus();
				});

				// handle key
				$(document).on('keydown','.subheade-mobile',function(e){ 
					if(e.which == 13 || e.which == 32){ 
						mobilefilter.mobileaccodian($(document.activeElement).parents('.header-submenu-mobile')); 
					}
				});

				$(document).find('.menu-close-btn').on('keydown',function(e){
					if ((e.which === 9 && e.shiftKey)) {
						e.preventDefault();
						$(document).find('.jb-store-locator-link-mobile').focus(); 
					}
				}); 

				$(document).find('.jb-store-locator-link-mobile').on('keydown',function(e){
					if ((e.which === 9 && !e.shiftKey)) {
						e.preventDefault();
						$(document).find('.menu-close-btn').focus();  
					}
				});

				$(document).find('.subitem-mobile a').on('keydown',function(e){
					if(e.which == 27){
						e.preventDefault();
						mobilefilter.mobileaccodian($(document.activeElement).parents('.sunmenu-container-mobile').find('.header-submenu-mobile'));
					} 
				});
			});
		});
});

