require([
		'modules/jquery-mozu',
		'modules/api',
		'modules/models-cart'
	],
	function($,Api,CartModels) {

	$(document).ready(function () {
		var url = location.href;
		var code = url.split("?")[1];
      var cartModel = new CartModels.Cart();
			cartModel.apiGet().then(function(res){
				Api.request('PUT', '/api/commerce/carts/'+ res.data.id + '/coupons/12345788').then(function(res){
					$('#coupon-image').append('<img src="//cdn-tp1.mozu.com/9046-m1/cms/files/mrJB_verticalImage.jpg" />');
					$('#coupon-message').html('<h2>Coupon '+code+' added! Shop <a href="https://www.jellybelly.com">Jellybelly.com</a></h2>');
				}, function(error){
					console.log('Invalid coupon code');
					$('#error-coupon').html('<h2>Sorry, coupon '+code+' could not be added. Shop <a href="https://www.jellybelly.com">Jellybelly.com</a></h2>'); 
				});	
			});  
	});      
});
					