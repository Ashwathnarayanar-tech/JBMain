var pwrRewards = [];
var pwrRedemptionAmount = 0;
var pwrInitialPoints = 0;
var pwrDisplayPoints = 0;
var pwrMaxRedemptions = 2;
var zinreloLoaded = false;

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

require(["modules/jquery-mozu", "underscore", "hyprlive","modules/api",
"modules/backbone-mozu", "modules/models-checkout", "modules/views-messages",
"modules/cart-monitor", 'hyprlivecontext', 'modules/editable-view',
'modules/preserve-element-through-render','modules/xpressPaypal', 'vendor/jquery.mask'],
function ($, _, Hypr,api, Backbone, CheckoutModels, messageViewFactory, 
CartMonitor, HyprLiveContext, EditableView, preserveElements,PayPal) {
    var isAddresTypeChanged = false;
    
    var CheckoutStepView = EditableView.extend({
        edit: function () {
            this.model.edit();
            $("#coupon-code-field").hide();
            this.paymentUI();
        },
        paymentUI: function(){
            console.log(this.el.id);
            if(this.el.id == 'step-shipping-address' || this.el.id == 'step-shipping-method'){
                $('#step-payment-info').removeClass('is-incomplete');
                $('#step-payment-info').removeClass('is-complete');
                $('#step-payment-info').find('.mz-formstep-body').css('display','none');
            }
        },
        next: function () {
            // wait for blur validation to complete
            var me = this;
            me.editing.savedCard = false;
           //  window.showGlobalOverlay();
            _.defer(function () {
                me.model.next();
            });
        },
        choose: function () {
            var me = this;
            me.model.choose.apply(me.model, arguments);
        },
        constructor: function () {
            var me = this;
            EditableView.apply(this, arguments);
            me.resize();
            setTimeout(function () {
                me.$('.mz-panel-wrap').css({ 'overflow-y': 'hidden'});
            }, 250); 
            me.listenTo(me.model,'stepstatuschange', me.render, me); 
            me.$el.on('keypress', 'input', function (e) {
                if (e.which === 13) {
                    me.handleEnterKey(e);
                    return false;
                }
            });
        },
        initStepView: function() {
            this.model.initStep();
        },
        handleEnterKey: function (e) {
            this.model.next();
        },
        render: function () {
            var self = this; 
            var shippingMethodStatus = window.checkoutViews.steps.shippingInfo.model._stepStatus;
            var shippingAddressStatus = window.checkoutViews.steps.shippingAddress.model._stepStatus;
            if(this.$el && this.$el.hasClass('mz-checkoutform-paymentinfo')){   
                if(shippingMethodStatus == "complete" && shippingAddressStatus == "complete"){
                    this.$el.removeClass('is-new is-incomplete is-complete is-invalid').addClass('is-' + this.model.stepStatus());
                }else{
                    this.$el.removeClass('is-new is-incomplete is-complete is-invalid').addClass('is-new');   
                }
            }else{
                this.$el.removeClass('is-new is-incomplete is-complete is-invalid').addClass('is-' + this.model.stepStatus());     
            }
            //Hide validation message section
            window.checkoutViews.messageView.el.style.display = "none";
            
            //this.updateFreeShippingDisplays();
            
            _.defer(_.bind(this.updateFreeShippingDisplays, this));

            var me = this.model;
            
            $("#order-comments").on('change keyup paste', function() {
                var charCount = $("#order-comments").val().length;
                if (charCount > 0) {
                    $("#comments-display").fadeIn("slow");
                }
                else { 
                    $("#comments-display").fadeOut("slow");
                }
                if( !me.parent.commentsReformatted && charCount<1){
                    if($.cookie('giftmessage') && $.cookie('giftmessage').length>9){
                        $("#order-comments").val($.cookie('giftmessage'));
                    }
                }
                var userLines = $("#order-comments").val().split("\n");
                var comment = ["", "", "", "", "", "", "", "", "", ""];
                var index = 0;
                var newLine = 0;
                
                for (var i = 0; i < userLines.length && i < 10; i++){
                    if (userLines[i].length < 30) {
                        comment[index] += userLines[i];
                        index++;
                    }
                    else if (userLines[i].length >= 30){
                        var words = userLines[i].split(" ");
                        for(var w = 0; w < words.length; w++) {
                            if ((comment[index].length + " ".length + words[w].length) < 30 ) {
                                comment[index] += (comment[index].length > 0 ? " " : "") + words[w];
                            } 
                            else {
                                // begin next line
                                index++;
                                newLine = 1;
                                comment[index] += words[w];
                            }
                        }
                    }
                    if(newLine) { index++; newLine = 0; }
                } 
                
                if (charCount >= 275) {
                    $("#comments-character-count").css({ color: "#000000", "font-weight": "bold" });
                    $("#comments-line-count").css({ color: "#000000", "font-weight": "bold" });
                }
                else {
                    $("#comments-character-count").css({ color: "#000000",  "font-weight": "normal" });
                }
                
                $("#comments-character-count").html("Length: " + $("#order-comments").val().length + " characters. (300 characters or 10 lines limit)");
                
                for(i = 0; i < 10; i++){
                    $("#line" + i).css({ background: "#cccccc"}).html(comment[i]);
                }
                 
                me.parent.commentsReformatted = comment.slice(0, 10).join("\n");
                $.cookie('giftmessage',me.parent.commentsReformatted);
                // me.parent.set('shopperNotes.giftMessage', comment.join("\n")); 
                // 
                //catch (e) {  }
            });
        
            $("#order-comments").trigger("change"); 
            
            //Guest email 
            if(window.checkoutEmail && require.mozuData('user').isAnonymous){
                if(window.paymentinfo.model.get('billingContact')){
                   if(window.paymentinfo.model.get('billingContact')._previousAttributes && window.paymentinfo.model.get('billingContact')._previousAttributes.email){
                        var prevEmail = window.paymentinfo.model.get('billingContact')._previousAttributes.email;
                        $('#billing-email').val(prevEmail);
                        window.paymentinfo.model.get('billingContact').set('email',prevEmail);
                   }else if($.cookie('guest')){
                        $('#billing-email').val($.cookie('guest'));
                        window.paymentinfo.model.get('billingContact').set('email',$.cookie('guest'));
                   }
                }
                /*if($('#billing-email').val().length === 0 && window.paymentinfo.model.get('billingContact')){
                    var prevEmail = window.paymentinfo.model.get('billingContact')._previousAttributes.email;
                    $('#billing-email').val(prevEmail);
                    window.paymentinfo.model.get('billingContact').set('email',prevEmail);
                }else if($.cookie('guest')){
                    $('#billing-email').val($.cookie('guest'));
                    window.paymentinfo.model.get('billingContact').set('email',$.cookie('guest'));
                }*/
            }
             
          /*  var address = this.model.get('address');
             var zip= $.cookie('zip');
            if(!address){
                $('[name="postal-code"]').val(zip);
            }else if($.cookie('isExistingAddress') === "false"){
                $('[name="postal-code"]').val(zip);
            }*/
            
       
            window.checkoutViews.steps.shippingInfo.ShippingValue();
            
            //Remove coupon functionality
           if( $.cookie('coupon') && window.couponCode.model.get('couponCodes') && window.couponCode.model.get('couponCodes').length>1){
                    window.couponCode.removeAllCouponCheckout();
            }else if($.cookie('coupon')==="" && window.couponCode.model.get('couponCodes') && window.couponCode.model.get('couponCodes').length>0){
                window.couponCode.removeCouponCheckout();
            }
            
            
            if(window.flag ){
                $('.mz-checkoutform-shippingmethod').removeClass('is-complete');
                $('.mz-checkoutform-shippingmethod').addClass('is-incomplete');
                $('.mz-checkoutform-paymentinfo').removeClass('is-incomplete');
                $('.mz-checkoutform-paymentinfo').addClass('is-new');
            } 
            
            if(window.flag && (window.location.href).split('?')[1] == 'cl=ml'){
                $('.mz-checkoutform-shippingmethod').removeClass('is-complete');
                $('.mz-checkoutform-shippingmethod').addClass('is-incomplete');
            }
            else if(window.flag && (window.location.href).split('?')[1] == 'cl=returningUser'){
                $('.mz-checkoutform-shippingmethod').removeClass('is-incomplete');
                $('.mz-checkoutform-shippingmethod').addClass('is-complete');
                $('html, body').animate({
                     scrollTop: $("#step-payment-info").offset().top
                 }, 500);
            }
            /*if(window.paymentTypeFlag) {
                $('.inpit-select').focus();
                window.paymentTypeFlag = false;
            }*/
            //$(document.activeElement)
            if(window.shipAddressFlagFirst){
                setTimeout(function(){
                    $(document).find('[data-mz-value="contactId"]').filter(':checked').focus();
                },900);
               window.shipAddressFlagFirst = false;
            }
            if(window.shipAddressFlag) {
                setTimeout(function(){
                    $(document).find('[data-mz-value="contactId"]').filter(':checked').focus();
                },300);
                window.shipAddressFlag = false;
            }
            
            if(window.byPassFlag) {
                setTimeout(function() {
                    $(document).find('.mz-checkoutform-shippingaddress').focus();
                }, 700);
                window.byPassFlag = false;
            }
            
            if(window.editAction) {
                if(window.selectedEdit == "shippingmethod-edit") {
                    setTimeout(function(){
                        $('#step-shipping-method').find('.address-info').focus();
                        window.selectedEdit = "";
                        window.editAction = false;
                    },700);
                }
                else if(window.selectedEdit == "shippingaddress-edit") {
                    setTimeout(function(){
                        $('#step-shipping-address').find('.address-info').focus(); 
                        window.selectedEdit = "";
                        window.editAction = false;
                    },700);         
                }
                else if(window.selectedEdit == "paymentinfo-edit") {
                    setTimeout(function(){
                        $("#step-payment-info").find(".mz-checkout-digitalcredit-enter-code").focus();
                        window.selectedEdit = "";
                        window.editAction = false;
                    },700);
                }
            }
            
            if(shippingMethodStatus == "complete"){
                $('#coupon-code-field').find('#coupon-code').focus();
                $('html, body').animate({
                    scrollTop: $('#step-shipping-method').offset().top - 50 //#DIV_ID is an example. Use the id of your destination on the page
                }, 'fast'); 
            }
            
            EditableView.prototype.render.apply(this, arguments);
            if($('.error-msg').html() !== ''){
                if(self.model){
                     $('.digitalcrediterror-msg').hide();
                      $('.digitalcrediterror-msg').css('display','none');   
                    self.model.set('digitalCreditCode','');
                    self.model.set('errormessage','');
                    window.couponCode.model.set('errormessagecoupon','');
                } 
                setTimeout(function(){   
                    $('.error-msg').html(''); 
                    
                                        $('#coupon-code').focus();
                    //$('.digitalcrediterror-msg').html('');
                },10000); 
            }
            
            if($('.digitalcrediterror-msg').html() !== ''){   
                setTimeout(function(){    
                    //$('.error-msg').html('');   
                    $('.digitalcrediterror-msg').html('');
                    if(self.model){
                         $('.error-msg').html('');   
                        self.model.set('errormessage','');  
                        self.model.set('errorsetdigitlcredit',''); 
                         $('.digitalcrediterror-msg').hide();
                          $('.digitalcrediterror-msg').css('display','none'); 
                    }  
                },10000); 
            }
            
            this.resize();
            /*if(window.nextFocusFlag) {
                $('#step-payment-info').find('#btn_validatepaypal').focus();
                window.nextFocusFlag = false;
            }*/
		},
        updateFreeShippingDisplays: function() {
            var nfsSkus = Hypr.getThemeSetting("noFreeShippingSkuList");
						// alert(nfsSkus);
            var order = this.model.getOrder();
						console.log("items");
						console.log(order);
						var freeOrDiscounted = "FREE";
						_.each(order.get('items'), function(i){ 
							if (nfsSkus.indexOf(i.product.productCode) > -1)
								freeOrDiscounted = "DISCOUNTED";
						});
            
            // var addressType = order.apiModel.data.fulfillmentInfo.fulfillmentContact.address.addressType;
            var subtotal = order.apiModel.data.discountedSubtotal; // checkoutModel.apiModel.data.subtotal;
						subtotal = subtotal - this.typeBsubtotal();
						console.log(this.typeBsubtotal());
						console.log("adjusted subtotal: " + subtotal);
            //var stateOrProvince = order.apiModel.data.fulfillmentInfo.fulfillmentContact !== null ? order.apiModel.data.fulfillmentInfo.fulfillmentContact.address.stateOrProvince : "ZZ";
            var fulfillmentInfo = order.apiModel.data.fulfillmentInfo;
            var stateOrProvince = fulfillmentInfo && fulfillmentInfo.fulfillmentContact && fulfillmentInfo.fulfillmentContact.address && fulfillmentInfo.fulfillmentContact.address.stateOrProvince || "ZZ";
            if(stateOrProvince !== 'AK' && stateOrProvince !== 'HI' && stateOrProvince !== 'AA' && stateOrProvince !== 'AP' && stateOrProvince !== 'AE' ){
								var p;
                // SHOW SUREPOST METHODS AS FREE
                if ((subtotal >= Hypr.getThemeSetting('freeshippingBoundingValue') && subtotal < Hypr.getThemeSetting('shippingSwitchoverValue')) || (subtotal >= Hypr.getThemeSetting('freeshippingBoundingValue') && $.cookie('isPoBoxSelected') == "true") || (subtotal >= Hypr.getThemeSetting('freeshippingBoundingValue') && _.contains(["AK","HI","AA","AE","AP"], stateOrProvince))) {
									p = $("span[id*='shippingmethod_detail_ups_UPS_SUREPOST']").first().attr('data-mz-price');
									//alert(p);
									$("span[id*='shippingmethod_detail_ups_UPS_SUREPOST']").first().html(freeOrDiscounted === 'FREE' ? "" : "$" + p + " - Choose and click CONTINUE below for discounted rate");
									$("span[id*='shippingmethod_summary_ups_UPS_SUREPOST']").first().html(freeOrDiscounted === 'FREE' ? "FREE" : "$" + order.apiModel.data.shippingTotal);
									$("span[id*='free_or_discounted_ups_UPS_SUREPOST']").first().html(freeOrDiscounted === 'FREE' ? 'FREE' : "");
									
                    }
								// SHOW UPS GROUND AS FREE
                else if (subtotal >= Hypr.getThemeSetting('shippingSwitchoverValue')) {
									p = $("span[id*='shippingmethod_detail_ups_UPS_GROUND']").first().attr('data-mz-price');
									$("span[id*='shippingmethod_detail_ups_UPS_GROUND']").first().html(freeOrDiscounted === 'FREE' ? "" : "$" + p + " - Choose and click CONTINUE below for discounted rate");
									$("span[id*='shippingmethod_summary_ups_UPS_GROUND']").first().html(freeOrDiscounted === 'FREE' ? "FREE" : "$" + order.apiModel.data.shippingTotal);
									$("span[id*='free_or_discounted_ups_UPS_GROUND']").first().html(freeOrDiscounted === 'FREE' ? 'FREE' : "");
                    }
            }else{
                $(document).find('#hide-from-heat-sensitive').css({ display: "none" });
                var checked = true;
                $.each($('[data-mz-shipping-method]'),function(i,v){
                    checked = checked && $(v).prop('checked');
                });
                if((order.get('fulfillmentInfo.shippingMethodCode') === "ups_UPS_SUREPOST_1LB_OR_GREATER") || (order.get('fulfillmentInfo.shippingMethodCode') === "ups_UPS_GROUND") || !checked){
                    $(document).find('.shippingAKHI').show();
                }
            }
             /*   if(Hypr.getThemeSetting('showHeatSensitiveText')) {
                    var items = order.apiModel.data.items;
                    for (var i = 0; i < items.length; i++){
                        var properties = items[i].product.properties;
                        for (var y = 0; y < properties.length; y++)
                        {
                            if (properties[y].attributeFQN === 'tenant~IsHeatSensitive')
                            { 
                                if(properties[y].values[0].value) {
                                    $('#heat-warning').css({ display: "block" });
                                    $('#hide-from-heat-sensitive').css({ display: "none" });
                                    }
                            }
                        }
                    }
                }*/
        },
				typeBsubtotal: function(){
            var items = this.model.getOrder().get('items');
						var sum = 0.0;
						_.each(items, function(item){
							var isTypeB = _.find(item.product.categories, function(category){
									//alert(category.id);
									return category.id == Hypr.getThemeSetting('noFreeShippingId');
							});
							//alert(isTypeB);
							if (typeof(isTypeB) != "undefined")
								sum = sum + item.subtotal;
						});
						console.log("type b items: " + (sum));
						return sum;
        },
        resize: _.debounce(function () {
            this.$('.mz-panel-wrap').animate({'height': this.$('.mz-inner-panel').outerHeight() });
        },200)
    });

    var OrderSummaryView = Backbone.MozuView.extend({
        templateName: 'modules/checkout/checkout-order-summary',
				setRewardAmount: function(amount){
									this.model.set("pwrAmount", amount);
									this.render();
								},
        initialize: function () {
            this.listenTo(this.model.get('billingInfo'), 'orderPayment', this.onOrderCreditChanged, this);
						this.model.set("pwrAmount", 0);
        },
        additionalEvents: {
            "click .remove-coupon": "removeCoupon",
            "keypress .remove-coupon": "removeCouponOnKeypress"
        },   
        removeCoupon:function(e){
            var self = this;
            window.couponCode.removeCouponCheckout($(e.currentTarget).attr('coupon'));
            /*api.action('order','remove-coupon',{id:require.mozuData("checkout").id,couponCode:$(e.currentTarget).attr('coupon')}).then(function(){
                self.model.refresh();  
            });*/
        },
        removeCouponOnKeypress: function(e) {
            var self = this;
            if(e.keyCode == 13 || e.keyCode == 32) {
                window.couponCode.removeCouponCheckout($(e.currentTarget).attr('coupon'));
                e.preventDefault();
            }
        },
        editCart: function () {
            window.location = "/cart";
        },
        
        onOrderCreditChanged: function (order, scope) {
            this.render();
        },
        
        // override loading button changing at inappropriate times
        handleLoadingChange: function () { }
    });

    var ShippingAddressView = CheckoutStepView.extend({
        templateName: 'modules/checkout/step-shipping-address',
        autoUpdate: [
            'firstName',
            'lastNameOrSurname',
            'companyOrOrganization',
            'address.address1',
            'address.address2',
            'address.address3',
            'address.cityOrTown',
            //'address.countryCode',
            'address.stateOrProvince',
            'address.postalOrZipCode',
            'address.addressType',
            'phoneNumbers.home',
            'contactId',
            'email',
            'updateMode'
        ], 
        renderOnChange: [
           // 'address.countryCode',
            'contactId'
        ],
        additionalEvents: { 
            "keydown input[name='shippingphone']": "phoneNumberFormating",
            "keyup input[name='shippingphone']": "phoneNumberFormating2",
            "change [data-mz-value='address.addressType']": "addressTypeChanged",
            "click [data-mz-value='contactId']": "addressSelection",
            "click #continuetoshipping" : "resetbypassbtn",
            "keydown input[name='postal-code']": "zipcodeFormating"
        },
        initialize: function(){
            this.model.set('address.countryCode',"US");  
        },
        getRenderContext: function () {
            var c = Backbone.MozuView.prototype.getRenderContext.apply(this, arguments);
            $(c.model.contacts).each(function(key , val){
                $(c.model.contacts[key].types).each(function(k,v){
                    if(v.name === "Shipping" && v.isPrimary){
                        c.model.contacts[key].isDefaultShipping = true;
                    }
                });
            });
            if($.cookie('isPoBoxSelected') == "true")c.model.address.addressType = "POBox";
            return c;
        },
        beginAddContact: function () {
            this.model.set('contactId', 'new');
        },
        addressSelection: function(e){
            if(e.target.value != "new"){
                $.cookie('isPoBoxSelected',false);
                $.cookie('isExistingAddress',true);
            }else{
                $.cookie('isExistingAddress',false);
            }
        },
        addressTypeChanged: function(e){
            if(e.target.value === "POBox"){
                $.cookie('isPoBoxSelected',true);
            }else{
                $.cookie('isPoBoxSelected',false);
            }
        },
        phoneNumberFormating2: function(e){
            var keyChar  = $('input[name="shippingphone"]').val()[$('input[name="shippingphone"]').val().length-1];
            var value = $('input[name="shippingphone"]').val();
            if(keyChar === "!" || keyChar === "@" || keyChar === "#" || keyChar === "$" || keyChar === "%" || keyChar === "^" || keyChar === "&"  || keyChar === "*" || keyChar === "(" || keyChar === ")" || keyChar === "_" || keyChar === "+" || keyChar === "~"){
                $('input[name="shippingphone"]').val(value.substr(0,value.length-1));
            }
        },
        phoneNumberFormating : function(e){
            if(e.shiftKey && e.keyCode == 9) {
                
            }
            else if(e.shiftKey){
                e.stopPropagation();
                e.preventDefault();
            }
            if((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 9){     
                var keyChar = String.fromCharCode( e.keyCode);
                var length = $('input[name="shippingphone"]').val().length;
                switch(length){
                    case(0): 
                        $('input[name="shippingphone"]').val('('+$('input[name="shippingphone"]').val());
                        break;
                    case(4): 
                        $('input[name="shippingphone"]').val($('input[name="shippingphone"]').val()+') ');
                        break;
                    case(9): 
                        $('input[name="shippingphone"]').val($('input[name="shippingphone"]').val()+'-');
                        break;
                }
            }else if((e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode===46){
                return true;
            }
            else{
                if(e.keyCode != 8){
                    e.stopPropagation();
                    e.preventDefault();
                }
            }
        },
        zipcodeFormating:function(e){
            if((e.which > 47 && e.which < 58 && !e.shiftKey) || (e.which > 95 && e.which < 106 && !e.shiftKey) || (e.which == 189 && !e.shiftKey) || e.which == 46 || e.which == 8 || e.which == 9 || (e.which>36 && e.which <41)){    
                return true;    
            }else{
                return false;
            }
        },
        confirmValidationBypass: function(){
            this.model.bypass(); 
        },
        resetbypassbtn: function(){
            this.model.resetbypass();
            setTimeout(function(){
                var $errEl = $('#step-shipping-address').find('.mz-validationmessage').filter(':visible');
                if($errEl.length > 0) {
                    $errEl.prev().attr('aria-invalid',true);
                    $errEl.first().prev().focus();
                }
            }, 700);
        }    
    });

    var ShippingInfoView = CheckoutStepView.extend({
        templateName: 'modules/checkout/step-shipping-method', 
        getRenderContext: function () {
                var c = Backbone.MozuView.prototype.getRenderContext.apply(this, arguments);
                var getcurrentState = window.checkoutViews.steps.shippingAddress.model.attributes.address.attributes.stateOrProvince;
            var getShippingstates = Hypr.getThemeSetting('usStates');
            var validateState = getShippingstates.filter(function(item){return item.abbreviation == getcurrentState;});
                if(validateState.length === 0) {
                    c.model.availableShippingMethods = [];
                }
                if(c.model.availableShippingMethods){
                    c.model.availableShippingMethods = _.map(c.model.availableShippingMethods, function(method) { 
                        if(method.shippingMethodCode.indexOf("SUREPOST") > -1)
                            method.shippingMethodName = "UPS SurePost®";
                        return method;
                        });
                    c.model.availableShippingMethods = c.model.availableShippingMethods.map(function(method){
                       method.price = parseFloat(method.price).toFixed(2);
                       return method;
                    });    
                    c.model.availableShippingMethods = c.model.availableShippingMethods.sort(function(obj1,obj2){ return parseFloat(obj1.price) > parseFloat(obj2.price) ? 1 : -1; });
                }
                if($.cookie('isPoBoxSelected') === "true"){
                    $(c.model.availableShippingMethods).each(function(key,val){
                        if(val.shippingMethodCode.indexOf("SUREPOST")<0){
                            key = c.model.availableShippingMethods.indexOf(val);
                            c.model.availableShippingMethods.splice(key, 1);
                        }
                    });
            } 
             //Heat sensitive
            if (window.order.hasHeatSensitiveItemsByCategory()  && Hypr.getThemeSetting('showHeatSensitiveText')) {
                c.model.showHeatMessage = true;
            }
                return c;
        },
        renderOnChange: [
            'availableShippingMethods'
        ],
        additionalEvents: {
            "change [data-mz-shipping-method]": "updateShippingMethod",
            "change [data-mz-delivery-date]": "ShippingValue",
			"click input[value='ups_UPS_GROUND']" : "showHeatSensitiveModal",
			"click input[value='ups_UPS_SUREPOST_LESS_THAN_1LB']" : "showHeatSensitiveModal",
			"click input[value='ups_UPS_SUREPOST_1LB_OR_GREATER']" : "showHeatSensitiveModal",
			"click input[value='ups_UPS_THREE_DAY_SELECT']" : "showHeatSensitiveModal"
        }, 
		showHeatSensitiveModal: function(e) {
			//his.model.updateShippingMethod(e);
			var maxWidth = "40%", maxHeight = "60%";
			if(require.mozuData('pagecontext').isMobile) {
				maxWidth="80%";
				maxHeight="80%";
			}
			var method = e.target.getAttribute('value') || "unknown";
			
			var self = this;
			var modalText = "<div style='width: 95%; text-align: center; padding: 10px;'><h1 id='heat-sensitive-confirmation' tabindex='0' style='font-size: 16px; margin: 2px;'>Heat Sensitive items alert</h1><p>The Heat-Sensitive item(s) on your order may melt if you don’t choose UPS Second Day Air or UPS Next Day Air Saver. Are you willing to take responsibility for that possibility?</p>";
			
			modalText += "<button id='hs-yes' class='mz-button' style='background: #177d23; cursor: pointer; width: 250px; margin: 10px; display: inline-block; color: #ffffff;'>YES, I’ll take my chances</button><br>";
			modalText += "<button id='hs-no' tabindex=0 class='mz-button' style='background: #007aaf; cursor: pointer; width: 250px; margin: 10px; display: inline-block; color: #ffffff;'>No, I want expedited shipping</button>";
			modalText += "<p><b>Note:</b> Orders with Heat-Sensitive items may not ship immediately. </p>";
			modalText += "</div>"; 

			// keep tab users in loop until a choice is made
			$(document).on('keypress keydown','#heat-sensitive-confirmation, #hs-no',function(e){
				if($(this).attr('id') === 'heat-sensitive-confirmation' && e.shiftKey && e.which == 9) {
					e.preventDefault();
					$('#hs-no').focus();
				}
				else if($(this).attr('id') === 'hs-no' && e.which == 9 && !e.shiftKey) {
					e.preventDefault();
					$('#heat-sensitive-confirmation').focus();
				}
			});
			
			if (Hypr.getThemeSetting('showHeatSensitiveText') && window.order.hasHeatSensitiveItemsByCategory()) {
				$.colorbox({
                    open : true,
                    maxWidth : maxWidth,
                    maxHeight : maxHeight,
                    scrolling : false,
                    fadeOut : 500,
                    html : modalText,
                    overlayClose : false,
                    trapFocus: false,
										onLoad: function (){
											$('#colorbox').attr("aria-modal",true).attr("aria-labelledby","heat-sensitive-confirmation");
										},
                    onComplete : function () {
                        $('#cboxLoadedContent').css({
                            background : "#ffffff"
                        });
												$('#heat-sensitive-confirmation').focus();
						$('#hs-yes').click(function(e){ 
							var timenow = new Date();
							var approvalid = JSON.parse(document.getElementById('data-mz-preload-checkout').innerHTML).orderNumber+"-"+timenow.getTime();
							api.create('entity', 
								{	"listName" : "record-ground-approval@jbelly",
									"approvalid": approvalid,
									"information" : "User placing order " + approvalid + " chose YES for " + method + " with heat-sensitive item(s) on " + timenow
								});
							// $(".mz-shipmethod").trigger('click'); 
							$.colorbox.close(); 
						});
						$('#hs-no').click(function(e){ 
							$('input[value="'+method+'"]').removeAttr('checked');
							self.model.resetShippingMethod();
							$(".mz_date_value2").hide();
							$.colorbox.close(); 
						});
					},
					onClosed: function() {
						$('input[value="'+window.lastShippingMethod.value+'"]').focus();
					}
				});
			}
		},
        updateShippingMethod: function (e) {
            //$('#step-payment-info').find('.mz-formstep-header').find('.mz-formstep-edit').click();   
            this.model.updateShippingMethod(this.$('[data-mz-shipping-method]:checked').val()); 
            $('.mz-formstep-next').find('.mz_date_value2').focus();
            setTimeout(function(){$('.mz-formstep-next').find('.mz_date_value2').focus();},1000);  
        },
        ShippingValue: function(){
			var testDate = new Date();
			var deadline = new Date(testDate.getTime());
			deadline.setHours(12);
			deadline.setMinutes(0);
			deadline.setSeconds(0);
			deadline.setMilliseconds(0);
			var heatsensitive = window.order.hasHeatSensitiveItemsByCategory() || false; // document.getElementById('heatsensitive').value;
			var state;		
			// error handling in case there is not a state available yet on the order
			try {
				var order = this.model.getOrder();
				var fulfillmentInfo = order.apiModel.data.fulfillmentInfo;
				state = fulfillmentInfo.fulfillmentContact.address.stateOrProvince;
			} catch(e) { 
				state = "ZZ";
			}
			//console.log(state);

			if(this.$('[data-mz-shipping-method]:checked').val() !== undefined) {
				var mdef = getMethod(this.$('[data-mz-shipping-method]:checked').val());			
				var shipDate = getNextShipDate(testDate, deadline, heatsensitive, mdef.method);
				var a1 = getArrival2(shipDate, 0, mdef.arrivalBegin);
				var a2 = getArrival2(shipDate, 0, mdef.arrivalEnd);
				// console.log(shipDate.toString(), a1.toString(), a2.toString());
                if(state == 'AK' || state == 'HI' || state == 'AA'|| state == 'AP' || state == 'AE'){
                    if (mdef.method === "ups_UPS_NEXT_DAY_AIR" || mdef.method === "ups_UPS_SECOND_DAY_AIR" || mdef.method === "ups_UPS_NEXT_DAY_AIR_SAVER" || mdef.method === "ups_UPS_THREE_DAY_SELECT") {
							$('.mz_date_value2').html('<dl><dt style="font-weight: bold">Ship Date: </dt><dd>' + shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + '</dd><dt>Expected Arrival Date: </dt><dd>'+a1.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })+'</dd></dl>');
							$('.mz_date_value2').show(); 
							$(document).find('.shippingAKHI').hide();
                    }else{
							$('.mz_date_value2').html('<dl><dd style="font-weight: bold">Up to 6 Weeks</dd></dl>'); 
							$('.mz_date_value2').show();
							$(document).find('.shippingAKHI').show();
                    }
				}else if (mdef.method === "ups_UPS_GROUND") {
					$('.mz_date_value2').html('<dl><dt style="font-weight: bold">Ship Date: </dt><dd>' + shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })  + '</dd><dt>Standard Ground: </dt><dd>4 to 7 business days from ship date</dd></dl>');
					$('.mz_date_value2').show();
                }else if (mdef.method === "ups_UPS_SUREPOST_LESS_THAN_1LB") {
									$('.mz_date_value2').html('<dl><dt style="font-weight: bold">Ship Date: </dt><dd>' + shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + '</dd><dt>Arrival: </dt><dd>6 to 9 business days from ship date</dd></dl>');
									$('.mz_date_value2').show();
                }else if (mdef.method === "ups_UPS_SUREPOST_1LB_OR_GREATER") {
									$('.mz_date_value2').html('<dl><dt style="font-weight: bold">Ship Date: </dt><dd>' + shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + '</dd><dt>Arrival: </dt><dd>6 to 9 business days from ship date</dd></dl>');
									$('.mz_date_value2').show();
                }else if (mdef.method === "ups_UPS_THREE_DAY_SELECT") {
									$('.mz_date_value2').html('<dl><dt style="font-weight: bold">Ship Date: </dt><dd>' + shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + '</dd><dt>Expected Arrival Date: </dt><dd>'+a1.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })+'</dd></dl>');
									$('.mz_date_value2').show();
                }else if (mdef.method === "ups_UPS_SECOND_DAY_AIR") {
									$('.mz_date_value2').html('<dl><dt style="font-weight: bold">Ship Date: </dt><dd>' + shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + '</dd><dt>Expected Arrival Date: </dt><dd>'+a1.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })+'</dd></dl>');
									$('.mz_date_value2').show();
                }else if (mdef.method === "ups_UPS_NEXT_DAY_AIR_SAVER") {
									$('.mz_date_value2').html('<dl><dt style="font-weight: bold">Ship Date: </dt><dd>' + shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + '</dd><dt>Expected Arrival Date: </dt><dd>'+a1.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })+'</dd></dl>');
									$('.mz_date_value2').show();
                }
			}
			if (this.hasItemsWithYearRoundHeatSensitivity() || this.hasItemsCurrentlySeasonallyHeatSensitive()) {
				$('#new-heat-sensitive-statement').html("<p><strong>Your order has one or more Heat-Sensitive Items. We strongly recommend choosing Express shipping (UPS Second Day Air or UPS Next Day Air Saver) to ensure that your candy arrives in the best possible condition. For more information, see the FAQ section, below.</strong></p><p><strong>These items will ship from our Memphis, Tennessee location.</strong></p>");
            }
            if (this.hasNoFreeShipping()) {
                $('#hide-from-heat-sensitive').css('display', 'none');
                $('#no-free-shipping-statement').html("<p><strong>Your order has one or more items in which the price does not count towards the Free Shipping threshold.</strong></p>");
            }
		},
		hasItemsWithYearRoundHeatSensitivity: function() { 
			var items = this.model.getOrder().get('items');//("items");
			//console.log(order);
			var result = _.find(items, function(item) {
			return _.find(item.product.categories, function(category){
				// console.log(category);
				return category.id == Hypr.getThemeSetting('heatSensitiveYearRoundId');
			});
		});
		if (result === undefined)
				return false;
			else
				return true; 
			},
		hasItemsCurrentlySeasonallyHeatSensitive: function() { 
		if (!Hypr.getThemeSetting('showHeatSensitiveText'))
			return false;
		var items = this.model.getOrder().get('items');
		var result = _.find(items, function(item) {
			return _.find(item.product.categories, function(category){
				return category.id == Hypr.getThemeSetting('heatSensitiveCategoryId');
			});
		});
		if (result === undefined)
				return false;
			else
				return true; 
        },
        hasNoFreeShipping: function(){
            var items = this.model.getOrder().get('items');
            var result = _.find(items, function(item) {
                return _.find(item.product.categories, function(category){
                    return category.id == Hypr.getThemeSetting('noFreeShippingId');
                });
            });
            if (result === undefined)
                return false;
            else
                return true;
        }
    });

    var visaCheckoutSettings = HyprLiveContext.locals.siteContext.checkoutSettings.visaCheckout;
    var pageContext = require.mozuData('pagecontext');
    var BillingInfoView = CheckoutStepView.extend({
        templateName: 'modules/checkout/step-payment-info',
        autoUpdate: [
            'savedPaymentMethodId',
            //'paymentType',
            'card.paymentOrCardType',
            'card.cardNumberPartOrMask',
            'card.nameOnCard',
            'card.expireMonth',
            'card.expireYear',
            'card.cvv',
            'card.isCardInfoSaved',
            'check.nameOnCheck',
            'check.routingNumber',
            'check.checkNumber',
            'isSameBillingShippingAddress',
            'billingContact.companyOrOrganization',
            'billingContact.firstName',
            'billingContact.lastNameOrSurname',
            'billingContact.address.address1',
            'billingContact.address.address2',
            'billingContact.address.address3',
            'billingContact.address.cityOrTown',
            'billingContact.address.countryCode',
            'billingContact.address.stateOrProvince',
            'billingContact.address.postalOrZipCode',
            'billingContact.phoneNumbers.home',
            'billingContact.email',
            'creditAmountToApply',
            'digitalCreditCode'
        ],
        renderOnChange: [
            'billingContact.address.countryCode',
            //'paymentType', 
            'isSameBillingShippingAddress',
            'usingSavedCard',
            'savedPaymentMethodId'
        ],
        additionalEvents: {
            "change [data-mz-digital-credit-enable]": "enableDigitalCredit",
            "change [data-mz-digital-credit-amount]": "applyDigitalCredit",
            "change [data-mz-digital-add-remainder-to-customer]": "addRemainderToCustomer",
            "paste #digital-credit-code":"onPasteStoreCreaditEnable",
            //"change [name='paymentType']": "resetPaymentData", 
            "click [paymentType-edit]":"cancelExternalCheckout",
            "click .select-li": "updatePaymentType", 
            "keydown .select-li": "kyupdatepayment",
            //"click .inpit-select": "showDropdown",   
            "click .btn_validatepaypal": "validateaddressform",
            //"change select[name='savedPaymentMethods']" : "changesavedcard"
            //"keypress [id='paymentType']": "keypressForMobile",
            //"change [id='paymentType']": "setFocusforOption",
            "keydown [name='credit-card-number']":"creditcardformat",
            "keydown [name='postal-code']":"zipcodeFormating",
						//"click .pay-with-rewards-prepare" : "payWithRewardsPrepare",
						"click .redeem": "redeem"
        },
        getRenderContext: function () {
            var c = Backbone.MozuView.prototype.getRenderContext.apply(this, arguments);
            if(!c.model.paymentType){
                c.model.paymentType = "CreditCard";      
            } 
            return c; 
        },
        kyupdatepayment: function(e){
            if(e.which == 13 || e.which == 32){
                e.preventDefault();
                this.updatePaymentType(e);  
            }
        },
        changesavedcard: function(e){
             if($(e.currentTarget).val() == 'CreditCard'){
                this.model.set('usingSavedCard',false); 
                this.render();
            }else{
                this.model.set('usingSavedCard',true);
            }
        },
				prepa: function(e) {
					this.prepareOrder();
				},
        validateaddressform: function(e){
            if(!this.model.get('billingContact.address.addressType')){this.model.set('billingContact.address.addressType',"Residential");}
            if(window.paymentinfo.model.get('paymentType').toLowerCase() === "storecredit" && window.checkoutViews.parentView.model.get('amountRemainingForPayment')>0){
                $('.store-credit-message').focus();
                return false;
            }
            
            if(!require.mozuData('user').isAnonymous){ 
                window.paymentinfo.model.attributes.billingContact.attributes.email = require.mozuData('user').email;
            }else{
                if(this.model.get('billingContact')._previousAttributes && this.model.get('billingContact')._previousAttributes.email){
                    window.paymentinfo.model.attributes.billingContact.attributes.email = this.model.get('billingContact')._previousAttributes.email;
                }else if($.cookie("guest")){
                    window.paymentinfo.model.attributes.billingContact.attributes.email = $.cookie("guest"); 
                }
            }
            var billincontact = this.model.get('billingContact').attributes;
            var card = this.model.get('card').attributes;
            var attr = {
                billingContact:{ 
                    address:{  
                        address1:billincontact.address.address1,
                        cityOrTown:billincontact.address.cityOrTown,
                        countryCode:billincontact.address.countryCode,
                        postalOrZipCode:billincontact.address.postalOrZipCode,
                        stateOrProvince:billincontact.address.stateOrProvince
                        },
                    email:billincontact.email,
                    firstName:billincontact.firstName,
                    lastNameOrSurname:billincontact.lastNameOrSurname, 
                    phoneNumbers:{home: null}
                },
                card:{
                    cardNumberPartOrMask:card.cardNumberPartOrMask,
                    expireMonth:card.expireMonth,
                    expireYear:card.expireYear,
                    nameOnCard:card.nameOnCard,
                    paymentOrCardType:card.paymentOrCardType,
                    cvv:card.cvv
                    
                }
                
            };
									
			api.request('GET', '/svc/isNewCustomer?email=' + attr.billingContact.email).then(function(res){
				$.cookie('isNewCustomer', res.result, { path: '/'});
					}).catch(function(e){
				console.log(e);
				$.cookie('isNewCustomer', true, { path: '/'});
				});

            if(billincontact.phoneNumbers && billincontact.phoneNumbers.home ){
                attr.billingContact.phoneNumbers.home = billincontact.phoneNumbers.home;
            }else{
                attr.billingContact.phoneNumbers.home = null;
            }
            var flag = false;
            if(!(window.paymentinfo.model.validate(attr))){
                 //CVV Validation
                 var regcvv=/^[0-9]{3,4}$/;
                 if(card.cvv && !regcvv.test(card.cvv)){
                     $('[data-mz-validationmessage-for="card.cvv"]').text("Error: Please enter your card’s complete CVV (Security Code)");
                      $('[data-mz-value="card.cvv"]').focus();
                  return false;
                 }else if(card.cvv===undefined || card.cvv === ""){
                    $('[data-mz-validationmessage-for="card.cvv"]').text("Error: Please enter your card's CVV (Security Code)");
                    $('[data-mz-value="card.cvv"]').focus();
                    return false;
                 }
                $('#completePaymment').click();
                if($('.is-showing.mz-errors').length > 0){
                    $('.is-showing.mz-errors').first().focus();
                }
            }else if(window.paymentinfo.model.validate(attr)){
                var k = window.paymentinfo.model.validate(attr);
                var counter = 0;var totalcounter = 0;
                $.each(k,function(k,v){
                    totalcounter++;
                    if("savedPaymentMethodId" == k || k == "billingContact.address.addressType" || k == "billingContact.address.countryCode"){
                        counter++;
                    }
                });
                if(totalcounter <= counter){
                    $('#bcompletePaymment').click();
                }else{
                    // form validation errors focus
                    var $errEl;
                    if($('.payment-form-section')) {
                        window.scrollTo(0, $('.payment-form-section').offset().top);
                        setTimeout(function() {
                            $errEl = $('.payment-form-section').find('.mz-validationmessage').filter(':visible');
                            if($errEl.first().prev().length > 0) {
                                if($errEl.first().prev().is('input') || $errEl.first().prev().is('select'))
                                    $errEl.first().prev().attr('aria-invalid', true).focus();
                                else
                                    $errEl.first().prevAll('input').attr('aria-invalid',true).focus();
                            }
                        }, 700);
                        
                        if($('.mz-l-formfieldgroup-address').is(':visible')) {
                            $errEl = $('.mz-l-formfieldgroup-address').find('.mz-validationmessage').filter(':visible');
                            $errEl.prev().attr('aria-invalid',true);
                            $errEl.first().prev().focus();
                        }
                    }
                }  
            }
            // global errors focus
            setTimeout(function() {
                if($('.mz-messagebar').find('.is-showing.mz-errors').filter(':visible').length > 0) {
                    $('.mz-messagebar').find('.is-showing.mz-errors').focus();
                }
            }, 500);
            // step 4 msg focus 
           
        },
        keypressForMobile: function(e) {
            if(e.keyCode == 13 || e.keyCode == 32) {
                $(e.target).trigger('click');
            }
        },
        setFocusforOption: function(ele) {
            if(ele == "CreditCard") {
                if($('.payment-form-section').is(':visible')) { 
                    if($('.mz-payment-select-saved-payments').length > 0) {
                         $('.mz-payment-select-saved-payments').focus();
                        setTimeout(function(){  
                            $('.mz-payment-select-saved-payments').focus();  
                            //$('#mz-payment-credit-card-number').focus();
                        },100);
                    }
                    else if($('#mz-payment-credit-card-type').length > 0) {
                        $('#mz-payment-credit-card-type').focus();
                        setTimeout(function(){
                            $('#mz-payment-credit-card-type').focus();
                            //$('#mz-payment-credit-card-number').focus();
                        },100); 
                    } 
                }
            }else if(ele == "PayPalExpress2") {
                if($('.paypal-next').is(':visible')) { 
                    setTimeout(function(){$('.paypal-next').find('.paypalmsg').focus();},250);  
                }
            }
        },
        // showDropdown: function(e){
        //     if($(e.target).hasClass('inactive') || $(e.target).parent().hasClass('inactive')){
        //         $('.select-li').slideDown();
        //         $('.inpit-select').removeClass('inactive');
        //         $('.inpit-select').addClass('active');
        //         $('.inpit-select').attr('aria-expanded','true');
        //     }else if($(e.target).hasClass('active') || $(e.target).parent().hasClass('active')){
        //         $('.select-li').slideUp();
        //         $('.inpit-select').addClass('inactive');
        //         $('.inpit-select').removeClass('active'); 
        //         $('.inpit-select').attr('aria-expanded','false');
        //     }
        // },
        // selectPaymentType:function(e){ 
        //     $('.inpit-select').html($(e.target).attr('data-value'));
        //     var container = $(e.target);
        //     if( container.hasClass("mz-paymenttype-label") ){ 
        //         container =container.parents(".select-li");
        //     }
        //     if( container.children().length){  
        //       container.find('input').click(); 
        //     } 
        //     if(container.attr('data-value') == "select payment type"){
        //         this.model.set('paymentType','select payment type');    
        //         this.render(); 
        //     }
        //     if(container.attr('data-value') == "PayPalExpress2"){
        //         container.parents('.paypal2').find('input').click();    
        //     }
        //     $('.select-li').slideUp();
        //     $(".inpit-select").addClass('inactive');
        //     $(".inpit-select").removeClass('active');
        //     $(".inpit-select").focus();
        // },
        initialize: function () {
            var self = this;
            this.listenTo(this.model, 'change:digitalCreditCode', this.onEnterDigitalCreditCode, this);
            this.listenTo(this.model, 'orderPayment', function (order, scope) {
                    this.render();
                }, this);
            this.listenTo(this.model, 'billingContactUpdate', function (order, scope) {
                    this.render();
            }, this);
            this.listenTo(this.model, 'change:savedPaymentMethodId', function (order, scope) {
                $('[data-mz-saved-cvv]').val('').change();
                this.render();
            }, this);
            this.codeEntered = !!this.model.get('digitalCreditCode');
        },
        resetPaymentData: function (e) {
            if (e.target !== $('[data-mz-saved-credit-card]')[0]) {
                $("[name='savedPaymentMethods']").val('0');
            }
            this.model.clear();
            this.model.resetAddressDefaults();
        },
        creditcardformat:function(e){
            if (e.which !== 8  && e.which !== 0 && e.which !== 9 && e.which !== 38 && e.which !== 40 && (e.which < 48 || e.which > 57 || e.shiftKey) && (e.which < 96 || e.which > 105 || e.shiftKey) || (e.which == 189 && e.shiftKey) ) {
                return false;    
            }else{
                return true;
            }
        },
        zipcodeFormating:function(e){
            if((e.which > 47 && e.which < 58 && !e.shiftKey) || (e.which > 95 && e.which < 106 && !e.shiftKey) || (e.which == 189 && !e.shiftKey) || e.which == 46 || e.which == 8 || e.which == 9 || (e.which>36 && e.which <41)){    
                return true;    
            }else{
                return false;
            }
        },
        onPasteStoreCreaditEnable:function(){
            setTimeout(function(e){
                if($('#digital-credit-code').val() !==""){
                   $('.applyDigitalCredit').prop('disabled', false);
                }
            },100);
        },
        render: function() {
            var self = this;
            if($('.error-msg').html() !== ''){
                if(self.model){  
                    self.model.set('digitalCreditCode','');
                    self.model.set('errormessage',''); 
                }  
                setTimeout(function(){    
                    $('.error-msg').html(''); 
                    //$('#coupon-code').focus();
                    //$('.digitalcrediterror-msg').html('');   
                },10000); 
            }
            if($('.digitalcrediterror-msg').html() !== ''){   
                setTimeout(function(){   
                    //$('.error-msg').html('');  
                    $('.digitalcrediterror-msg').html(''); 
                    if(self.model){ 
                        self.model.set('errormessage','');  
                        self.model.set('errorsetdigitlcredit','');  
                    }
                },10000);
            }
            preserveElements(this, ['.v-button', '.p-button'], function() {
                CheckoutStepView.prototype.render.apply(this, arguments);
            });
            var status = this.model.stepStatus(); 
            if(require.mozuData('user').isAuthenticated){
                if(
                    (this.model.get('card').id && this.model.get("savedPaymentMethodId") && this.model.get("savedPaymentMethodId") !== 'CreditCard' && this.model.get('usingSavedCard')===true) ||
                    (this.model.get("savedPaymentMethodId") === 'CreditCard' && !this.model.get('card').id  && this.model.get('usingSavedCard')===false)||
                    (this.model.get('card').id && this.model.get("savedPaymentMethodId") === 'CreditCard' && this.model.get('usingSavedCard')===false && !this.model.get('card.isDefaultPayMethod') && this.model.get('card.cvv'))
                    )
                {
                    
                }
                else if(this.model.get("savedPaymentMethodId") === undefined ){
                     //this.model.get('billingContact').clear();
                    this.model.set("savedPaymentMethodId",'CreditCard');
                    this.model.get('card').clear();
                    this.model.set('usingSavedCard',false); 
                    //this.model.set('isSameBillingShippingAddress',false);
                }else {
                    this.model.get('card').clear();
                    this.model.set('usingSavedCard',false); 
                    this.model.set('isSameBillingShippingAddress',false);
                    this.model.get('billingContact').clear();
                }  
            }
            if (visaCheckoutSettings.isEnabled && !this.visaCheckoutInitialized && this.$('.v-button').length > 0) {
                window.onVisaCheckoutReady = _.bind(this.initVisaCheckout, this);
                require([pageContext.visaCheckoutJavaScriptSdkUrl]);
                this.visaCheckoutInitialized = true;
            }
            /*if(window.flag){
                this.model.get('billingContact').clear();
                this.model.get('card').clear();
                this.model.set('usingSavedCard',false); 
            }*/
            
             setTimeout(function() {
                if($('#step-payment-info').hasClass('is-complete')) {
                    if($('#step-review').is(':visible')) {
                        $('#step-review').filter(':visible').find('.mz-formstep-desc').focus();
                    }
                }
            }, 2000);
            
            if (this.$(".p-button").length > 0)
                PayPal.loadScript();
								// pay with rewards
					if (window.zinreloLoaded) {
						this.updatePayWithRewardsDisplay();
					}
					
					var ccPayment = _.find(this.model.getOrder().apiModel.data.payments, function(p){
						return p.paymentType == 'CreditCard' && p.status == 'New';
					});
					if(window.pwrRewards.length > 0 && ccPayment !== undefined) {
						var oo = this.model.getOrder();
						var x = parseFloat(oo.get('total')) - parseFloat(window.pwrRedemptionAmount);
						$('#credit-card-amount-with-rewards').html(x.toFixed(2)).show();
						$('#credit-card-amount-without-rewards').hide();
					}
					else{
						$('#credit-card-amount-with-rewards').hide();
					}

					$(".mz-paymenttype-label-creditcard, .mz-paymenttype-label-check").removeAttr("tabindex");
					$(".mz-paymenttype-label-creditcard, .mz-paymenttype-label-check").removeAttr("aria-current");
					setTimeout(function(){ 
					if(window.paymentTypeChosen === "creditcard") {
						$(".mz-paymenttype-label-creditcard").prop("tabindex", 0);
						$(".mz-paymenttype-label-creditcard").prop("aria-current", "true");
					}
					else if(window.paymentTypeChosen === "paypal") {
						$(".mz-paymenttype-label-check").prop("tabindex", 0);
						$(".mz-paymenttype-label-check").prop("aria-current", "true");
					}
					}, 1000);

        },

        updateAcceptsMarketing: function(e) {
            if($(e.currentTarget).prop('checked')){
            this.model.getOrder().set('acceptsMarketing', $(e.currentTarget).prop('checked'));
            }else if($('#accept').is(':checked')){
                this.model.getOrder().set('acceptsMarketing',$('#accept').is(':checked') );
            }
        },
        updatePaymentType: function(e) { 
            var newType = $(e.currentTarget).find('input').val(); 
            
            //this.model.set('usingSavedCard', e.currentTarget.hasAttribute('data-mz-saved-credit-card'));
            
            if(newType==="CreditCard" && !require.mozuData('user').isAnonymous && $('.mz-payment-select-saved-payments').val() !=="CreditCard" && this.model.get('savedPaymentMethodId') !== "CreditCard"){
                this.model.set('usingSavedCard', true);
            }else{
                this.model.set('usingSavedCard', false);
            }
            this.model.set('paymentType', newType);
            /*if(newType == "PayPal"){
                $('.p-button').prop('disabled',false); 
                //$(e.currentTarget).siblings('button').css("background-color", "#ffc439");
               // $('.p-button').css("background-color", "#ffc439");
            }else{
                 $('.p-button').prop('disabled',true);
                 //$('.p-button').css("background-color", "#999");
            } */
            this.render();
            this.setFocusforOption(newType); 
        },
        beginEditingCard: function() {
            var me = this;
            if (!this.model.isExternalCheckoutFlowComplete()) {
                this.editing.savedCard = true;
                this.render();
            } else {
                this.cancelExternalCheckout();
            }
        },
        beginEditingExternalPayment: function () {
            var me = this;
            if (this.model.isExternalCheckoutFlowComplete()) {
                this.doModelAction('cancelExternalCheckout').then(function () {
                    me.editing.savedCard = true;
                    me.render();
                });
            }
        },
        beginEditingBillingAddress: function() {
            this.editing.savedBillingAddress = true;
            this.render();
        },
        beginApplyCredit: function () {
            this.model.beginApplyCredit();
            this.render();
        },
        cancelApplyCredit: function () {
            this.model.closeApplyCredit();
            this.render();
        },
        cancelExternalCheckout: function () {
            var me = this;
            this.doModelAction('cancelExternalCheckout').then(function () {
                me.editing.savedCard = false;
                me.render();
            });
        },
        finishApplyCredit: function () {
            var self = this;
            this.model.finishApplyCredit().then(function() {

                self.render();
            });
        },
        removeCredit: function (e) {
            var self = this,
                id = $(e.currentTarget).data('mzCreditId');
            this.model.removeCredit(id).then(function () {
                self.render();
            });
        },
        getDigitalCredit: function (e) {
            var self = this;
            this.$el.addClass('is-loading');
            this.model.getDigitalCredit().ensure(function () {
                self.$el.removeClass('is-loading');
                if(window.checkoutViews.messageView.model.models[0].attributes.errorCode == "ITEM_NOT_FOUND"){  
                    self.model.set('errorsetdigitlcredit',"creditcode");  
                    // $('.mz-checkout-digitalcredit-enter-code').val('');  
                    self.model.set('errormessage', 'Error: '+window.checkoutViews.messageView.model.models[0].attributes.message);  
                    setTimeout(function(){   
                        self.render();  
                    },1000);
                    
                    // $('#digital-credit-code').'Error: '+html('');
                    // $('#digital-credit-code').val('');
                    $('.digitalcrediterror-msg').show(); 
                    $('.digitalcrediterror-msg').css('display','block');  
                    
                    setTimeout(function(){   
                        // $('.digitalcrediterror-msg').focus();   
                    },1000);
                }
            });
        },
        stripNonNumericAndParseFloat: function (val) {
            if (!val) return 0;
            var result = parseFloat(val.replace(/[^\d\.]/g, ''));
            return isNaN(result) ? 0 : result;
        },
        applyDigitalCredit: function(e) {
            var val = $(e.currentTarget).prop('value'),
                creditCode = $(e.currentTarget).attr('data-mz-credit-code-target');  //target
            if (!creditCode) {
                return;
            }
            var amtToApply = this.stripNonNumericAndParseFloat(val);
            
            this.model.applyDigitalCredit(creditCode, amtToApply, true);
            this.render();
        },
        onEnterDigitalCreditCode: function(model, code) {
            if ($.trim(code) && !this.codeEntered) {
                this.codeEntered = true; 
                this.$el.find('button.applyDigitalCredit').prop('disabled', false);
            }
            if (!$.trim(code) && this.codeEntered) {
                this.codeEntered = false;
                this.$el.find('button.applyDigitalCredit').prop('disabled', true);
            }
            $('#digital-credit-code').val($.trim(code));
        },
        enableDigitalCredit: function(e) {
				var creditCode = $(e.currentTarget).attr('data-mz-credit-code-source'),
				amount = $(e.currentTarget).attr('data-mz-credit-balance'),
                isEnabled = $(e.currentTarget).prop('checked') === true,
                targetCreditAmtEl = this.$el.find("input[data-mz-credit-code-target='" + creditCode + "']"),
                me = this;

							if (creditCode.indexOf('PWR-') > -1) {
								var ra = 0;
								_.each(window.pwrRewards, function (r) {
									ra = ra + r.discount;
								});
								window.checkoutViews.orderSummary.setRewardAmount(parseFloat(ra) + parseFloat(amount));
								var rwd = this.lookupRewardByAmount(parseFloat(amount));
								window.pwrRewards.push(rwd);
								window.pwrRedemptionAmount = parseFloat(ra) + parseFloat(rwd.discount);
							}
								
						
             if (isEnabled) {
                 targetCreditAmtEl.prop('disabled', false);
                 me.model.applyDigitalCredit(creditCode, null, true);
             } else {
                 targetCreditAmtEl.prop('disabled', true);
                 me.model.applyDigitalCredit(creditCode, 0, false);

                 me.render();
             }
        },
        addRemainderToCustomer: function (e) {
            var creditCode = $(e.currentTarget).attr('data-mz-credit-code-to-tie-to-customer'),
                isEnabled = $(e.currentTarget).prop('checked') === true;
            this.model.addRemainingCreditToCustomerAccount(creditCode, isEnabled);
        },
        handleEnterKey: function (e) {
            var source = $(e.currentTarget).attr('data-mz-value');
            if (!source) return;
            switch (source) {
                case "creditAmountApplied":
                    return this.applyDigitalCredit(e);
                case "digitalCreditCode":
                    return this.getDigitalCredit(e);
            }
        },
        /* begin visa checkout */
        initVisaCheckout: function () {
            var me = this;
            var visaCheckoutSettings = HyprLiveContext.locals.siteContext.checkoutSettings.visaCheckout;
            var apiKey = visaCheckoutSettings.apiKey || '0H1JJQFW9MUVTXPU5EFD13fucnCWg42uLzRQMIPHHNEuQLyYk';
            var clientId = visaCheckoutSettings.clientId || 'mozu_test1';
            var orderModel = this.model.getOrder();


            if (!window.V) {
                //console.warn( 'visa checkout has not been initilized properly');
                return false;
            }
            // on success, attach the encoded payment data to the window
            // then call the sdk's api method for digital wallets, via models-checkout's helper
            window.V.on("payment.success", function(payment) {
                //console.log({ success: payment });
                me.editing.savedCard = false;
                me.model.parent.processDigitalWallet('VisaCheckout', payment);
            });

          

            window.V.init({
                apikey: apiKey,
                clientId: clientId,
                paymentRequest: {
                    currencyCode: orderModel.get('currencyCode'),
                    subtotal: "" + orderModel.get('subtotal')
                }
            });
        },
        /* end visa checkout */
				// pay with rewards
			
			updatePayWithRewardsDisplay: function() {
				var totalRedeemed = 0;
				_.each(window.pwrRewards, function(r){
					totalRedeemed = totalRedeemed + r.points;
				});

				//window.pwrDisplayPoints = window.pwrInitialPoints - totalRedeemed;
				var orderTotal = this.model.getOrder().get('total');
				
				$('#sweet-rewards-points').empty().html(window.pwrDisplayPoints-totalRedeemed);
				if (window.pwrDisplayPoints < 1800 || orderTotal < 20) {
					$("#reward-1800").prop("disabled", true);
				}
				if (window.pwrDisplayPoints < 950 || orderTotal < 10){
					$("#reward-950").prop("disabled", true);
				}
				if (window.pwrDisplayPoints < 500 || orderTotal < 5){
					$("#reward-500").prop("disabled", true);
				}
				
				if (window.pwrRewards.length > 1) {
					$('#pwr-max-statement').empty().html("The maximum of two rewards has been redeemed for this order.");
					$(".redeem").prop("disabled", true);
				}
				if(window.pwrRewards.length > 0) {
					$('#pwr-congrats-statement').empty().html("Congratulations! <b>You have redeemed " + totalRedeemed + " points.</b>");
                }
                $("#pwr-rewards-list").empty();
                // $('#sweet-rewards-points').empty().html(window.pwrDisplayPoints - totalRedeemed);
                    
				for (var i = 0; i < window.pwrRewards.length; i++)	
                    $('#pwr-rewards-list').append("<li style='font-weight: normal; margin: 12.5px'>" + (i+1) + ". " + window.pwrRewards[i].points + " - $" + window.pwrRewards[i].discount + "</li>");
			},
			rewardList: JSON.parse(document.getElementById('data-mz-preload-apicontext').innerHTML).headers["x-vol-tenant"] == '9046' ? [{
					id: 'reward_3206a',
					points: 500,
					discount: 5.00
				}, {
					id: 'reward_191e0',
					points: 950,
					discount: 10.00
				}, {
					id: 'reward_28df0',
					points: 1800,
					discount: 20.00
				}] : [{
						id: 'reward_9a207',
						points: 500,
						discount: 5.00
					}, {
						id: 'reward_62ed7',
						points: 950,
						discount: 10.00
					}, {
						id: 'reward_b6015',
						points: 1800,
						discount: 20.00
					}],
			lookupReward: function(id) {
				return this.rewardList.find(function(r){ 
					return r.id === id; 
				});
			},
			lookupRewardByAmount: function(amount) {
				return this.rewardList.find(function(r){ 
					return r.discount === amount; 
				});
			},
			updateZinrelo: function(points) {
				console.log(JSON.parse(document.getElementById('data-mz-preload-apicontext').innerHTML).headers["x-vol-tenant"]);
					window.pwrInitialPoints = window.zrl_mi.user_data.available_points;
                    window.pwrDisplayPoints = window.zrl_mi.user_data.available_points;
					var rewards = [];
					var ers = this.processExistingRedemptions();
					var self = this;
					_.each(ers, function(sc){
                        var r = self.lookupRewardByAmount(parseFloat(sc.amountRequested));
						rewards.push(r);
					});
                    console.log(window.pwrDisplayPoints);
					window.pwrRewards = rewards;
					if (rewards.length >= 2)
						$('.redeem').hide();
					
					var ra = 0;
					var ps = 0;
					_.each(rewards, function (r) {
						ra = ra + r.discount;
						//window.pwrDisplayPoints = window.pwrDisplayPoints - r.points;
					});
					window.pwrRedemptionAmount = ra;
					window.checkoutViews.orderSummary.setRewardAmount(ra);
                    window.zinreloLoaded = true;
					this.render();
					return;
			},
			processExistingRedemptions: function () {
				var asc = this.model.activeStoreCredits();
				var e = [];
				_.each(this.model.activeStoreCredits(), function(asc){ 
					if (asc.billingInfo.storeCreditCode.indexOf('PWR-') > -1)
						e.push(asc);
                });
				return e;
			},
			redeem: function (e) {
        var rid = e.currentTarget.getAttribute('reward-id');
				var re = this.lookupReward(rid);
				window.pwrRewards.push(re);
        
				var ra = 0;
				var ip = window.pwrInitialPoints;
                var rpv = window.pwrRedeemedPointsValue;

				_.each(window.pwrRewards, function (r) {
					ra = ra + r.discount;
                    ip = ip - r.points;
				});
				
				//window.pwrDisplayPoints = ip;
				window.pwrRedemptionAmount = ra;
				window.checkoutViews.orderSummary.setRewardAmount(ra);
				
				var orderid = this.model.getOrder().get('id');
				var self = this;
				
				if (window.pwrRewards.length === 2) { 
                    $(".redeem").hide();
                }
				
				$('#pay-with-rewards-buttons').hide();
				$('#redemption-spinner').show();
				$('#sweet-rewards-error').empty();
				api.request('GET', '/svc/pay_with_rewards_store_credit?orderid=' + orderid + '&reward_id=' + rid).then(function (res) {
					$('#redemption-spinner').hide();
                    $('#pay-with-rewards-buttons').show();
                    //self.model.getOrder();
                    self.render();
				}).then(function() {
                    $('.sweet-rewards-header').focus();
                }, function(e) { 
                    $('#sweet-rewards-error').html("<b>An error occurred while redeeming your rewards. Please contact Customer Service for assistance.");
                    $('#redemption-spinner').hide();
                }

                );
		}
    });

    var CouponView = Backbone.MozuView.extend({
        templateName: 'modules/checkout/coupon-code-field',
        handleLoadingChange: function (isLoading) {
            // override adding the isLoading class so the apply button 
            // doesn't go loading whenever other parts of the order change
        },
        additionalEvents: {
            "click .remove-coupon-checkout": "removechekout",
            "keypress .remove-coupon-checkout": "removeChekoutOnKeypress"
        },  
        removechekout:function(e){   
            $('.remove-coupon').click();  
            $('#coupon-code').focus();
        },
        removeChekoutOnKeypress: function(e) {
            var keyCode = e.keyCode || e.which;
            if(keyCode == 13 || keyCode == 32) {
                $('.remove-coupon').trigger('click');
                $('#coupon-code').focus();
            }
        },
        initialize: function() {
            var me = this;
            this.listenTo(this.model, 'change:couponCode', this.onEnterCouponCode, this);
            this.codeEntered = !!this.model.get('couponCode');
            this.$el.on('keypress', 'input', function (e) {
                if (e.which === 13) {
                    if (me.codeEntered) {
                        me.handleEnterKey();
                    }
                    return false;
                }
            });
            this.$el.on('paste', 'input', function (e) {
                setTimeout(function(){
                    if($('#coupon-code').val() !==""){
                        me.$el.find('button').prop('disabled', false);
                        $('.coupon-error').fadeOut();
                    }
                },100);
            }); 
        },
        onEnterCouponCode: function (model, code) {
            if ($.trim(code) && !this.codeEntered) {
                this.codeEntered = true; 
                this.$el.find('button').prop('disabled', false);
                 $('.coupon-error').fadeOut();
            }
            if (!$.trim(code) && this.codeEntered) {
                this.codeEntered = false;
                this.$el.find('button').prop('disabled', true);
            }
            $('#coupon-code').val($.trim(code));
        },
        autoUpdate: [
            'couponCode'
        ],
        addCoupon: function (e) {
            e.preventDefault(); 
            // add the default behavior for loadingchanges
            // but scoped to this button alone
           var self = this,addedCoupon = self.model.get('couponCode');
            if( $.trim($('#coupon-code').val()) === ""){
                $(".mz-messagebar").html('<ul class="is-showing mz-errors"><li>Please enter gift certificate code</li></ul>');
            }else{
                this.$el.addClass('is-loading');
                if(self.model.apiModel.data.couponCodes && self.model.apiModel.data.couponCodes.length>0){ 
                    self.$el.removeClass('is-loading');
                    self.render();
                    $('.coupon-error').fadeIn();
                    $('.coupon-error').focus();
                }else{
                    this.model.addCoupon().ensure(function() {
                        self.$el.removeClass('is-loading');
                        self.render();
                        if($('.error-msg').text().length > 0){
                            $('.error-msg').focus();   
                        }
                    });  
                    $.cookie("coupon", addedCoupon , { path: '/', expires: 7 });
                }
            }
          },
        handleEnterKey: function () {
            $('[data-mz-action="addCoupon"]').trigger('click');
        },
             removeCouponCheckout:function(){
                var self=this,
                    couponCode =this.model.get('couponCodes'); 
                if(couponCode && couponCode.length>0){
                    $.each(couponCode,function(i,v){
                        self.model.apiRemoveCoupon(v).then(function (res) {
                            $.cookie("coupon",'',{ path: '/', expires: 7 });
                            window.checkoutViews.steps.shippingInfo.next();
                        });    
                    });    
                }
                self.model.unset('couponCodes');
        },
        removeAllCouponCheckout:function(){
            var self=this,CartData = this.model.apiModel.data;
                var couponCode =this.model.get('couponCodes'),i=0,removeCoupon;
                
                if(couponCode && couponCode.length>0 && $.cookie("coupon")){
                    for(i;i<couponCode.length;i++){
                        if($.cookie("coupon") !== couponCode[i]){
                            removeCoupon = couponCode[i];
                        }
                    }
                    if(removeCoupon){
                        self.model.apiRemoveCoupon(removeCoupon).then(function (res) {
                            console.log("coupon removed");
                        });    
                    }
                }
                self.model.unset('couponCodes');
            
        },
        render:function(){
                if(this.model){
                    $('.digitalcrediterror-msg').hide();
                     $('.digitalcrediterror-msg').css('display','none');  
                    this.model.set('digitalCreditCode','');
                    this.model.set('errormessage',''); 
                }   
            Backbone.MozuView.prototype.render.apply(this);     
        }
    });
    
    var CommentsView = Backbone.MozuView.extend({
        templateName: 'modules/checkout/comments-field',
        autoUpdate: ['shopperNotes.giftMessage'],
        render: function(){
            var OSName = "Unknown";
            var $userAgent = '';
           
            if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1) OSName="Windows 10";
            if (window.navigator.userAgent.indexOf("Windows NT 6.3") != -1) OSName="Windows 8.1";
            if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) OSName="Windows 8";
            if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) OSName="Windows 7";
            if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) OSName="Windows Vista";
            if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1) OSName="Windows XP";
            if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1) OSName="Windows 2000";
            if (window.navigator.userAgent.indexOf("Mac")!=-1) OSName="Mac/iOS";
            if (window.navigator.userAgent.indexOf("X11")!=-1) OSName="UNIX";
            if (window.navigator.userAgent.indexOf("Linux")!=-1) OSName="Linux";
            
            //alert('Your OS is: ' + OSName);
            //To detect Browser and Version //
            var nVer = window.navigator.appVersion;
            var nAgt = window.navigator.userAgent;
            var browserName  = window.navigator.appName;
            var fullVersion  = ''+parseFloat(window.navigator.appVersion); 
            var majorVersion = parseInt(window.navigator.appVersion,10);
            var nameOffset,verOffset,ix;
            
            // In Opera 15+, the true version is after "OPR/" 
            if ((verOffset=nAgt.indexOf("OPR/"))!=-1) {
            browserName = "Opera";
            fullVersion = nAgt.substring(verOffset+4);
            }
            // In older Opera, the true version is after "Opera" or after "Version"
            else if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
            browserName = "Opera";
            fullVersion = nAgt.substring(verOffset+6);
            if ((verOffset=nAgt.indexOf("Version"))!=-1) 
            fullVersion = nAgt.substring(verOffset+8);
            }
            // // In MSIE, the true version is after "MSIE" in userAgent
            // else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
            // browserName = "Microsoft Internet Explorer";
            // fullVersion = nAgt.substring(verOffset+5);
            // }
            // In Chrome, the true version is after "Chrome" 
            else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
            browserName = "Chrome";
            fullVersion = nAgt.substring(verOffset+7);
            }
            // In Safari, the true version is after "Safari" or after "Version" 
            else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
            browserName = "Safari";
            fullVersion = nAgt.substring(verOffset+7);
            if ((verOffset=nAgt.indexOf("Version"))!=-1) 
            fullVersion = nAgt.substring(verOffset+8);
            }
            // In Firefox, the true version is after "Firefox" 
            else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
            browserName = "Firefox";
            fullVersion = nAgt.substring(verOffset+8);
            }
            // In most other browsers, "name/version" is at the end of userAgent 
            else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
            (verOffset=nAgt.lastIndexOf('/')) ) 
            {
            browserName = nAgt.substring(nameOffset,verOffset);
            fullVersion = nAgt.substring(verOffset+1);
            if (browserName.toLowerCase()==browserName.toUpperCase()) {
            browserName = window.navigator.appName;
            }
            }
             var a=window.navigator.appVersion;
            var b=a.split(' ');
            if(b[b.length - 1]=="Edge/12.10240" ){
            var c =b[b.length - 1].split('/');
            browserName = c[0];
            fullVersion = c[1];
            
            } 
            // alert( $userAgent)
              if(browserName != "Firefox"){
              if((/MSIE/i).test(window.navigator.userAgent)===true||(/rv/i).test(window.navigator.userAgent)===true){
            var keep = window.navigator.appVersion;
           
            var x = keep.split(';');
            var y = x[x.length-1].split(")");
            var z = y[0].split(":");
            fullVersion = z[1];
           
            
           
            $userAgent='Internet Explorer';
            }      
}
            // trim the fullVersion string at semicolon/space if present
            if(fullVersion){
                if ((ix=fullVersion.indexOf(";"))!=-1)
                fullVersion=fullVersion.substring(0,ix);
                if ((ix=fullVersion.indexOf(" "))!=-1)
                fullVersion=fullVersion.substring(0,ix);
                
                majorVersion = parseInt(''+fullVersion,10);
                if (isNaN(majorVersion)) {
                fullVersion  = ''+parseFloat(window.navigator.appVersion); 
                majorVersion = parseInt(window.navigator.appVersion,10);
                }
            }
            var ipaddress = this.model.get('ipAddress');
            var storeclientdetails;
            
            if(!window.selected){
              //  this.model.get('fulfillmentInfo.shippingMethodCode');
              window.checkoutViews.steps.shippingInfo.ShippingValue();
            }
             if( $userAgent === 'Internet Explorer'){
             storeclientdetails= "IP Address "+ ipaddress + " <br/>" +" Browser Name & Version "+  $userAgent + " " + fullVersion  + "  <br/> " + "OS Name & Version " + OSName+"<br/>"+"Expected Arrival Date:"+ window.selected;
             }else{
                storeclientdetails= "IP Address "+ ipaddress + " <br/>" +" Browser Name & Version "+  browserName + " " + fullVersion  + "  <br/> " + "OS Name & Version " + OSName+"<br/>"+"Expected Arrival Date:"+ window.selected; 
             }
            
                // var mz_date_val = window.selected;
                // $('.mz_date_value').html(mz_date_val); 
           
            this.model.get('shopperNotes').set('comments',storeclientdetails);
            Backbone.MozuView.prototype.render.apply(this);
        }
                
    });

    var ReviewOrderView = Backbone.MozuView.extend({
        templateName: 'modules/checkout/step-review',
        autoUpdate: [
            'createAccount',
            'agreeToTerms',
            'emailAddress',
            'password',
            'confirmPassword'
        ],
        renderOnChange: [
            'createAccount',
            'isReady'
        ],
        initialize: function () {
            var me = this;
            var test;
            this.$el.on('keypress', 'input', function (e) {
                if (e.which === 13) {
                    me.handleEnterKey();
                    return false;
                } 
            });
            this.model.on('passwordinvalid', function(message) {  
                if(message.indexOf("EmailAddress already associated with a login") == -1){
                    test = me.$('[data-mz-validationmessage-for="password"]').text(message); 
               
                if(message.indexOf("Adding customer failed for the following reason: Missing or invalid parameter: EmailAddress") < 0){
                    if(message.indexOf("Passwords did not match, please reenter")) 
                      message = "Please make sure that the matching valid Password (at least 6 characters, with at least 1 number and 1 alphabetic character) is in each field.";
                      me.$('[data-mz-validationmessage-for="password"]').text(message);
                    } 
                }
            });  
            this.model.on('userexists', function (user) {
                if(test === undefined ){ 
                me.$('[data-mz-validationmessage-for="emailAddress"]').html(Hypr.getLabel("customerAlreadyExists", user, encodeURIComponent(window.location.pathname)));      
                }
               
            });
        },
        submit: function () {
            
            var self = this;
            _.defer(function () {
                if (self.model.commentsReformatted.length > 10) { 
                    self.model.set('shopperNotes.giftMessage',self.model.commentsReformatted);
                    $.cookie('giftmessage','');
                }
                self.model.submit();
            });
        },
        handleEnterKey: function () {
            this.submit();
        }
    });

    var ParentView = function(conf) {
      var gutter = parseInt(Hypr.getThemeSetting('gutterWidth'), 10);
      if (isNaN(gutter)) gutter = 15;
      var mask;
      conf.model.on('beforerefresh', function() {
         killMask();
         conf.el.css('opacity',0.5);
         var pos = conf.el.position();
         mask = $('<div></div>', {
           'class': 'mz-checkout-mask'
         }).css({
           width: conf.el.outerWidth() + (gutter * 2),
           height: conf.el.outerHeight() + (gutter * 2),
           top: pos.top - gutter,
           left: pos.left - gutter
         }).insertAfter(conf.el);
      });
      function killMask() {
        conf.el.css('opacity',1);
        if (mask) mask.remove();
      }
      conf.model.on('refresh', killMask); 
      conf.model.on('error', killMask);
      return conf;
    };    
    function focusLoop(){
        $(document).on('keydown','#cboxClose',function(e){
            var notifyinputs = $(document).find('#cboxContent').find('select, input, textarea, button, a').filter(':visible');
            if((e.which === 9 && !e.shiftKey)||(e.which === 9 && e.shiftKey)){
                e.preventDefault();
               notifyinputs.first().focus(); 
            } 
        }) ;
    }
    $(document).ready(function () {
            window.lastShippingMethod = '';
            window.guestlogincppcheckboxChecked = false;
			window.paymentTypeChosen = "";
			$(document).on("click", "input[name*='shippingMethod']", function(e){ 
					window.lastShippingMethod = e.target;
			});
            $(document).on('keydown','input,select',function(e){
                if(e.keyCode === 13){
                    e.preventDefault();
                } 
            });
			$(document).on('change','#guestmail-cpp-checkbox',function(){
                if (this.checked) {
                    $('.cpp-guest').prop('disabled',false);
                }else{
                    $('.cpp-guest').prop('disabled',true);
                }   
			});
			$(document).on('change','#guestlogin-cpp-checkbox',function(){
                if (this.checked) {
                    $('.cpp-loginpopup').prop('disabled',false);
                    window.guestlogincppcheckboxChecked = true;
                }else{
                    window.guestlogincppcheckboxChecked = false;
                    $('.cpp-loginpopup').prop('disabled',true); 
                }    
			});
			var orderNumGA = require.mozuData('checkout').orderNumber;
			try {
				$.cookie('__GA__' + orderNumGA, "cookie_set", {
					path: '/', expires: 1
				});
			} catch(e) { console.warn(orderNumGA + ' error in checkout'); }
			
			$(document).on("blur", "#guest_email", function(e) {
				window._bopiq = window._bopiq || [];
				window._bopiq.push(['doNotContact']);
			});

			$(document).on("blur", "#email", function(e) {
				window._bopiq = window._bopiq || [];
				window._bopiq.push(['doNotContact']);
			});	
			
        var shipAddressFlag = window.shipAddressFlag = false;
        //var paymentTypeFlag = window.paymentTypeFlag = false;
        var byPassFlag = window.byPassFlag = false;
        
        
        $(document).on('keydown','#step-shipping-address .address-info a', function(e) {
            if(e.keyCode == 9) {
                window.shipAddressFlagFirst = true;
                
            }
        });
        $(document).on('keydown','[data-mz-value="contactId"]', function(e) {
            if(e.keyCode == 13 || e.keyCode == 32) {
                window.shipAddressFlag = true;
            }
        });
        
        
        $(document).on('click','.sweet-rewards-modal', function(e) {
            var me = this;
            $.colorbox({
                open : true,
                maxWidth : "100%",
                maxHeight : "100%",
                scrolling : false,
                fadeOut : 500,
                html : "<div role='dialog' aria-modal='true' aria-label='sweet rewards program' style='padding-right:10px;'><ul><center><img width='150px' height='100px' src='//cdn-tp1.mozu.com/9046-m1/cms/files/sweet_rewards_3.png' alt='Jelly Belly Sweet Rewards Program'/></center><br>Earn coupons and special perks just for buying Jelly Belly items <br>by joining our Sweet Rewards customer loyalty program! <br>Click <a title='Jelly Belly Sweet Rewards Program page' href='https://www.jellybelly.com/jelly-belly-sweet-rewards'>here</a> for more info.</ul></div>",
                overlayClose : true,
                trapFocus: false,
                onComplete : function () {
                    $('#cboxClose').css({ 'background-image': 'url("/resources/images/icons/close-popup.png")' });
                    $('#cboxClose').fadeIn();
                    $('#cboxLoadedContent').css({
                        background : "#ffffff"
                    });
                    $('#cboxClose').focus();
                    focusLoop();
                },
                onClosed: function(){
                    me.focus();
                }
            });
        });
      
        var flag = window.flag = true;
        var guestLoginWithExistingAccount = window.guestLoginWithExistingAccount = false;
        if($(".popupmodal").length > 0 && !Hypr.getThemeSetting('disableCheckoutModal')){
            var getguest= $.cookie('guest');
            window.checkoutEmail = false;
            if(getguest) { 
                $(".popupmodal").hide();  
                if(window.innerWidth <= 1024 && window.innerWidth > 767){
                    $('#checkout-form').show();
                    $('#checkout-rightcol').show();
                    $('.checkout-header').show();
                    $('.jb-socialize').show();
                    $('.jb-footer-dpzone').show(); 
                }
                window.checkoutEmail = true;  
            }
            else{
                $("#checkoutmodal").show();
                if(window.innerWidth <= 1024 && window.innerWidth > 767){
                    $('#checkout-form').hide();
                    $('#checkout-rightcol').hide();
                    $('.checkout-header').hide();
                    $('.jb-socialize').hide();
                    $('.jb-footer-dpzone').hide(); 
                }
                window.checkoutEmail = true;  
                $('.popupmodal').css('background','transparent'); 
                $('#email-dialog').focus(); 
            } 
        }
        $(document).on('click',function(){
            window.flag = false; 
        });
        $(document).bind("paste",function(e) {
            if($(e.target).hasClass('cvvcodeinput')){    
                e.preventDefault();
            }
        });  
         /*$(document).on('click',function(e){
            if($('.inpit-select').hasClass('active')  && !($(e.target).hasClass('inpit-select') || $(e.target).parent().hasClass('inpit-select')) ){ 
                $('.select-li').slideUp();
                $('.inpit-select').addClass('inactive'); 
                $('.inpit-select').removeClass('active'); 
            }
        });  */
        $(document).on('keypress keyup','.cvvcodeinput',function(e){       
            var value = $(this).val(); 
            if(value.length < 4){  
                if((e.which >= 48 && e.which <= 57) || e.which === 8){           
                     
                }else{
                    e.preventDefault();         
                }
            }else{
                if(e.which != 8){
                    e.preventDefault();   
                }
            }
        });
        $("#checkoutmodal").on('click',function(){
            window.location.replace("/cart"); 
            // $(this).children(".wrapper_email").toggle(); 
        }).on('click','.wrapper_email',function(e) { 
            e.stopPropagation();
        });   
        var $checkoutView = $('#checkout-form'),
            checkoutData = require.mozuData('checkout');
        var checkoutModel = window.order = new CheckoutModels.CheckoutPage(checkoutData),
            checkoutViews = {
                parentView: new ParentView({
                  el: $checkoutView,
                  model: checkoutModel
                }),
                steps: {
                    shippingAddress: new ShippingAddressView({
                        el: $('#step-shipping-address'),
                        model: checkoutModel.get("fulfillmentInfo").get("fulfillmentContact")
                    }),
                    shippingInfo: new ShippingInfoView({
                        el: $('#step-shipping-method'),
                        model: checkoutModel.get('fulfillmentInfo')
                    }),
                    paymentInfo: new BillingInfoView({
                        el: $('#step-payment-info'),
                        model: checkoutModel.get('billingInfo')
                    })
                },
                orderSummary: new OrderSummaryView({
                    el: $('#order-summary'),
                    model: checkoutModel
                }),
                couponCode: new CouponView({
                    el: $('#coupon-code-field'),
                    model: checkoutModel
                }),
                // comments: Hypr.getThemeSetting('showCheckoutCommentsField') && new CommentsView({
                comments: new CommentsView({
                    el: $('#comments-field'),
                    model: checkoutModel
                }),
                reviewPanel: new ReviewOrderView({
                    el: $('#step-review'),
                    model: checkoutModel
                }),
                messageView: messageViewFactory({
                    el: $checkoutView.find('[data-mz-message-bar]'),
                    model: checkoutModel.messages
                })
            };
        window.checkoutViews = checkoutViews;
        window.paymentinfo =  window.checkoutViews.steps.paymentInfo;
        window.couponCode = window.checkoutViews.couponCode;
        window.checkoutViews.comments.render();
        checkoutModel.on('complete', function() {
            CartMonitor.setCount(0);
            window.location = "/checkout/" + checkoutModel.get('id') + "/confirmation";
        });

        $('input[name="shippingphone"]').mask("(999) 999-9999");
        var $reviewPanel = $('#step-review');
        checkoutModel.on('change:isReady',function (model, isReady) {
            if (isReady) {
                setTimeout(function () { window.scrollTo(0, $reviewPanel.offset().top); }, 750);
            }
        });

        _.invoke(checkoutViews.steps, 'initStepView');

        $checkoutView.noFlickerFadeIn();
        
        // shipping address keyboard interactions
        $(document).on('keydown', '.mz-contactselector-contact input[type="radio"]', function(e) {
            if(e.keyCode == 40 || e.keyCode == 39) {
                e.preventDefault();	
                if($(this).parents('.mz-contactselector-contact').next().hasClass('mz-contactselector-contact')) {
                    $(this).parents('.mz-contactselector-contact').next().focus();
                }else {
                    $(this).parents('.mz-contactselector-contact').nextAll('.mz-contactselector-contact').first().focus();
                }
            }
            else if(e.keyCode == 37 || e.keyCode == 38) {
                e.preventDefault();	
                if($(this).parents('.mz-contactselector-contact').prev().hasClass('mz-contactselector-contact')) {
                    $(this).parents('.mz-contactselector-contact').prev().focus();
                }
                else {
                    $(this).parents('.mz-contactselector-contact').prevAll('.mz-contactselector-contact').first().focus();
                }
            }
            if(e.keyCode == 13) {
                e.preventDefault();
                $(this).trigger('click');
            }
        
        });
        
        // shipping method keyboard interactions
        $(document).on('keydown', 'input[data-mz-shipping-method]', function(e) {
            if(e.keyCode == 40 || e.keyCode == 39) {
                e.preventDefault();	
                if($(this).parents('div').next().find('input[data-mz-shipping-method]')) {
                    $(this).parents('div').next().find('input[data-mz-shipping-method]').focus();
                }
            }
            else if(e.keyCode == 37 || e.keyCode == 38) {
                e.preventDefault();	
                if($(this).parents('div').prev().find('input[data-mz-shipping-method]')) {
                    $(this).parents('div').prev().find('input[data-mz-shipping-method]').focus();
                }
            }
            if(e.keyCode == 13 || e.keyCode == 32) {
                $(this).trigger('click');
                e.preventDefault();
            }
        });
        
        
        $(document).on('keypress', '.mz-contactselector-contact.mz-contactselector-new input', function(e) {
            if(e.keyCode == 13) {
                e.preventDefault();
                if($(this).parent().next().find('input#companyname'))
                    $(this).parent().next().find('input#companyname').focus();
            }
        });
        
        $(document).on('keypress', '#coupon-code', function (e) {
            
                        if (e.which === 13) {
                            e.preventDefault();
                         return false;
                        }
                    });
        $(document).on('click','#copyshipping',function(e){
            setTimeout(function(){
                $('#copyshipping').focus();
            }, 700);
            /*if(!($(this).parents().hasClass('paypal-next'))){
                $(this).focus(); 
                //$("html, body").animate({scrollTop:  $(e.target)[0].offsetTop }, 300);
            }*/
        });
        $(document).on('keypress','#copyshipping',function(e) { //keypress for copy from shipping button
            if(e.keyCode == 32 || e.keyCode == 13) {
                e.preventDefault();
                $(this).trigger('click');
                $(this).focus();
         /*
                if($('.mz-l-formfieldgroup-address').find('.mz-addressform-companyname').filter(':visible').length > 0) {
                    $(this).focus();
                    //$('.mz-l-formfieldgroup-address').find('.mz-addressform-companyname').focus();
                    e.preventDefault();
                }
                else {
                    $(this).focus();
                    e.preventDefault();
                }*/
                
                
            }
        });
        $(document).on('change','#submitorder-cpp-checkbox', function() {
            if (this.checked) {
            $('.brontocart-place-order').prop('disabled',false);
            }else{
            $('.brontocart-place-order').prop('disabled',true);
            }
        });
        /*$(document).on('keydown','.inpit-select', function(e) { //keypress for payment type option opening
            //var allowEsc = window.allowEsc = false;
            if($(this).hasClass('inactive')) {
                if(e.keyCode == 13 || e.keyCode == 40 || e.keyCode == 32) {
                    e.preventDefault();
                    $(this).trigger('click');
                    //window.allowEsc = true;
                }
                if(e.keyCode == 9 && !e.shiftKey) {
                    if($('.mz-payment-select-saved-payments').length > 0) {
                        $('.mz-payment-select-saved-payments').focus();
                        e.preventDefault();
                    }
                    else if($('#mz-payment-credit-card-type').length > 0) {
                        $('#mz-payment-credit-card-type').focus();
                        e.preventDefault();
                    }
                    else if($('#copyshipping').length > 0) {
                        $('#copyshipping').focus();
                        e.preventDefault();
                    }
                    
                    else {
                        if($(this).parents('.mz-checkoutform-paymentinfo').find('.checkout-btn').filter(':visible').length > 0){
                            $(this).parents('.mz-checkoutform-paymentinfo').find('.checkout-btn').filter(':visible').focus();
                            e.preventDefault();       
                        } 
                    } 
                }
            }
            else if($(this).hasClass('active')) { 
                if(e.keyCode == 27) {
                    e.preventDefault();
                    $(this).trigger('click');
                }
                
                if(e.keyCode == 40) {
                    $('.select-li')[0].focus();
                    e.preventDefault();
                }
                
                
            }
        });*/
        
        /*$(document).on('keydown','.select-li', function(e) { //keypress for payment type option selection
            if(e.keyCode == 9 || e.keyCode == 13 || e.keyCode == 32) {
                e.preventDefault();
                $(this).trigger('click');
                //$(this).parent().prev().focus();
                window.paymentTypeFlag = true;
            }
            else if(e.keyCode == 40) {
                e.preventDefault();
                if($(this).next().length > 0)
                    $(this).next().focus();
            }
            else if(e.keyCode == 38) {
                e.preventDefault();
                if($(this).prev().length > 0)
                    $(this).prev().focus();
            }
        });

        $(document).keyup(function(e) { //keypress for payment type option opening
             if ( $('.inpit-select').hasClass('active')  && !($(e.target).hasClass('inpit-select') || $(e.target).parent().prev().hasClass('inpit-select')) ) {
                $('.select-li').slideUp();
                $('.inpit-select').addClass('inactive'); 
                $('.inpit-select').removeClass('active'); 
            }
        });*/
        
        $(document).on('click','.mz-shipmethod',function(e){
            setTimeout(function(){
                if($('[data-mz-validationmessage-for="shippingMethodCode"]').text().length > 0){
                    $('[data-mz-validationmessage-for="shippingMethodCode"]').focus();
                } else {
									$('html, body').animate({
											//scrollTop: $('#step-payment-info').offset().top - 30 //#DIV_ID is an example. Use the id of your destination on the page
											scrollTop: $('#step-shipping-method').offset().top - 30
									}, 'fast'); 
                    $("#coupon-code").show(); // .focus();
                    // setTimeout(function(){
                    //     $('#coupon-code-field').find('#coupon-code').focus();
                    //     $('html, body').animate({
                    //         scrollTop: $('#coupon-code-field').offset().top - 50 //#DIV_ID is an example. Use the id of your destination on the page
                    //     }, 'fast'); 
                    // },1000);   
                }                
            },1000);
            
            if($('.mz-checkoutform-shippingaddress').hasClass('is-complete') && $('input[name="shippingMethod"]:checked').length > 0){
                $("#coupon-code-field").show();
                $('#step-payment-info').addClass('is-incomplete');
                $('#step-payment-info').find('.mz-formstep-body').css('display','block');
            } else {
                $("#coupon-code-field").hide();
            }
        });
        $(document).on('click','.mz-digital-gift-card-product',function(e){
            $("#coupon-code-field").show();
            $("#coupon-code").show().focus();
        });
        if($('.mz-checkoutform-shippingmethod').hasClass('is-complete')){
            $("#coupon-code-field").show();    
        } 
        $(document).on('change', 'input[data-mz-shipping-method]' ,function(){ 
            // $("#coupon-code-field").show();
            //$('.mz-formstep-next').find('.mz_date_value2').focus();
        });
        $(document).on('keydown', '#newaccountpassword', function(e) {
             if (e.keyCode == 32) return false;
        });
         $(document).on('keydown', '#confirmpassword', function(e) {
             if (e.keyCode == 32) return false;
        });
//      checkoutViews.steps.shippingInfo.updateFreeShippingDisplays();
        
        _.defer(_.bind(checkoutViews.steps.shippingInfo.updateFreeShippingDisplays, checkoutViews.steps.shippingInfo));
        
       /* if (checkoutModel.hasHeatSensitiveItemsByCategory()  && Hypr.getThemeSetting('showHeatSensitiveText')) {
            $('#heat-warning').css({ display: "block" });
            $('#hide-from-heat-sensitive').css({ display: "none" });
        }*/
        
        checkoutModel.commentsReformatted = "";
        
        
         /*$("#guest_email").on('focusin',function(){
                 $('#guest_addbutton').addClass('active-button').removeAttr('disabled');  
            });*/
       //auto fill button enable//
       /*$("#email").change(function(){
               if($(this).val()!== '') {
                 $('#addbutton').addClass('active-button').removeAttr('disabled');  
                }
            });*/ 
       //end//
            if($('.mz-date-val').children('.mz-ship-date').attr('data-shipdate')){
               window.checkoutViews.steps.shippingInfo.ShippingValue();
            }

        
        // Guest Login/create account during payment
        /* ADA focus loop */
        function keepFocusWithinModal($target, $container) {
          var notifyinputs = $(document).find($container).find('select, input, textarea, button, a').filter(':visible');
          var firstInput = notifyinputs.first();
          var lastInput = notifyinputs.last();
          firstInput.on('keydown', function(e) {
            if ((e.which === 9 && e.shiftKey)) {
              e.preventDefault();
              lastInput.focus();
            }
          });

          lastInput.on('keydown', function(e) {
            if ((e.which === 9 && !e.shiftKey)) {
              e.preventDefault();
              firstInput.focus();
            }
          });
        }

        // Show/Hide guestcheckoutmodal /** Vignesh changes **/
        function modalAriaFix(ariaVal) {
          $('.jb-footer-dpzone').attr('aria-hidden',ariaVal);
          $('.jb-socialize').attr('aria-hidden',ariaVal);
          $('#checkout-rightcol').attr('aria-hidden',ariaVal);
          $('.checkout-header').attr('aria-hidden',ariaVal);
          $('#checkout-form').attr('aria-hidden',ariaVal);
          $('.notification-dropzone').attr('aria-hidden',ariaVal);
          $('.jb-mobile-logo').attr('aria-hidden',ariaVal);
          $('.skipto').attr('aria-hidden',ariaVal);
        }

        var focusElonClose = window.focusElonClose;
        $(document).on("click", ".open-guestcheckoutmodal-modal",function(ev){
          window.guestLoginWithExistingAccount = true;
          window.focusElonClose = ev.target;
          $("body").css({"overflow":"hidden"});
          $(".popupmodal2").show();
          $("#guestcheckoutmodal").show();
          if($(ev.target).text() == "Account") {
            $("#guestcheckoutmodal").find(".labelmodel").removeClass("active");
            $("#guestcheckoutmodal").find(".labelmodel").first().addClass("active");
            $("#guestcheckoutmodal").find(".form-content").removeClass("active");
            $("#guestcheckoutmodal").find(".form-content").first().addClass("active");
          }
          else if($(ev.target).text() == "Login") {
            $("#guestcheckoutmodal").find(".labelmodel").removeClass("active");
            $("#guestcheckoutmodal").find(".labelmodel").last().addClass("active");
            $("#guestcheckoutmodal").find(".form-content").removeClass("active");
            $("#guestcheckoutmodal").find(".form-content").last().addClass("active");
          }
          $("#guestcheckoutmodal").find(".close-icon a").focus();
          $(".popupmodal2").css("overflow","auto");
          keepFocusWithinModal('.popupmodal2 #email-dialog','.popupmodal2 #email-dialog');
          modalAriaFix('true');
        });

        $("#guestcheckoutmodal .user-login, #guestcheckoutmodal .guest-login, #guestcheckoutmodal .mz-signup-register, .addbutton-alt-class").on("click", function(){
          setTimeout(function(){
            keepFocusWithinModal('.popupmodal2 #email-dialog','.popupmodal2 #email-dialog');
          }, 700);
        });

        $(document).find("#guestcheckoutmodal").find(".close-icon").on("click", function(){
          $("body").css({"position":"static","overflow":"auto"});
          $("#guestcheckoutmodal").hide();
          $(".popupmodal2").hide();
          modalAriaFix('false');
          window.focusElonClose.focus();
        });

        $("#guestcheckoutmodal").find('input[type="submit"].addbutton-alt-class').on("click", function() {
          $("#email").val($(this).parents("form").find("#email").val());
          $("#password").val($(this).parents("form").find("#password").val());
        });

        $(".signup-form").find("input#pswd").on("focus", function() {
          $(".pwd-message-desktop").show();
        });
        $(".signup-form").find("input#pswd").on("blur", function() {
          $(".pwd-message-desktop").hide();
        });

        //user Email
        var ChekoutEmailView = {
            logKey:function(){
                var value=$.trim($("#email").val());
                var passvalue = $.trim($("#password").val());
                 if( value.length > 0 && passvalue.length > 0){ 
                     $('#addbutton').addClass('active-button'); 
                 }
                 else{
                     //$('#addbutton').removeClass('active-button');     
                 }
                
                var guestvalue = $.trim($("#guest_email").val());
                if( guestvalue.length > 0){ 
                    $('#guest_addbutton').addClass('active-button');    
                }else{ 
                    //$('#guest_addbutton').removeClass('active-button');  
                    //$('#guest_addbutton').attr('disabled','disabled');  
                }
                  
            },
            loginCheckout: function(e){
                e.preventDefault();
                var valid = this.validData();
                var currentUser = require.mozuData("user");
                if(valid && currentUser.isAnonymous){
                     window.showGlobalOverlay();
                    api.action('customer', 'loginStorefront', {
                        email: $('.login_submit-l .user-email').val(),
                        password: $('.login_submit-l .user-password').val()
                    }).then(this.loginProcess, this.LoginErrorMessage);
                    setTimeout(function(){ window.scrollTo(0, -5000);},300);
                } 
            },
            guestCheckout: function(e){
                e.preventDefault();
                this.validGuest();
                var valid=this.validGuest();
                if(valid === false){
                    $('.error-guest').text(Hypr.getThemeSetting('validEmialSignUp'));
                    $('.error-guest').prev('input').focus();  
                }else{
                 this.guest = $('.guest-email').val();
                 $.cookie('guest', $('.guest-email').val());
                    $('.popupmodal').hide(); 
                        if(window.innerWidth <= 1024 && window.innerWidth > 767){
                        $('#checkout-form').show();
                        $('#checkout-rightcol').show();
                        $('.checkout-header').show();
                        $('.jb-socialize').show(); 
                        $('.jb-footer-dpzone').show();   
                    }
                    $(document).find('.checkout-header').find('.mz-pagetitle a').focus(); 
                     
                    if(window.checkoutEmail){
                        $('#billing-email').val( $.cookie('guest')); 
                        $('#billing-email').blur();
                    }
                }
                
                if($('#accept').is(':checked')){
                    window.checkoutViews.steps.paymentInfo.model.set("acceptsMarketing",true);
                    window.checkoutViews.steps.paymentInfo.updateAcceptsMarketing(e);
                    if(window.checkoutViews.steps.paymentInfo.model.get("acceptsMarketing")){
                       $('#news').attr('checked',true);
                       $('.marketing').hide();
                    }
                    var br_email = $('#guest_email').val(), br_phone = ''; 

                    br_email = br_email.length === 0? (br_phone + '-phone-only@jellybelly.com') : br_email;
                    
                    $('body').append('<img src="https://bm5150.com/public/?q=direct_add&fn=Public_DirectAddForm&id=bcmeoxwnoqonwvrsmbhtyrfqskopbjp&email='+br_email+'&list1=0bd903ec000000000000000000000017579c" width="0" height="0" border="0" alt=""/>');
                }
               setTimeout(function(){ window.scrollTo(0, -5000);},300); 
            },
            LoginErrorMessage: function(){
                 window.hideGlobalOverlay();
                $('.loginError').text(Hypr.getLabel('loginFailedMessage',$("#email").val()));
                $('.loginError').prev('input').focus(); 
            },
            loginProcess: function(e){
              window.hideGlobalOverlay();
              if(!window.guestLoginWithExistingAccount) {
                window.location.href = window.location.pathname+"?cl=ml";
              }
              else {
                window.location.href = window.location.pathname+"?cl=returningUser";
              }
            },
            validGuest: function(){
                var validity = true;
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                var patt = new RegExp(re);
                if( $('.guest-email').val().length === 0){
                     $('.guest-email').css({'border':'1px solid #e9000f'});
                    validity = false;
                }else if(patt.test($('.guest-email').val())){
                     $('.guest-email').css({'border':'1px solid #c2c2c2'});    
                }else{
                     $('.guest-email').css({'border':'1px solid #e9000f'});
                    validity = false;
                }
                return validity;
            },
            validData: function(){
                var validity = true;
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                var patt = new RegExp(re);
                var parentEle = "";
                if($("#guestcheckoutmodal").is(":visible")) 
                {
                    parentEle = "#guestcheckoutmodal ";
                }
                else {
                    parentEle = "#checkoutmodal ";
                }
                if( $(parentEle+'.user-email').val().length === 0){
                     $(parentEle+'.user-email').css({'border':'1px solid #e9000f'});
                     $(parentEle+'.error-user').text(Hypr.getThemeSetting('validEmialSignUp'));
                     $(parentEle+'.error-user').prev('input').focus();
                    validity = false;
                }else if(patt.test($(parentEle+'.user-email').val())){
                     $(parentEle+'.user-email').css({'border':'1px solid #c2c2c2'});
                     $(parentEle+'.error-user').text('');
                }else{
                     $(parentEle+'.user-email').css({'border':'1px solid #e9000f'});
                     $(parentEle+'.error-user').text(Hypr.getThemeSetting('validEmialSignUp'));
                     $(parentEle+'.error-user').prev('input').focus();
                    validity = false;
                }
                if( $(parentEle+'.user-password').val().length === 0){
                    $(parentEle+'.user-password').css({'border':'1px solid #e9000f'});     
                    validity = false;
                }else{ 
                    $(parentEle+'.user-password').css({'border':'1px solid #c2c2c2'});    
                }
                return validity; 
            },
            switchmodelcontent: function(e){
                $('.labelmodel').removeClass('active');
                $(e.currentTarget).addClass('active');
                $('.form-content').removeClass('active');
                $('.'+$(e.currentTarget).attr('attr-data')).addClass('active');
                $('.'+$(e.currentTarget).attr('attr-data')).find('input').first().focus();
                // ADA changes 
                ChekoutEmailView.activateloopinginmodal();
            },
            activateloopinginmodal: function(){
                window.inputs = $(document).find('#email-dialog').find('select, input, textarea, button, a, .labelmodel').filter(':visible');
                window.firstInput = window.inputs.first();
                window.lastInput = window.inputs.last(); 
                
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
        };
     
        $(document).on('keydown','#bypassNotification', function(e) {
            if($('#bypassNotification').length > 0) {
                if(e.keyCode == 9 && !e.shiftKey) {
                    e.preventDefault();
                    $('#bypassButton').focus();
                }
            }
        });
        
        $(document).on('click','#bypassButton',function(e){
            window.byPassFlag = true;
        });
        
        $(document).on('keydown','#bypassButton',function(e){
            if(e.keyCode == 13 || e.keyCode == 32) {
               window.byPassFlag = true;
            }
        });
        
        $(document).on('click',' [data-mz-action="edit"]',function(e){
            window.editAction = true;
            window.selectedEdit = $(this).attr('id');
        });
        
        $(document).on('keydown',' [data-mz-action="edit"]',function(e){
            if(e.keyCode == 13 || e.keyCode == 32) {
              window.editAction = true;
                window.selectedEdit = $(this).attr('id');
            }
        });
    
       
        $('.labelmodel').on('click',function(e){
            ChekoutEmailView.switchmodelcontent(e); 
        });
        $('.labelmodel').on('keydown',function(e){
            if(e.whick == 13 || e.which == 32){
                e.preventDefault();
                ChekoutEmailView.switchmodelcontent(e); 
            }
        });
        $('.login_submit').find('#email').on('keyup',function(){
            ChekoutEmailView.logKey();
        });
        
        $('.guest_submit').find('#guest_email').on('keyup',function(){
             ChekoutEmailView.logKey();     
        });
        
        $('.guest_submit').on('submit',function(e){
            ChekoutEmailView.guestCheckout(e);
        }); 
        
       /* $('.login_submit,.login_submit,.login_submit-l').on('submit',function(e){
            if($("#guestlogin-cpp-checkbox").is(":checked")){
                ChekoutEmailView.loginCheckout(e);
            }
            else{
                e.preventDefault();
                e.stopPropagation();
            }
        });*/
        
        $('.cpp-loginpopup').on('click',function(e){ 
            if(window.guestlogincppcheckboxChecked){
                ChekoutEmailView.loginCheckout(e);
            }
            else{
                e.preventDefault();
                e.stopPropagation();
            }
        });
        $(document).on('focus','#toolTipStock', function(e) { 
            $(this).next().addClass('cc-tooltip');
        });
        
        $(document).on('blur','#toolTipStock', function(e) { 
            $(this).next().removeClass('cc-tooltip');
        });
        
        $(document).on('focus','[aria-describedby="saved-card-tooltip"]',function(e) {
            $(this).nextAll('#saved-card-tooltip').addClass('show');
        });
        $(document).on('blur','[aria-describedby="saved-card-tooltip"]',function(e) {
            $(this).nextAll('#saved-card-tooltip').removeClass('show');
        });
        
       
        var inputs = window.inputs ;
        var firstInput = window.firstInput ;
        var lastInput = window.lastInput ;
        ChekoutEmailView.activateloopinginmodal();
			
				$(document).on('click', 'span.mz-paymenttype-label',
					function(e){
						window.paymentTypeChosen = '';
						if ($(this).hasClass('mz-paymenttype-label-creditcard'))
							window.paymentTypeChosen = "creditcard";
						else if ($(this).hasClass('mz-paymenttype-label-check'))
							window.paymentTypeChosen = "paypal";
				});
    });
});
