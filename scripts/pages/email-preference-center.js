require([
		"modules/jquery-mozu"
	], function ($) {
	$(document).ready(function () {

		var queryString = window.location.search.substr(1, (window.location.search.length - 1));
		if (queryString.indexOf('EmailNotExist') > 0) {
			$('#email-not-found').html('Error: the email address is not found.');
		}
	});
});
