require(['modules/jquery-mozu', 'underscore', 'hyprlive', 'modules/api'],
	function ($, _, Hypr, api) {
		var order=require.mozuData('order');
		function getMethod(name) {
			// Helper function. Returns an object containing information about that shipping method
			//
			// method: Kibo id for shipping method
			// regularShipDays: Days of the week when this shipping method can be used - 0,1,2,3,4,5,6
				// 0 = Sunday, 1 = Monday ... 6 = Saturday
			// hsShipDays: Days of the week when this shipping method can be used on orders containing heat sensitive items
				// 0 = Sunday, 1 = Monday ... 6 = Saturday
			// arrivalBegin and arrivalEnd: A range indicating the expected arrival (in days) of an order after ship date
			//		Note: should be same for specific delivery methods
		
			var shipMethods = [{
					"method": "ups_UPS_GROUND", 
					"regularShipDays": [1,2,3,4,5],
					"hsShipDays": [1,2],
					"arrivalBegin": 4,
					"arrivalEnd" : 7
				},
				{
					"method": "ups_UPS_SUREPOST_LESS_THAN_1LB",
					"regularShipDays": [1,2,3,4,5],
					"hsShipDays": [1,2,3,4,5],
					"arrivalBegin": 6,
					"arrivalEnd" : 9
				},
				{
					"method": "ups_UPS_SUREPOST_1LB_OR_GREATER",
					"regularShipDays": [1,2,3,4,5],
					"hsShipDays": [1,2,3,4,5],
					"arrivalBegin": 6,
					"arrivalEnd" : 9
				},
				{
					"method": "ups_UPS_THREE_DAY_SELECT",
					"regularShipDays": [1,2,3,4,5],
					"hsShipDays": [1,2],
					"arrivalBegin": 3,
					"arrivalEnd" : 3
				},
				{
					"method": "ups_UPS_SECOND_DAY_AIR",
					"regularShipDays": [1,2,3,4,5],
					"hsShipDays": [1,2],
					"arrivalBegin": 2,
					"arrivalEnd" : 2
				},
				{
					"method": "ups_UPS_NEXT_DAY_AIR_SAVER",
					"regularShipDays": [1,2,3,4,5],
					"hsShipDays": [1,2],
					"arrivalBegin": 1,
					"arrivalEnd" : 1
				},
				{
					"method": "ups_UPS_NEXT_DAY_AIR",
					"regularShipDays": [1,2,3,4,5],
					"hsShipDays": [1,2],
					"arrivalBegin": 1,
					"arrivalEnd" : 1
				}
			];
			//return shipMethods.find(function(method){return method.method === name;});
			
			for (var i = 0; i < shipMethods.length; i++) {
					if (shipMethods[i].method === name)
						return shipMethods[i];
			}
		
		//	shipMethods.forEach(function(method){
		//		if (method.method === name)
		//			shipMethod = method;
		//	});
		//	return shipMethod;
		}
		
		function checkMethod(day, method, hs) {
			// given a date, shipping method id, and whether order is heat-sensitive, returns true or false
			// for whether the order can be shipped on the date
			var meth = getMethod(method);
			if (hs) { 
				return meth.hsShipDays.indexOf(day) > -1 ? true:false;
			}else{ 
				return meth.regularShipDays.indexOf(day) > -1 ? true:false;
			}
		}
		
		function getArrival2(d, start, days) {
			// given a shipdate d, a start index (should be 0), and the number of days from the shipdate, returns the first
			// eligible business day
			if (start === days)
				return d;
			
			var d2 = new Date(d);
			var dd = d.getDate();
			d2.setDate(dd + 1);
		
			var s = (start);
			// we'll assume orders can only arrive on Monday - Friday, or 1,2,3,4,5
			if ([1,2,3,4,5].indexOf(d2.getDay()) > -1) {
				s=s+1;
			}
			return getArrival2(d2, s, days);
		}
		
		function getNextShipDate(n, d, hs, m) {
			// given a date n, a 12PM deadline d, a heat sensitive boolean, and a shipping method id, finds the first
			// eligible business day on which an order can ship (according to the shipping method definition)
			if (n.getTime() < d.getTime() && checkMethod(d.getDay(), m, hs)) {
				return d;
			}
			else {
				var d2 = new Date(d);
				var cd = d.getDate();
				d2.setDate(cd + 1);
				return getNextShipDate(n, d2, hs, m);
			}
		}
	
		function shippingestimation(shippingmethod){
            var testDate = new Date();
			var deadline = new Date(testDate.getTime());
			deadline.setHours(12);
			deadline.setMinutes(0);
			deadline.setSeconds(0);
			deadline.setMilliseconds(0);
			var heatsensitive =hasHeatSensitiveItemsByCategory() || false; // document.getElementById('heatsensitive').value;
			var state;		
			// error handling in case there is not a state available yet on the order
			try {
				//var order = require.mozuData('order');
				var fulfillmentInfo = order.fulfillmentInfo;
				state = fulfillmentInfo.fulfillmentContact.address.stateOrProvince;
			} catch(e) { 
				state = "ZZ";
			}
			var mdef = getMethod(shippingmethod.shippingMethodCode);
			if(mdef!==undefined){
			var shipDate = getNextShipDate(testDate, deadline, heatsensitive, mdef.method);
			var a1 = getArrival2(shipDate, 0, mdef.arrivalBegin);
			var a2 = getArrival2(shipDate, 0, mdef.arrivalEnd);
			var estimation = "", estimationDate="";
			if(state == 'AK' || state == 'HI' || state == 'AA'|| state == 'AP' || state == 'AE'){
                if (mdef.method === "ups_UPS_NEXT_DAY_AIR" || mdef.method === "ups_UPS_SECOND_DAY_AIR" || mdef.method === "ups_UPS_NEXT_DAY_AIR_SAVER" || mdef.method === "ups_UPS_THREE_DAY_SELECT") {
					estimation = "Expected Arrival Date: "+a1.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
					estimationDate = shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
					$(document).find('.shippingAKHI').hide();
                }else{
                    estimation = "Up to 6 Weeks";
					estimationDate = "Up to 6 Weeks";
					$(document).find('.shippingAKHI').show();
                }
			}else if (mdef.method === "ups_UPS_GROUND") {
                estimation = "4 to 7 business days from ship date";
				estimationDate = shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            }else if (mdef.method === "ups_UPS_SUREPOST_LESS_THAN_1LB") {
                estimation = "6 to 9 business days from ship date";
				estimationDate = shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            }else if (mdef.method === "ups_UPS_SUREPOST_1LB_OR_GREATER") {
                estimation = "6 to 9 business days from ship date";
				estimationDate = shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            }else if (mdef.method === "ups_UPS_THREE_DAY_SELECT") {
                estimation = a1.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
				estimationDate = shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            }else if (mdef.method === "ups_UPS_SECOND_DAY_AIR") {
                estimation = a1.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
				estimationDate = shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            }else if (mdef.method === "ups_UPS_NEXT_DAY_AIR_SAVER") {
                estimation = a1.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
				estimationDate = shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            }
			return {"estimation": estimation,"estimationDate" : estimationDate};  
		}
		}
		function hasHeatSensitiveItemsByCategory() {
			var items = order.items;
		
			var result = _.find(items, function(item) {
				return _.find(item.product.categories, function(category){
					return category.id == Hypr.getThemeSetting('heatSensitiveCategoryId');
				});
			});
			if (result === undefined)
					return false;
				else
					return true;
		}
		$(document).on('click','.Take-Survey',function(e){
			e.preventDefault();
			$('#brmerchantLogo,.invitation-navigation-element').trigger('click'); 
			$('.Take-Survey').attr('disabled',true);
		});
	$(document).ready(function () {
		// if($(window).width() < 768){ 
        //     $('.mz-signup-password').focusin(function(){
        //         $('.mob-pwd-row').css('display','block');     
        //     });
        //     $('.mz-signup-password').focusout(function(){
        //        $('.mob-pwd-row').css('display', 'none');          
        //     });
        // }

		var johnList = []; //Hypr.getThemeSetting('onetimeCoupons').split(',');
		var orderInfo = JSON.parse(document.getElementById('data-mz-preload-order').innerHTML);
		//var onetimeUseCoupons = _.intersection(johnList, orderInfo.couponCodes);
		//alert("doing something");
		// if (!$.cookie("onetimeCoupons")) {
		// $.cookie("onetimeCoupons", encodeURIComponent(onetimeUseCoupons.join(",")), {
		// path : '/', expires: 365
		// });
		// } else {
		// var tempCouponsUsedStr = decodeURIComponent($.cookie("onetimeCoupons") || '');
		// var tempCouponsUsed = tempCouponsUsedStr.split(",");
		// Array.prototype.push.apply(tempCouponsUsed, onetimeUseCoupons);
		// $.cookie("onetimeCoupons", encodeURIComponent(tempCouponsUsed.join(",")), {
		// path : '/', expires: 365
		// });
		// }
		
		var fulfillmentInfo = order.fulfillmentInfo;
		var estimationInfo=shippingestimation(fulfillmentInfo);
		console.log(estimationInfo);
		if(estimationInfo){
			$('.estimation-info').text(estimationInfo.estimation);
		}
		// signup functaion
		$(document).on('click', '.signup', function(e){
			var password = $('.forminput[name="password"]').val();
			var cpassword = $('.forminput[name="cpassword"]').val();
			$(document).find('.cpasswordError').html('');
			$(document).find('.passwordError').html('');
			var passregex=/^(?=.*\d)(?=.*[A-Za-z])(?=.*[a-zA-Z]).{6,}$/;
			if(passregex.test(password)){
				if(password == cpassword){
					var email = $.cookie('guest');
					api.request('post','/svc/customersignup', 
						{"EmailAddress" : email,
						"Password" : password }).then(function(res){
						console.log(res); 
						if(res.Error){
							$(document).find('.passwordError').html(res.Message);	
						}else{
                            api.action('customer', 'loginStorefront', {
                                email: email,
                                password: password
                            }).then(function(res){
                                window.location = window.location.href;
                            });
						}
					});
				}else{
					$(document).find('.cpasswordError').html("Password must match with confirmation password.");	
				}
			}else{
                if(!passregex.test(password)){
					$(document).find('.passwordError').html(" Password must contain at least 6 characters, containing at least 1 number and 1 alphabetic character.");
				}
				else if(cpassword.length === 0){
                    $(document).find('.cpasswordError').html("Password must match with confirmation password.");
                }
				//$(document).find('.passwordError').html("Password must contain 6 characters.");
			}
			console.log('password',password, "cpassword", cpassword);
		});
		$.cookie('pepperjam_clickid_list', '', { path: '/' });
		
		var orderNumGA = orderInfo.orderNumber;
		try {
			if (document.cookie.indexOf('__GA__' + orderNumGA) > -1) {
				$.cookie('__GA__' + orderNumGA, "cookie_set", {
					path: '/', expires: -1
				});
			}
		} catch(e) { console.warn(orderNumGA + ' error in confirmation (confirmation script)'); }
		
		api.request('GET', '/svc/encrypt_email?email=' + orderInfo.email).then(function(res){
		})
		.catch(function(e){
			console.log(e);
		});
		
	});
});
