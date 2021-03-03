require(['modules/jquery-mozu', 'underscore', 'hyprlive', 'modules/api'],
	function ($, _, Hypr, api) {
	$(document).ready(function () {

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
