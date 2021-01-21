require(['modules/backbone-mozu',
		'modules/jquery-mozu'
	],
	function (Backbone,$) {

	var SlotMachineView = Backbone.MozuView.extend({
			templateName : "modules/slot-machine",
			initialize : function () {
				var me = this;
			}
		});

	//function to build mobile reels
		function reelMobile(slot) {
			for (var i = 0; i < 34; i = i + 1) {
				$(slot).append("<div style='width: 45px; height: 38px;'><img src='/cms/files/reel_image_playful.jpg?max=45'></div>");
				$(slot).append("<div style='width: 45px; height: 38px;'><img src='/cms/files/reel_image_sad.jpg?max=45'></div>");
				$(slot).append("<div style='width: 45px; height: 38px;'><img src='/cms/files/reel_image_happy.jpg?max=45'></div>");
				$(slot).append("<div style='width: 45px; height: 38px;'><img src='/cms/files/reel_image_grumpy.jpg?max=45'></div>");
				$(slot).append("<div style='width: 45px; height: 38px;'><img src='/cms/files/reel_image_love.jpg?max=45'></div>");
				$(slot).append("<div style='width: 45px; height: 38px;'><img src='/cms/files/reel_image_blank.jpg?max=45'></div>");
			}
		}	

	//function to build tablet reels
		function reelTablet(slot) {
			for (var i = 0; i < 23; i = i + 1) {
				$(slot).append("<div style='width: 105px; height: 88px;'><img src='/cms/files/reel_image_playful.jpg?max=105'></div>");
				$(slot).append("<div style='width: 105px; height: 88px;'><img src='/cms/files/reel_image_sad.jpg?max=105'></div>");
				$(slot).append("<div style='width: 105px; height: 88px;'><img src='/cms/files/reel_image_happy.jpg?max=105'></div>");
				$(slot).append("<div style='width: 105px; height: 88px;'><img src='/cms/files/reel_image_grumpy.jpg?max=105'></div>");
				$(slot).append("<div style='width: 105px; height: 88px;'><img src='/cms/files/reel_image_love.jpg?max=105'></div>");
				$(slot).append("<div style='width: 105px; height: 88px;'><img src='/cms/files/reel_image_blank.jpg?max=105'></div>");
			}
		}	
		
	//function to build desktop reels
		function reel(slot) {
			for (var i = 0; i < 17; i = i + 1) {
				$(slot).append("<div style='width: 120px; height: 100px;'><img src='/cms/files/reel_image_playful.jpg'></div>");
				$(slot).append("<div style='width: 120px; height: 100px;'><img src='/cms/files/reel_image_sad.jpg'></div>");
				$(slot).append("<div style='width: 120px; height: 100px;'><img src='/cms/files/reel_image_happy.jpg'></div>");
				$(slot).append("<div style='width: 120px; height: 100px;'><img src='/cms/files/reel_image_grumpy.jpg'></div>");
				$(slot).append("<div style='width: 120px; height: 100px;'><img src='/cms/files/reel_image_love.jpg'></div>");
				$(slot).append("<div style='width: 120px; height: 100px;'><img src='/cms/files/reel_image_blank.jpg'></div>");
			}
		}			
		
	//Spin button code	
		function spin(value1, value2, value3, value4, value5, value6, value7, value8, value9, value10, value11, value12, value13, value14, value15, value16, value17, value18) {		
				/* jshint ignore:start */
				var audio = new Audio('//cdn-tp1.mozu.com/9046-m1/cms/files/34b77a67-acba-4000-b8ff-45fc600f1e0d');
				audio.play();
				/* jshint ignore:end */
				
		//Mobile slot machine	
			if($(window).width() <= 737) {			
				$("#slot-roll1").css({ "top" : "-7524px" });
				$("#slot-roll1").animate({
					top : value9
				}, 5797, function () {});

				$("#slot-roll2").css({ "top" : "-7562px" });
				$("#slot-roll2").animate({
					top : value10
				}, 9310, function () {
					$("#image-result").attr({"src":value6, "alt":value8});
					$("#text-result").text(value7);
					$("#text-result").attr({size:2});
				});

				$("#slot-roll3").css({ "top" : "-7600px" });
				$("#slot-roll3").animate({
					top : value11
				}, 3857, function () {});
			
				$("#slot-roll4").css({ "top" : "-7638px" });
				$("#slot-roll4").animate({
					top : value12
				}, 7095, function () {});
			
				$("#slot-roll5").css({ "top" : "-7676px" });
				$("#slot-roll5").animate({
					top : value13
				}, 4897, function () {});
			} else if(($(window).width() > 737) && ($(window).width() <= 960)) {
		//Tablet slot machine
				$("#slot-roll1").css({ "top" : "-10032px" });
				$("#slot-roll1").animate({
					top : value14
				}, 5797, function () {});

				$("#slot-roll2").css({ "top" : "-10120px" });
				$("#slot-roll2").animate({
					top : value15
				}, 9310, function () {
					$("#image-result").attr({"src":value6, "alt":value8});
					$("#text-result").text(value7);
				});

				$("#slot-roll3").css({ "top" : "-10208px" });
				$("#slot-roll3").animate({
					top : value16
				}, 3857, function () {});
			
				$("#slot-roll4").css({ "top" : "-9768px" });
				$("#slot-roll4").animate({
					top : value17
				}, 7095, function () {});
			
				$("#slot-roll5").css({ "top" : "-9856px" });
				$("#slot-roll5").animate({
					top : value18
				}, 4897, function () {});			
			} else {	
		//Desktop slot machine					
				$("#slot-roll1").css({ "top" : "-9600px" });
				$("#slot-roll1").animate({
					top : value1
				}, 5797, function () {});

				$("#slot-roll2").css({ "top" : "-9700px" });
				$("#slot-roll2").animate({
					top : value2
				}, 9310, function () {
					$("#image-result").attr({"src":value6, "alt":value8});
					$("#text-result").text(value7);
				});

				$("#slot-roll3").css({ "top" : "-9800px" });
				$("#slot-roll3").animate({
					top : value3
				}, 3857, function () {});
			
				$("#slot-roll4").css({ "top" : "-9900px" });
				$("#slot-roll4").animate({
					top : value4
				}, 7095, function () {});
			
				$("#slot-roll5").css({ "top" : "-10000px" });
				$("#slot-roll5").animate({
					top : value5
				}, 4897, function () {});
			}			
		}
		
		
	//build reels	
	if($(window).width() <= 737) {
		//build mobile reels
		$("#slot-roll1").attr({"top":"-48px", "left":"0px"});
		$("#slot-roll2").attr({"top":"0px", "left":"50px"});
		$("#slot-roll3").attr({"top":"48px", "left":"100px"});
		$("#slot-roll4").attr({"top":"96px", "left":"150px"});
		$("#slot-roll5").attr({"top":"144px", "left":"200px"});

		$("#text-result").attr({"size":"4.8"});
			
		reelMobile("#slot-roll1"); 
		reelMobile("#slot-roll2");
		reelMobile("#slot-roll3");
		reelMobile("#slot-roll4");
		reelMobile("#slot-roll5");					
	} else if(($(window).width() > 737) && ($(window).width() <= 960)) {
		//build tablet reels 
		$("#slot-roll1").css({"top" : "0px", "left" : "0px"});
		$("#slot-roll2").css({"top" : "-88px", "left" : "107px"});
		$("#slot-roll3").css({"top" : "-176px", "left" : "214px"});
		$("#slot-roll4").css({"top" : "-264px", "left" : "321px"});
		$("#slot-roll5").css({"top" : "-352px", "left" : "428px"});
		
		$("#text-result").attr({"size":"6.8"});

		reelTablet("#slot-roll1"); 
		reelTablet("#slot-roll2");		
		reelTablet("#slot-roll3");
		reelTablet("#slot-roll4");
		reelTablet("#slot-roll5");		
	} else {
		//build desktop reels
		$("#slot-roll1").css({"top" : "-9600px", "left" : "0px"});
		$("#slot-roll2").css({"top" : "-9700px", "left" : "125px"});
		$("#slot-roll3").css({"top" : "-9800px", "left" : "250px"});
		$("#slot-roll4").css({"top" : "-9900px", "left" : "375px"});
		$("#slot-roll5").css({"top" : "-10000px", "left" : "500px"});
		
		$("#text-result").attr({"size":"6.8"});

		reel("#slot-roll1"); 
		reel("#slot-roll2");		
		reel("#slot-roll3");
		reel("#slot-roll4");
		reel("#slot-roll5");
	}	

//Slot machine click 
	$("#slot-machine-button").click(function(e) {
		
		$("#slot-machine-button").hide().delay(10000).queue(function(n) {
		$(this).show(); n();
		});
		
		$("#slot-machine-button-disabled").show().delay(10000).queue(function(n) {
		$(this).hide(); n();
		});
		
		var num = Math.random();
		
		
		//slot machine results
		if (num <= 0.07)
		{
			spin("-500px", "-500px", "-500px", "-200px", "0px", "/cms/files/summer_vacation_v3.jpg", "HAPPY + PLAYFUL = SUMMER VACATION", "Summer Vacation", "-190px", "-190px", "-190px", "-76px", "0px", "-440px", "-440px", "-440px", "-176px", "0px"); //Summer Vacation
		}
		else if (0.07 < num <= 0.14)
		{
			spin("-500px", "-500px", "-300px", "-300px", "-100px", "/cms/files/breakup_v3.jpg", "GRUMPY + GRUMPY + SAD = BREAKUP", "Sad breakup", "-190px", "-190px", "-114px", "-114px", "-38px", "-440px", "-440px", "-264px", "-264px", "-88px"); //Breakup
		}
		else if (0.14 < num <= 0.21)
		{
			spin("-500px", "-500px", "-500px", "-200px", "-400px", "/cms/files/new_puppy_v3.jpg", "HAPPY + LOVE = NEW PUPPY", "New Puppy", "-190px", "-190px", "-190px", "-76px", "-152px", "-440px", "-440px", "-440px", "-176px", "-352px"); //New Puppy
		}
		else if (0.21 < num <= 0.28)
		{
			spin("-500px", "-500px", "-100px", "-100px", "-300px", "/cms/files/monday_v3.jpg", "SAD + SAD + GRUMPY = MONDAY", "Monday spilled coffee", "-190px", "-190px", "-38px", "-38px", "-114px", "-440px", "-440px", "-88px", "-88px", "-264px"); //Monday
		}
		else if (0.28 < num <= 0.35)
		{
			spin("-500px", "-500px", "-0px", "-300px", "-200px", "/cms/files/road_trip_v3.jpg", "PLAYFUL + GRUMPY + HAPPY = ROAD TRIP", "Roadtrip", "-190px", "-190px", "0px", "-114px", "-76px", "-440px", "-440px", "0px", "-264px", "-176px"); //Roadtrip
		}
		else if (0.35 < num <= 0.42)
		{
			spin("-500px", "-500px", "-500px", "-200px", "-200px", "/cms/files/shopping_spree_v3.jpg", "HAPPY + HAPPY = SHOPPING SPREE", "Shopping spree", "-190px", "-190px", "-190px", "-76px", "-76px", "-440px", "-440px", "-440px", "-176px", "-176px"); //Shopping Spree
		}
		else if (0.42 < num <= 0.49)
		{
			spin("-500px", "-300px", "-300px", "-300px", "-100px", "/cms/files/flat_tire_v3.jpg", "GRUMPY + GRUMPY + GRUMPY + SAD = FLAT TIRE", "Flat Tire", "-190px", "-114px", "-114px", "-114px", "-38px", "-440px", "-264px", "-264px", "-264px", "-88px"); //Flat Tire
		}
		else if (0.49 < num <= 0.56)
		{
			spin("-500px", "0px", "0px", "-400px", "-200px", "/cms/files/first_date_v3.jpg", "PLAYFUL + PLAYFUL + LOVE + HAPPY = FIRST DATE", "First Date Milkshake", "-190px", "0px", "0px", "-152px", "-76px", "-440px", "0px", "0px", "-352px", "-176px"); //First Date
		}		
		else if (0.56 < num <= 0.63)
		{
			spin("-500px", "-500px", "-100px", "-400px", "-300px", "/cms/files/series_finale_v3.jpg", "SAD + LOVE + GRUMPY = SERIES FINALE", "bittersweet Series Finale", "-190px", "-190px", "-38px", "-152px", "-114px", "-440px", "-440px", "-88px", "-352px", "-264px"); //Series Finale
		}
		else if (0.63 < num <= 0.7)
		{
			spin("-500px", "-500px", "-200px", "-200px", "-400px", "/cms/files/bff_v3.jpg", "HAPPY + HAPPY + LOVE = BEST FRIENDS FOREVER", "Best Friends Forever", "-190px", "-190px", "-76px", "-76px", "-152px", "-440px", "-440px", "-176px", "-176px", "-352px"); //BFF
		}
		else if (0.7 < num <= 0.77)
		{
			spin("-500px", "-100px", "-100px", "-100px", "-300px", "/cms/files/cracked_phone_v3.jpg", "SAD + SAD + SAD + GRUMPY = CRACKED PHONE", "Cracked Phone", "-190px", "-38px", "-38px", "-38px", "-114px", "-440px", "-88px", "-88px", "-88px", "-264px"); //Cracked Phone
		}
		else if (0.77 < num <= 0.84)
		{
			spin("-500px", "-500px", "-200px", "-400px", "0px", "/cms/files/love_at_first_sight_v3.jpg", "HAPPY + LOVE + PLAYFUL = LOVE AT FIRST SIGHT", "Love at First Sight", "-190px", "-190px", "-76px", "-152px", "0px", "-440px", "-440px", "-176px", "-352px", "0px"); //Love at First Sight
		}	
		else if (0.84 < num <= 0.91)
		{
			spin("-500px", "-500px", "0px", "0px", "-200px", "/cms/files/friday_v3.jpg", "PLAYFUL + PLAYFUL + HAPPY = FRIDAY", "Relaxing Friday", "-190px", "-190px", "0px", "0px", "-76px", "-440px", "-440px", "0px", "0px", "-176px"); //Friday
		}
		else 
		{
			spin("-500px", "-500px", "-500px", "-300px", "0px", "/cms/files/sibling_rivalry_v3.jpg", "GRUMPY + PLAYFUL = SIBLING RIVALRY", "Sibling Rivalry", "-190px", "-190px", "-190px", "-114px", "0px", "-440px", "-440px", "-440px", "-264px", "0px"); //Sibling Rivalry
		}		
	});		

});


