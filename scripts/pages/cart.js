// Changes made by Amit on 3- july for empty cart and coupon code at line no 74-116
define(['modules/backbone-mozu', 'underscore', 'hyprlive', 'modules/jquery-mozu', 'modules/models-cart', 
        'modules/cart-monitor','modules/minicart', 'modules/api' , 'modules/preserve-element-through-render',
        'modules/models-product','modules/xpressPaypal', "shim!vendor/owl.carousel[jquery=jQuery]>jQuery"], 
function (Backbone, _, Hypr, $, CartModels, CartMonitor, Minicart,Api, preserveElement,ProductModels,paypal) {
		
    var ThresholdMessageView = Backbone.MozuView.extend({
      templateName: 'modules/cart/cart-discount-threshold-messages'
    }); 
    var CartView = Backbone.MozuView.extend({
        templateName: "modules/cart/cart-table",
        getRenderContext : function(){
            var noShippingProducts = Hypr.getThemeSetting('noFreeShippingSkuList').replace(/ /g, "").split(','); 
            var c = Backbone.MozuView.prototype.getRenderContext.apply(this, arguments);
            var noshippingTotal = 0;
            c.model.isNoShipping = false;
            c.model.items.filter(function(v,i){
                if(noShippingProducts.indexOf(v.product.productCode) >= 0) c.model.isNoShipping =  true;
                v.product.isNoShipping = noShippingProducts.indexOf(v.product.productCode) >= 0 ? true : false; 
                if(noShippingProducts.indexOf(v.product.productCode) == -1){
                    noshippingTotal = noshippingTotal+v.total;
                } 
            });

            var total=c.model.discountedTotal;
            var amt = 0;      
            if(!c.model.isNoShipping){
                if(total<Hypr.getThemeSetting('freeshippingBoundingValue')){                                          
                    amt=(Hypr.getThemeSetting('freeshippingBoundingValue')-parseFloat(total,10)).toFixed(2);
                    c.model.remainingfreeshippinng=amt;
                }else{
                    c.model.remainingfreeshippinng=0; 
                }
            }else{
                if(noshippingTotal<Hypr.getThemeSetting('freeshippingBoundingValue')){
                    amt=(Hypr.getThemeSetting('freeshippingBoundingValue')-parseFloat(noshippingTotal,10)).toFixed(2);
                    c.model.remainingfreeshippinng=amt;
                }else{
                    c.model.remainingfreeshippinng=0; 
                }
            }

            c.model.noshippingTotal = noshippingTotal;
            return c;   
        },
        initialize: function () {
            var me = this;

            //setup coupon code text box enter.
            this.listenTo(this.model, 'change:couponCode', this.onEnterCouponCode, this);
            this.codeEntered = !!this.model.get('couponCode');
            /*this.$el.on('keypress', 'input', function (e) {
                if (e.which === 13) {
                    if (me.codeEntered) {
                        me.handleEnterKey();
                    }
                    return false;
                }
            });*/

            $("#coupon-code").keyup(function(event) {
                if (event.keyCode === 13) {
                    if (me.codeEntered) {
                        me.handleEnterKey();
                    }
                }
            });
            this.$el.on('paste', 'input', function (e) {
                setTimeout(function(){
                    if($('#coupon-code').val() !==""){
                        me.$el.find('#cart-coupon-code').prop('disabled', false);
                        me.$el.find('#cart-coupon-code').addClass("active-button");
                        $('.coupon-error').fadeOut();
                    }
                },100);
            });

           
            me.messageView = new ThresholdMessageView({
              el: $('#mz-discount-threshold-messages'),
              model: this.model
            });
        },
        increseQty : function(e){
            var newQuantity = parseInt($(e.target).parents('.qty-input-box').find('input').val(),10)+1,
            id = $(e.target).parents('.qty-input-box').find('input').attr('data-mz-cart-item'),
            item = this.model.get("items").get(id);

            if(newQuantity <= 25){
                if (item && !isNaN(newQuantity)) {
                    item.set('quantity', newQuantity);
                    item.saveQuantity();

                }
                Minicart.MiniCart.updateMiniCart();
                window.qtyButtonToFocus = '.plus-prod-qty-cart';
                // setTimeout(function() {
                //     $('.plus-prod-qty-cart').focus();
                // }, 5000);
                // $(e.target).parent().find('input').val(newQuantity);
            }
        },
        decQty: function(e){
            var newQuantity = parseInt($(e.target).parents('.qty-input-box').find('input').val(),10)-1,
            id = $(e.target).parents('.qty-input-box').find('input').attr('data-mz-cart-item'),
            item = this.model.get("items").get(id);
            if(!newQuantity){
                newQuantity = 1;
            }
            if(newQuantity >= 1){
                if (item && !isNaN(newQuantity)) {
                    item.set('quantity', newQuantity);
                    item.saveQuantity();

                }
                Minicart.MiniCart.updateMiniCart();
                window.qtyButtonToFocus = '.minus-prod-qty-cart';
                // setTimeout(function() {
                //     $('.minus-prod-qty-cart').focus();
                // }, 800);
                // $(e.target).parent().find('input').val(newQuantity);
            }
        },
        updateQuantity: _.debounce(function (e) {
            var $qField = $(e.currentTarget),
                newQuantity = parseInt($qField.val(),10),
                id = $qField.data('mz-cart-item'),
                item = this.model.get("items").get(id);

                if(newQuantity > 25){
                    $qField.val('25');
                    newQuantity = 25;
                }
                
                if (item && !isNaN(newQuantity)) {
                    item.set('quantity', newQuantity);
                    item.saveQuantity();

                }
                Minicart.MiniCart.updateMiniCart();

            }, 400),
        additionalEvents: {
            // 'keyup #shipping-zip': 'testfun',
            'click .remove-coupon': 'removeCoupon',
            "click .plus-prod-qty-cart" : "increseQty",
            "click .minus-prod-qty-cart" : "decQty",
            "touchstart .minus-prod-qty-cart": "decQty",
            "touchstart .plus-prod-qty-cart": "increseQty", 
            "click .coupon-text":"couponSlide",
            'click .p-button-mobile':'paypal',
            "click .estimateShippingCost":"showShipplingCalculator",
            "keyup #shippingzipcode":"onEntershippingzipcode"
        },
        removeCoupon: function(e) {
            var self = this,
                removedCoupon,
                couponCodes = self.model.get('couponCodes');

                $.each(couponCodes, function(i, o) {
                    self.model.apiRemoveCoupon(o).then(function(res) {
                        $.cookie('coupon', '', {
                            path: '/',
                            expires: 7
                        });
                    });
                });
                
                //$('#cart-checkout').focus();
                $('.coupon-code-main').find('input').focus();

            },
            removeAllCoupon: function() {
                var self = this,
                    couponCodesLength = self.model.get('couponCodes').length,
                    couponCodes = self.model.get('couponCodes'),
                    i = 0,
                    removeCoupon;
                if (couponCodesLength > 0 && $.cookie('coupon')) {
                    for (i; i < couponCodesLength; i++) {
                        if ($.cookie('coupon') !== couponCodes[i]) {
                            removeCoupon = couponCodes[i];
                        }
                    }
                    if (removeCoupon) {
                        self.model.apiRemoveCoupon(removeCoupon).then(function(res) {
                            console.log("coupon removed");
                        });
                    }
                }
            },
        // couponSlide: function(e){
        //     var coupon = $(document).find('.coupon-code-main');
        //     if(coupon.is(':visible')){
        //         coupon.slideUp();     
        //         $(e.currentTarget).find('span img').removeClass('arrow'); 
        //     }else{
        //         coupon.slideDown();
        //         $(e.currentTarget).find('span img').addClass('arrow');
        //         $(document).find('#coupon-code').focus();
        //     }
        // },
       /* testfun: function(e) {
                var cartDetails = this.model.apiModel.data;
                if (cartDetails && cartDetails.items.length > 0) {
                    if ($(e.currentTarget).val() !== "" && $(e.currentTarget).val().length == 5) {
                        $('#estimateShip').removeAttr('disabled');
                    }else{
                         $('#estimateShip').attr('disabled','disabled');
                    }
            }
           
    
  
         
         
        
        },*/
        showShipplingCalculator:function(e){
            $(".estimateShippingCost").addClass("estimateShippingCost-onshow");
            $('#estimateShippingCost-entry').removeClass('inactive');
            $('#estimateShippingCost-entry').addClass('active');
            $(document.getElementById("shippingzipcode")).focus();
            $("#estimateShippingCost-success").hide();
            $('#estimateShippingCost-failure').hide();
            $('#shippingzipcode-btn').prop('disabled', true);
            this.shippingcodeEntered = false;
        },
        render:function(){
           // window.shippingCalculationEnabled = true;
           console.log(" Hypr.getThemeSetting('isshippingCalculationEnabled') ===",Hypr.getThemeSetting('isshippingCalculationEnabled'));
           var isshippingCalculationEnabled = Hypr.getThemeSetting('isshippingCalculationEnabled');
           if(!window.isshippingCalculationEnabled){
                window.isshippingCalculationEnabled = isshippingCalculationEnabled;
           }
            if(window.isshippingCalculationEnabled){
                this.model.set('isshippingCalculationEnabled', window.isshippingCalculationEnabled); 
            } 
            Minicart.MiniCart.updateMiniCart();
            preserveElement(this, ['.p-button'], function() {
                Backbone.MozuView.prototype.render.call(this);
            });
            if(this.model.get('couponCodes').length>1 && $.cookie('coupon')){
                this.removeAllCoupon(); 
            }else if($.cookie('coupon')==="" && this.model.get('couponCodes').length>0){
                this.removeCoupon();
            }else if(this.model.get('suggestedDiscounts').length <= 0 && this.model.get('couponCodes').length>0 && this.model.get('discountTotal')===0){ 
                this.removeCoupon();
            } 
            if(this.model.apiModel.data.items.length>0){
			this.checkInventory(); 
            } 
            if(this.model.apiModel.data.items.length<1){
                $(document).find('.p-button').attr('disabled',true);
                $(document).find('.p-button-mobile').attr('disabled',true);
            }else{
                $(document).find('.p-button').attr('disabled',false);
                $(document).find('.p-button-mobile').attr('disabled',false);
            }
        },
        
        removeItem: function(e) {
            var $removeButton = $(e.currentTarget),
                id = $removeButton.data('mz-cart-item');
            this.model.removeItem(id);
            Minicart.MiniCart.updateMiniCart();
			//brontoObj.build(Api);
            return false;
        },
        empty: function() {
             this.model.apiDel().then(function() {
                 window.location.reload();
             });
             /*if(this.model.isEmpty){
                window.location.reload();
             }*/
        },
        
        proceedToCheckout: function () {
            //commenting  for ssl for now...
            //this.model.toOrder();
            // return false;
            this.model.isLoading(true);
            // the rest is done through a regular HTTP POST
        },
        
        // coupon changed by amit
        addCoupon: function () {
			$('.coupon-error-onetime-use').fadeOut();
			var johnList = []; // Hypr.getThemeSetting('onetimeCoupons').split(',');
			var tempCouponsUsedStr = decodeURIComponent($.cookie("onetimeCoupons") || '');
			var tempCouponsUsed = tempCouponsUsedStr.split(",");
			if(tempCouponsUsed.indexOf($('#coupon-code').val()) > -1) {
						$('.coupon-error-onetime-use').html("<b>" + $('#coupon-code').val() + " is a one-time use coupon code that you have previously redeemed.</b> If you have a different code, please enter it above, or click “PROCEED TO CHECKOUT”, below.").fadeIn().focus();
						return;
				}
			var self = this;
			if(this.model.get('couponCodes').length< 1){
				var addedCoupon = self.model.get('couponCode');
				this.model.addCoupon().ensure(function () {
					self.model.unset('couponCode');
					self.render();
				});
				$.cookie("coupon", addedCoupon , { path: '/', expires: 7 });
                //$('#cart-checkout').focus();
                $('.coupon-code-main').find('input').focus();
            } 
            else {
                $('.coupon-error').fadeIn().focus();
			}

/*		var tempCouponsUsedStr = decodeURIComponent($.cookie("onetimeCoupons") || '');
			var tempCouponsUsed = tempCouponsUsedStr.split(",");
			var self = this;
			Api.get('cart').then(function (cart) {
				if (cart.data.couponCodes.indexOf($('#coupon-code').val()) > -1) {
					alert("Error, coupon already used");
					return;
				} else {
					alert("Adding");

				}		
			}); */
        },
        onEnterCouponCode: function (model, code) {
            if (code && !this.codeEntered) {
                this.codeEntered = true;
                this.$el.find('#cart-coupon-code').prop('disabled', false);
                this.$el.find('#cart-coupon-code').addClass("active-button");
                $('.coupon-error').fadeOut();
            }
            if (!code && this.codeEntered) {
                this.codeEntered = false;
                this.$el.find('#cart-coupon-code').prop('disabled', true);
                this.$el.find('#cart-coupon-code').removeClass("active-button");
            }
        },
        onEntershippingzipcode:function(e){
            var code = $("#shippingzipcode").val();
            if (code && !this.shippingcodeEntered) {
                this.shippingcodeEntered = true;
                this.$el.find('#shippingzipcode-btn').prop('disabled', false);
               // this.$el.find('#shippingzipcode-btn').addClass("active-button");
            }
            if (!code && this.shippingcodeEntered) {
                this.shippingcodeEntered = false;
                this.$el.find('#shippingzipcode-btn').prop('disabled', true);
               // this.$el.find('#cshippingzipcode-btn').removeClass("active-button");
            }
            $('#estimateShippingCost-failure').hide();
            console.log(" e-----",e.which);
            if (e.which === 13 && this.shippingcodeEntered) {
                $("#shippingzipcode-btn").click();
            }
        },
        autoUpdate: [
            'couponCode'
        ],
        handleEnterKey: function () {
            this.addCoupon();
        },

        estimateShip: function(e) {
                var self = this;
                //var stringmethods = Hypr.getThemeSetting('shippingMethods');
                //var shippingMethods = stringmethods.split(',');
                e.preventDefault();
                var zipPat = /^\d{5}(?:[-\s]\d{4})?$/;
                var zip = $('#shippingzipcode').val();
                $(e.currentTarget).addClass('is-loading');
                if (zipPat.test($('#shippingzipcode').val())) {

                    $('#ziperror').hide();
                    self.$el.find('#shippingzipcode-btn').prop('disabled', true);
                    var cartData = this.model.apiModel.data;

                    $.cookie('zip', $('#shippingzipcode').val());

                    if (cartData.isEmpty !== true) {
                        var itemArr = [];

                        $.each(cartData.items, function(index, obj) {

                            var item = {};
                            item.quantity = obj.quantity;
                            item.shipsByItself = false;
                            if(obj.product && obj.product.measurements){
                                item.unitMeasurements = {
                                    "height": {
                                        "unit": obj.product.measurements.height ? obj.product.measurements.height.unit:"",
                                        "value": obj.product.measurements.height ? obj.product.measurements.height.value :""
                                    },
                                    "length": {
                                        "unit": obj.product.measurements.length ? obj.product.measurements.length.unit:"",
                                        "value": obj.product.measurements.length ? obj.product.measurements.length.value:""
                                    },
                                    "weight": {
                                        "unit": obj.product.measurements.weight ? obj.product.measurements.weight.unit :"",
                                        "value": obj.product.measurements.weight ? obj.product.measurements.weight.value:""
                                    },
                                    "width": {
                                        "unit": obj.product.measurements.width ? obj.product.measurements.width.unit :"",
                                        "value": obj.product.measurements.width ? obj.product.measurements.width.value:""
                                    }
                                };
                            }
                            itemArr.push(item);
                        });
                        var now = new Date();
                        var utc = new Date(Date.UTC(
                            now.getFullYear(),
                            now.getMonth(),
                            now.getDate(),
                            now.getHours(),
                            now.getMinutes()
                        ));
                        //$('.dispdate').append('CurrentDate ' + now);

                        var responsefiled1 = {
                            "carrierIds": ['ups'],
                            "destinationAddress": {
                                "countryCode": "US",
                                "postalOrZipCode": $('#shippingzipcode').val()
                            },

                            "isDestinationAddressCommercial": true,
                            "isoCurrencyCode": Hypr.getThemeSetting('shipamtCode'),
                            "items": itemArr,
                            "originAddress": {
                                "address1": Hypr.getThemeSetting('shipaddress1'),
                                "cityOrTown": Hypr.getThemeSetting('shipcityOrTown'),
                                "countryCode": Hypr.getThemeSetting('shipcountryCode'),
                                "postalOrZipCode": Hypr.getThemeSetting('shippostalOrZipCode'),
                                "stateOrProvince": Hypr.getThemeSetting('shipstateOrProvince'),
                            },
                            //"shippingServiceTypes": ["ups_UPS_GROUND","ups_UPS_SUREPOST_LESS_THAN_1LB","ups_UPS_SUREPOST_1LB_OR_GREATER","ups_UPS_THREE_DAY_SELECT","ups_UPS_SECOND_DAY_AIR","ups_UPS_NEXT_DAY_AIR_SAVER"] //shippingMethods
                        };
                        var amount = false;
                        Api.request('POST', {
                            url: '/api/commerce/catalog/storefront/shipping/request-rates',
                            iframeTransportUrl: 'https://' + document.location.host + '/receiver?receiverVersion=2'
                        }, responsefiled1).then(function(resp) {
                            $('#shippingzipcode').val("");
                            $('#estimateShip').removeClass('is-loading');
                            $('#estimateShip').attr('disabled', 'disabled');
                            $('#estimateradio').html('');
                            self.$el.find('#shippingzipcode-btn').prop('disabled', false);
                            for (var i = 0; i < resp.rates[0].shippingRates.length; i++) {
                                if (resp.rates[0].shippingRates[i].amount !== undefined) {
                                    amount = true;
                                    break;
                                }
                            }
                            if (!amount) {
                                $('#ziperror').show();
                            }
                            $.each(resp.rates, function(index, val) {
                                var shippingAmount = [];
                                for (var i = 0; i < val.shippingRates.length; i++) {
                                    if (val.shippingRates[i].amount !== undefined) {
                                        shippingAmount.push(val.shippingRates[i]);
                                    } else if (val.shippingRates[i].amount === undefined) {}
                                }
                                var sortedRates = shippingAmount.sort(function(a, b) {
                                    if (a.amount !== undefined || b.amount !== undefined) {
                                        return a.amount - b.amount;
                                    }
                                });
                                var shippingGroundAmount = 0;
                                for(var l=0;l<sortedRates.length;l++){
                                    if(sortedRates[l].code === "ups_UPS_SUREPOST_LESS_THAN_1LB"){
                                        shippingGroundAmount = sortedRates[l].amount;
                                    }
                                }
                                if(shippingGroundAmount > 0){
                                    var str = " SurePost Shipping to <b>"+zip +"</b>(estimate): <b> $"+shippingGroundAmount+"</b>";
                                    $("#estimateShippingCost-success").show();
                                    $("#estimateShippingCost-success").html(str);
                                    $(".estimateShippingCost").removeClass("estimateShippingCost-onshow");
                                    $('#estimateShippingCost-entry').addClass('inactive');
                                    $('#estimateShippingCost-entry').removeClass('active');
                                    $('#estimateShippingCost-failure').hide();
                                    $("#estimateShippingCost-success").focus();
                                }
                               /* sortedRates = _.map(sortedRates, function(method) {
                                    if (method.code.indexOf("SUREPOST") > -1)
                                        method.content.name = "UPS SurePost®";
                                    return method;
                                });
                                $.each(sortedRates, function(i, o) {
                                    var cartModel = self.model.attributes;
                                    if (o.amount !== undefined) {
                                        $('.estimateradio-heading').show().focus();
                                        if (o.amount > 0 && o.code === "ups_UPS_GROUND" && Hypr.getThemeSetting('freeshippingBoundingValue') < cartModel.discountedSubtotal) {
                                            $('#estimateradio').append("<div class='mleft18 '><input type='radio' name='shippingmethod' data-mz-value = 'shippingMethodCode' aria-label= "+ o.code +"  data-mz-price = " + o.amount + " value =" + o.code + "/><span style='margin-left:10px;'>" + o.content.name + " - " + "$" + (0.00).toFixed(2) + "</span></div>");
                                        } else {
                                            $('#estimateradio').append("<div class='mleft18 '><input type='radio' name='shippingmethod' data-mz-value = 'shippingMethodCode' aria-label= "+ o.code +" data-mz-price = " + o.amount + " value =" + o.code + "/><span style='margin-left:10px;'>" + o.content.name + " - " + "$" + o.amount.toFixed(2) + "</span></div>");
                                        }
                                    }
                                });*/
                            });
                            /*$('input[type=radio]').change(function(e) {

                                var price = $(this).data('mz-price');
                                var estimatedPriceWithShipping = 0;
                                var shipMethod = $(this).val();
                                //var cartModel = require.mozuData('cart');
                                var cartModel = self.model.attributes;
                                if (Hypr.getThemeSetting('freeshippingBoundingValue') < cartModel.discountedSubtotal && shipMethod == 'ups_UPS_GROUND/') {
                                    estimatedPriceWithShipping = 0;
                                    estimatedPriceWithShipping = (cartModel.discountedSubtotal).toFixed(2);
                                } else {
                                    estimatedPriceWithShipping = 0;
                                    estimatedPriceWithShipping = (cartModel.discountedSubtotal + price).toFixed(2);

                                }
                                document.getElementById('estimateprice').innerHTML = "";
                                $('.ordertotalWithoutshipping').css('border-bottom', 'none');
                                $('.estimateprice').append("<span class='mleft18 order-total'><span class='estimate-total'>Total With Shipping:</span><span id='mz-carttable-total' class='mz-carttable-total jb-carttotalwithshipping'> $" + estimatedPriceWithShipping + "</span></span>");
                                
                                $('[data-mz-value="shippingMethodCode"]').attr('aria-label','Total With Shipping: $'+estimatedPriceWithShipping);
                            });*/
                            /*if($('input[type=radio]').length > 0)
                                $('input[type=radio]')[0].focus();*/

                                
                                
                   }).catch(function(error) {
                    console.log("error ---",error);
                    $('#shippingzipcode').val("");
                    $("#estimateShippingCost-success").show();
                    $("#estimateShippingCost-success").html(error && error.message);
                    $(".estimateShippingCost").removeClass("estimateShippingCost-onshow");
                    $('#estimateShippingCost-entry').addClass('inactive');
                    $('#estimateShippingCost-entry').removeClass('active');
                    $('#estimateShippingCost-failure').hide();
                    $("#estimateShippingCost-success").focus();

                   });

                    }
                } else {
                    $('#estimateShippingCost-failure').show();
                    $('#estimateShippingCost-failure').html('Entered Zip code is wrong ');
                    $('#estimateShip').removeClass('is-loading');
                    $("#estimateShippingCost-failure").focus();

                    return false;
                }
        },
            checkInventory: function() {
            var error = 0,
            items = this.model.apiModel.data.items,
            productCodes = [],locatioCodes = [items[0].fulfillmentLocationCode];
            _.each(items, function(item) {
                productCodes.push(item.product.productCode);
            });
            Api.request('POST','api/commerce/catalog/storefront/products/locationinventory',{"locationCodes": ["US01"],
            "productCodes": productCodes}).then(function(res){
                for(var i=0;i<items.length;i++){
                    for(var j=0;j<res.items.length;j++){
                        if (items[i].product.productCode === res.items[j].productCode && items[i].quantity > res.items[j].softStockAvailable){
                            $('[data-mz-carttable-item-sku="' + items[i].product.productCode + '"]').next('.error-msg').remove();
                            $('[data-mz-carttable-item-sku="' + items[i].product.productCode + '"]').after("<tr class='mz-carttable-item error-msg'><td colspan=5 class='mz-carttable-item-product' style='margin-top: 20px;'><span role='content-info' tabindex='0' style='font-size: 14px; font-weight: bold;'>ALERT: Sorry, but " + items[i].product.productCode + ":" + items[i].product.name + " no longer has enough inventory to satisfy your order.  There are " + res.items[j].softStockAvailable + " units left in stock. Please adjust your order and try again.</span></td></tr>");
                            if($(window).width()<768){
                                $('[data-mz-carttable-item-sku-mobile="' + items[i].product.productCode + '"]').next('.error-msg').remove();
                                $('[data-mz-carttable-item-sku-mobile="' + items[i].product.productCode + '"]').after("<div class='mz-carttable-item error-msg' role='content-info' tabindex='0'><span colspan=5 class='mz-carttable-item-product' style='margin-top: 20px;'><span style='font-size: 14px; font-weight: bold;'>ALERT: Sorry, but " + items[i].product.productCode + ":" + items[i].product.name + " no longer has enough inventory to satisfy your order.  There are " + res.items[j].softStockAvailable + " units left in stock. Please adjust your order and try again.</span></span></div>");
                            }
                           error++;
                            if(error===1){
                                 $(document).find('.oos-error').text( Hypr.getLabel('ooserror')).attr({tabindex:'0',role:'content-info'});
                            }
                            j=res.length; 
                        }else if(error===0){
                            $(document).find('.oos-error').text('').attr({tabindex:'-1'});
                        }
                    }
                }
            },function(err){
                console.log(err);  
            });
        },
        paypal:function(e){
            e.preventDefault();
            $(document).find('.p-button').trigger('click');
        }
    });
    var WishlistView =  Backbone.MozuView.extend({
        templateName: "modules/cart/cart-wishlist",
        additionalEvents: {
            'click .add-to-cart-wish':'addToCart'
        },
        addToCart:function(e){
            var productCode = $(e.currentTarget).attr('data-mz-prcode'),self = this,//addProduct = true,
            $target = $(e.currentTarget);
         
            var $quantity = $(e.target.parentNode.parentNode).find('.quantity-field-wish').val();
            var count = parseInt($quantity,10);
            var items = window.cartView.model.get('items').models;
            // if(items.length>0){
            //     for(var i=0;i<items.length;i++){
            //         if(items[i].get('product.productCode')===productCode){
            //             addProduct = (items[i].get('quantity')+count>25)?false:true;
            //             i = items.length;
            //         }
            //     }
            // }
           // if(addProduct){
                
            // }else{
            //     $('.mz-l-pagewrapper').removeClass('is-loading');
            // }
            //api.request('GET','/api/commerce/carts/current/items').then(function(cartitem) {
                var flag=false;
                 if(items.length>0){
                     for(var j=0;j<items.length;j++){
                         var cartitemCode=items[j].get('product.productCode');
                         var cartitemQty=items[j].get('quantity'); 
                         var totalQty=count+cartitemQty;
                         if(cartitemCode==productCode && totalQty>25){
                             flag=true;
                             // alert('Maximum quantity that can be purchased is 25');
                         }
                     }
                     if(flag){
                        // alert('Maximum quantity that can be purchased is 25');
                        $('.maximumProduct').show().focus();
                        $('.maximum-inner-content').focus();
                        //$('.maximum-message').focus();
                        loopInMax();
                         return false;
                     }else{
                        $('.mz-l-pagewrapper').addClass('is-loading');
                        self.additemstoCart(productCode,$target,count,e);
                        return false;
                     }
                 }else{
                    $('.mz-l-pagewrapper').addClass('is-loading');
                    self.additemstoCart(productCode,$target,count,e);
                     return false;
                     
                 }
             //});   
        }, 
        additemstoCart:function(productCode,$target,count,e){
            var self=this;
            Api.get('product', productCode).then(function(sdkProduct) {
                var PRODUCT = new ProductModels.Product(sdkProduct.data);
                if(PRODUCT.get('purchasableState').isPurchasable){
                    var variantOpt = sdkProduct.data.options;
                    if(variantOpt !== undefined && variantOpt.length>0){  
                        var newValue = $target.parent().parent().find('[plp-giftcart-prize-change-action]')[0].value;
                        var ID =  $target.parent().parent().find('[plp-giftcart-prize-change-action]')[0].getAttribute('data-mz-product-option');
                        if(newValue != "Select gift amount" && newValue !== ''){
                            var option = PRODUCT.get('options').get(ID);
                            var oldValue = option.get('value');
                            if (oldValue !== newValue && !(oldValue === undefined && newValue === '')) {
                                option.set('value', newValue);
                            }
                            setTimeout(function(){
                                self.addToCartAndUpdateMiniCart(PRODUCT,count,$target);
                            },2000);
                        }else{
                           $('.mz-l-pagewrapper').removeClass('is-loading');
                        }
                    }else{
                        self.addToCartAndUpdateMiniCart(PRODUCT,count,$target);
                    }
                }else{
                    self.outOfStock(e,productCode,PRODUCT);
                }
            });
        },
        addToCartAndUpdateMiniCart:function(PRODUCT,count,$target){
            PRODUCT.set({'quantity':count});
            PRODUCT.addToCart(1); 
            var myMata = PRODUCT,self = this;
            PRODUCT.on('addedtocart', function(attr) {
                $('.mz-l-pagewrapper').removeClass('is-loading');
                CartMonitor.update();
                PRODUCT = '';
                var prodName = attr.data.product.name;
                var listPrice = myMata.get('price').get('price');
                var salePrice = myMata.get('price').get('salePrice');
                var img = attr.data.product.imageUrl+"?max=150";
                var Qty = myMata.get('quantity');
                self.showAddtoCartPopup(prodName,listPrice,salePrice,img,Qty);
                setTimeout(function() {
                    window.cartView.model.apiGet();
                    window.cartView.render();
                }, 500);
                console.log("added via wish list button");
                brontoObj.build(Api);
            });
            Api.on('error', function (badPromise, xhr, requestConf) {
                $('.mz-l-pagewrapper').removeClass('is-loading');
                $(document).find('.Add-to-cart-popup').removeClass("active");
                $(document).find('body').removeClass("noScroll");
                if(badPromise.message && badPromise.message.indexOf('The following items have limited quantity or are out of stock') > -1){
                    $('[data-mz-message-bar]').empty();
                    var emsg = '<ul class="is-showing mz-errors" tabindex="-1" id="mz-errors-list"><li>'+badPromise.message+'</li></ul>';
                    $('[data-mz-message-bar]').append(emsg);
                    $('[data-mz-message-bar]').fadeIn();
                    $('#mz-errors-list').attr({tabindex:0});
                    $('#mz-errors-list').find('li').attr({tabindex:0});
                    $('#mz-errors-list').find('li').focus();
                    var offTop = $(window).width()<768?120:0;
                    $('html, body').stop(true, false).animate({scrollTop:$('[data-mz-message-bar]').offset().top-offTop}, "slow");
                    setTimeout(function(){
                        $('[data-mz-message-bar]').hide();
                    },6000); 
                } 
            });  
            setTimeout(function(){window.cartModel.checkBOGA(); },2000);    
        },
        showAddtoCartPopup:function(name,price,sprice,img,qty){
            var self = this;
            $(document).find('.Add-to-cart-popup').find('.product-image').attr('src',img);
            $(document).find('.Add-to-cart-popup').find('.product-name').html(name);
            if(price > sprice && sprice !== 0){
                $(document).find('.Add-to-cart-popup').find('.saleprice').html('$'+sprice.toFixed(2));
                $(document).find('.Add-to-cart-popup').find('.listprice').addClass('through');
            }else{
                $(document).find('.Add-to-cart-popup').find('.saleprice').html("");  
                $(document).find('.Add-to-cart-popup').find('.listprice').removeClass('through');
            }
            $(document).find('.Add-to-cart-popup').find('.listprice').html('$'+price.toFixed(2));
            $(document).find('.Add-to-cart-popup').find('.qty-count-popup').html(qty);
            $(document).find('.Add-to-cart-popup').addClass("active");
            $(document).find('body').addClass("noScroll");
            var owl = $(document).find('.rec-prod-list-popup');    
            owl.trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
            owl.find('.owl-stage-outer').children().unwrap();
            $(document).find('#rec-prod-list-popup').html('');
            $(document).find('.recommended-product-container').find('.mz-productlisting').each(function(){
                $(document).find('#rec-prod-list-popup').append($(this)[0].outerHTML);
            });
            owl.owlCarousel({  
                loop: true, 
                margin: 14,
                dots: false,
                autoPlay: false,  
                pagination: false,   
                nav: true,     
                navText:false,
                slideBy: 1,
                items: 1,
                center: false,
                stagePadding : 50,
                responsive: {    
                    0: {
                        items: 1
                    },
                    400: {
                        items: 1
                    },
                    600: {
                        items: 3
                    },
                    800: {
                        items: 3  
                    }, 
                    1025: {
                        items: 3
                    },
                    1200:{
                        items: 3
                    },
                    1440: {
                        items: 3
                    }
                } 
            });
            $(document).find('.Add-to-cart-popup').find('.popup-head h3').focus();
            self.loopInAddTocart(); 
        },
        loopInAddTocart:function(){
            var inputs = window.inputs = $(document).find('.Add-to-cart-popup').find('button,[tabindex="0"],a,input');
            var firstInput = window.firstInput = window.inputs.first();
            var lastInput = window.lastInput = window.inputs.last(); 
            
            // if current element is last, get focus to first element on tab press.
            window.lastInput.on('keydown', function (e) {
               if ((e.which === 9 && !e.shiftKey)) {
                   e.preventDefault();
                   window.firstInput.focus(); 
               }
            });
            
            // if current element is first, get focus to last element on tab+shift press.
            window.firstInput.on('keydown', function (e) {
                if ((e.which === 9 && e.shiftKey)) {
                    e.preventDefault();
                    window.lastInput.focus();  
                }
            }); 
        },
        outOfStock:function(e,productCode,PRODUCT){
            var $prevTarget = $(e.target),location = PRODUCT.get('inventoryInfo').onlineLocationCode;
            $('.mz-l-pagewrapper').removeClass('is-loading'); 
            window.notifymePopup(productCode,location); 
        },
        render:function(){
            Backbone.MozuView.prototype.render.apply(this);
        }
    }); 
    function loopInMax(){
        var inputs = window.inputs = $(document).find('.maximumProduct').find('button,[tabindex="0"],a,input');
        var firstInput = window.firstInput = window.inputs.first();
        var lastInput = window.lastInput = window.inputs.last(); 
        
        // if current element is last, get focus to first element on tab press.
        window.lastInput.on('keydown', function (e) {
           if ((e.which === 9 && !e.shiftKey)) {
               e.preventDefault();
               window.firstInput.focus(); 
           }
        });
        
        // if current element is first, get focus to last element on tab+shift press.
        window.firstInput.on('keydown', function (e) {
            if ((e.which === 9 && e.shiftKey)) {
                e.preventDefault();
                window.lastInput.focus();  
            }
        }); 
    } 
    $(document).on('keypress', '.maximumProduct .close-icon', function(e) {
        if(e.keyCode == 13 || e.keyCode == 32) {
            e.preventDefault();
            $('.maximumProduct').hide();
        }
    });
    $(document).on('click', '.maximumProduct .close-icon',function(){
        $('.maximumProduct').hide();
        $(document).find('.add-to-cart-btn-plp').focus();
         //trigger.focus();
     });
    $(document).ready(function () {
        $(document).on('keydown','#keep-shopping-button',function(e) {
           if(e.keyCode == 13) {
			location.href='/online-candy-store';  
			}
		});
        var cartModel = window.cartModel = CartModels.Cart.fromCurrent(),
        cartView = new CartView({
            el: $('#cart'),
            model: cartModel,
            messagesEl: $('[data-mz-message-bar]')
        });
       
       cartView.focusQtyButton = function(className) { 
         $(className).focus(); 
       };
       
        cartModel.on('ordercreated', function (order) {
            cartModel.isLoading(true);
            window.location = "/checkout/" + order.prop('id');
        }); 
        cartModel.on('sync', function() {
            CartMonitor.setCount(cartModel.count());
			if (cartModel.hasItemsWithYearRoundHeatSensitivity() || cartModel.hasItemsCurrentlySeasonallyHeatSensitive()) {
                $('#heat-warning').append('<p tabindex="0" ><span style="color: #bc0000; font-weight: bold;">IMPORTANT:</span>  You have at least one Heat-Sensitive item in your Cart. During warm-weather months (April through October), we strongly recommend Express shipping (UPS Second Day Air or UPS Next Day Air Saver). Whatever shipping method you choose, we’ll add a cold pack (free to you) and will ship the order during a specific time frame to give it the best chance to reach you in good condition.</p><p>Please <a style="color: #0077a2; text-decoration:none" href="/shipping_info">click here</a> for more information or <a style="color: #0077a2; text-decoration:none" href="/contact-us">contact us</a>.</p>').show();
			}
            if(cartModel.hasNoFreeShipping()) {
                $('#no-free-shipping-warning').append('<p tabindex="0" ><span style="color: #bc0000; font-weight: bold;">IMPORTANT:</span>  You have at least one product that does not count toward the Free Shipping threshold.</p>').show();
            }
        });

        cartModel.checkBOGA();

        window.cartView = cartView;
        cartView.render();
        
        //wishlist items
        if(require.mozuData('user').isAuthenticated){
            var wishlistView;
            Api.get('wishlist').then(function(response){
                var QOModel = Backbone.MozuModel.extend({});
                wishlistView = new WishlistView({
                    el: $('.wishlist-section'),
                    model: new QOModel(response.data.items[0])
                });
                window.wishlistView  = wishlistView;
                wishlistView.render();
                wishlistowl();
            },function(err){  
                console.log(err);   
            });
        }         
        function wishlistowl(){
            var owl2  = $(document).find('.wishlist-items');      
            owl2.trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
            owl2.find('.owl-stage-outer').children().unwrap();
            var stagePadding = 0;
            var loop = false,nav=true;
            if($(window).width() <= 767){
              stagePadding = 30; 
              nav=false;
              loop = owl2.children().length>1?true:false;
            }
            owl2.owlCarousel({  
                loop: loop, 
                margin: 14,
                dots: false,
                autoPlay: false,  
                pagination: false,   
                nav: nav,     
                navText:false,
                slideBy: 1,
                items: 1, 
                center: false,
                stagePadding : stagePadding,
                responsive: {    
                  0: {
                    items: 1
                  },
                  400: {
                    items: 1
                  },
                  600: {
                    items: 3
                  },
                  800: {
                    items: 3   
                  }, 
                  1025: {
                    items: 4
                  },
                  1200:{
                    items: 5
                  },
                  1440: {
                    items: 5
                  }
                } 
            });   
             owl2.on('changed.owl.carousel', function (e) {
              if((e.item.count-e.page.size) == e.item.index){
                   $(document).find('.wishlist-items').find('.owl-next').addClass('disabled');  
              }else{
                 $(document).find('.wishlist-items').find('.owl-next').removeClass('disabled');
              }
              if(e.item.index === 0){
                   $(document).find('.wishlist-items').find('.owl-prev').addClass('disabled');      
              }else{
                   $(document).find('.wishlist-items').find('.owl-prev').removeClass('disabled');
              } 
            });  
            if($(document).find('.wishlist-items .owl-item').length <= 5 && $(window).width() > 1024){   
              $(document).find('.wishlist-items').find('.owl-prev').hide(); 
              $(document).find('.wishlist-items').find('.owl-next').hide();  
              $(document).find('.wishlist-items').find('.owl-prev').addClass('disabled');
              $(document).find('.wishlist-items').find('.owl-next').addClass('disabled'); 
            }else if($(document).find('.wishlist-items .owl-item').length <= 3 && $(window).width() > 767){
              $(document).find('.wishlist-items').find('.owl-prev').hide();  
              $(document).find('.wishlist-items').find('.owl-next').hide();  
              $(document).find('.wishlist-items').find('.owl-prev').addClass('disabled');
              $(document).find('.wishlist-items').find('.owl-next').addClass('disabled');   
            }else if($(document).find('.wishlist-items .owl-item').length <= 1){
              $(document).find('.wishlist-items').find('.owl-prev').hide();  
              $(document).find('.wishlist-items').find('.owl-next').hide();  
              $(document).find('.wishlist-items').find('.owl-prev').addClass('disabled');
              $(document).find('.wishlist-items').find('.owl-next').addClass('disabled');      
            } 
        }
        paypal.loadScript();
        // keypress for remove coupon
        $(document).on('keypress', '.remove-coupon, [data-mz-action="removeCoupon"]', function(e) {
            if(e.keyCode == 13) {
                window.cartView.removeCoupon(); 
            }
        });

        if (cartModel.hasItemsWithYearRoundHeatSensitivity() || cartModel.hasItemsCurrentlySeasonallyHeatSensitive()) {
            $('#heat-warning').append('<p tabindex="0" ><span style="color: #bc0000; font-weight: bold;">IMPORTANT:</span>  You have at least one Heat-Sensitive item in your Cart. During warm-weather months (April through October), we strongly recommend Express shipping (UPS Second Day Air or UPS Next Day Air Saver). Whatever shipping method you choose, we’ll add a cold pack (free to you) and will ship the order during a specific time frame to give it the best chance to reach you in good condition.</p><p>Please <a style="color: #0077a2; text-decoration:none" href="/shipping_info">click here</a> for more information or <a style="color: #0077a2; text-decoration:none" href="/contact-us">contact us</a>.</p>').show();   
        }

        if(cartModel.hasNoFreeShipping()) {
            $('#no-free-shipping-warning').append('<p tabindex="0" ><span style="color: #bc0000; font-weight: bold;">IMPORTANT:</span>  You have at least one product that does not count toward the Free Shipping threshold.</p>').show();
        }
        
		/*
		unfinished code for another task
		if($.cookie("coupon_from_email")) {
            cartModel.apiAddCoupon($.cookie("coupon_from_email")).then(function(data) {
                $.cookie("coupon_from_email", null, { path: '/' });
            });
		}
		*/
		
        /**
         * ADD CARAOUSEL in mobile view
         **/
        $(document).on('click', '.jb-add-to-cart,.jb-add-to-cart-cur', function(e) {  
            //e.preventDefault(); 
            var $target = $(e.currentTarget), productCode = $target.data("mz-prcode");
            $('[data-mz-message-bar]').hide();
            // var $quantity = $(e.target.parentNode.parentNode).find('.quantity')[0].options[$(e.target.parentNode.parentNode).find('.quantity')[0].options.selectedIndex];
            var $quantity = $(e.target.parentNode.parentNode).find('.quantity-field-rti').val();
            var count = parseInt($quantity,10);
            Api.request('GET','/api/commerce/carts/current/items').then(function(cartitem) {
                var flag=false;
                 if(cartitem.items.length>0){
                     for(var j=0;j<cartitem.items.length;j++){
                         var cartitemCode=cartitem.items[j].product.productCode;
                         var cartitemQty=cartitem.items[j].quantity; 
                         var totalQty=count+cartitemQty;
                         if(cartitemCode==productCode && totalQty>25){
                             flag=true;
                             // alert('Maximum quantity that can be purchased is 25');
                         }
                     }
                     if(flag){
                        // alert('Maximum quantity that can be purchased is 25');
                        $('.maximumProduct').show().focus();
                        $('.maximum-inner-content').focus();
                        loopInMax();
                         return false;
                     }else{
                        $('.mz-l-pagewrapper').addClass('is-loading');
                        $(document).find('.RTI-overlay').addClass('active');
                        $('[data-mz-productlist],[data-mz-facets]').addClass('is-loading');
                        $('#mybuyspagezone3').addClass('is-loading');  
                        additemstoCart(productCode,$target,count);
                        return false;
                     }
                 }else{
                    $('.mz-l-pagewrapper').addClass('is-loading');
                    $(document).find('.RTI-overlay').addClass('active');
                    $('[data-mz-productlist],[data-mz-facets]').addClass('is-loading');
                    $('#mybuyspagezone3').addClass('is-loading');  
                    additemstoCart(productCode,$target,count);
                     return false;
                     
                 }
             });   
            
          });
          function additemstoCart(productCode,$target,count){
            Api.get('product', productCode).then(function(sdkProduct) {
                var PRODUCT = new ProductModels.Product(sdkProduct.data);
                var variantOpt = sdkProduct.data.options;
                if(variantOpt !== undefined && variantOpt.length>0){  
                    var newValue = $target.parent().parent().find('[plp-giftcart-prize-change-action]')[0].value;
                    var ID =  $target.parent().parent().find('[plp-giftcart-prize-change-action]')[0].getAttribute('data-mz-product-option');
                    if(newValue != "Select gift amount" && newValue !== ''){
                        var option = PRODUCT.get('options').get(ID);
                        var oldValue = option.get('value');
                        if (oldValue !== newValue && !(oldValue === undefined && newValue === '')) {
                            option.set('value', newValue);
                        }
                        setTimeout(function(){
                            addToCartAndUpdateMiniCart(PRODUCT,count,$target);
                        },2000);
                    }else{
                        $('#mybuyspagezone3').removeClass('is-loading');
                    }
                }else{
                    addToCartAndUpdateMiniCart(PRODUCT,count,$target);
                }
            });
          }
          function addToCartAndUpdateMiniCart(PRODUCT,count,$target){
            PRODUCT.set({'quantity':count});
            var myMata = PRODUCT;
            $('#mybuyspagezone3').addClass('is-loading');
            $(document).find('.RTI-overlay').addClass('active');
            PRODUCT.addToCart(1);
            PRODUCT.on('addedtocart', function(attr) {
                $('.mz-l-pagewrapper').removeClass('is-loading');
                $(document).find('.RTI-overlay').removeClass('active');
				CartMonitor.update();
				PRODUCT = '';
				var prodName = attr.data.product.name;
                var listPrice = myMata.get('price').get('price');
                var salePrice = myMata.get('price').get('salePrice');
                var img = attr.data.product.imageUrl+"?max=150";
                var Qty = myMata.get('quantity');
                showAddtoCartPopup(prodName,listPrice,salePrice,img,Qty);
				setTimeout(function() {
                    cartView.model.apiGet();
                    cartView.render();
                    $(document).find('.RTI-overlay').removeClass('active');
				}, 500);
                console.log("added via RTI button");
                brontoObj.build(Api);
            });
            Api.on('error', function (badPromise, xhr, requestConf) { 
                $('#mybuyspagezone3').removeClass('is-loading');
                $(document).find('.RTI-overlay').removeClass('active');
                $('.mz-l-pagewrapper').removeClass('is-loading');
                $(document).find('.RTI-overlay').removeClass('active');
                $(document).find('.Add-to-cart-popup').removeClass("active");
                $(document).find('body').removeClass("noScroll");
                if(badPromise.message && badPromise.message.indexOf('The following items have limited quantity or are out of stock') > -1){
                    $('[data-mz-message-bar]').empty();
                    var emsg = '<ul class="is-showing mz-errors" tabindex="-1" id="mz-errors-list"><li>'+badPromise.message+'</li></ul>';
                    $('[data-mz-message-bar]').append(emsg);
                    $('[data-mz-message-bar]').fadeIn();
                    $('#mz-errors-list').attr({tabindex:0});
                    $('#mz-errors-list').find('li').attr({tabindex:0});
                    $('#mz-errors-list').find('li').focus();
                    var offTop = $(window).width()<768?120:0;
                    $('html, body').stop(true, false).animate({scrollTop:$('[data-mz-message-bar]').offset().top-offTop}, "slow");
                    setTimeout(function(){
                        $('[data-mz-message-bar]').hide();
                    },6000);
                }
            }); 
            setTimeout(function(){cartModel.checkBOGA(); },2000);    
        }
        
        function loopInAddTocart(){
            var inputs = window.inputs = $(document).find('.Add-to-cart-popup').find('button,[tabindex="0"],a,input');
            var firstInput = window.firstInput = window.inputs.first();
            var lastInput = window.lastInput = window.inputs.last(); 
            
            // if current element is last, get focus to first element on tab press.
            window.lastInput.on('keydown', function (e) {
               if ((e.which === 9 && !e.shiftKey)) {
                   e.preventDefault();
                   window.firstInput.focus(); 
               }
            });
            
            // if current element is first, get focus to last element on tab+shift press.
            window.firstInput.on('keydown', function (e) {
                if ((e.which === 9 && e.shiftKey)) {
                    e.preventDefault();
                    window.lastInput.focus();  
                }
            }); 
        }
    
        function showAddtoCartPopup(name,price,sprice,img,qty){
            $(document).find('.Add-to-cart-popup').find('.product-image').attr('src',img);
            $(document).find('.Add-to-cart-popup').find('.product-name').html(name);
            if(price > sprice && sprice !== 0){
                $(document).find('.Add-to-cart-popup').find('.saleprice').html('$'+sprice.toFixed(2));
                $(document).find('.Add-to-cart-popup').find('.listprice').addClass('through');
            }else{
                $(document).find('.Add-to-cart-popup').find('.saleprice').html("");  
                $(document).find('.Add-to-cart-popup').find('.listprice').removeClass('through');
            }
            $(document).find('.Add-to-cart-popup').find('.listprice').html('$'+price.toFixed(2));
            $(document).find('.Add-to-cart-popup').find('.qty-count-popup').html(qty);
            $(document).find('.Add-to-cart-popup').addClass("active");
            $(document).find('body').addClass("noScroll");
            var owl = $(document).find('.rec-prod-list-popup');    
            owl.trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
            owl.find('.owl-stage-outer').children().unwrap();
            $(document).find('#rec-prod-list-popup').html('');
            $(document).find('.recommended-product-container').find('.mz-productlisting').each(function(){
                $(document).find('#rec-prod-list-popup').append($(this)[0].outerHTML);
            });
            owl.owlCarousel({  
                loop: true, 
                margin: 14,
                dots: false,
                autoPlay: false,  
                pagination: false,   
                nav: true,     
                navText:false,
                slideBy: 1,
                items: 1,
                center: false,
                stagePadding : 50,
                responsive: {    
                    0: {
                        items: 1
                    },
                    400: {
                        items: 1
                    },
                    600: {
                        items: 3
                    },
                    800: {
                        items: 3  
                    }, 
                    1025: {
                        items: 3
                    },
                    1200:{
                        items: 3
                    },
                    1440: {
                        items: 3
                    }
                } 
            });
            $(document).find('.Add-to-cart-popup').find('.popup-head h3').focus();
            loopInAddTocart(); 
        } 
 
        function notifymePopup(productCode, locationCode){
            var emailVal = '';
            if(require.mozuData('user').isAuthenticated){
                emailVal = require.mozuData('user').email;
            }
            $.colorbox({  
                open : true, 
                maxWidth : "100%",
                maxHeight : "100%",
                scrolling : false,
                fadeOut : 500,
                html : "<div id='notify-me-dialog' tabindex='0' style='padding: 30px;' role='dialog' aria-labelledby='Noiify me sign up dialog'><form><span>Enter your email address to be notified when this item is back in stock.</span><br><input tabindex='0' style='margin-top: 10px;' id='notify-me-email' type='text' aria-label='Enter email address text field' value='"+emailVal+"'><span tabindex='0' style='background: #39A857;text-decoration: none; color: #ffffff; padding: 3px; margin-left: 5px; cursor: pointer;' role='button' aria-label='notify me' id='notify-me-button' data-mz-location-code = '"+locationCode+"' data-mz-product-code='" +productCode+ "'>Notify Me</span></form></div>", //"/resources/intl/geolocate.html",
                overlayClose : true,
                trapFocus: false, 
                onComplete : function () {
                    $('#cboxClose').show().attr({'role':'button','aria-label':'close dialog'});
                    $('#cboxLoadedContent').css({
                        background : "#ffffff"
                    });
                    $('#notify-me-dialog').focus();
                    notifymedilog(); 
                }
            });  
            notifymeAction(); 
        }

        function notifymedilog(){
            window.notifyinputs = $(document).find('#cboxContent').find('select, input, textarea, button, a').filter(':visible');   
            window.notifyfirstInput = window.notifyinputs.first();
            window.notifylastInput = window.notifyinputs.last(); 
            
             // if current element is last, get focus to first element on tab press.
            window.notifylastInput.on('keydown', function (e) {
               if ((e.which === 9 && !e.shiftKey)) {
                   e.preventDefault();
                   window.notifyfirstInput.focus(); 
               }
            });
            
            // if current element is first, get focus to last element on tab+shift press.
            window.notifyfirstInput.on('keydown', function (e) {
                if ((e.which === 9 && e.shiftKey)) {
                    e.preventDefault();
                    window.notifylastInput.focus();  
                }
            }); 
        }
        window.notifymePopup = notifymePopup;
            // Shipping quotes
        /*      $('#shipping-zip').bind("copy paste", function(e) {
                e.preventDefault();
            });
            
            $('#shipping-zip').keypress(function(event) {
                if (event.keyCode == 13) {
                    $("#estimateShip").click();
                }

                if (event.which !== 13 && (event.which < 48 || event.which > 57) && (event.keyCode !== 9 || (event.keyCode !== 9 && !event.shiftKey))) {
                    if (event.which == 8) {
                        return;
                    }
                    return false;
                } else {
                    return true;
                }
                var regex = new RegExp("^[a-zA-Z0-9]+$");
                var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                if (!regex.test(key)) {
                    event.preventDefault();
                    return false;
                }
                var zip = $('#shipping-zip').val();
                if ((zip.length) > 5) {
                    $('#estimate-zip').attr('disabled', true);
                } else {
                    $('#estimate-zip').attr('disabled', false);
                } 
            });*/
            
        $(document).on('click', '.holiday-shipping-modal', function(e) {
            $.colorbox({
                open: true,
                maxWidth: "75%",
                maxHeight: "110%",
                scrolling: false,
                fadeOut: 500,
                html: "<div style='padding: 20px;'><strong>For arrival on or before Christmas - 12/25/2015</strong><br /><ul><li>UPS SurePost - Place order by 12 PM PT on 12/14/2015</li><br /><li>UPS Ground - Place order by 12 PM PT on 12/15/2015</li><br /><li>UPS Three-Day Select - Place order by 12 PM PT on 12/18/2015</li><br /><li>UPS Second Day Air - Place order by 12 PM PT on 12/21/2015</li><br /><li>UPS Next Day Air Saver - Place order by 12 PM PT on 12/22/2015</li></ul></div>",
                overlayClose: true,
                onComplete: function () {
                    $('#cboxClose').css({ 'background-image': 'url("/resources/images/icons/close-popup.png")' });
                    $('#cboxClose').fadeIn();
                    $('#cboxLoadedContent').css({
                        background: "#ffffff"
                    });
                }
            });
        });
        $(document).on('click','.jb-out-of-stock-cur', function(e) {
            var $prevTarget = $(e.target);
            notifymePopup(e.target.getAttribute('data-mz-product-code'),e.target.getAttribute('data-mz-location-code'));   
        });
         
        function notifymeAction(){ 
            $(document).find('#notify-me-button').on('click', function(e) { 
                if($('#notify-me-email').val().trim()  !== ''){
                    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        patt = new RegExp(re),
                        location = $(e.currentTarget).attr('data-mz-location-code');
                        if(patt.test($('#notify-me-email').val().trim())){
                    Api.create('instockrequest', {  
                        email: $('#notify-me-email').val(),
                        customerId: require.mozuData('user').accountId,
                        productCode: e.target.getAttribute('data-mz-product-code'), 
                        locationCode: location
                    }).then(function (xhr) { 
                        $("#notify-me-dialog").fadeOut(500, function () { 
                            $("#notify-me-dialog").empty().html("<div class='success-msg' tabindex='0'>Thank you! We'll let you know when we have more.</div>"); 
                             $(document).find('#cboxLoadedContent').css({'height':'80px'});
                            $("#notify-me-dialog").fadeIn(500);
                        });
                        setTimeout(function(){ window.wishlistView.notifymedilog(); $("#notify-me-dialog").find('.success-msg').focus(); }, 1200);
                    }, function (xhr) {
                        $('[data-mz-message-bar]').hide();
                        if(xhr.errorCode == "VALIDATION_CONFLICT"){
                            $('[data-mz-message-bar]').hide(); 
                            $('#notify-me-button').next('.errormsgpopup').remove();
                            $('#notify-me-button').after('<div style="color:red;font-size: 12px;" class="errormsgpopup" tabindex="0">Error: Please enter valid email address.</div>'); 
                            $("#notify-me-dialog").find('.errormsgpopup').focus();
                        }else if(xhr.errorCode != "ITEM_ALREADY_EXISTS"){   
                            //$("#notify-me-dialog").fadeOut(500, function () { $('[data-mz-message-bar]').hide(); $("#notify-me-dialog").empty().html(xhr.items[0].message).fadeIn(500); $("#notify-me-dialog").css('color','red');  }); 
                            $('[data-mz-message-bar]').hide();
                            $('#notify-me-button').next('.errormsgpopup').remove();
                            if(xhr.items.length){ 
                                $('#notify-me-button').after('<div style="color:red;font-size: 12px;" class="errormsgpopup" tabindex="0">'+xhr.items[0].message+'</div>');
                                $("#notify-me-dialog").find('.errormsgpopup').focus();
                            }else{
                                $('#notify-me-button').after('<div style="color:red;font-size: 12px;" class="errormsgpopup" tabindex="0">'+xhr.message+'</div>');
                                        $("#notify-me-dialog").find('.errormsgpopup').focus();
                                    }    
                                }else{
                                    $('[data-mz-message-bar]').hide();
                                    $('#notify-me-button').next('.errormsgpopup').remove();
                                    $('#notify-me-button').after('<div style="color:red;font-size: 12px;" class="errormsgpopup" tabindex="0">Error: Email id you have provided already subscribed for back in stock notification.</div>');
                                    $("#notify-me-dialog").find('.errormsgpopup').focus();
                                }
                                $('[data-mz-message-bar]').hide();
                            });
                        }else{
                            $('#notify-me-button').next('.errormsgpopup').remove();
                            $('#notify-me-button').after('<div style="color:red;font-size: 12px;" class="errormsgpopup" tabindex="0">Error: Please enter valid email address.</div>');
                            $("#notify-me-dialog").find('.errormsgpopup').focus();
                        }
                }else{/*Error: */
                    $('#notify-me-button').next('.errormsgpopup').remove();  
                    $('#notify-me-button').after('<div style="color:red;font-size: 12px;" class="errormsgpopup" tabindex="0">Error: Please enter valid email address.</div>');
                    $("#notify-me-dialog").find('.errormsgpopup').focus();
                }   
            });
        }
        window.notifymeAction = notifymeAction;
        $(document).find('#notify-me-email').on('keypress', function (e) { 
            if (e.which === 13) {
                e.preventDefault();
                $('#notify-me-button').trigger('click');
                return false;
            } 
        });
    });
});






