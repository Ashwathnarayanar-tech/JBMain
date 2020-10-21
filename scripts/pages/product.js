// Made chages for Read Review By Amit on 25June from line 242 to 259 
require(["modules/jquery-mozu", "modules/api",
"underscore", "hyprlive", "modules/backbone-mozu", 
"modules/cart-monitor", "modules/models-product", "modules/views-productimages", 
'modules/minicart', "modules/models-cart",
"modules/jquery-dateinput-localized",
"shim!vendor/owl.carousel[jquery=jQuery]>jQuery",
"vendor/jquery-ui.min"],
function ($, Api, _, Hypr, Backbone, CartMonitor, ProductModels, ProductImageViews, MiniCart, CartModels) {

    var user = require.mozuData('user'); 
    var ProductView = Backbone.MozuView.extend({ 
        templateName: 'modules/product/product-detail', 
        autoUpdate: ['quantity'], 
        additionalEvents: {
            "change [data-mz-product-option]": "onOptionChange",
            "blur [data-mz-product-option]": "onOptionChange",
            "click .more-info":"scrollToProductDetails",
            "click .sweet-rewards-pdp":"sweetRewards",
            "change #subscribe" : "showHideContent",
            "click .subscribe-now" : "subscribeNow",
            "click .subscription-list": "subscriptionList",
            "click .span-tabs" : "changeWeekorMonth",
            "click .tabitem" : "checngetab",
            "change #guestsignup-cpp-checkbox" : "enablesignupbutton",
            "change #guestlogin-cpp-checkbox" : "enableloginbutton",
            "click .closepopup" : "closeSignupPopup",
            "click .cpp-loginpopup" : "login",
            "change .how-long-val" :"setHowLongVal",
            "change .how-often-val" :"setHowOffenVal",
            "click #signup-submit":"signupSubmit"
        },
        login: function(e){
            e.preventDefault();
            var valid = this.validData();
            var currentUser = require.mozuData("user");
            if(valid && currentUser.isAnonymous){
                Api.action('customer', 'loginStorefront', {
                    email: $('.user-email').val(),
                    password: $('.user-password').val()
                }).then(
                this.loginProcess(window.loginFlag), this.LoginErrorMessage);

                setTimeout(function(){ window.scrollTo(0, -5000);},300);
            } 
        },
        validData: function(){
            var validity = true;
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var patt = new RegExp(re);
            if($('.user-email').val().length === 0){
                 $('.user-email').css({'border':'1px solid #e9000f'});
                 $('.error-user').text(Hypr.getThemeSetting('validEmialSignUp'));
                 $('.error-user').prev('input').focus();
                validity = false;
            }else if(patt.test($('.user-email').val())){
                 $('.user-email').css({'border':'1px solid #c2c2c2'});
                 $('.error-user').text('');
            }else{
                 $('.user-email').css({'border':'1px solid #e9000f'});
                 $('.error-user').text(Hypr.getThemeSetting('validEmialSignUp'));
                 $('.error-user').prev('input').focus();
                validity = false;
            }
            if( $('.user-password').val().length === 0){
                $('.user-password').css({'border':'1px solid #e9000f'});     
                validity = false;
            }else{ 
                $('.user-password').css({'border':'1px solid #c2c2c2'});    
            }
            return validity; 
        },
        loginProcess: function(subVal){
            setTimeout(function(){
                if(subVal == "subscribeNow"){
                    window.location.href = window.location.pathname+"?subscribeNow=true";
                }else{
                    window.location.href = window.location.pathname+"?subscribeList=true"; 
                }
            },2000);
            
        },
        LoginErrorMessage: function(){
            $('.loginError').text(Hypr.getLabel('loginFailedMessage',$("#email").val()));
            $('.loginError').prev('input').focus(); 
        },
        closeSignupPopup : function(){
            this.model.get('subscriptionData').singnupopoup.isEnabled = false;
            this.render();
        },
        enableloginbutton : function(e){
            if($(e.target).is(':checked')){
                $('.cpp-loginpopup').attr("disabled", false);
            }else{
                $('.cpp-loginpopup').attr("disabled", true);
            }
        },
        enablesignupbutton : function(e){
            if($(e.target).is(':checked')){
                $('.mz-signup-register').attr("disabled", false);
            }else{
                $('.mz-signup-register').attr("disabled", true);
            }
        },
        signupSubmit:function(){
            var self = this,
                email = $('[data-mz-signup-emailaddress]').val(),
                firstName = $('[data-mz-signup-firstname]').val(),
                lastName = $('[data-mz-signup-lastname]').val(),
                payload = {
                    account: {
                        emailAddress: email,
                        userName: email,
                        firstName: firstName,
                        lastName: lastName,
                        contacts: [{
                            email: email,
                            firstName: firstName,
                            lastNameOrSurname: lastName
                        }]
                    },
                    password: $('[data-mz-signup-password]').val()
                };
            if (this.signupvalidData()) {
                //var user = api.createSync('user', payload);
                //this.setLoading(true);
                return Api.action('customer', 'createStorefront', payload).then(function () {
                    window.location.reload();
                }, self.displayApiMessage);
            }
        },
        signupvalidData: function(){
            var validity = true;
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var patt = new RegExp(re);
            if($('[data-mz-signup-firstname]').val().length === 0){
               $('[data-mz-signup-firstname]').css({'border':'1px solid #e9000f'});
                validity = false;
                $('[data-mz-role="mz-signup-register-message"]').text('Error: Please provide your First Name.');
                return false;
            }else{
                $('[data-mz-signup-firstname]').css({'border':'1px solid #c2c2c2'});
            }
            if($('[data-mz-signup-lastname]').val().length === 0){
                $('[data-mz-signup-lastname]').css({'border':'1px solid #e9000f'});
                validity = false;
                $('[data-mz-role="mz-signup-register-message"]').text('Error: Please provide your Last Name.');
                return false;
            }else{
                $('[data-mz-signup-lastname]').css({'border':'1px solid #c2c2c2'});
            }
            if($('[data-mz-signup-emailaddress]').val().length === 0){
                $('[data-mz-signup-emailaddress]').css({'border':'1px solid #e9000f'});
                validity = false;
                $('[data-mz-role="mz-signup-register-message"]').text("Error: Please provide your Email Address.");
                return false;
            }else if(patt.test($('[data-mz-signup-emailaddress]').val())){
                $('[data-mz-signup-emailaddress]').css({'border':'1px solid #c2c2c2'});
            }else{
                $('[data-mz-signup-emailaddress]').css({'border':'1px solid #e9000f'});
                validity = false;
                $('[data-mz-role="mz-signup-register-message"]').text("Error: Please enter a valid Email Address and Password combination. Make sure you include the '@' and the '.' in the Email Address and that your Password has a minimum of 6 characters with at least 1 number and 1 alphabetic character.");
                return false;
            }
            if($('[data-mz-signup-password]').val().length === 0){
                $('[data-mz-signup-password]').css({'border':'1px solid #e9000f'});
                validity = false;
                $('[data-mz-role="mz-signup-register-message"]').text('Error: Password must be a minimum of 6 characters with at least 1 number and 1 alphabetic character.');
                return false;
            }else{
                $('[data-mz-signup-password]').css({'border':'1px solid #c2c2c2'});
               
                
            }
            if($('[data-mz-signup-confirmpassword]').val().length === 0){
                $('[data-mz-signup-confirmpassword]').css({'border':'1px solid #e9000f'});
                validity = false;
                $('[data-mz-role="mz-signup-register-message"]').text('Error: Provide both password. Password must be a minimum of 6 characters with at least 1 number and 1 alphabetic character.');
                return false;
            }else{
                $('[data-mz-signup-confirmpassword]').css({'border':'1px solid #c2c2c2'});
            }
            // var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
            if($('[data-mz-signup-confirmpassword]').val() != $('[data-mz-signup-password]').val()){
                validity = false;
                $('[data-mz-role="mz-signup-register-message"]').text('Error: Password doesn\'t match. Password must be a minimum of 6 characters with at least 1 number and 1 alphabetic character.');
                return false;
            }
            
            return validity;
        },
        displayApiMessage:function(xhr){
            $('[data-mz-role="mz-signup-register-message"]').text(xhr.message); 
            console.log(xhr);
        },
        checngetab : function(e){
            this.model.get('subscriptionData').singnupopoup.signup = $(e.target).attr('data-mz-data') == "signup" ? true : false;
            this.model.get('subscriptionData').singnupopoup.login = $(e.target).attr('data-mz-data') == "login" ? true : false;
            this.render(); 
        },
        changeWeekorMonth : function(e){
            $(e.target).attr('data-mz-value');
            this.model.get('subscriptionData').Data.weeks = $(e.target).attr('data-mz-value') == "weeks" ? true : false;
            this.model.get('subscriptionData').Data.months = $(e.target).attr('data-mz-value') == "months" ? true : false;
            this.render();   
        },
        subscriptionList: function(e){
            if(require.mozuData('user').isAnonymous){
                window.loginFlag  = "subscriptionList";
                this.model.get('subscriptionData').singnupopoup.isEnabled = true;
                this.render();
            }else{
                this.model.get('subscriptionData').Data.qty = $(document).find('.quantity-sub').val();
                this.model.get('subscriptionData').Data.howOften = $(document).find('.how-often-val').val();
                this.model.get('subscriptionData').Data.weeks = $(document).find('.span-tabs.week').hasClass("active");
                this.model.get('subscriptionData').Data.months = $(document).find('.span-tabs.months').hasClass("active");
                this.model.get('subscriptionData').Data.when = $(document).find('#interval-startdate').val();
                this.model.get('subscriptionData').Data.howLong = $(document).find('.how-long-val').val();
                var popupData = {
                    "isEnabled" : true,
                    "message" : "You can subscribe to this item (and others) to get regular deliveries on your own schedule! Click below to start the process.",
                    "buttons" : [
                        {
                            "buttonLabel" : "Cancel",
                            "action" : "closePopup",
                            "class" : "cancel"   
                        },
                        {
                            "buttonLabel" : "Get Started",
                            "action" : "getStarted",
                            "class" : "Get-Started"
                        }
                    ]
                };
                this.model.get('subscriptionData').popupData = popupData;
                this.render();     
            }
        },
        redirectTosubCheckout: function(e){
            var cartModel = new CartModels.Cart(), self = this;
            try{
                cartModel.apiGet().then(function(cart) {
                    console.log('cart',cart); 
                    cartModel.apiCheckout().then(function(cartId) {
                        console.log('cartId',cartId);
                        window.location.href = "/checkout/" + cartId.data.id + "?chktSub=true";
                    }, function(err) {
                        console.warn(err);
                    });
                }, function(err) {
                    console.log("cart error" + err);
                });
            }catch (err) { 
                console.warn(err);
            }
        },
        getStarted : function(){
            var self = this;
            this.model.get('subscriptionData').Data.qty = $(document).find('.quantity-sub').val();
            this.model.get('subscriptionData').Data.howOften = $(document).find('.how-often-val').val();
            this.model.get('subscriptionData').Data.weeks = $(document).find('.span-tabs.week').hasClass("active");
            this.model.get('subscriptionData').Data.months = $(document).find('.span-tabs.months').hasClass("active");
            this.model.get('subscriptionData').Data.when = $(document).find('#interval-startdate').val();
            this.model.get('subscriptionData').Data.howLong = $(document).find('.how-long-val').val();
            // $.cookie("subscriptionCreated", true);
            $.cookie("subscriptionData", JSON.stringify(this.model.get('subscriptionData').Data));
            setTimeout(function(){
                window.location.href = window.location.origin+"/subscription?productCode="+self.model.get('productCode')+"&qty="+$(document).find('.quantity-sub').val();
            },500);            
        },
        subscribeNow : function(e){
            if(require.mozuData('user').isAnonymous){
                window.loginFlag  = "subscribeNow";
                this.model.get('subscriptionData').singnupopoup.isEnabled = true;
                this.render();
            }else{
                this.model.get('subscriptionData').Data.qty = $(document).find('.quantity-sub').val();
                this.model.get('subscriptionData').Data.howOften = $(document).find('.how-often-val').val();
                this.model.get('subscriptionData').Data.weeks = $(document).find('.span-tabs.week').hasClass("active");
                this.model.get('subscriptionData').Data.months = $(document).find('.span-tabs.months').hasClass("active");
                this.model.get('subscriptionData').Data.when = $(document).find('#interval-startdate').val();
                this.model.get('subscriptionData').Data.howLong = $(document).find('.how-long-val').val();
                if(MiniCart.MiniCart.model.get('items').length){
                    if($.cookie("subscriptionCreated") == "true"){
                        var popupData = {
                            "isEnabled" : true,
                            "message" : "You have already started building a <strong>Subscription</strong>. Do you want to add these products to that Subscription?",
                            "buttons" : [
                                {
                                    "buttonLabel" : "No",
                                    "action" : "showOtherPopUp",
                                    "class" : "no"   
                                },
                                {
                                    "buttonLabel" : "Yes",
                                    "action" : "addProducttosubscription",
                                    "class" : "yes"
                                }
                            ]
                        };
                        this.model.get('subscriptionData').popupData = popupData;
                        this.render();
                    }else{
                        var popupData = {
                            "isEnabled" : true,
                            "message" : "We can't mix <strong>Subscription</strong> and <strong>non-Subscription</strong> items at this time. Do you want to Subscribe to everything you have in the Cart?",
                            "buttons" : [
                                {
                                    "buttonLabel" : "No",
                                    "action" : "showOtherPopUptoConfirm",
                                    "class" : "no"   
                                },
                                {
                                    "buttonLabel" : "Yes",
                                    "action" : "addTocartandConvertToSub",
                                    "class" : "yes"
                                }
                            ]
                        };
                        this.model.get('subscriptionData').popupData = popupData;
                        this.render();
                    }
                }else{
                    this.myAddTocartFunc(this.model.get('subscriptionData').Data);
                }
            }
        },
        showOtherPopUptoConfirm : function(){
            var popupData = {
                "isEnabled" : true,
                "message" : "To create a Subscription, you must have only <strong>Subscription items</strong> in the Cart. Do you want to remove the non-subscription items from the Cart and proceed to check out?",
                "buttons" : [
                    {
                        "buttonLabel" : "No",
                        "action" : "showOnemorePopUp",
                        "class" : "no"   
                    },
                    {
                        "buttonLabel" : "Yes",
                        "action" : "Proceed",
                        "class" : "yes"
                    }
                ]
            };
            this.model.get('subscriptionData').popupData = popupData;
            this.render();       
        },
        showOnemorePopUp : function(){
            var popupData = {
                "isEnabled" : true,
                "message" : "Proceeding will ignore your <strong>Subscription</strong> List and allow you to purchase your At Once item(s)",
                "buttons" : [
                    {
                        "buttonLabel" : "Back To Subscription",
                        "action" : "backtosubscription",
                        "class" : "Back-To-Subscription"   
                    },
                    {
                        "buttonLabel" : "Proceed",
                        "action" : "goToCheckoutByNotAdding",
                        "class" : "Proceed"
                    }
                ]
            };
            this.model.get('subscriptionData').popupData = popupData;
            this.render();       
        },
        goToCheckoutByNotAdding : function(){
            var data = this.model.get('subscriptionData').Data;
            // $.cookie("subscriptionCreated", true, { path: '/'});
            // $.cookie("subscriptionData", JSON.stringify(data), { path: '/'});
            // alert("go to subscription checkout.");
            this.redirectTosubCheckout();
        },
        addTocartandConvertToSub : function(){
            var self = this;
            var data = this.model.get('subscriptionData').Data;
            var myDataProduct = ProductModels.Product.fromCurrent();
            myDataProduct.set({'quantity': data.qty});
            myDataProduct.addToCart(1);
            myDataProduct.on('addedtocart', function(attr) {
                $.cookie("subscriptionCreated", true, { path: '/'});
                $.cookie("subscriptionData", JSON.stringify(data), { path: '/'});
                CartMonitor.update();
                self.redirectTosubCheckout();               
            });    
        }, 
        showOtherPopUp : function(){
            var popupData = {
                "isEnabled" : true,
                "message" : "Proceeding will ignore your previously-started <strong>Subscription</strong> and allow you to set up the new Subscription.",
                "buttons" : [
                    {
                        "buttonLabel" : "Back To Subscription",
                        "action" : "backtosubscription",
                        "class" : "Back-To-Subscription"   
                    },
                    {
                        "buttonLabel" : "Proceed",
                        "action" : "Proceed",
                        "class" : "Proceed"
                    }
                ]
            };
            this.model.get('subscriptionData').popupData = popupData;
            this.render();    
        },
        backtosubscription : function(){
           // alert("back to subscription page with current product and quentity.");
           this.getStarted();
        },
        Proceed : function(){
            var self = this;
            var data = this.model.get('subscriptionData').Data;
            MiniCart.MiniCart.clearCart();
            setTimeout(function(){
                var mynProduct = ProductModels.Product.fromCurrent();
                mynProduct.set({'quantity': data.qty});
                mynProduct.addToCart(1);
                mynProduct.on('addedtocart', function(attr) {
                    $.cookie("subscriptionCreated", true, { path: '/'});
                    $.cookie("subscriptionData", JSON.stringify(data), { path: '/'});
                    // CartMonitor.update();
                    // self.model.get('subscriptionData').popupData.isEnabled = false;
                    // self.render(); 
                    // alert("go to subscription checkout.");  
                    self.redirectTosubCheckout();                  
                }); 
            },2000);
        },
        closePopup : function(){
            this.model.get('subscriptionData').popupData.isEnabled = false;
            this.render();  
        },
        addProducttosubscription : function(){
            var self = this;
            var data = this.model.get('subscriptionData').Data;
            var mynProduct = ProductModels.Product.fromCurrent();
            mynProduct.set({'quantity': data.qty});
            mynProduct.addToCart(1);
            mynProduct.on('addedtocart', function(attr) {
                $.cookie("subscriptionCreated", true, { path: '/'});
                $.cookie("subscriptionData", JSON.stringify(data), { path: '/'});
                CartMonitor.update();
                self.model.get('subscriptionData').popupData.isEnabled = false;
                self.redirectTosubCheckout();                    
            });  
            // Api.on('error', function (badPromise, xhr, requestConf) {
            //     self.model.get('subscriptionData').popupData.isEnabled = false;
            //     self.render(); 
            //     alert("Error in add to cart 1.");             
            // }); 
        },
        myAddTocartFunc : function(data){
            var myProduct = ProductModels.Product.fromCurrent(), self = this;
            myProduct.set({'quantity': data.qty});
            myProduct.addToCart(1);
            myProduct.on('addedtocart', function(attr) {
                $.cookie("subscriptionCreated", true, { path: '/'});
                $.cookie("subscriptionData", JSON.stringify(data), { path: '/'});
                CartMonitor.update();
                self.redirectTosubCheckout();                 
            });  
            Api.on('error', function (badPromise, xhr, requestConf) {
                //alert("Error in add to cart.");            
            }); 
        },
        showHideContent : function(e){
            var isChecked = false;
            if($(e.target).is(":checked")){
                isChecked = true;
            }
            this.model.get('subscriptionData').showContent = isChecked;
            this.render();
        },
        qtyPlusSub : function(e,cqty){
            var me = this,qty;
            if(cqty){
                qty = cqty; 
            }else{
                qty = parseInt(this.el.querySelector('.quantity-sub').value,10);
            }
            if(!qty){
                qty = 0;
            } 
            if(qty < 25){
                this.el.querySelector('.quantity-sub').value = qty + 1;
                me.model.get('subscriptionData').qty = qty + 1;
                $(document).find('.quantity-sub').val(qty + 1); 
            } 
        },
        qtyMinusSub: function(e,cqty){
            var me = this,qty;
             if(cqty){
                qty = cqty;
            }else{
                qty = parseInt(this.el.querySelector('.quantity-sub').value,10);
            }
            if(qty > 1){
                this.el.querySelector('.quantity-sub').value = qty - 1;
                me.model.set('subscriptionData').qty = qty-1;
                $(document).find('.quantity-sub').val(qty - 1);
            }
        },
        qtyPlus: function(e,cqty){
            var me = this,qty;
            if(cqty){
                qty = cqty; 
            }else{
                qty = parseInt(this.el.querySelector('.quantity').value,10);
            }
            if(!qty){
                qty = 0;
            } 
            if(qty < 25){
                this.el.querySelector('.quantity').value = qty + 1;
                me.model.set('quantity', qty + 1);
                $(document).find('.scroll-header .qty-input-box .quantity').val(qty + 1); 
            }
        },
        qtyMinus: function(e,cqty){
            var me = this,qty;
             if(cqty){
                qty = cqty;
            }else{
                qty = parseInt(this.el.querySelector('.quantity').value,10);
            }
            if(qty > 1){
                this.el.querySelector('.quantity').value = qty - 1;
                me.model.set('quantity', qty-1);
                $(document).find('.scroll-header .qty-input-box .quantity').val(qty - 1);
            }
        },
        scrollToProductDetails:function(e){
            if($(window).width()>767){
                $("html, body").animate({
                    scrollTop : $(".accordian-prod").offset().top
                }, 1000);
            }else{
                var list = $('.accordian-list'),len = ($(list[0].children).length-1);
                $(list[0].children).removeClass('active');
                $(list[0].children).attr("aria-expanded", "false");
                $(list[0].children).find('ul').hide();
                $(list[0].children[0]).addClass('active');
                $(list[0].children[0]).attr("aria-expanded", "true");
                if($(list[0].children[0]).hasClass('active')){
                    e.preventDefault(); 
                    $('html, body').animate({ 
                         scrollTop : $(".accordian-prod-mobile").offset().top-150 
                    }, 500);
                    $(list[0].children[0]).find('ul').slideDown();
                    $(list[0].children[0]).find('h2').find('.new-icon-images').find('.new-icon-plus').hide();
                    $(list[0].children[0]).find('h2').find('.new-icon-images').find('.new-icon-minus').show();
                }
                else{
                    e.preventDefault();
                    $(list[0].children[0]).find('ul').slideUp();
                }
            }
        },
        sweetRewards:function(){
            $(document).find('.zinrelo-tab').click();
        },
        getRenderContext: function () {
            var c = Backbone.MozuView.prototype.getRenderContext.apply(this, arguments);
            c.subscribed = (_.indexOf(getExistingNotifications(), (this.model.get('variationProductCode') || this.model.get('productCode'))) !== -1);
            c.model.savePrice = (c.model.savePrice).toFixed(2);
            return c;
        },
        render: function () {   
            var me = this;  
            this.model.attributes.savePrice = this.model.attributes.price.attributes.price - this.model.attributes.price.attributes.salePrice;
            console.log("this.model", this.model);
            Backbone.MozuView.prototype.render.apply(this);
            me.dateSelector();
            if(window.wishlistFlag){
                $(document).find('#add-to-wishlist').prop('disabled', 'disabled').text(Hypr.getLabel('addedToWishlist')).attr('aria-label',Hypr.getLabel('addedToWishlist'));
                $(document).find('#add-to-wishlist').css('cursor','not-allowed');
            }
            //notify me success ada             
            if($(document).find('#product-detail').find('#notify-success').length>0 && window.sucess) {
                $(document).find('#product-detail').find('#notify-success').focus();   
                window.sucess = false;                     
            }
            this.setTestimonial();
            this.$('[data-mz-is-datepicker]').each(function (ix, dp) {
                $(dp).dateinput().css('color', Hypr.getThemeSetting('textColor')).on('change  blur', _.bind(me.onOptionChange, me));
            });
           // PowerReviews.displayReviewSnippet($("#ReviewHeader"));
           // PowerReviews.displayReviews($("#ReviewsContainer"));
            //nutrition look up
            Api.request('GET', '/svc/nutrition_info?sku='+ require.mozuData("product").productCode).then(function(res) {
                $('#nutrition-image').append('<img src="//'+res.image+'?max=500" alt="'+res.productInfo+'" />');
                //$('#nutrition-text').html(res.text); 
                //$('#nutrition-text').attr('aria-label',res.text);
                $('.mz-productimages-thumbs').append('<a class="mz-productimages-thumb" data-mz-productimage-thumb="NUTRITION" href="javascript:void(0)"><img class="mz-productimages-thumbimage"  src="//'+res.image+'?max=50" alt="'+res.productInfo+'" /></a>');
                window.productImagesView.addToImageCache("//"+res.image, "NUTRITION");
                // Nutrition Panel Information for Accessible Users
                /*$('#nut_panel_title').append('<h2 style="text-align:center;" class="skipto mz-desktop" tabindex="0"> Nutrition Panel Information for Accessible Users<span style=font-size:14px;color:#000;" id="nut_panel"> </span></h2>');
                $('#nut_panel').append('<div>Servings Per Container: '+ res.panel.valueServingPerContainer +' lots and lots and lots and lots of text</div>');
                $('#nut_panel').append('<div>Serving Size: '+ res.panel.valueServingPerPieces +' pieces</div>');    
                $('#nut_panel').append('<div>Serving Weight Grams: ' + res.panel.valueServingWeightGrams +' grams </div>');
                $('#nut_panel').append('<div>Calories: '+ res.panel.valueCalories +'</div>');
                $('#nut_panel').append('<div>Sodium: '+ res.panel.valueSodium +' milligram</div>');
                $('#nut_panel').append('<div>Total Carbohydrate: '+ res.panel.valueTotalCarb +' grams </div>');
                $('#nut_panel').append('<div>Sugars: '+ res.panel.valueSugars +' grams</div>'); 
                $('#nut_panel').append('<div>Includes Added Sugars: '+ res.panel.valueIncludedAddedSugars +' grams</div>');   */
            }, function(error){
                console.log('handling the error');
            });
            
            //nutrition panel code
            Api.request('GET', '/svc/nutPanel2?sku=' + require.mozuData("product").productCode).then(function(res) {
                $('#nut_panel_title').append('<div class="skipto mz-desktop" tabindex="0" style=font-size:16px;color:#444;white-space:normal !important; text-transform: uppercase !important;" id="nut_panel"><h2 style="text-align:center;">Nutrition Panel Information for Accessible Users</h2> </div>');
                
                $('#nutrition-text').html("INGREDIENTS: " + res.ingredients); 
                //$('#nutrition-text').attr('aria-label',"product ingredients");
                
                
                //build the hidden Accessible Nut Panel             
                $('#nut_panel').append("<div>NUTRITION FACTS: </div>");
                if (res.value10lbServingPackage > -1) {
                    $('#nut_panel').append('Servings per container:' + res.value10lbServingPackage);
                }
                if (res.value16ozServingPackage > -1) {
                    $('#nut_panel').append('Servings per container:' + res.value16ozServingPackage);
                }
                if (res.valueServingWeightGrams != -1) {
                    $('#nut_panel').append('Serving size: ' + res.valueServingWeightGrams + ' grams');
                }
                if (res.valueCalories != -1) {
                    $('#nut_panel').append(', Calories per serving: ' + res.valueCalories );
                }
                if (res.valueTotalFat != -1) {
                    $('#nut_panel').append(', Total Fat ' + res.valueTotalFat + ' grams');
                    if (res.valueTotalFatPct != -1) {
                        $('#nut_panel').append(': ' + res.valueTotalFatPct + '% Daily Value');
                    }
                }
                if (res.valueSaturatedFat != -1) {
                    $('#nut_panel').append(', Saturated Fat ' + res.valueSaturatedFat + ' grams');
                    if (res.valueSaturatedFatPct != -1) {
                        $('#nut_panel').append(': ' + res.valueSaturatedFatPct + '% Daily Value');
                    }
                }
                if (res.valueTotalCarb != -1) {
                    $('#nut_panel').append(', Total Carbohydrates ' + res.valueTotalCarb + ' grams');
                    if (res.valueTotalCarbPct != -1) {
                        $('#nut_panel').append(': ' + res.valueTotalCarbPct + '% Daily Value');
                    }
                }
                if (res.valueDietaryFiber != -1) {
                    $('#nut_panel').append(', Total Dietary Fiber ' + res.valueDietaryFiber + ' grams');
                    if (res.valueDietaryFiberPct != -1) {
                        $('#nut_panel').append(': ' + res.valueDietaryFiberPct + '% Daily Value');
                    }
                }
                if (res.valueSugars != -1) {
                    $('#nut_panel').append(', Total Sugars ' + res.valueSugars + ' grams');
                    if (res.valueSugarsPct != -1) {
                        $('#nut_panel').append(': ' + res.valueSugarsPct + '% Daily Value');
                    }
                }
                if (res.valueIncludedAddedSugars != -1) {
                    $('#nut_panel').append(', Includes ' + res.valueIncludedAddedSugars + ' grams of Added Sugars');
                    if (res.valueIncludedAddedSugarsPct != -1) {
                        $('#nut_panel').append(': ' + res.valueIncludedAddedSugarsPct + '% Daily Value');
                    }
                }
                if (res.valueProteins != -1) {
                    $('#nut_panel').append(', Protein ' + res.valueProteins + ' grams');
                    if (res.valueProteinsPct != -1) {
                        $('#nut_panel').append(': ' + res.valueProteinsPct + '% Daily Value');
                    }
                }
                if (res.valuePotassium != -1) {
                    $('#nut_panel').append(', Potassium ' + res.valuePotassium + ' milligrams');
                    if (res.valuePotassiumPct != -1) {
                        $('#nut_panel').append(': ' + res.valuePotassiumPct + '% Daily Value');
                    }
                }
                if (res.valueSodium != -1) {
                    $('#nut_panel').append(', Sodium ' + res.valueSodium + ' milligrams');
                    if (res.valueSodiumPct != -1) {
                        $('#nut_panel').append(': ' + res.valueSodiumPct + '% Daily Value');
                    }
                }
                $('#nut_panel').append('<br><br>The % Daily Value tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.<br><br>');
                //end hidden nut panel
            }, function(error){
                    console.log('handling the error');
            });     
        },
        onOptionChange: function (e) {
            return this.configure($(e.currentTarget));
        },
        configure: function ($optionEl) {
            var newValue = $optionEl.val(),
                oldValue,
                id = $optionEl.data('mz-product-option'),
                optionEl = $optionEl[0],
                isPicked = (optionEl.type !== "checkbox" && optionEl.type !== "radio") || optionEl.checked,
                option = this.model.get('options').get(id);
            if (option) {
                if (option.get('attributeDetail').inputType === "YesNo") {
                    option.set("value", isPicked);
                } else if (isPicked) {
                    oldValue = option.get('value');
                    if (oldValue !== newValue && !(oldValue === undefined && newValue === '')) {
                        option.set('value', newValue);
                    }
                }
            }
        },
        addToCart: function () {
            if($.cookie("subscriptionCreated") == "true"){
                var popupData = {
                    "isEnabled" : true,
                    "message" : " You have already started building a <strong>Subscription</strong>. Do you want to remove the subscription products and add this product to the cart?",
                    "buttons" : [
                        {
                            "buttonLabel" : "No",
                            "action" : "closePopup",
                            "class" : "no"   
                        },
                        {
                            "buttonLabel" : "Yes",
                            "action" : "clearCartandaddtocart",
                            "class" : "yes"
                        }
                    ]
                };
                this.model.get('subscriptionData').popupData = popupData;
                this.render();       
            }else{
                this.model.addToCart();     
            }
        },
        clearCartandaddtocart : function(){
            var self = this;
            MiniCart.MiniCart.clearCart();
            setTimeout(function(){ 
                $.cookie("subscriptionCreated", false);
                self.model.addToCart();  
                self.closePopup();
            },2000);  
        },
        /*addToWishlist: function () {
            this.model.addToWishlist();
        },*/
        checkLocalStores: function (e) { 
            var me = this;
            e.preventDefault();
            this.model.whenReady(function () {
                var $localStoresForm = $(e.currentTarget).parents('[data-mz-localstoresform]'),
                    $input = $localStoresForm.find('[data-mz-localstoresform-input]');
                if ($input.length > 0) {
                    $input.val(JSON.stringify(me.model.toJSON()));
                    $localStoresForm[0].submit();
                }
            });

        },
        setTestimonial: function() { 
            // var c = Backbone.MozuView.prototype.getRenderContext.apply(this, arguments);
            var c = this;
            var testimonials = [
                {
                  name: "",
                  city: "",
                  state: "",
                  quote: ""
                },
                {
                  name: "",
                  city: "",
                  state: "",
                  quote: ""
                },
                {
                  name: "",
                  city: "",
                  state: "",
                  quote: ""
                }
                ];
            var t = 0;
            $.each(c.model.get('properties'), function(index,item){
                    if(item.attributeFQN == 'tenant~testimonial-data-1') { 
                        testimonials[0].name = item.values[0].value.split(',')[0];
                        testimonials[0].city = item.values[0].value.split(',')[1];
                        testimonials[0].state = item.values[0].value.split(',')[2];
                    }
                    else if(item.attributeFQN == 'tenant~testimonial-data-2') { 
                        testimonials[1].name = item.values[0].value.split(',')[0];
                        testimonials[1].city = item.values[0].value.split(',')[1];
                        testimonials[1].state = item.values[0].value.split(',')[2];
                    }
                    else if(item.attributeFQN == 'tenant~testimonial-data-3') { 
                        testimonials[2].name = item.values[0].value.split(',')[0];
                        testimonials[2].city = item.values[0].value.split(',')[1];
                        testimonials[2].state = item.values[0].value.split(',')[2];
                    }
                    else if(item.attributeFQN == 'tenant~testimonial-quote-1') { 
                        testimonials[0].quote = item.values[0].stringValue;
                    }
                    else if(item.attributeFQN == 'tenant~testimonial-quote-2') { 
                        testimonials[1].quote = item.values[0].stringValue;
                    }
                    else if(item.attributeFQN == 'tenant~testimonial-quote-3') { 
                        testimonials[2].quote = item.values[0].stringValue;
                    }
            });

            var randNum = Math.floor((Math.random() * testimonials.length));

            if (testimonials[randNum].name.length > 0) {
                var testTemp = [];
                if(testimonials[randNum].name) {
                    testTemp.push(testimonials[randNum].name);
                }
                
                if(testimonials[randNum].city) {
                    testTemp.push(testimonials[randNum].city);
                }
                
                if(testimonials[randNum].state) {
                    testTemp.push(testimonials[randNum].state);
                }
                
                $('#testimonial-data').html(testTemp.join(', '));
                $('#testimonial-quote').html(testimonials[randNum].quote);
                $('#testimonial-section').show();  
            }
        },
        hasYearRoundHeatSensitivity: function(){
          var v = false;
          _.each(this.model.get('categories'), function(c){
            if (c.categoryId === Hypr.getThemeSetting('heatSensitiveYearRoundId'))
              v = true;
          });
          return v;
        },
        isCurrentlySeasonallyHeatSensitive: function(){
          var v = false;
          if (Hypr.getThemeSetting('showHeatSensitiveText')) {
            _.each(this.model.get('categories'), function(c){
              if (c.categoryId == Hypr.getThemeSetting('heatSensitiveCategoryId'))
                v = true;
            });
          }
          return v;
        },
        hasNoFreeShipping: function(){
            var v = false;
            _.each(this.model.get('categories'), function(c){
              if (c.categoryId === Hypr.getThemeSetting('noFreeShippingId'))
                v = true;
            });
            return v;
        },
        clearError: function() {
            this.setError('');
        },
        setError: function(txt) {
            this.$('[data-mz-validationmessage-for="email"]').text(txt);
            this.$('[data-mz-validationmessage-for="email"]').attr('aria-label',txt);
            $('*[data-mz-role="email"]').focus();
        },
        validateEmail: function(emailid){
            if(emailid.length>0){
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if(!re.test(emailid.trim())){
                    this.setError(Hypr.getLabel('emailMissing'));
                    return false;
                } 
                else {
                    return re.test(emailid);
                }
            }else{
                this.setError(Hypr.getLabel('emailMissing'));
                return false;
            }
        },
        widgetNotifyUserAction: function () {
            var self = this; 
            this.clearError();
            var email = this.$('[data-mz-role="email"]').val();
            if(this.validateEmail(email)) {
                Api.create('instockrequest', {
                    email: email,
                    customerId: user.accountId,
                    productCode: this.model.get('productCode') || this.model.get('variationProductCode'),
                    locationCode: this.model.get('inventoryInfo').onlineLocationCode
                }).then(function () {
                    window.sucess = true;
                    saveNotification(self.model.get('productCode') || self.model.get('variationProductCode'));
                    self.render();
                }, function (xhr) {
                    if(xhr.errorCode == "VALIDATION_CONFLICT"){
                        self.setError(Hypr.getLabel('notifyWidgetError'));
                    }else if(xhr.errorCode != "ITEM_ALREADY_EXISTS"){   
                        if(xhr.items.length){ 
                            self.setError(xhr.items[0].message);
                        }else{
                            self.setError(xhr.message);
                        }    
                    }else{
                       self.setError('Error: Email id you have provided already subscribed for back in stock notification.');
                    }
                });
        }
        },
        initialize: function () {
            // handle preset selects, etc
            var me = this;
            this.$('[data-mz-product-option]').each(function () {
                var $this = $(this), isChecked, wasChecked;
                if ($this.val()) {
                    switch ($this.attr('type')) {
                        case "checkbox":
                        case "radio":
                            isChecked = $this.prop('checked');
                            wasChecked = !!$this.attr('checked');
                            if ((isChecked && !wasChecked) || (wasChecked && !isChecked)) {
                                me.configure($this);
                            }
                            break;
                        default:
                            me.configure($this);
                    }
                }
            });
        },
        dateSelector: function() {
            var finaldate;
            var heat;
            var finalDate;
            var me = this;
            if (this.isHeatSensitive()) {
                finaldate = this.heatSensitvieDatePicker();
                finalDate = finaldate.replace(/-/g, '/');
                heat = true;
            } else {
                finaldate = this.datePicker();
                finalDate = finaldate.replace(/-/g, '/');
                heat = false;
            }

            // Date Picker 
            $('#interval-startdate').datepicker({
                beforeShowDay: heatSensitive,
                minDate: '0',
                maxDate: '+6m',
                dateFormat: "mm-dd-yy",
                autoclose:true,
                onSelect: function(dateText, inst) {
                    var date = $(this).datepicker('getDate'),
                        day = date.getDate(),
                        month = date.getMonth() + 1,
                        year = date.getFullYear();
                    var shipdate = ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2) + '-' + year;

                    window.shipdate = shipdate;
                    var subscriptionData = me.model.get('subscriptionData');
                    if(subscriptionData && subscriptionData.Data){
                        subscriptionData.Data.when = shipdate;
                        me.model.set('subscriptionData', subscriptionData); 
                    }

                    $('#interval-startdate').datepicker("setDate", shipdate);
                    $('#interval-startdate').val(shipdate);
                    //$('.estimateddate').text(shipdate);  
                    //me.render(); 
                },
                beforeShow: function () { 
                    $(document).find('body').removeClass('smooth-scroll');
                    $(document).find('#ui-datepicker-div').show();
                },onClose:function(){
                    $(document).find('body').addClass('smooth-scroll');
                    $(document).find('#ui-datepicker-div').hide();
                }
            });

            //if (window.shipdate && !window.isPreviouslyStarted) {
            var selectedDate = window.shipdate;
            if (window.shipdate == finaldate) {
                if(this.isHeatSensitive()) {
                    var currentHeatDate = new Date(window.shipdate);
                    if( heatSensitive(currentHeatDate)[0] === true ) {
                        $('#interval-startdate').val(window.shipdate);
                    } else {
                        $('#interval-startdate').datepicker("setDate", finaldate);
                        $('#interval-startdate').val(finaldate);
                        window.shipdate = finaldate;
                    }
                } else {
                    $('#interval-startdate').datepicker("setDate", window.shipdate);
                    if(me.model.get("scheduleInfo")) {
                        $('#interval-startdate').val(me.model.get("scheduleInfo").startDate);
                    }
                }
            } else {
                $('#interval-startdate').datepicker("setDate", finaldate);
                $('#interval-startdate').val(finaldate);
            }

            function heatSensitive(date) {
                var restDates = Hypr.getThemeSetting('shipping_date') ? Hypr.getThemeSetting('shipping_date') : "01/01/2019,02/18/2019,05/27/2019,07/04/2019,05/25/2020" ;
                var blackoutdates = restDates.split(',');
                var day;
                var m = date.getMonth();
                var d = date.getDate();
                var y = date.getFullYear();

                var dd = new Date();
                var mm = dd.getMonth();
                var ddd = dd.getDate();
                var yy = dd.getFullYear();

                var shipdate = new Date(finalDate);
                var currentDate = ('0' + (mm + 1)).slice(-2) + "/" + ('0' + ddd).slice(-2) + "/" + yy;
                var compareDate = ('0' + (m + 1)).slice(-2) + '/' + ('0' + d).slice(-2) + '/' + y;
                if (heat) {
                    for (var i = 0; i < blackoutdates.length; i++) {
                        if ($.inArray(compareDate, blackoutdates) != -1 || new Date() > date || shipdate > date) {
                            return [false];
                        }
                    }
                    day = date.getDay();
                    if (day === 3 || day === 4 || day === 5 || day === 6 || day === 0) {
                        return [false];
                    } else {
                        return [true];
                    }
                } else {
                    for (var j = 0; j < blackoutdates.length; j++) {
                        if ($.inArray(compareDate, blackoutdates) != -1 || new Date() > date || shipdate > date) {
                            return [false];
                        }
                    }
                    day = date.getDay();
                    if (day === 6 || day === 0) {
                        return [false];
                    } else {
                        return [true];
                    }
                }
            }
        },
        datePicker: function() {
            var date = new Date();
            var businessdays = 2;
            var restDates = Hypr.getThemeSetting('shipping_date') ? Hypr.getThemeSetting('shipping_date') : "01/01/2019,02/18/2019,05/27/2019,07/04/2019,05/25/2020" ;
            var blackoutdates = restDates.split(',');
            var day, month, year, fulldate, currentDate, comparedate;
            while (businessdays) {
                date.setFullYear(date.getFullYear(), date.getMonth(), (date.getDate() + 1));
                day = date.getDay();
                month = date.getMonth();
                year = date.getFullYear();
                currentDate = date.getDate();
                fulldate = ('0' + (month + 1)).slice(-2) + '-' + ('0' + currentDate).slice(-2) + '-' + year;
                comparedate = ('0' + (month + 1)).slice(-2) + '/' + ('0' + currentDate).slice(-2) + '/' + year;


                if (day === 0 || day === 6 || blackoutdates.indexOf(comparedate) !== -1 || new Date() > comparedate) {
                    date.setFullYear(year, month, currentDate);
                } else {
                    businessdays--;
                }
            }
            date.setFullYear(year, month, (date.getDate()));
            var finaldate = ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + '-' + date.getFullYear();
            $('.earliest-date span').text(finaldate);
            //$('#interval-startdate').datepicker("setDate",final);
            return finaldate;
        },
        heatSensitvieDatePicker: function() {
            var date = new Date();
            var businessdays = 2;
            var restDates = Hypr.getThemeSetting('shipping_date') ? Hypr.getThemeSetting('shipping_date') : "01/01/2019,02/18/2019,05/27/2019,07/04/2019,05/25/2020" ;
            var blackoutdates = restDates.split(',');
            var day, month, year, currentDate, comparedate;
            while (businessdays) {
                date.setFullYear(date.getFullYear(), date.getMonth(), (date.getDate() + 1));
                day = date.getDay();
                month = date.getMonth();
                year = date.getFullYear();
                currentDate = date.getDate();
                // fulldate= ('0'+(month+1)).slice(-2)+ '-' + ('0'+currentDate).slice(-2) + '-' + year;
                comparedate = ('0' + (month + 1)).slice(-2) + '/' + ('0' + currentDate).slice(-2) + '/' + year;

                if (day === 0 || day === 6 || day === 3 || day === 4 || day === 5 || blackoutdates.indexOf(comparedate) !== -1) {
                    date.setFullYear(year, month, (currentDate));
                } else {
                    businessdays--;
                }
            }
            date.setFullYear(year, month, (currentDate));
            var finaldate = ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + '-' + date.getFullYear();
            $('.earliest-date span').text(finaldate);
            return finaldate;
        },
        isHeatSensitive: function() {
            var heatSensitiveEnabled = Hypr.getThemeSetting('heatsensitive') ? Hypr.getThemeSetting('heatsensitive') : true;
            var isHeatSensitivePrd = false;
            if (heatSensitiveEnabled) {
                var properties = this.model.get('properties');
                for(var i=0;i<properties.length;i++){
                    if(properties[i].attributeFQN === "tenant~IsHeatSensitive"){
                        isHeatSensitivePrd = properties[i].values[0].value;
                    }
                }
             } 
             return isHeatSensitivePrd;        
        }, 
        setHowLongVal:function(){
            this.model.get('subscriptionData').Data.howLong = $(document).find('.how-long-val').val();
        },
        setHowOffenVal:function(){
            this.model.get('subscriptionData').Data.howOften = $(document).find('.how-often-val').val();
        }  
    });
    var ReleatedProducts = Backbone.MozuView.extend({
        templateName: 'modules/product/details-acc-sec',
        loadMore:function(){
            $('.single-product:hidden').show();
            this.model.set('loadMore',false);
            this.render();
        },
        render: function (){   
            Backbone.MozuView.prototype.render.apply(this);
        }
    });
    function getExistingNotifications() {
        return ($.cookie('mozustocknotify') || '').split(',');
    }

    function saveNotification(productCode) {
        var existing = getExistingNotifications();
        $.cookie('mozustocknotify', existing.concat(productCode).join(','), { path: '/', expires: 365 });
    }

    $(document).ready(function () {
        var loginFlag = window.loginFlag = "";
        // date picker

        $(document).on('click', 'button', function(e) {
            Api.action('cart', 'get').then(function(cartData) {  
                var items = [];
                cartData.data.items.forEach(function (item) {
                    items.push({'id': item.product.productCode,'price': item.product.price.price,'quantity': item.quantity,'name': item.product.name,'description': item.product.description,'url': 'https://www.jellybelly.com/p/' + item.product.productCode,
                    'image': "https:" + item.product.imageUrl, 'currency': 'USD'});
                });

                var q = document.getElementById("quantity").value;
                var product = JSON.parse(document.getElementById("data-mz-preload-product").innerHTML);
                items.push({'id': product.productCode || [],
                   'price': product.price.price || [],
                   'quantity': q || [],
                   'name': product.content.productName || [],
                   'description': product.content.productShortDescription || [],
                   'url': 'https://www.jellybelly.com/p/' + product.productCode || [],
                   'image': "https:" + product.mainImage.src || [],
                   'currency': 'USD'});
                window._bopiq = window._bopiq || [];
                window._bopiq.push(['cartView', 'https://www.jellybelly.com/cart', { items: items}]);
            });
        });
        var notifyinputs = window.notifyinputs,
            notifyfirstInput = window.notifyfirstInput,
            notifylastInput = window.notifylastInput;  
            $("#store-branding").find('a').focus();
            $(document).on('keydown','li', function(e) {
            if(e.keyCode == 13 || e.keyCode == 32) {
                e.preventDefault();
                accordianproductpage($(this));  
            }
        }); 
        
        function accordianproductpage(ele){
            if(ele.parents('ul').hasClass('accordian-list')) {
                if(ele.hasClass('active')) {
                    ele.removeClass('active');
                    ele.attr("aria-expanded", "false");
                    ele.find('ul').slideUp(); 
                    ele.find('h2').find('.new-icon-images').find('.new-icon-plus').show();
                    ele.find('h2').find('.new-icon-images').find('.new-icon-minus').hide(); 
                }
                else {
                    $('.accordian-list').find('li').each(function() {
                        $(this).find('h2').find('.new-icon-images').find('.new-icon-plus').show();
                        $(this).find('h2').find('.new-icon-images').find('.new-icon-minus').hide();
                        $(this).removeClass('active');
                        $(this).attr("aria-expanded", "false");
                        $(this).find('ul').slideUp();
                    });
                   // $(this).parents('ul').find('li').
                    ele.addClass('active');
                    ele.attr("aria-expanded", "true"); 
                    ele.find('ul').slideDown();
                    ele.find('h2').find('.new-icon-images').find('.new-icon-plus').hide();
                    ele.find('h2').find('.new-icon-images').find('.new-icon-minus').show();
                    setTimeout(function(){
                        $("html, body").animate({
                            scrollTop : ele.offset().top-100
                        }, 1000);
                    },500);
                    
                }
            }
        } 
        
        /**
         * Add click event for PDP page accordian.
         * Functionality: Open clicked accordian, if its closed and close other.
         **/
        $(document).on('click', '#ReviewHeader a[href="#ReviewHeader"]', function (e) {
            $('#accordian li').removeClass('active');
            $('#accordian li').attr("aria-expanded", "false");
            $("#accordian ul ul").slideUp();
            $('.comment-section').parent().addClass("active");
            $('.comment-section').attr("aria-expanded", "true");
            $('.comment-section').slideDown();
            $("html, body").animate({
                scrollTop : $("#ReviewsContainer").offset().top-100
            }, 1000);
        });
        
        $(document).on('click', '.accordian-prod-mobile h2', function () { 
            accordianproductpage($(this).parents('li')); 
        }); 
        //Review snippet click functionality
        $(document).on('click', 'a.pr-snippet-review-count' ,function(e){
            if($(window).width()>767){    
                e.preventDefault();  
                $(document).find('.tabStructe .header-item').removeClass('active');
                $(document).find('.product-info-scroll .header-item').removeClass('active');
                $(document).find('.tabStructe .item-content').removeClass('active'); 
                $('html, body').animate({  
                    scrollTop: $(document).find('.tab-content-sec').offset().top-100
                }, 1000); 
                if(!$('.header-item.ProductReviews').hasClass('active')){
                    setTimeout(function(){
                        $(document).find('.header-item.ProductReviews').addClass('active'); 
                        $(document).find('.product-info-scroll .header-item.ProductReviews').addClass('active'); 
                        $(document).find('.tabStructe .item-content.ProductReviews').addClass('active'); 
                    },500);
                }
                // setTimeout(function(){
                //     $(document).find('.header-item.ProductReviews').click();
                // },500);
            }else{  
                var list = $('.accordian-list'),len = ($(list[0].children).length-1);
                $(list[0].children).removeClass('active');   
                $(list[0].children).attr("aria-expanded", "false"); 
                $(list[0].children).find('ul').hide();
                $(list[0].children[len]).addClass('active'); 
                $(list[0].children[len]).attr("aria-expanded", "true"); 
                if($(list[0].children[len]).hasClass('active')){
                    e.preventDefault(); 
                    $('html, body').animate({
                        scrollTop: $(document).find('#Reviews').offset().top-100
                    }, 1000);
                    setTimeout(function(){
                        $(list[0].children[len]).find('ul').show();
                        $(list[0].children[len]).find('h2').find('.new-icon-images').find('.new-icon-plus').hide();
                        $(list[0].children[len]).find('h2').find('.new-icon-images').find('.new-icon-minus').show();
                    },500);
                }
                else{
                    e.preventDefault();
                    $(list[0].children[len]).find('ul').slideUp();
                }
            }
        });


        $(document).on('keydown', 'a.pr-snippet-review-count' ,function(e){
            if($(window).width()>767){ 
                if(e.which === 13 || e.which === 32){
                    e.preventDefault(); 
                    $(document).find('.tabStructe .header-item').removeClass('active');
                    $(document).find('.product-info-scroll .header-item').removeClass('active');
                    $(document).find('.tabStructe .item-content').removeClass('active'); 
                    $('html, body').animate({
                        scrollTop: $(document).find('.tab-content-sec').offset().top-100
                    }, 1000);
                    
                    if(!$('.header-item.ProductReviews').hasClass('active')){
                        setTimeout(function(){
                            $(document).find('.tabStructe .header-item').removeClass('active').attr('aria-expanded',false);
                            $(document).find('.product-info-scroll .header-item').removeClass('active').attr('aria-expanded',false);
                            $(document).find('.header-item.ProductReviews').addClass('active').attr('aria-expanded',true);
                            $(document).find('.header-item.ProductReviews').addClass('active'); 
                            $(document).find('.product-info-scroll .header-item.ProductReviews').addClass('active').attr('aria-expanded',true); 
                            $(document).find('.tabStructe .item-content.ProductReviews').addClass('active').attr('aria-expanded',true);
                            $(document).find('.tabStructe .item-content.ProductReviews').find('li').focus();
                        },500);
                    }
                }
            }
        });           
        
        $('.mz-productoptions-option').on('change',function(){   
            return configure($(this)); 
        }); 
        
        function configure($optionEl) {
            var newValue = $optionEl.val(),
                oldValue,
                id = $optionEl.data('mz-product-option'),
                optionEl = $optionEl[0],
                isPicked = (optionEl.type !== "checkbox" && optionEl.type !== "radio") || optionEl.checked,
                option = window.productView.model.get('options').get(id);
            if (option) {
                if (option.get('attributeDetail').inputType === "YesNo") { 
                    option.set("value", isPicked);
                } else if (isPicked) {
                    oldValue = option.get('value');
                    if (oldValue !== newValue && !(oldValue === undefined && newValue === '')) {
                        option.set('value', newValue);
                    }
                }
            }
        }
    
        var product = ProductModels.Product.fromCurrent();

        product.on('addedtocart', function (cartitem) { 
            if (cartitem && cartitem.prop('id')) {
               // product.isLoading(true);
                CartMonitor.update();
                MiniCart.MiniCart.updateMiniCart();  
                var prodName = product.get('content.productName'),
                    listPrice = product.get('price').get('price'),
                    salePrice = product.get('price').get('salePrice'),
                    img = product.get('mainImage').imageUrl + '?max=150',
                    qty = product.get('quantity');
                showAddtoCartPopup(prodName,listPrice,salePrice,img,qty);
            } else {
                product.trigger("error", { message: Hypr.getLabel('unexpectedError') });
                $('[data-mz-message-bar]').find('.mz-errors').focus();
                setTimeout(function(){
                    $('#add-to-cart').focus();
                }, 6000);
            }
            brontoObj.build(Api);
        });

        /*restrict user from adding same items to wishlist */
        var this_model = require.mozuData("product");  
        var wishlistFlag = window.wishlistFlag = false;
        
        Api.get('wishlist').then(function(response){
            var wishlistCount = response.data.items.length;
            for (var i = 0; i < wishlistCount; i++) {
                var wistlistItemCount = response.data.items[i].items.length;
                for (var j = 0; j < wistlistItemCount; j++) {
                    var productCode = response.data.items[i].items[j].product.productCode;
                    if(this_model.productCode === productCode) {
                        window.wishlistFlag = true;
                        $('#add-to-wishlist').prop('disabled', 'disabled').text(Hypr.getLabel('addedToWishlist'));
                        $('#add-to-wishlist').css('cursor','not-allowed');
                        $('#add-to-wishlist').removeClass('add-to-wishlist');
                        $('#add-to-wishlist').addClass('added-to-wishlist');
                    }
                }
            } 
        });
        product.on('addedtowishlist', function (cartitem) {
            $('#add-to-wishlist').prop('disabled', 'disabled').text(Hypr.getLabel('addedToWishlist'));
            $('#add-to-wishlist').css('cursor','not-allowed'); 
            $('.free-shipping-section').focus();
        });

        product.set('isMobile', ($(window).width() < 768 ? true : false));
        product.set('isTablet', ($(window).width() < 1025 && $(window).width() > 767 ? true : false));
        product.set('isDesktop', ($(window).width() > 1024 ? true : false));

        var dateObj = new Date();
        var month = dateObj.getMonth();  
        var day = String(dateObj.getDate()).padStart(2, '0');
        var year = dateObj.getFullYear();
        var output = month  + '-'+ day  + '-' + year;

        var myObj = {
            'qty' : 1,
            'howOften' : 1,
            'weeks' : true,
            'months' : false,
            'when' : output, 
            'howLong' : "untill i cancel" 
        };
        if(typeof $.cookie("subscriptionCreated") !== 'undefined' && $.cookie("subscriptionCreated") == 'true'){
            var myval = JSON.parse($.cookie("subscriptionData"));
            myObj = {
                'howOften' : myval.howOften,
                'weeks' : myval.weeks,
                'months' : myval.months,
                'when' : myval.when, 
                'howLong' : myval.howLong,
                'qty' : myval.qty
            };
        }
        var clickSubscribeNow = window.location.search.indexOf("subscribeNow=true") != -1 ? true : false;
        var clickSbubscribeList = window.location.search.indexOf("subscribeList=true") != -1 ? true : false;
        var dataVal = {
            'showContent' :  (window.location.search.indexOf("isSubscribe=true") != -1 || clickSubscribeNow || clickSbubscribeList) ? true : false,
            'Data' : myObj,
            'singnupopoup' : {
                'isEnabled' : false,
                'signup' : false,
                'login' : true
            } 
        };
        setTimeout(function(){
            if(clickSubscribeNow){
                $(document).find('.subscribe-now').trigger('click');
            }else if(clickSbubscribeList){
                $(document).find('.subscrib-multi').trigger('click');
            }
        },3000);
        product.set('subscriptionData', dataVal);

        var productView = new ProductView({ 
            el: $('#product-detail'),
            model: product,
            messagesEl: $('[data-mz-message-bar]')
        });

        var productImagesView = new ProductImageViews.ProductPageImagesView({
            el: $('[data-mz-productimages]'),
            model: product
        });
        var releatedProducts = new ReleatedProducts({
            el: $('.related-section'),
            model: product
        });
 
        window.productView = productView;
        window.productImagesView = productImagesView;
        Api.request('GET', '/svc/related_products_UX?sku='+ require.mozuData("product").productCode).then(function(res) { 
            product.set('relatedProducts', res);
            console.log(res.totalCount);
            if(res.totalCount>4)product.set('loadMore', true);
            productView.render();  
            productImagesView.render();
            releatedProducts.render();
            thumbnailCarousel();
            if($(window).width()>767){
                relatedProductsCarousel();
            }
        }, function(error) {  
            product.set('relatedProducts', '');   
            productView.render();
            productImagesView.render();
            releatedProducts.render();
            console.log('handling the error');
            thumbnailCarousel();
            if($(window).width()>767){
                relatedProductsCarousel();
            }
        });
        
        //AB testing modifications starts.         

        function setError(txt) {
            $(document).find('.mz-product.variant').find('[data-mz-validationmessage-for="email"]').text(txt);
            $(document).find('.mz-product.variant').find('[data-mz-validationmessage-for="email"]').attr('aria-label',txt).focus();
        }
        function validateEmail(emailid){
            if(emailid.length>0){
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if(!re.test(emailid.trim())){
                    setError(Hypr.getLabel('emailMissing'));
                    return false;
                }
                else {
                    return re.test(emailid);
                }
            }else{
                setError(Hypr.getLabel('emailMissing'));
                return false;
            }
        }
        function addToCartAndUpdateMiniCart(PRODUCT,count,$target){
            PRODUCT.set({'quantity':count});
            $('#mybuyspagezone3').addClass('is-loading');
            PRODUCT.addToCart(1);
            PRODUCT.on('addedtocart', function(attr) {
                $('[data-mz-productlist],[data-mz-facets]').removeClass('is-loading');
                $(document).find('.RTI-overlay').removeClass('active');
                $target.removeClass('is-loading');
                CartMonitor.update();
                MiniCart.MiniCart.showMiniCart($target);
                PRODUCT = ''; 
                
            });  
            Api.on('error', function (badPromise, xhr, requestConf) {
                showErrorMessage(badPromise.message); 
                //$target.removeClass('is-loading');
                $(document).find('.RTI-overlay').removeClass('active');
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
        function showErrorMessage(msg){
            $('[data-mz-message-bar]').empty();
            var emsg = '<div class="mz-messagebar" data-mz-message-bar="">'+
                        '<ul class="is-showing mz-errors" tabindex="-1" id="mz-errors-list"><li>'+msg+'</li>'+
                        '</ul></div>';
            $('[data-mz-message-bar]').append(emsg);
            $('[data-mz-message-bar]').fadeIn();
            $('html, body').animate({
                scrollTop: $('#Reviews').offset().top  
            }, 500);
            setTimeout(function(){
                $('[data-mz-message-bar]').hide();
            },60000);
            $('.jb-inner-overlay').remove();
            // $("html, body").animate({scrollTop:  $(".mz-l-paginatedlist").offset().top }, 1000);
        }
        
        setTimeout(function(){
            if($(window).width() >= 768){
                $(document).find('.tabStructe .header-item').on('click',function(){
                    $(document).find('.tabStructe .header-item').removeClass('active');
                    $(document).find('.product-info-scroll .header-item').removeClass('active');
                    $(this).addClass('active');
                    $(document).find('.product-info-scroll .header-item.'+$(this).attr('attr-data')).addClass('active');
                    $(document).find('.tabStructe .item-content').removeClass('active');
                    $(document).find('.tabStructe .item-content.'+$(this).attr('attr-data')).addClass('active');
                });
                $(document).find('.product-info-scroll .header-item').on('click',function(){
                    $(document).find('.tabStructe .header-item').removeClass('active');
                    $(document).find('.product-info-scroll .header-item').removeClass('active');
                    $(this).addClass('active');
                    $(document).find('.tabStructe .header-item.'+$(this).attr('attr-data')).addClass('active');
                    $(document).find('.tabStructe .item-content').removeClass('active');
                    $(document).find('.tabStructe .item-content.'+$(this).attr('attr-data')).addClass('active');
                    $('html, body').animate({
                        scrollTop: $(document).find('.tabStructe').offset().top
                    }, 800);
                });
            }else{
                $(document).find('.header-item').on('click',function(){
                    $(document).find('.header-item').removeClass('active');
                    $(document).find('.content-data').removeClass('active');
                    $(this).addClass('active');
                    $(this).next('.content-data').addClass('active');
                });
            } 
            //ADA Product Details
            if($(window).width() >= 768){
                $(document).find('.tabStructe .header-item').on('keydown',function(e){
                    if(e.which === 13 || e.which === 32){
                        e.preventDefault();
                        $(document).find('.tabStructe .header-item').removeClass('active').attr('aria-expanded',false);
                        $(document).find('.product-info-scroll .header-item').removeClass('active').attr('aria-expanded',false);
                        $(this).addClass('active').attr('aria-expanded',true);
                        $(document).find('.product-info-scroll .header-item.'+$(this).attr('attr-data')).addClass('active').attr('aria-expanded',true);
                        $(document).find('.tabStructe .item-content').removeClass('active');
                        $(document).find('.tabStructe .item-content.'+$(this).attr('attr-data')).addClass('active');
                        $(document).find('.tabStructe .item-content.'+$(this).attr('attr-data')).find('li').focus();
                    }
                });
                $(document).find('.product-info-scroll .header-item').on('keydown',function(e){
                    if(e.which === 13 || e.which === 32){
                        e.preventDefault();
                        $(document).find('.tabStructe .header-item').removeClass('active').attr('aria-expanded',false);
                        $(document).find('.product-info-scroll .header-item').removeClass('active').attr('aria-expanded',false);
                        $(this).addClass('active').attr('aria-expanded',true);
                        $(document).find('.tabStructe .header-item.'+$(this).attr('attr-data')).addClass('active').attr('aria-expanded',true);
                        $(document).find('.tabStructe .item-content').removeClass('active');
                        $(document).find('.tabStructe .item-content.'+$(this).attr('attr-data')).addClass('active');
                        $(document).find('.tabStructe .item-content.'+$(this).attr('attr-data')).find('li').focus();
                        $('html, body').animate({
                            scrollTop: $(document).find('.tabStructe').offset().top
                        }, 800);
                    }    
                });
            }else{
                $(document).find('.header-item').on('keydown',function(){
                    $(document).find('.header-item').removeClass('active').attr('aria-expanded',false);
                    $(document).find('.content-data').removeClass('active').attr('aria-expanded',false);
                    $(this).addClass('active').attr('aria-expanded',true);
                    $(this).next('.content-data').addClass('active');
                });
            }
        },3000);
        // AB testing modifications ends.

        $(".norton-holder").insertAfter("#free-shipping-text");
        $(".norton-holder").css({ "display" : "inline-block", "width" : "15%", "float" : "right" });

        $(document).on('click', ".open-video", function(e) {
            productImagesView.showVideo(e.target.getAttribute('data-mz-video-id'));
            $('#cboxClose').css({ 'background-image': 'url("/resources/images/icons/close-popup-black.png")' });
        });
        
        $(document).on('keypress', ".mz-productimages-main", function(e) {
            if(e.keyCode == 13) {
                $(this).trigger('click');
            }
        });
        
        $(document).on('keypress', ".mz-productimages-thumb", function(e) {
            if(e.keyCode == 13) {
                $(this).trigger('click');
            }
        });
        
        productView.setTestimonial(); 
        //open review section
        $(document).on('click','.jb-read-review-link',function(e){
            $($('.accordian-list')[0].children[0]).removeClass('active');
            $($('.accordian-list')[0].children[0]).attr("aria-expanded", "false");
            $($('.accordian-list')[0].children[0]).find('ul').hide();
            if($(this).find('span').text() !== "0"){
                    $($('.accordian-list')[1].children[0]).addClass('active');
                    $($('.accordian-list')[1].children[0]).attr("aria-expanded", "true");
                if($($('.accordian-list')[1].children[0]).hasClass('active')){
                    e.preventDefault(); 
                    $('html, body').animate({
                        scrollTop: $('#Reviews').offset().top - 200  
                    }, 500);
                    $('.accordian-list .comment-section').slideDown();
                }
                else{
                    e.preventDefault();
                    $('.accordian-list .comment-section').slideUp();
                }
            }
        });
        // Hide zoome view
        $('html').click(function(e){ 
            if(e.target === $('[data-mz-role="product-variants-wrapper"]')[0]){
                $(e.target).hide().remove();
                $('body').removeClass('tz-modal-active');
            }
        });
        
        var width = $(window).width();
        if(width <= 767){
            $('.truck-div').css({ "width" : "100%" });
            $('.norton-holder').css({ "width" : "100%" });
        }

        var modalText = ""; 
        modalText += "<div class='free-shipping' aria-modal='true' tabindex='-1' role='dialog' aria-labelledby='modal-title' style='padding: 20px;'>";
        modalText += "<h1 id='modal-title'>FREE GROUND SHIPPING RESTRICTIONS</h1>";
        modalText += "<ul id='desc'><li class='free-shipping' tabindex='-1' >This offer applies ONLY to orders shipping to the Lower 48 Contiguous States.</li>";
        modalText += "<li class='free-shipping' tabindex='-1'>The Free Ground Shipping method offered will be the least expensive ground shipping option based on weight combined with the location to which the package is being shipped.</li>";
        modalText += "<li class='free-shipping' tabindex='-1'>This offer applies ONLY to orders placed with JellyBelly.com and does not apply to orders placed with MyJellyBelly.com or affiliated websites.</li>";
        modalText += "<li class='free-shipping' tabindex='-1'>Canceling, combining or changing orders might affect your order's eligibility for Free Ground Shipping.</li>";
        modalText += "<li class='free-shipping' tabindex='-1'>If you return all or part of your order, resulting in a merchandise total of less than $29.95, we will refund your money minus the Ground Shipping charge that would have been assessed.</li>";
        modalText += "<li class='free-shipping' tabindex='-1'>If you’re ordering Heat-Sensitive items during warm-weather months (April through October), we strongly recommend choosing Express shipping (UPS Second Day Air or UPS Next Day Air Saver).</li>";
        modalText += "</ul><a href='/shipping-info'>Click here</a> for more info.</div>";
        
        $(document).on('click','.free-shipping-modal', function(e) {
            $.colorbox({
                open : true,
                maxWidth : "75%",
                maxHeight : "110%",
                scrolling : false,
                fadeOut : 500,
                html : modalText,
                overlayClose : true,
                trapFocus: false,
                
                onComplete : function () {
                    $('#cboxClose').css({ 'background-image': 'url("/resources/images/icons/close-popup.png")' });
                    $('#cboxClose').fadeIn();
                    $('#cboxLoadedContent').css({
                        background : "#ffffff"
                    });
                    $('#cboxClose').focus();
                    focusColorBox(); 
                },
                onClosed: function() {
                    $('.free-shipping-modal').focus();
                }
            });
        });
        
        $(document).on('click', '.holiday-shipping-modal', function (e) { 
            $.colorbox({
                open: true,
                maxWidth: "75%",
                maxHeight: "110%",
                scrolling: false,
                fadeOut: 500,
                html: "<div class='holiday-shipping' tabindex='-1' style='padding: 20px;'><strong><a href='javascript:void(0)'>For arrival on or before Christmas - 12/25/2015</a></strong><br /><ul><li class='holiday-shipping' tabindex='-1' ><a href='javascript:void(0)'>UPS SurePost - Place order by 12 PM PT on 12/14/2015</a></li><br /><li class='holiday-shipping' tabindex='-1' ><a href='javascript:void(0)'>UPS Ground - Place order by 12 PM PT on 12/15/2015</a></li><br /><li class='holiday-shipping' tabindex='-1' ><a href='javascript:void(0)'>UPS Three-Day Select - Place order by 12 PM PT on 12/18/2015</a></li><br /><li class='holiday-shipping' tabindex='-1' ><a href='javascript:void(0)'>UPS Second Day Air - Place order by 12 PM PT on 12/21/2015</a></li><br /><li class='holiday-shipping' tabindex='-1' ><a href='javascript:void(0)'>UPS Next Day Air Saver - Place order by 12 PM PT on 12/22/2015</a></li></ul></div>",
                overlayClose: true,
                trapFocus: false,
                onComplete: function () {
                    $('#cboxClose').css({ 'background-image': 'url("/resources/images/icons/close-popup.png")' });
                    $('#cboxClose').fadeIn();
                    $('#cboxLoadedContent').css({
                        background: "#ffffff"
                    });
                    $('#cboxClose').focus();
                    focusColorBox();
                }
            });
        });
        
        var focusColorBox = function(){
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
        };
    
        //ada error handling
        Api.on('error', function (badPromise, xhr, requestConf) {
          console.log(badPromise);
            if(badPromise.message && badPromise.message.indexOf('The following items have limited quantity or are out of stock') > -1){
                $('#mz-errors-list').attr({tabindex:0});
                $('#mz-errors-list').find('li').attr({tabindex:0,role:'contentinfo'});
                $('#mz-errors-list').find('li').focus();
            }
        });
        if(productView.hasYearRoundHeatSensitivity() || productView.isCurrentlySeasonallyHeatSensitive())
        $('#heat-sensitive-message').append('<strong><p><span style="color: #e7131a">IMPORTANT:</span></strong>  During warm-weather months (April through October), we strongly recommend choosing Express shipping (UPS Second Day Air or UPS Next Day Air Saver). Whatever shipping method you choose, we’ll include a cold pack (free of charge) and will ship the order during a specific time frame to give it the best chance to reach you in good condition.</p><p>Please <a style="color: #0077a2; text-decoration:none" href="/shipping_info">click here</a> for more information or <a style="color: #0077a2; text-decoration:none" href="/contact-us">contact us</a>.</p>');  
        require(["modules/add-to-wishlist-modal"]);

        if(productView.hasNoFreeShipping()) {
            setTimeout(function() {
                $('.free-shipping-text').empty();
                $('.free-shipping-text').append('<b><span>Sorry, the price of this product does not count toward the Free Shipping threshold.</span></b>');
            }, 700);
        } else {
            setTimeout(function() {
                $('.truck-div').append('<img src="/resources/images/truck_icon.png" alt="">');
                $('.free-text').append('FREE SHIPPING');
                $('.orders-over-text').append('for orders over $'+ Hypr.getThemeSetting("freeshippingBoundingValue").toFixed(2) +'!');
                $('.click-text').append('(<!-- Restrictions apply. Not valid for <a href="https://www.jellybelly.com/shipping-info#warm-weather" aria-label="heat-sensitive">heat-sensitive</a> orders. -->Click <a href="javascript:void(0)" role="button" class="free-shipping-modal" tabindex="0" title="opens a dialog">here</a> for details.)');
            }, 700);
        }
    
        //scroll 
        var deviceWidth = $(window).width(); 
        if(deviceWidth>767){
            $(window).scroll(function(){
                if ($(window).scrollTop() > $(".tab-header-sec").offset().top) {
                    $(document).find('.scroll-section').show();
                    $(document).find('.progress-bar').addClass('add-progress-bar');
                }
                else {
                    $(document).find('.scroll-section').hide();
                    $(document).find('.progress-bar').removeClass('add-progress-bar');
                }
            });
        }else if(deviceWidth<768){
            $(window).scroll(function(){
                if ($(window).scrollTop() > $(".accordian-list").offset().top) {
                    $(document).find('.mobile-scroll-section').show();
                }
                else {
                    $(document).find('.mobile-scroll-section').hide();
                }
            });
        }
        
        //On click Show more reviews hiding the sticky header
        setTimeout(function(){
            $(document).find('.pr-rd-show-more').on('click',function(){
                setTimeout(function(){
                    if(deviceWidth>767){
                        $(document).find('.scroll-section').hide();
                    }
                },2000);
            });
        },4000); 
        
        //Thumbnail Carousel
        function thumbnailCarousel(){
            setTimeout(function(){
                var len = $(document).find('.mz-productimages-thumbs .mz-productimages-thumb').length,owlMBRP;
                if(len>4 && $(window).width()>767){
                    owlMBRP = $('.mz-productimages-thumbs');
                    owlMBRP.owlCarousel({
                        center          :false,
                        loop            :true,
                        nav             :true,
                        dots            :false,
                        responsive:{
                            768:{
                                items:3
                            },
                            1024:{ 
                                items:4
                            },
                            1025:{
                                items:4
                            },
                            1440:{
                                items:5
                            }
                        }
                    });
                }else if(len>3 && $(window).width()<768){
                owlMBRP = $('.mz-productimages-thumbs');
                owlMBRP.owlCarousel({
                    center          :false,
                    loop            :true,
                    nav             :true,
                    dots            :false,
                    responsive:{
                        0:{
                            items:1
                        },
                        300:{
                            items:3
                        },
                        600:{
                            items:3
                        },
                        767:{
                            items:3
                        } 
                    }
                });
            }   
            }, 500);
        } 
        function relatedProductsCarousel(){
            var len = $(document).find('#related-products .single-product').length,owlMBRP;
            if(len>4 && $(window).width()>1024){
                owlMBRP = $('#related-products').find('.product-row');
                owlMBRP.owlCarousel({
                    center          :false,
                    loop            :true,
                    nav             :true,
                    dots            :false,
                    responsive:{
                        1025:{ 
                            items:4
                        }
                    },
                    onInitialized: updateRelatedProductsCarousel
                });
            }else if(len>3 && $(window).width()>767 && $(window).width()<1025 ){
                owlMBRP = $('#related-products').find('.product-row');
                owlMBRP.owlCarousel({
                    center          :false,
                    loop            :true,
                    nav             :true,
                    dots            :false,
                    responsive:{
                        768:{ 
                            items:2
                        },
                        1024:{ 
                            items:3
                        }
                    }
                });
            }else if(len>2 && $(window).width()>767 && $(window).width()<1024){
                owlMBRP = $('#related-products').find('.product-row');
                owlMBRP.owlCarousel({
                    center          :false, 
                    loop            :true, 
                    nav             :true,
                    dots            :false,
                    responsive:{
                        768:{ 
                            items:2
                        }
                    }
                });
            }else{
                $(document).find('#related-products .single-product').css({'margin-right':'15px'});
            }    
        } 
        //scroll quantity update
        setTimeout(function(){
            $(document).find('.scroll-header .increment').on('click',function(e){
                window.productView.qtyPlus(e,parseInt($(this).parents('.qty-input-box').find('.quantity').val(),10));
            });
            $(document).find('.scroll-header .decrement').on('click',function(e){
                window.productView.qtyMinus(e,parseInt($(this).parents('.qty-input-box').find('.quantity').val(),10));
            });
            $(document).find('#add-to-cart-scroll').on('click',function(){
                window.productView.addToCart();
            });

            $(document).find('.scroll-header .increment').on('keydown',function(e){
                if(e.which === 13 || e.which === 32){
                    e.preventDefault();
                    window.productView.qtyPlus(e,parseInt($(this).parents('.qty-input-box').find('.quantity').val(),10));
                }
            });
            $(document).find('.scroll-header .decrement').on('keydown',function(e){
                if(e.which === 13 || e.which === 32){
                    e.preventDefault();
                    window.productView.qtyMinus(e,parseInt($(this).parents('.qty-input-box').find('.quantity').val(),10));
                }
            }); 
            $(document).find('.scroll-header .qty-input-box .quantity').on('change',function(e){
                window.productView.model.set('quantity', $(this).val());
                $(document).find('.mz-productdetail-conversion-controls .qty-input-box .quantity').val($(this).val());
            });
            $(document).find('#add-to-cart-scroll').on('keydown',function(e){
                if(e.which === 13 || e.which === 32){
                    e.preventDefault();
                    window.productView.addToCart();
                }
            });
            $(document).find('.mz-productdetail-conversion-controls .increment').on('keydown',function(e){
                if(e.which === 13 || e.which === 32){
                    e.preventDefault();
                    window.productView.qtyPlus(e,parseInt($(this).parents('.qty-input-box').find('.quantity').val(),10));
                }
            });
            $(document).find('.mz-productdetail-conversion-controls .decrement').on('keydown',function(e){
                if(e.which === 13 || e.which === 32){
                    e.preventDefault();
                    window.productView.qtyMinus(e,parseInt($(this).parents('.qty-input-box').find('.quantity').val(),10));
                }
            });
           
        },3000);

        //ada for social sharing
        $('.addthis_sharing_toolbox:visible').find('.at-share-btn').attr('tabindex','0');

        setTimeout(function(){
            if($(document).find('.pr-accessible-text').length>0){
                $(document).find('.pr-accessible-text').attr('tabindex','0');
            }
            if($(document).find('.pr-snippet-reco-to-friend').length>0){
                $(document).find('.pr-snippet-reco-to-friend').attr({'tabindex':'0'});
                $(document).find('.pr-snippet-reco-to-friend-percent').attr('aria-hidden','false');
            }
            if($(document).find('.at_flat_counter').length>0){
                $(document).find('.at_flat_counter').attr({'tabindex':'0','role':'contentinfo'});
            }
        },5000);
        
        function updateRelatedProductsCarousel() { 
          setTimeout(function(){ 
            $('.related-section div.owl-prev').attr("aria-label", "Scroll to previous product").attr("role", "button");
            $('.related-section div.owl-next').attr("aria-label", "Scroll to next product").attr("role", "button");
          }, 2000); 
        }
        
        function updateJustunoButton() {
          setTimeout(function(){ 
            $('#ju_bbox p > span > span > span').attr("role", "button").attr("tabindex", 0);
          }, 5000); 
        }
        
        updateJustunoButton();
    });     

});
