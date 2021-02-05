var utag_data = {};

var ga_check = true;

define("pages/jb-tealium-new", ["modules/jquery-mozu", "modules/api"],

	function ($, api) {
	"use strict";

	//   var pixelimg;
	//   try {
	//      if ($) {
	//         console.log("jquery is defined in jb-tealium-new");
	//  pixelimg = document.createElement('img');
	//  pixelimg.src = "//content.jellybelly.com/pixel/pixel.aspx?order_id=TBD&step=JQUERY_IS_DEFINED";
	//      }
	//   } catch (e) {
	//      pixelimg = document.createElement('img');
	//      pixelimg.src = "//content.jellybelly.com/pixel/pixel.aspx?order_id=ERROR&step=JQUERY_UNDEFINED";
	//   }

	var apiContext = JSON.parse(document.getElementById('data-mz-preload-apicontext').innerHTML);
	var pageContext = JSON.parse(document.getElementById('data-mz-preload-pagecontext').innerHTML);
	var userContext = JSON.parse(document.getElementById('data-mz-preload-user').innerHTML);
	
	if(!userContext.isAnonymous) {
		utag_data.customer_email = userContext.email;
		api.get('customer', { id: require.mozuData('user').accountId }).then(function(customer) {
			try { utag_data.customer_phone = customer.data.contacts[0].phoneNumbers.home.replace(/\D/g,''); } catch(e) { 
				utag_data.customer_phone = "";	
				console.log(e); 
				console.log("phone is not yet known"); 
			}
		});
	}
	else {
		utag_data.customer_email = "";	
		utag_data.customer_phone = "";	
	}

	var backupItemsArray = [{
			productCode : "76888",
			content : {
				productName : "Champagne Jelly Beans - 7.5 oz Gift Bag - 12 Count Case"
			},
			categories : [{
					content : {
						name : "Gift Bag"
					}
				}
			]
		}, {
			productCode : "76888",
			content : {
				productName : "Champagne Jelly Beans - 7.5 oz Gift Bag - 12 Count Case"
			},
			categories : [{
					content : {
						name : "Gift Bag"
					}
				}
			]
		}, {
			productCode : "76888",
			content : {
				productName : "Champagne Jelly Beans - 7.5 oz Gift Bag - 12 Count Case"
			},
			categories : [{
					content : {
						name : "Gift Bag"
					}
				}
			]
		}, {
			productCode : "76888",
			content : {
				productName : "Champagne Jelly Beans - 7.5 oz Gift Bag - 12 Count Case"
			},
			categories : [{
					content : {
						name : "Gift Bag"
					}
				}
			]
		}, {
			productCode : "76888",
			content : {
				productName : "Champagne Jelly Beans - 7.5 oz Gift Bag - 12 Count Case"
			},
			categories : [{
					content : {
						name : "Gift Bag"
					}
				}
			]
		}, {
			productCode : "76888",
			content : {
				productName : "Champagne Jelly Beans - 7.5 oz Gift Bag - 12 Count Case"
			},
			categories : [{
					content : {
						name : "Gift Bag"
					}
				}
			]
		}, {
			productCode : "76888",
			content : {
				productName : "Champagne Jelly Beans - 7.5 oz Gift Bag - 12 Count Case"
			},
			categories : [{
					content : {
						name : "Gift Bag"
					}
				}
			]
		}, {
			productCode : "76888",
			content : {
				productName : "Champagne Jelly Beans - 7.5 oz Gift Bag - 12 Count Case"
			},
			categories : [{
					content : {
						name : "Gift Bag"
					}
				}
			]
		}, {
			productCode : "76888",
			content : {
				productName : "Champagne Jelly Beans - 7.5 oz Gift Bag - 12 Count Case"
			},
			categories : [{
					content : {
						name : "Gift Bag"
					}
				}
			]
		}, {
			productCode : "76888",
			content : {
				productName : "Champagne Jelly Beans - 7.5 oz Gift Bag - 12 Count Case"
			},
			categories : [{
					content : {
						name : "Gift Bag"
					}
				}
			]
		}, {
			productCode : "76888",
			content : {
				productName : "Champagne Jelly Beans - 7.5 oz Gift Bag - 12 Count Case"
			},
			categories : [{
					content : {
						name : "Gift Bag"
					}
				}
			]
		}, {
			productCode : "76888",
			content : {
				productName : "Champagne Jelly Beans - 7.5 oz Gift Bag - 12 Count Case"
			},
			categories : [{
					content : {
						name : "Gift Bag"
					}
				}
			]
		}

	];

	var backupItems = {
		items : backupItemsArray
	};

	var cartModel; // = require.mozuData('cart');
	var prodModel; // = require.mozuData('product');
	var checkoutModel; // = require.mozuData('checkout');
	var confirmationModel; // = require.mozuData('order');
	var categoryModel; // = require.mozuData('Category');
	var userModel; // = require.mozuData('user');
	var categoryproduct;

	var facetedProducts = require.mozuData('facetedproducts');
	if (facetedProducts === undefined) {
		categoryproduct = backupItems; // require.mozuData('facetedproducts');
	} else {
		categoryproduct = facetedProducts;
	}

	var timer;

	if (pageContext.pageType == "cart") { // Cart Page
		cartModel = require.mozuData('cart');

		utag_data.site_name = "JellyBelly.com";
		utag_data.site_country = "US";
		utag_data.site_currency = "USD";
		utag_data.site_search_results = "";
		utag_data.site_search_keyword = "";

		utag_data.page_referring_url = document.referrer;
		utag_data.product_top5 = ["1220", "1171", "1241", "462", "527"];
		utag_data.page_name = pageName(pageContext);
		utag_data.page_type = pageType(pageContext);
		utag_data.page_type_googleDynamicRemarketing = pageTypeGoogleDynamicRemarketing(pageContext);

		utag_data.order_subtotal = (cartModel === undefined) ? "" : "" + cartModel.subtotal.toFixed(2);
		utag_data.product_brand = [""];
		utag_data.product_category = [""];
		utag_data.product_id = cartDetail('id');
		utag_data.product_sku = cartDetail('id');
		utag_data.product_image = cartDetail('image');
		utag_data.product_list_price = cartDetail('Discprice');
		utag_data.product_quantity = cartDetail('qty');
		utag_data.product_name = cartDetail('name');
		utag_data.product_unit_price = cartDetail('price');
		
	}
	//if (pageContext.pageType == "info") { // Static Pages.
	else if (pageContext.pageType == "web_page" || pageContext.pageType == "info") { // Static Pages.
		utag_data.site_name = "JellyBelly.com";
		utag_data.site_country = "US";
		utag_data.site_currency = "USD";
		utag_data.site_search_results = "";
		utag_data.site_search_keyword = "";

		utag_data.page_name = pageName(pageContext);
		utag_data.page_type = pageType(pageContext);
		utag_data.page_type_googleDynamicRemarketing = pageTypeGoogleDynamicRemarketing(pageContext);
		utag_data.page_section_name = "";
		utag_data.page_referring_url = document.referrer;

		utag_data.product_top5 = ["1220", "1171", "1241", "462", "527"];

		
	} else if (pageContext.pageType == 'search') {
		categoryproduct = backupItems;

		utag_data.site_name = "JellyBelly.com";
		utag_data.site_country = "US";
		utag_data.site_currency = "USD";
		utag_data.site_search_keyword = (require.mozuData('pagecontext') === undefined) ? "" : require.mozuData('pagecontext').search.query;
		//utag_data.site_search_results = ($('.jb-result-details').data('total-results') > 0) ? '' + $('.jb-result-details').data('total-results') : "";

		if (document.getElementById('data-mz-preload-facetedproducts') === null) {
			utag_data.site_search_results = 0;
		} else {
			var searchData = JSON.parse(document.getElementById('data-mz-preload-facetedproducts').innerHTML);
			utag_data.site_search_results = searchData.totalCount;
		}
		//utag_data.site_search_results = searchData.totalCount;
		utag_data.page_name = pageName(pageContext);
		utag_data.page_type = pageType(pageContext);
		utag_data.page_type_googleDynamicRemarketing = pageTypeGoogleDynamicRemarketing(pageContext);
		utag_data.product_id = categoryDetail('pid');

		
	} else if (pageContext.pageType == "category") { // Category Page

		utag_data.site_name = "JellyBelly.com";
		utag_data.site_country = "US";
		utag_data.site_currency = "USD";
		utag_data.site_search_results = "";
		utag_data.site_search_keyword = "";

		utag_data.page_referring_url = document.referrer;
		utag_data.product_top5 = ["1220", "1171", "1241", "462", "527"];
		utag_data.page_name = pageName(pageContext);
		utag_data.page_type = pageType(pageContext);
		utag_data.page_type_googleDynamicRemarketing = pageTypeGoogleDynamicRemarketing(pageContext);

		categoryModel = require.mozuData('Category');

		utag_data.page_category_name = categoryModel.content.name;
		utag_data.page_section_name = "product category";
		utag_data.page_categoryid = categoryModel.categoryId.toString();
		utag_data.page_subcategory_name = "";
		myCategory();

	} else if (pageContext.pageType == "product") { // Product Page

		utag_data.site_name = "JellyBelly.com";
		utag_data.site_country = "US";
		utag_data.site_currency = "USD";
		utag_data.site_search_results = "";
		utag_data.site_search_keyword = "";

		utag_data.page_referring_url = document.referrer;
		utag_data.product_top5 = ["1220", "1171", "1241", "462", "527"];
		utag_data.page_name = pageName(pageContext);
		utag_data.page_type = pageType(pageContext);
		utag_data.page_type_googleDynamicRemarketing = pageTypeGoogleDynamicRemarketing(pageContext);

		prodModel = require.mozuData('product');

		utag_data.product_id = productModel('id');
		utag_data.product_sku = productModel('id');
		utag_data.product_name = productModel('name').toString();
		utag_data.product_brand = productModel('category');
		utag_data.product_category = productModel('category');
		utag_data.product_unit_price = productModel('unitPrice'); //need non-sale price
		utag_data.product_list_price = productModel('salePrice');
		utag_data.product_image = productModel('image');
					myProduct();

		console.log(utag_data);
		
	} else if (pageContext.pageType == 'checkout') { // Checkout Page
		checkoutModel = require.mozuData('checkout');

		utag_data.site_name = "JellyBelly.com";
		utag_data.site_country = "US";
		utag_data.site_currency = "USD";

		utag_data.page_name = pageName(pageContext);
		utag_data.page_type = pageType(pageContext);
		utag_data.page_type_googleDynamicRemarketing = pageTypeGoogleDynamicRemarketing(pageContext);
		utag_data.page_referring_url = document.referrer;

		utag_data.product_id = checkoutDetail('id');
		utag_data.product_sku = checkoutDetail('id');
		utag_data.product_image = checkoutDetail('image');
		utag_data.product_quantity = checkoutDetail('qty');
		utag_data.product_list_price = checkoutDetail('Discprice');
		utag_data.product_name = checkoutDetail('name');
		utag_data.product_unit_price = checkoutDetail('price');

		
	} else if (pageContext.pageType == 'confirmation') { // Order Confirmation Page
		
		var orderNum = JSON.parse(document.getElementById('data-mz-preload-order').innerHTML).orderNumber;
		try {
			//console.log("document.cookie: " +document.cookie);
			//if (! document.cookie.includes('__GA__' + orderNum)) {
			if (document.cookie.indexOf('__GA__' + orderNum) == -1) {
				ga_check = undefined;
			}
		} catch(e) { console.warn(orderNum + ' tealium-new error in confirmation (tealium script)'); }

		confirmationModel = require.mozuData('order');
		userModel = require.mozuData('user');

		var logged_in = 'N';
		if (!userModel.isAnonymous) {
			logged_in = 'Y';
		}

		var order_has_digital = 'N';
		var i = 0;
		for (i = 0; i < confirmationModel.items.length; i += 1) {
			if (confirmationModel.items[i].product.goodsType === 'DigitalCredit') {
				order_has_digital = 'Y';
			}
		}

		// ESTIMATED SHIP AND DELIVERY DATE
		// var order_date = new Date(order_date_str + "T00:00:00");
		var orderDate = new Date();
		var daysToShip = 3;
		var daysToDeliver = 7;

		var shipDate = new Date();
		shipDate.setDate(orderDate.getDate() + daysToShip);

		// adjust shipDate and deliveryDate to advance beyond Saturdays and Sundays
		while (shipDate.getDay() === 6 || shipDate.getDay() === 0) {
			shipDate.setDate(shipDate.getDate() + 1);
		}

		var deliveryDate = new Date();
		deliveryDate.setDate(shipDate.getDate() + daysToDeliver);
		while (deliveryDate.getDay() === 6 || deliveryDate.getDay() === 0) {
			deliveryDate.setDate(deliveryDate.getDate() + 1);
		}

		var shipMonth = ('0' + (shipDate.getMonth() + 1)).slice(-2);
		var shipDay = ('0' + shipDate.getDate()).slice(-2);
		var estimatedShipDate = shipDate.getFullYear() + "-" + shipMonth + "-" + shipDay;

		var deliveryMonth = ('0' + (deliveryDate.getMonth() + 1)).slice(-2);
		var deliveryDay = ('0' + deliveryDate.getDate()).slice(-2);
		var estimatedDeliveryDate = deliveryDate.getFullYear() + "-" + deliveryMonth + "-" + deliveryDay;

		utag_data.site_name = "JellyBelly.com";
		utag_data.site_country = "US";
		utag_data.site_currency = "USD";
		utag_data.site_search_results = "";
		utag_data.site_search_keyword = "";

		utag_data.page_name = pageName(pageContext);
		utag_data.page_type = pageType(pageContext);
		utag_data.page_type_googleDynamicRemarketing = pageTypeGoogleDynamicRemarketing(pageContext);
		utag_data.page_section_name = "";
		utag_data.page_category_name = "";
		utag_data.page_subcategory_name = "";
		utag_data.page_referring_url = document.referrer;

		utag_data.product_id = confirmationDetail('id');
		utag_data.product_sku = confirmationDetail('id');
		utag_data.product_image = confirmationDetail('image');
		utag_data.product_quantity = confirmationDetail('qty');
		utag_data.product_list_price = confirmationDetail('Discprice');
		utag_data.product_name = confirmationDetail('name');
		utag_data.product_unit_price = confirmationDetail('price');

		utag_data.order_id = confirmationDetail('order_id').toString();
		utag_data.order_subtotal = confirmationDetail('subtotal').toString();
		utag_data.order_subtotalDisc = confirmationDetail('subtotalDiscount').toString();
		utag_data.order_shipping_amount = confirmationDetail('shippingTotal').toString();
		utag_data.order_payment_type = confirmationDetail('paymentType');
		utag_data.order_promotions = confirmationDetail('couponCode');
		utag_data.order_discount_amount = confirmationDetail('orderDiscount').toString();
		utag_data.order_total = confirmationDetail('total').toString();
		utag_data.order_currency = confirmationDetail('currency').toString();
		utag_data.order_shipping_method = confirmationDetail('shippingMethod').toString(); //need shipping method
		utag_data.order_shipping_company = confirmationDetail('company').toString();
		utag_data.order_shipping_first_name = confirmationDetail('fname').toString();
		utag_data.order_shipping_last_name = confirmationDetail('lname').toString();
		utag_data.order_shipping_street_1 = confirmationDetail('street1').toString();
		utag_data.order_shipping_street_2 = confirmationDetail('street2').toString();
		utag_data.order_shipping_city = confirmationDetail('city').toString();
		utag_data.order_shipping_state = confirmationDetail('state').toString();
		utag_data.order_shipping_zip = confirmationDetail('zip').toString();
		utag_data.order_shipping_msg = confirmationDetail('msg').toString();
		utag_data.order_billing_company = confirmationDetail('company').toString();
		utag_data.order_billing_first_name = confirmationDetail('billing_fname').toString();
		utag_data.order_billing_last_name = confirmationDetail('billing_lname').toString();
		utag_data.order_billing_street_1 = confirmationDetail('billing_street1').toString();
		utag_data.order_billing_street_2 = confirmationDetail('billing_street2').toString();
		utag_data.order_billing_city = confirmationDetail('billing_city').toString();
		utag_data.order_billing_state = confirmationDetail('billing_state').toString();
		utag_data.order_billing_zip = confirmationDetail('billing_zip').toString();
		utag_data.order_tax_amount = confirmationDetail('taxtotal').toString();
		utag_data.order_has_preorder = 'N';
		utag_data.order_has_digital = order_has_digital;
		utag_data.order_shipping_date_est = estimatedShipDate;
		utag_data.order_delivery_date_est = estimatedDeliveryDate;

		utag_data.customer_id = confirmationDetail('customer_id').toString();
		utag_data.customer_email = confirmationDetail('customer_email').toString();
		utag_data.customer_optin = confirmationDetail('customer_emailOpt').toString();
		utag_data.customer_phone = confirmationDetail('customer_phone').toString();
		utag_data.customer_country = "US";
		utag_data.customer_loggedin = logged_in;
		utag_data.google_conversion_language = "en";
		utag_data.google_conversion_format = "2";
		utag_data.google_conversion_color = "ffffff";
		utag_data.google_remarketing_only = false;
		// go ahead and concatenate info to form the "opt" parameter expected by Pepperjam
		// I suppose this could be concatenated at the Tealium level but it's okay to do it here too
		//var af_opt_amounts = "AMNT:" + utag_data.product_list_price.join('|');
		var af_opt_amounts = "AMNT:" + confirmationDetail('discountedLineItems_singleSkuPrice').join('|');
		var af_opt_skus = "IMID:" + utag_data.product_sku.join('|');
		var af_opt_qtys = "QNTY:" + utag_data.product_quantity.join('|');
		var af_isNewCustomer = "NWRT:" + ($.cookie("isNewCustomer") == "true" ? 1 : 0);
		$.cookie("isNewCustomer", "", { expires: 0, path: "/" });
		utag_data.pepperjam_opt = [af_opt_amounts, af_opt_skus, af_opt_qtys, af_isNewCustomer].join(';');
		utag_data.pepperjam_clickid_list = decodeURIComponent($.cookie('pepperjam_clickid_list') || '');
		utag_data.pepperjam_new_customer = af_isNewCustomer.match(/[0,1]/) || 0;
				
	} else {

		utag_data.site_name = "JellyBelly.com";
		utag_data.site_country = "US";
		utag_data.site_currency = "USD";
		utag_data.site_search_results = "";
		utag_data.site_search_keyword = "";

		utag_data.page_name = pageContext.url;
		utag_data.page_type = "unknown";
		utag_data.page_type_googleDynamicRemarketing = "unknown";
		utag_data.page_section_name = "";
		utag_data.page_category_name = "";
		utag_data.page_subcategory_name = "";
		utag_data.page_referring_url = document.referrer;

	}

	function pageName(pcontext) { // Check Page name
		if (pcontext.pageType === 'cart')
			return 'cart';
		else if (pcontext.pageType === 'category')
			return 'product category';
		else if (pcontext.pageType === 'product')
			return 'product';
		else if (pcontext.pageType === 'search')
			return 'search';
		else if (pcontext.pageType === 'checkout') // && this.urlCheck1 != 'confirmation')
			return "checkout";
		else if (pcontext.pageType == 'confirmation')
			return 'confirmation';
		else if (pcontext.title.toLowerCase() == 'home2' || pcontext.title.toLowerCase() == 'home')
			return 'home';
		else if (pcontext.title.toLowerCase() == "shop our prodiucts")
			return 'shopmain';
		else if (pcontext.title.toLowerCase() == "our products - jelly belly candy company" || pcontext.title.toLowerCase() == "visit us" || pcontext.title.toLowerCase() == "entertainment" || pcontext.title.toLowerCase() == "sports sponsorships")
			return 'home';
		else if (pcontext.title.toLowerCase() == "jelly belly store locator")
			return 'Locator';
		else if (pcontext.title.toLowerCase() == "gift-cards")
			return 'gift_cards';
		else if (pcontext.url.indexOf('com/candy') != -1)
			return 'candy';
		else
			return pcontext.cmsContext.page.path;
	}
	function pageType(pcontext) { // Check Page Type
		if (pcontext.pageType === 'cart')
			return 'cart';
		else if (pcontext.pageType === 'category')
			return 'category';
		else if (pcontext.pageType === 'product')
			return 'product';
		else if (pcontext.pageType === 'search')
			return 'search';
		else if (pcontext.pageType === 'checkout')
			return 'Checkout';
		else if (pcontext.pageType == 'confirmation')
			return 'receipt';
		else if (pcontext.title.toLowerCase() == 'home2' || pcontext.title.toLowerCase() == 'home')
			return 'home';
		else if (pcontext.title.toLowerCase() == "shop our prodiucts")
			return 'Shop';
		else if (pcontext.title.toLowerCase() == "our products - jelly belly candy company" || pcontext.title.toLowerCase() == "visit us" || pcontext.title.toLowerCase() == "entertainment" || pcontext.title.toLowerCase() == "sports sponsorships" || pcontext.title.toLowerCase() == "gift-cards" || pcontext.title.toLowerCase() == "jelly belly store locator")
			return 'gateway';
		else if (pcontext.url.indexOf('com/candy') != -1)
			return 'candy';
		else
			return pcontext.cmsContext.page.path;
	}

	function pageTypeGoogleDynamicRemarketing(pcontext) { // Check Page Type
		if (pcontext.pageType === 'cart')
			return 'cart';
		else if (pcontext.pageType === 'category')
			return 'category';
		else if (pcontext.pageType === 'product')
			return 'product';
		else if (pcontext.pageType === 'search')
			return 'searchresults';
		else if (pcontext.pageType === 'checkout')
			return 'purchase';
		else if (pcontext.pageType == 'confirmation')
			return 'other';
		else if (pcontext.pageType == 'cart')
			return 'cart';
		else if (pcontext.title.toLowerCase() == 'home2' || pcontext.title.toLowerCase() == 'home')
			return 'home';
		else if (pcontext.title.toLowerCase() == "shop our prodiucts")
			return 'other';
		else if (pcontext.title.toLowerCase() == "our products - jelly belly candy company" || pcontext.title.toLowerCase() == "visit us" || pcontext.title.toLowerCase() == "entertainment" || pcontext.title.toLowerCase() == "sports sponsorships" || pcontext.title.toLowerCase() == "gift-cards" || pcontext.title.toLowerCase() == "jelly belly store locator")
			return 'other';
		else if (pcontext.url.indexOf('com/candy') != -1)
			return 'other';
		else
			//return this.page.toString();
			return 'other';
	}

	function cartDetail(type) { // Explore details from Cart Model
		var products = [];
		if (type == "id") {
			for (var i = 0; i < cartModel.items.length; i++) {
				products.push(cartModel.items[i].product.productCode);
			}
		}
		if (type == "image") {
			for (var j = 0; j < cartModel.items.length; j++) {
				products.push(cartModel.items[j].product.imageUrl);
			}
		}
		if (type == "Discprice") {
			var discPrice;
			for (var z = 0; z < cartModel.items.length; z++) {
				discPrice = cartModel.items[z].discountedTotal / cartModel.items[z].quantity;
				products.push("" + discPrice.toFixed(2));
			}
		}
		if (type == "price") {
			for (var z2 = 0; z2 < cartModel.items.length; z2++) {
				products.push(cartModel.items[z2].product.price.price);
			}
		}
		if (type == "qty") {
			for (var x = 0; x < cartModel.items.length; x++) {
				products.push(cartModel.items[x].quantity);
			}
		}
		if (type == "name") {
			for (var y = 0; y < cartModel.items.length; y++) {
				products.push(cartModel.items[y].product.name);
			}
		}
		return products;
	}

	function categoryDetail(type) {
		var products = [];
		// var z = '';
		if (type == 'pid') {
            if(categoryproduct.items){  
                for (var z_1 = 0; z_1 < categoryproduct.items.length; z_1++) {
                    products.push(categoryproduct.items[z_1].productCode);
                }
            }
		}
		if (type == 'name') {
            if(categoryproduct.items){ 
                for (var z_2 = 0; z_2 < categoryproduct.items.length; z_2++) {
                    products.push(categoryproduct.items[z_2].content.productName);
                }
            }
		}

		if (type == 'category') { 
            if(categoryproduct.items){  
                for (var z_3 = 0; z_3 < categoryproduct.items.length; z_3++) {
                    products.push(categoryproduct.items[z_3].categories[0].content.name);
                }
            } 
		}
		return products;
	}

	function productModel(type) { // Get product details from Product Model
		var products = [];
		if (type == 'name') {
			products.push((prodModel.content.name === undefined) ? "" : prodModel.content.name);
		}
		if (type == 'id') {
			products.push((prodModel.productCode === undefined) ? "" : prodModel.productCode);
		}
		if (type == 'category') {
			for (var i = 0; i < prodModel.categories.length; i++) {
				products.push(prodModel.categories[i].content.name);
			}
		}
		if (type == 'unitPrice') {
			products.push((prodModel.price === undefined) ? "" : prodModel.price.price);
		}
		if (type == 'salePrice') {
			products.push((prodModel.price === undefined) ? "" : (prodModel.price.salePrice === undefined) ? "" : "" + prodModel.price.salePrice);
		}
		if (type == 'image') {
			for (var j = 0; j < prodModel.content.productImages.length; j++) {
				products.push(prodModel.content.productImages[j].imageUrl);
			}
		}
		return products;
	}

	function checkoutDetail(type) {
		var details = [];

		if (type == 'id') {
			for (var i = 0; i < checkoutModel.items.length; i++) {
				details.push(checkoutModel.items[i].product.productCode);
			}
		}
		if (type == 'image') {
			for (var j = 0; j < checkoutModel.items.length; j++) {
				details.push(checkoutModel.items[j].product.imageUrl);
			}
		}
		if (type == 'qty') {
			for (var x = 0; x < checkoutModel.items.length; x++) {
				details.push(checkoutModel.items[x].quantity);
			}
		}
		if (type == 'name') {
			for (var z = 0; z < checkoutModel.items.length; z++) {
				details.push(checkoutModel.items[z].product.name);
			}
		}
		if (type == "Discprice") {
			var discPrice;
			for (var z1 = 0; z1 < checkoutModel.items.length; z1++) {
				discPrice = checkoutModel.items[z1].discountedTotal / checkoutModel.items[z1].quantity;
				details.push("" + discPrice.toFixed(2));
			}
		}
		if (type == 'price') {
			for (var y = 0; y < checkoutModel.items.length; y++) {
				details.push(checkoutModel.items[y].product.price.salePrice);
			}
		}

		return details;
	}

	function confirmationDetail(type) { // Get Details from Order Confirmation Model
		var details = [],
		detailsStr;
		if (type == 'id') {
			for (var i = 0; i < confirmationModel.items.length; i++) {
				details.push(confirmationModel.items[i].product.productCode);
			}
		}
		if (type == 'image') {
			for (var j = 0; j < confirmationModel.items.length; j++) {
				details.push(confirmationModel.items[j].product.imageUrl);
			}
		}
		if (type == 'qty') {
			for (var x = 0; x < confirmationModel.items.length; x++) {
				details.push(confirmationModel.items[x].quantity);
			}
		}
		if (type == "Discprice") {
			var discPrice;
			for (var z1 = 0; z1 < confirmationModel.items.length; z1++) {
				discPrice = confirmationModel.items[z1].discountedTotal / confirmationModel.items[z1].quantity;
				details.push("" + discPrice.toFixed(2));
			}
		}
		if (type == 'price') {
			for (var y = 0; y < confirmationModel.items.length; y++) {
				details.push(confirmationModel.items[y].product.price.salePrice);
			}
		}
		if (type == 'name') {
			for (var z = 0; z < confirmationModel.items.length; z++) {
				details.push(confirmationModel.items[z].product.name);
			}
		}
		if (type == 'order_id') {
			details.push(confirmationModel.orderNumber);
		}
		if (type == 'subtotal') {
			details.push((confirmationModel.total - confirmationModel.shippingTotal).toFixed(2));
		}
		if (type == 'total') {
			details.push(confirmationModel.total);
		}
		if (type == 'taxtotal') {
			details.push((confirmationModel.taxTotal).toFixed(2));
		}
		if (type == 'shippingTotal') {
			details.push(confirmationModel.shippingTotal.toFixed(2));
		}
		if (type == 'paymentType') {
			for (var q = 0; q < confirmationModel.payments.length; q++) {
				details.push(confirmationModel.payments[q].paymentType);
			}
		}
		if (type == 'subtotalDiscount') {
			details.push((confirmationModel.discountTotal === undefined || confirmationModel.discountTotal === null) ? "" : confirmationModel.discountTotal.toFixed(2));
		}
		if (type == 'orderDiscount') {
			for (var zp = 0; zp < confirmationModel.orderDiscounts.length; zp++) {
				details.push(confirmationModel.orderDiscounts[zp].impact);
			}
		}
		if (type == 'couponCode') {
			for (var p = 0; p < confirmationModel.orderDiscounts.length; p++) {
				details.push(confirmationModel.orderDiscounts[p].couponCode);
			}
		}
		if (type == 'currency') {
			details.push(confirmationModel.currencyCode);
		}
		if (type == 'shippingMethod') {
			details.push(confirmationModel.fulfillmentInfo.shippingMethodName);
		}
		if (type == 'fname') {
			details.push(confirmationModel.fulfillmentInfo.fulfillmentContact.firstName);
		}
		if (type == 'lname') {
			details.push(confirmationModel.fulfillmentInfo.fulfillmentContact.lastNameOrSurname);
		}
		if (type == 'street1') {
			details.push(confirmationModel.fulfillmentInfo.fulfillmentContact.address.address1);
		}
		if (type == 'street2') {
			details.push((confirmationModel.fulfillmentInfo.fulfillmentContact.address.address2 === null) ? "" : confirmationModel.fulfillmentInfo.fulfillmentContact.address.address2);
		}
		if (type == 'city') {
			details.push(confirmationModel.fulfillmentInfo.fulfillmentContact.address.cityOrTown);
		}
		if (type == 'state') {
			details.push(confirmationModel.fulfillmentInfo.fulfillmentContact.address.stateOrProvince);
		}
		if (type == 'zip') {
			details.push(confirmationModel.fulfillmentInfo.fulfillmentContact.address.postalOrZipCode);
		}
		if (type == 'billing_fname') {
			details.push(confirmationModel.billingInfo.billingContact.firstName);
		}
		if (type == 'billing_lname') {
			details.push(confirmationModel.billingInfo.billingContact.lastNameOrSurname);
		}
		if(confirmationModel.billingInfo.billingContact.address !== undefined){
			if (type == 'billing_street1') {
				details.push(confirmationModel.billingInfo.billingContact.address.address1);
			}
			if (type == 'billing_street2') {
				details.push((confirmationModel.billingInfo.billingContact.address.address2 === null) ? "" : confirmationModel.billingInfo.billingContact.address.address2);
			}
			if (type == 'billing_city') {
				details.push(confirmationModel.billingInfo.billingContact.address.cityOrTown);
			}
			if (type == 'billing_state') {
				details.push(confirmationModel.billingInfo.billingContact.address.stateOrProvince);
			}
			if (type == 'billing_zip') {
				details.push(confirmationModel.billingInfo.billingContact.address.postalOrZipCode);
			}
		}
		if (type == 'customer_id') {
			details.push(confirmationModel.customerAccountId);
		}
		if (type == 'customer_email') {
			//details.push((!confirmationModel.acceptsMarketing) ? "" : confirmationModel.email);
			details.push(confirmationModel.email);
		}
		if (type == 'customer_emailOpt') {
			details.push((!confirmationModel.acceptsMarketing) ? "N" : "Y");
		}
		if (type == 'customer_phone') {
			details.push((typeof confirmationModel.billingInfo.billingContact.phoneNumbers == "undefined" ? "" : confirmationModel.billingInfo.billingContact.phoneNumbers.home));
		}
		if (type == 'msg') {
			details.push((confirmationModel.shopperNotes.comments === null || confirmationModel.shopperNotes.comments === undefined) ? "" : confirmationModel.shopperNotes.comments);
		}
		if (type == 'company') {
			details.push((confirmationModel.fulfillmentInfo.fulfillmentContact.companyOrOrganization === null || confirmationModel.fulfillmentInfo.fulfillmentContact.companyOrOrganization === undefined) ? "" : confirmationModel.fulfillmentInfo.fulfillmentContact.companyOrOrganization);
		}
		if (type == 'discountedLineItems') {
			for (var dli = 0; dli < confirmationModel.items.length; dli++) {
					details.push(confirmationModel.items[dli].adjustedLineItemSubtotal.toFixed(2));
			}
		}
		if (type == 'discountedLineItems_singleSkuPrice') {
			for (var dlis = 0; dlis < confirmationModel.items.length; dlis++) {
					var tempPrice = confirmationModel.items[dlis].adjustedLineItemSubtotal / utag_data.product_quantity[dlis];
					details.push(tempPrice.toFixed(2));
			}
		}
		return details;
	}


	function myProduct() {

		//var CartId = $('.softCartId').html();
		//var CartQty = $('.softCartQty').html();
		//var CartPrice = $('.softCartPrice').html();

		var CartId = document.getElementsByClassName('softCartId')[0].innerHTML;
		var CartQty = document.getElementsByClassName('softCartQty')[0].innerHTML;
		var CartPrice = document.getElementsByClassName('softCartPrice')[0].innerHTML;

		//      if (CartId !== "")
		//          clearInterval(timer);
		if (CartId !== "") {

			utag_data.site_name = "JellyBelly.com";
			utag_data.site_country = "US";
			utag_data.site_currency = "USD";
			utag_data.site_search_results = "";
			utag_data.site_search_keyword = "";

			utag_data.page_name = pageName(pageContext);
			utag_data.page_type = pageType(pageContext);
			utag_data.page_type_googleDynamicRemarketing = pageTypeGoogleDynamicRemarketing(pageContext);
			utag_data.page_section_name = "";
			utag_data.page_category_name = "";
			utag_data.page_subcategory_name = "";
			utag_data.page_referring_url = document.referrer;

			utag_data.product_top5 = ["1220", "1171", "1241", "462", "527"];

			utag_data.product_id = productModel('id');
			utag_data.product_sku = productModel('id');
			utag_data.product_name = productModel('name').toString();
			utag_data.product_brand = productModel('category');
			utag_data.product_category = productModel('category');
			utag_data.product_unit_price = productModel('unitPrice'); //need non-sale price
			utag_data.product_list_price = productModel('salePrice');
			utag_data.product_image = productModel('image');
			utag_data.cart_product_id = (CartId === "" || CartId === "[]") ? [] : JSON.parse(CartId);
			utag_data.cart_product_quantity = (CartQty === "" || CartId === "[]") ? [] : JSON.parse(CartQty);
			utag_data.cart_product_unit_price = (CartPrice === "" || CartId === "[]") ? [] : JSON.parse(CartPrice);
		
		}
	}

	function myCategory() {
		//var CartId = $('.softCartId').html();
		//var CartQty = $('.softCartQty').html();
		//var CartPrice = $('.softCartPrice').html();
		//      if (CartId !== "")
		//          clearInterval(timer);

		var CartId = document.getElementsByClassName('softCartId')[0].innerHTML;
		var CartQty = document.getElementsByClassName('softCartQty')[0].innerHTML;
		var CartPrice = document.getElementsByClassName('softCartPrice')[0].innerHTML;

		if (CartId !== "") {

			utag_data.site_name = "JellyBelly.com";
			utag_data.site_country = "US";
			utag_data.site_currency = "USD";
			utag_data.page_category_name = categoryModel.content.name;
			utag_data.page_name = pageName(pageContext);
			utag_data.page_type = pageType(pageContext);
			utag_data.page_type_googleDynamicRemarketing = pageTypeGoogleDynamicRemarketing(pageContext);
			utag_data.page_section_name = "product category";
			utag_data.product_id = categoryDetail('pid');
			utag_data.page_categoryid = categoryModel.categoryId.toString();
			utag_data.page_subcategory_name = "";
			utag_data.cart_product_id = (CartId === "" || CartId === "[]") ? [] : JSON.parse(CartId);
			utag_data.cart_product_quantity = (CartQty === "" || CartId === "[]") ? [] : JSON.parse(CartQty);
			utag_data.cart_product_unit_price = (CartPrice === "" || CartId === "[]") ? [] : JSON.parse(CartPrice);
		}
	}
utag_data.yotta_custom_dimension1 = "yottaa_control";
});

