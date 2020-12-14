define([
    'modules/backbone-mozu', 
    'hyprlive', 
    'hyprlivecontext', 
    'modules/jquery-mozu', 
    'underscore', 
    'modules/models-customer', 
    'modules/views-paging', 
    'modules/editable-view',
    'modules/api',
    'modules/models-product',
    'modules/models-cart',
    'modules/cart-monitor',
    'modules/minicart',"vendor/jquery.mask"], 
    function(Backbone, Hypr, HyprLiveContext, $, _, CustomerModels, PagingViews, EditableView,
    Api,ProductModels, CartModels, CartMonitor,MiniCart) {

    var AccountSettingsView = EditableView.extend({
        templateName: 'modules/my-account/my-account-settings',
        autoUpdate: [
            'firstName',
            'lastName',
            'emailAddress',
            'acceptsMarketing'
        ],
        constructor: function() {
            EditableView.apply(this, arguments);
            this.editing = false;
            this.invalidFields = {};
        },
        initialize: function() {
            return this.model.getAttributes().then(function(customer) {
                customer.get('attributes').each(function(attribute) {
                    attribute.set('attributeDefinitionId', attribute.get('id'));
                });
                return customer;
            });
        },
        updateAttribute: function(e) {
            var self = this;
            var attributeFQN = e.currentTarget.getAttribute('data-mz-attribute');
            var attribute = this.model.get('attributes').findWhere({
                attributeFQN: attributeFQN
            });
            var nextValue = attribute.get('inputType') === 'YesNo' ? $(e.currentTarget).prop('checked') : $(e.currentTarget).val();

            attribute.set('values', [nextValue]);
            attribute.validate('values', {
                valid: function(view, attr, error) {
                    self.$('[data-mz-attribute="' + attributeFQN + '"]').removeClass('is-invalid')
                        .next('[data-mz-validationmessage-for="' + attr + '"]').text('');
                },
                invalid: function(view, attr, error) {
                    self.$('[data-mz-attribute="' + attributeFQN + '"]').addClass('is-invalid')
                        .next('[data-mz-validationmessage-for="' + attr + '"]').text(error);
                }
            });
        },
        startEdit: function(event) {
            event.preventDefault();
            this.editing = true;
            this.render();
            var x = document.getElementsByClassName('mz-accountsettings-email')[0];
            x.focus();
        },
        cancelEdit: function() {
            this.editing = false;
            this.model.apiModel.get();
        },
        finishEdit: function() {
            var self = this;
            var email = $('.mz-accountsettings-email[type="email"]').val();
            if(this.validate(email)){
                this.$el.find('.edit-user-settings').find('input').attr('aria-invalid',false);
                this.$el.find('.edit-user-settings').find('.mz-validationmessage').html('');
                if(this.$el.find('input')[0].value.length>0 && this.$el.find('input')[1].value.length>0 && this.$el.find('input')[2].value.length>0){
                    this.doModelAction('apiUpdate').then(function() {
                    self.editing = false;
                    self.$el.find('[data-mz-action="startEditName"]').focus();
                    }).otherwise(function() {
                        self.editing = true;
                    }).ensure(function() {
                        self.afterEdit();
                    });
                    
                }else{
                    if(this.$el.find('input')[0].value.length === 0){
                        this.$el.find('input')[0].setAttribute('aria-invalid', true);
                        this.$el.find('input')[0].setAttribute('aria-describedby','err_1');
                        this.$('[data-mz-validationmessage-for="emailAddress"]').show().text(Hypr.getThemeSetting('validEmail')).css('color','#b94a48').attr('id','err_1');
                        this.$el.find('input')[0].focus();
                    }
                    else if(this.$el.find('input')[1].value.length === 0){
                        this.$el.find('input')[1].setAttribute('aria-invalid', true);
                        this.$el.find('input')[1].setAttribute('aria-describedby','err_2');
                        this.$('[data-mz-validationmessage-for="firstName"]').show().text(Hypr.getThemeSetting('firstNameMissing')).css('color','#b94a48').attr('id','err_2');
                        this.$el.find('input')[1].focus();
                    }
                    else if(this.$el.find('input')[2].value.length === 0){
                        this.$el.find('input')[2].setAttribute('aria-invalid', true);
                        this.$el.find('input')[2].setAttribute('aria-describedby','err_3');
                        this.$('[data-mz-validationmessage-for="lastName"]').show().text(Hypr.getThemeSetting('lastNameMissing')).css('color','#b94a48').attr('id','err_3');
                        this.$el.find('input')[2].focus();
                    }
                }
            }
        },
        validate: function(payload) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var patt = new RegExp(re);
            if (!patt.test(payload)) {
                return this.displayMessage(Hypr.getLabel('emailMissing')), false;
            }
            return true;
        },
        displayMessage: function(msg) {
            if($('.msgalertemail').length === 0)
                $('<span class="msgalertemail" style="color:red">'+msg+'</span><br>').insertAfter('.required-label');
        },  
        afterEdit: function() {
            var self = this;

            self.initialize().ensure(function() {
                self.render();
                var x = document.querySelector('[data-mz-action="startEdit"]');
                x.focus();
            });
        }
    });

    var PasswordView = EditableView.extend({
        templateName: 'modules/my-account/my-account-password',
        autoUpdate: [
            'oldPassword',
            'password',
            'confirmPassword'
        ],
        startEditPassword: function () {
            this.editing.password = true;
            this.render();
            var x = document.getElementById('account-password-old');
            x.focus();
        },
        finishEditPassword: function() {
            var self = this;
            function restoreFocus() {
                $('[data-mz-action="startEditPassword"]').focus();
            }
            this.doModelAction('changePassword').then(function() {
                _.delay(function() {
                    self.$('[data-mz-validationmessage-for="passwordChanged"]').show().text(Hypr.getLabel('passwordChanged')).fadeOut(3000);
                }, 250);
            }, function() {
                self.editing.password = true;
            });
            this.editing.password = false;
        },
        cancelEditPassword: function() {
            this.editing.password = false;
            this.render();
            var x = document.querySelector('[data-mz-action="startEditPassword"]');
            x.focus();
        }
        //startEditPhone: function() {
        //    this.editing.phone = true;
        //    this.render();
        //},
        //finishEditPhone: function() {
        //    this.doModelAction('savePrimaryBillingContact');
        //    this.editing.phone = false;
        //},
        //cancelEditPhone: function() {
        //    this.editing.phone = false;
        //    this.render();
        //}
    });
      $(document).find('.popup').on('click', '.button-yes', function(e){
            MiniCart.MiniCart.clearCart();
            setTimeout(function(){ 
                $.cookie("subscriptionCreated", false, { path: '/'});
                $(document).find('[data-mz-productlist]').addClass('is-loading');
                $(document).find('[data-mz-facets]').addClass('is-loading');
                var $target = $(e.target), productCode = $target.attr("productCode");
                $(document).find('[data-mz-message-bar]').hide();             
                $target.addClass('is-loading');            
                var $quantity = $(e.target).attr('quantity');
                var count = parseInt($quantity);            
                Api.get('product', productCode).then(function(sdkProduct) {
                    $(e.target).parents('.popup').removeClass('active');
                    var PRODUCT = new ProductModels.Product(sdkProduct.data);
                    var variantOpt = sdkProduct.data.options;                    
                    if(variantOpt !== undefined && variantOpt.length>0){  
                        var newValue = $target.parent().parent().find('[plp-giftcart-prize-change-action]')[0].value;
                        var ID =  $target.parent().parent().find('[plp-giftcart-prize-change-action]')[0].getAttribute('data-mz-product-option');
                        if(newValue != "Select gift amount" && newValue !== ''){
                            if("Tenant~gift-card-prices" !== ID && window.location.host !== "www.jellybelly.com"){
                                ID = "Tenant~gift-card-prices";
                            }
                            var option = PRODUCT.get('options').get(ID);
                            var oldValue = option.get('value');
                            if (oldValue !== newValue && !(oldValue === undefined && newValue === '')) {
                                option.set('value', newValue);
                            }
                            setTimeout(function(){
                                window.WishListView.addToCartAndUpdateMiniCart(PRODUCT,count,$target);
                            },2000);
                        }else{
                            window.WishListView.showErrorMessage("Please choose the Gift Card amount before adding it to your cart. <br> Thanks for choosing to give a Jelly Belly Gift Card!");
                            $target.removeClass('is-loading');
                        }
                    }else{
                        window.WishListView.addToCartAndUpdateMiniCart(PRODUCT,count,$target);
                    }
                });
                setTimeout(function(){ 
                     $target.focus(); 
                },1000); 
            },200);  
        });
    var WishListView = EditableView.extend({
        templateName: 'modules/my-account/my-account-wishlist',
        addItemToCart: function (e) {
            var self = this, $target = $(e.currentTarget),
            id = $target.data('mzItemId');
            var Item = this.model.get('items').filter(function(ele){return ele.id == id ? true:false;});
            if (Item.length > 0) {  
                // this.editing.added = id;
                // return this.doModelAction('addItemToCart', id).then(function() {
                //     document.getElementById('x-account-wishlist').focus();
                // }, function(){
                //     $('[data-mz-message-bar]').find('.mz-errors').focus();
                //     setTimeout(function(){
                //         document.getElementById('x-account-wishlist').focus();
                //     }, 6000);
                // });
                if($.cookie("subscriptionCreated") !== "true"){
                    var count = Item[0].quantity;
                    Api.get('product', Item[0].product.productCode).then(function(sdkProduct) {
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
                                self.addToCartAndUpdateMiniCart(PRODUCT,count,$target);
                            },2000);
                        }else{
                            self.showErrorMessage("Please choose the Gift Card amount before adding it to your cart. <br> Thanks for choosing to give a Jelly Belly Gift Card!");
                            $(document).find('.RTI-overlay').removeClass('active');
                        }
                    }else{
                        var pro = PRODUCT, qntcheck = 0, ProItems = MiniCart.MiniCart.getRenderContext().model.items;
                        ProItems.filter(function(ele){if(ele.product.productCode == pro.get('productCode') && ((ele.quantity + count) > 50)){qntcheck = 1;}});
                        if(pro.get('price.price') === 0 && ProItems.length > 0 ){
                            var cartItems = ProItems, len = cartItems.length;
                            for(var i=0;i<len;i++){
                                if(cartItems[i].product.productCode === pro.get('productCode')){
                                    if(cartItems[i].product.price.price === pro.get('price.price')){
                                        $(document).find('.RTI-overlay').removeClass('active');
                                        $('.zero-popup').show();
                                        return false;
                                    }
                                }
                            }
                            if(sdkProduct.data.purchasableState.isPurchasable){
                                self.addToCartAndUpdateMiniCart(PRODUCT,count,$target);
                            }else{
                                self.notifyMeShowpopUp(sdkProduct.data.productCode,id);   
                            }
                        }else if(qntcheck){
                            $(document).find('.RTI-overlay').removeClass('active');
                            $(".items-per-order").show();
                            return false;
                        }else{
                            if(sdkProduct.data.purchasableState.isPurchasable){
                                self.addToCartAndUpdateMiniCart(PRODUCT,count,$target);
                            }else{
                                self.notifyMeShowpopUp(sdkProduct.data.productCode,sdkProduct.data.inventoryInfo.onlineLocationCode,id);   
                            }
                        }
                    }
                });
                }else{
                    $(document).find('.popup').removeClass('inactive');
                    $(document).find('.popup').addClass('active');
                     $target = $(e.currentTarget);
                    var productCode = Item[0].product.productCode;
                    var $quantity = Item[0].quantity;
                    $(document).find('.popup').find('.button-yes').attr('productCode',productCode);
                    $(document).find('.popup').find('.button-yes').attr('quantity',$quantity);
                    $(document).find('.popup').find('.button-yes').attr('isOrder', false);
                    $(document).find('.popup').find('.button-yes').attr('isWishlist', true);
                    $(document).find('.popup').find('.button-yes').attr('addAll', false);
                }
            }
        },
        notifymedilog : function(){
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
        },
        notifyMeShowpopUp: function(code,location,lineitem){
            var self = this;
            //alert(e.target.getAttribute('data-mz-product-code'));
            $.colorbox({
                open : true,  
                maxWidth : "100%",
                maxHeight : "100%",
                scrolling : false,
                fadeOut : 500,  
                html :"<div id='notify-me-dialog' tabindex='0' style='padding: 30px 15px;' role='dialog' aria-labelledby='Noiify me sign up dialog'><form><span>Enter your email address to be notified when this item is back in stock.</span><br><input class='notify-me-field' aria-describedBy='' aria-invalid='false' tabindex='0' style='margin-top: 10px;' id='notify-me-email' type='text' aria-label='Enter email address text field' value='"+require.mozuData('user').email+"'><a tabindex='0' href='javascript:void(0);' style='background: #39A857;text-decoration: none; color: #ffffff; padding: 3px; margin-left: 5px; cursor: pointer;' role='button' aria-label='notify me' id='notify-me-button' data-mz-location-code = '"+location+"' data-mz-product-code='" +code+ "'>Notify Me</a></form><span class='notify-error' id='notify-error' style='font-size:13px;color:red;display:none;'>Error: Please enter valid mail address.</span></div>", //"/resources/intl/geolocate.html",
                overlayClose : true,
                onComplete : function () {
                    $('#cboxClose').css({'background-image': 'url("../../resources/images/icons/close_popup.png")'});
                    $('#cboxClose').show();
                    $('#cboxLoadedContent').css({
                       background : "#ffffff" 
                   });
                   $('#notify-me-dialog').focus();
                   self.notifymedilog();
               } 
            }); 
            self.notifymedilog();
            $(document).find('body').addClass("haspopup");
            
            $(document).on('click','#cboxClose',function(e) {
                $(document).find('.action-addToCart[data-mz-item-id="'+lineitem+'"]').focus(); 
            });
            
            $(document).on('click', '#notify-me-button', function(e){
                if($('#notify-me-email').val() !== ""){ 
                    $('.notify-error').hide();
                    $('#notify-me-email').attr('aria-describedBy','');  
                    $('#notify-me-email').attr('aria-invalid',false); 
                    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    var patt = new RegExp(re);
                    if(patt.test($('#notify-me-email').val())){
                        var obj = { 
                        email: $('#notify-me-email').val(),   
                        customerId: require.mozuData('user').accountId,
                        productCode: e.target.getAttribute('data-mz-product-code'), 
                            locationCode: e.target.getAttribute('data-mz-location-code')
                        };                       

                        Api.create('instockrequest',obj ).then(function (xhr) {
                            $("#notify-me-dialog").fadeOut(500, function () { $("#notify-me-dialog").empty().html("<div class='success-msg' tabindex='0'>Thank you! We'll let you know when we have more.</div>").fadeIn(500); });
                            setTimeout(function(){self.notifymedilog(); $("#notify-me-dialog").find('.success-msg').focus(); }, 1200);
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
                                    $('#notify-me-button').after('<span style="color:red;font-size: 12px;display:block;" id="errormsgpopup" class="errormsgpopup" role="contentinfo" tabindex="0">'+xhr.items[0].message+'</span>');
                                    $('#notify-me-email').attr('aria-describedBy','errormsgpopup');
                                    // $("#notify-me-dialog").find('.errormsgpopup').focus();
                                    $('#notify-me-email').focus();
                                    }else{
                                        $('#notify-me-button').after('<span style="color:red;font-size: 12px;display:block;" id="errormsgpopup" class="errormsgpopup" role="contentinfo" tabindex="0">'+xhr.message+'</span>');
                                        $('#notify-me-email').attr('aria-describedBy','errormsgpopup');
                                        // $("#notify-me-dialog").find('.errormsgpopup').focus();
                                        $('#notify-me-email').focus();
                                    }       
                                }else{
                                    $('[data-mz-message-bar]').hide();
                                    $('#notify-me-button').next('.errormsgpopup').remove();
                                    $('#notify-me-button').after('<span style="color:red;font-size: 12px;display:block;" id="errormsgpopup" class="errormsgpopup" tabindex="0">Error: Email id you have provided already subscribed for back in stock notification.</span>');
                                    $('#notify-me-email').attr('aria-describedBy','errormsgpopup');
                                    // $("#notify-me-dialog").find('.errormsgpopup').focus();
                                    $('#notify-me-email').focus();
                                    
                                }    
                                $('[data-mz-message-bar]').hide();  
                            });
                    }else{
                        $('#notify-me-email').attr('aria-describedBy','notify-error');
                        $('#notify-me-email').attr('aria-invalid',true);
                        $('.notify-error').show();  
                        $('.errormsgpopup').hide();
                        $('#notify-me-email').focus();
                    }
                }else{
                    $('#notify-me-email').attr('aria-describedBy','notify-error');
                    $('#notify-me-email').attr('aria-invalid',true);
                    $('.notify-error').show();  
                    $('.errormsgpopup').hide();  
                    $('#notify-me-email').focus();
                }
            }); 
        },
        addToCartAndUpdateMiniCart: function(PRODUCT,count,$target){
            var self = this;
            PRODUCT.set({'quantity':count});
            $(document).find('.RTI-overlay').addClass('active');
            PRODUCT.addToCart(1);
            PRODUCT.on('addedtocart', function(attr) {
                $(document).find('.RTI-overlay').removeClass('active');
				brontoObj.build(Api);  
                CartMonitor.update();
                MiniCart.MiniCart.showMiniCart();
                PRODUCT = '';  
            });  
            Api.on('error', function (badPromise, xhr, requestConf) {
                self.showErrorMessage(badPromise.message);
                $(document).find('.RTI-overlay').removeClass('active');
            });
        },
        showErrorMessage:function(msg){
            $('[data-mz-message-bar]').empty();
            $('[data-mz-message-bar]').append('<p tabindex="0" role="contentinfo">Error: '+msg+'</p>');
            $('#account-messages').show();
            $('[data-mz-message-bar]').fadeIn();
            $('[data-mz-message-bar]').find('p').css('color','red');
            $('[data-mz-message-bar]').find('p').focus();
            setTimeout(function(){
                $('[data-mz-message-bar]').hide();
                $('#account-messages').hide();
            },4000);
            $('.jb-inner-overlay').remove();
            // $("html, body").animate({scrollTop:  $(".mz-l-paginatedlist").offset().top }, 1000);
        },
        doNotRemove: function() {
            this.editing.added = false;
            this.editing.remove = false;
            this.render();
        },
        beginRemoveItem: function (e) {
            var self = this;
            var id = $(e.currentTarget).data('mzItemId');
            if (id) {
                this.editing.remove = id;
                this.render();
            }
        },
        finishRemoveItem: function(e) {
            var self = this;
            var id = $(e.currentTarget).data('mzItemId');
            if (id) {
                var removeWishId = id;
                // return this.model.apiDeleteItem(id).then(function () {
                //     self.editing.remove = false;
                //     var itemToRemove = self.model.get('items').where({ id: removeWishId });
                //     if (itemToRemove) {
                //         self.model.get('items').remove(itemToRemove);
                //         self.render();
                //     }
                // });
                //var Url = "api/commerce/wishlists/"+this.model.get('WishlistId')+"/items";
                var url = "api/commerce/wishlists/"+this.model.get('WishlistId')+"/items/"+removeWishId;
                Api.request('DELETE',url).then(function(resp) {
                    var tempItems = self.model.get('items').filter(function(ele){return ele.id == removeWishId?false:true;});
                    self.model.set('items', tempItems); 
                    self.render();       
                });    
            }
        },
        removeAllItems: function(e){
            var self = this;
            var url = "api/commerce/wishlists/"+this.model.get('WishlistId')+"/items";
            Api.request('DELETE',url).then(function(resp) {
                self.model.set('items', []); 
                self.render();       
            });    
        },
        removePopup: function(e){
            $(document).find('.conformation-poup').show();
            $(document).find('.conformation-poup').find('.content').focus();
            this.activateloopinginmodal();
        },
        activateloopinginmodal: function() { 
            window.inputs = $(document).find('.conformation-poup').find('button,div[tabindex="0"]').filter(':visible');
            window.firstInput = window.inputs.first();
            window.lastInput = window.inputs.last();

            // if current element is last, get focus to first element on tab press.
            window.lastInput.on('keydown', function(e) {
                if ((e.which === 9 && !e.shiftKey)) {
                    e.preventDefault();
                    window.firstInput.focus();  
                }
            });

            // if current element is first, get focus to last element on tab+shift press.
            window.firstInput.on('keydown', function(e) {
                if ((e.which === 9 && e.shiftKey)) {
                    e.preventDefault();
                    window.lastInput.focus();
                }
            });
        },
        cancelremoving: function(){
            $(document).find('.conformation-poup').hide();     
        },
        lodemoreItems:function(e){
            var self = this, focusitem = self.model.get('items').length; 
            var url = "api/commerce/wishlists/"+this.model.get('WishlistId')+"/items?startIndex="+this.model.get('items').length+"&pageSize=11&sortBy=createDate desc";
            Api.request('GET',url).then(function(resp) {
                if(resp.items.length < 11 || (self.model.get('items').length+resp.items.length-1) >= 50){
                    self.model.set('showWishlistLoadMore',false);
                }
                if(resp.items.length > 10)resp.items.pop();
                if(50 - self.model.get('items').length < 10){
                    resp.items = resp.items.slice(0, (50 - self.model.get('items').length+1));    
                }
                var length = self.model.get('items').length;
                self.model.set('totalCount',(length + resp.items.length));
                for(var i = 0; i < resp.items.length; i++){
                    self.model.get('items').push(resp.items[i]);
                } 
                self.render();
                setTimeout(function(){$($(document).find('.mz-table').find('.item-tr')[focusitem]).find('.itemlisting-title').focus();},1500);    
            });  
        }
    });
    
    var OrderHistoryView = Backbone.MozuView.extend({
        templateName: "modules/my-account/order-history-list",
        currentOrderId: '',
        autoUpdate: [
            'rma.returnType',
            'rma.reason',
            'rma.quantity',
            'rma.comments'
        ],
        initialize: function () {
            // this.listenTo(this.model, "change:pageSize", _.bind(this.model.changePageSize, this.model));
        },
        loadMoreItems: function(){
            this.model.changePageSize(true);    
        },
        increaseReturnQuantity: function(){
            $('[data-mz-value="rma.quantity"]').val($('[data-mz-value="rma.quantity"]').val()===""?1:parseInt($('[data-mz-value="rma.quantity"]').val())+1);
        },
        decreaseReturnQuantity: function(){
            $('[data-mz-value="rma.quantity"]').val($('[data-mz-value="rma.quantity"]').val()===""?1:parseInt($('[data-mz-value="rma.quantity"]').val())-1);
        },
        getRenderContext: function () {
            var context = Backbone.MozuView.prototype.getRenderContext.apply(this, arguments);
            context.returning = this.returning;
            if(context.model.hasNextPage) {
                context.model.allLoaded = 1;
            }else{
                context.model.allLoaded = 2;
            }
            return context;
        },
        decreaseQuickOrderQuantity: function(e){
            var productId = e.currentTarget.getAttribute('quickOrderProductCodeQuantityChanger');
            var orderId = $(e.currentTarget).parents('[orderid]').attr('orderid');
            var variantCode;
            
                if($(e.currentTarget).attr('variationcode')){
                    variantCode = $(e.currentTarget).attr('variationcode');
                    if(parseInt($('[orderId="'+orderId+'"] .quick-order-history .quantity-field[variationcode="'+variantCode+'"][OrderProductId="'+productId+'"]').val(),10)<2){
                        $('[orderId="'+orderId+'"] [data-mz-action="decreaseQuickOrderQuantity"][variationcode="'+variantCode+'"][quickorderproductcodequantitychanger="'+productId+'"]').prop('disabled', true);
                    }else{
                        $('[orderid="'+orderId+'"] .quick-order-history .quantity-field[variationcode="'+variantCode+'"][OrderProductId="'+productId+'"]').val($('[orderid="'+orderId+'"] .quick-order-history [variationcode="'+variantCode+'"][OrderProductId="'+productId+'"]').val()===""?1:parseInt($('[orderid="'+orderId+'"] .quick-order-history [variationcode="'+variantCode+'"][OrderProductId="'+productId+'"]').val())-1);
                        $('[orderid="'+orderId+'"] [data-mz-action="decreaseQuickOrderQuantity"][variationcode="'+variantCode+'"][quickorderproductcodequantitychanger="'+productId+'"]').prop('disabled', false);
                        $('[orderid="'+orderId+'"] [data-mz-action="increaseQuickOrderQuantity"][variationcode="'+variantCode+'"][quickorderproductcodequantitychanger="'+productId+'"]').prop('disabled', false);
                    }
                }else{
                    if(parseInt($('[orderId="'+orderId+'"] .quick-order-history .quantity-field[OrderProductId="'+productId+'"]').val(),10)<2){
                        $('[orderId="'+orderId+'"] [data-mz-action="decreaseQuickOrderQuantity"][quickorderproductcodequantitychanger="'+productId+'"]').prop('disabled', true);
                    }else{
                        $('[orderid="'+orderId+'"] .quick-order-history .quantity-field[OrderProductId="'+productId+'"]').val($('[orderid="'+orderId+'"] .quick-order-history [OrderProductId="'+productId+'"]').val()===""?1:parseInt($('[orderid="'+orderId+'"] .quick-order-history [OrderProductId="'+productId+'"]').val())-1);
                        $('[orderid="'+orderId+'"] [data-mz-action="decreaseQuickOrderQuantity"][quickorderproductcodequantitychanger="'+productId+'"]').prop('disabled', false);
                        $('[orderid="'+orderId+'"] [data-mz-action="increaseQuickOrderQuantity"][quickorderproductcodequantitychanger="'+productId+'"]').prop('disabled', false); 
                    }
            }
            ///prevent negative quantity
            
          /*  $('[data-mz-action="increaseQuickOrderQuantity"][quickorderproductcodequantitychanger="'+productId+'"]').click(function(){
                $('[data-mz-action="decreaseQuickOrderQuantity"][quickorderproductcodequantitychanger="'+productId+'"]').prop('disabled', false);
            });
            $('[data-mz-action="decreaseQuickOrderQuantity"][quickorderproductcodequantitychanger="'+productId+'"]').click(function(e){
                if($('[quickOrderQuantity][quickOrderProductId="'+productId+'"]').val()<=1) {
                    $('[data-mz-action="decreaseQuickOrderQuantity"][quickorderproductcodequantitychanger="'+productId+'"]').prop('disabled', true); 
                    $('[data-mz-action="increaseQuickOrderQuantity"][quickorderproductcodequantitychanger="'+productId+'"]').click();
                    
                } 
            }); */
        },
        increaseQuickOrderQuantity: function(e){
            var productId = e.currentTarget.getAttribute('quickOrderProductCodeQuantityChanger');
            var orderId = $(e.currentTarget).parents('[orderid]').attr('orderid');
            var variantCode;
            if($(e.currentTarget).attr('variationcode')){
                variantCode = $(e.currentTarget).attr('variationcode');
                if(parseInt($('[orderid="'+orderId+'"] .quick-order-history .quantity-field[variationcode="'+variantCode+'"][OrderProductId="'+productId+'"]').val(),10)> 24 ){
                    $('[orderid="'+orderId+'"] [data-mz-action="increaseQuickOrderQuantity"][variationcode="'+variantCode+'"][quickorderproductcodequantitychanger="'+productId+'"]').prop('disabled', true);
                }else{
                    $('[orderid="'+orderId+'"] .quick-order-history .quantity-field[variationcode="'+variantCode+'"][OrderProductId="'+productId+'"]').val($('[orderid="'+orderId+'"] .quick-order-history [variationcode="'+variantCode+'"][OrderProductId="'+productId+'"]').val()===""?1:parseInt($('[orderid="'+orderId+'"] .quick-order-history [variationcode="'+variantCode+'"][OrderProductId="'+productId+'"]').val())+1);
                    $('[orderid="'+orderId+'"] [data-mz-action="increaseQuickOrderQuantity"][variationcode="'+variantCode+'"][quickorderproductcodequantitychanger="'+productId+'"]').prop('disabled', false);
                    if(parseInt($('[orderid="'+orderId+'"] .quick-order-history .quantity-field[variationcode="'+variantCode+'"][OrderProductId="'+productId+'"]').val(),10)>1 ){
                        $('[orderid="'+orderId+'"] [data-mz-action="decreaseQuickOrderQuantity"][variationcode="'+variantCode+'"][quickorderproductcodequantitychanger="'+productId+'"]').prop('disabled', false);
                    }
                }
            }else{
                if(parseInt($('[orderid="'+orderId+'"] .quick-order-history .quantity-field[OrderProductId="'+productId+'"]').val(),10)> 24 ){
                    $('[orderid="'+orderId+'"] [data-mz-action="increaseQuickOrderQuantity"][quickorderproductcodequantitychanger="'+productId+'"]').prop('disabled', true);
                }else{
                    $('[orderid="'+orderId+'"] .quick-order-history .quantity-field[OrderProductId="'+productId+'"]').val($('[orderid="'+orderId+'"] .quick-order-history [OrderProductId="'+productId+'"]').val()===""?1:parseInt($('[orderid="'+orderId+'"] .quick-order-history [OrderProductId="'+productId+'"]').val())+1);
                    $('[orderid="'+orderId+'"] [data-mz-action="increaseQuickOrderQuantity"][quickorderproductcodequantitychanger="'+productId+'"]').prop('disabled', false);
                    if(parseInt($('[orderid="'+orderId+'"] .quick-order-history .quantity-field[OrderProductId="'+productId+'"]').val(),10)>1 ){
                        $('[orderid="'+orderId+'"] [data-mz-action="decreaseQuickOrderQuantity"][quickorderproductcodequantitychanger="'+productId+'"]').prop('disabled', false);
                    }
                }
            }
        },
        addInlineItemToCart: function(e){
            var productId,orderNumber;
            if($.cookie("subscriptionCreated") !== "true"){
                productId = e.currentTarget.getAttribute('quickOrderProductCode');
                orderNumber = $(e.currentTarget).parents('[orderid]').attr('orderid');
                var quantityElement;
                //var variantCode = e.currentTarget.getAttribute('variationCode');
                if(e.currentTarget.getAttribute('variationCode')){
                    quantityElement = $('[orderid="'+orderNumber+'"] .quick-order-history .quantity-field[variationCode="'+e.currentTarget.getAttribute('variationCode')+'"][OrderProductId="'+productId+'"]');
                }else{
                    quantityElement = $('[orderid="'+orderNumber+'"] .quick-order-history .quantity-field[OrderProductId="'+productId+'"]');
                }
                
                var productCodes = [];
                var product = {
                    productCode:productId,
                    qty:quantityElement[0].value
                };
                if(e.currentTarget.getAttribute('variationCode')){
                    product.variantcode = e.currentTarget.getAttribute('variationCode');
                }
                productCodes.push(product);
                this.makeQuickOrder(productCodes,orderNumber,orderNumber); 
                window.targetFocusEl = e.target;
            }else{
                productId = e.currentTarget.getAttribute('quickOrderProductCode');
                orderNumber = $(e.currentTarget).parents('[orderid]').attr('orderid');
                $(document).find('.popup').removeClass('inactive');
                $(document).find('.popup').addClass('active');
                $(document).find('.popup').find('.button-yes').attr('isOrder', true);
                $(document).find('.popup').find('.button-yes').attr('isWishlist', false);
                $(document).find('.popup').find('.button-yes').attr('addAll', false);
                $(document).find('.popup').find('.button-yes').attr('orderId', orderNumber);
                $(document).find('.popup').find('.button-yes').attr('productId', productId);
            }
        },
        removerProductandAddtocart: function(orderNumber,productId,e){
            var self = this;
            MiniCart.MiniCart.clearCart();
            var quantityElement;
            //var variantCode = e.currentTarget.getAttribute('variationCode');
            if(e && e.currentTarget &&  e.currentTarget.getAttribute('variationCode')){
                quantityElement = $('[orderid="'+orderNumber+'"] .quick-order-history .quantity-field[variationCode="'+e.currentTarget.getAttribute('variationCode')+'"][OrderProductId="'+productId+'"]');
            }else{
                quantityElement = $('[orderid="'+orderNumber+'"] .quick-order-history .quantity-field[OrderProductId="'+productId+'"]');
            }
            
            var productCodes = [];
            var product = {
                productCode:productId,
                qty:quantityElement[0].value
            };
            if(e && e.currentTarget && e.currentTarget.getAttribute('variationCode')){
                product.variantcode = e.currentTarget.getAttribute('variationCode');
            }
            productCodes.push(product);
            this.makeQuickOrder(productCodes,orderNumber,orderNumber); 
            window.targetFocusEl = e.target;
        },
        addAllToCart: function(e){
            var el = e;
            var orderId = e.currentTarget.getAttribute('orderToAdd');
            if($.cookie("subscriptionCreated") !== "true"){
                $('[data-mz-action="addAllToCart"][orderToAdd="'+orderId+'"]').addClass('active');
                var products = [];
                var locationCodes = [];
                var locCode;
                var productCodes = [];
                var prodCode;
                //var productQuantity = [];
                 
                //var orderItems = $('[data-mz-QuickOrder][QorderId="'+orderId+'"]').find('[quickOrderProductCode]');
                var orderItems = $('.mz-orderlisting-items[orderid="'+orderId+'"]').find('.quantity-field');
                $(orderItems).each(function(key,val){
                    var product = {
                      productcode:val.getAttribute('orderproductid'),
                      quantity: parseInt(val.value)
                    };
                    if(val.getAttribute('variationcode')){
                        product.variantcode = val.getAttribute('variationcode');
                    }

                    products.push(product);

                    locCode = val.getAttribute('prodLocationCode');
                    prodCode = val.getAttribute('orderproductid');

                    locationCodes.push(locCode);
                    productCodes.push(prodCode);
                });

                var itemNamesElement = $("[orderid='"+orderId+"']").find('.mz-itemlisting-details');
                var itemNames = [];

                itemNamesElement.each(function(key, val){
                    itemNames.push({
                        productCode: $(val).find('div').text().trim(),
                        productName: $(val).find('a').text().trim()
                    });
                });
                /*var orderQuantity = $('[data-mz-QuickOrder][QorderId="'+orderId+'"]').find('[quickOrderQuantity]');
                $(orderQuantity).each(function(key,val){
                    productQuantity.push(val.value);
                });*/
                this.makeQuickBulkOrder(el, products, orderId, locationCodes, productCodes, itemNames);
                window.targetFocusEl = e.target;
            }else{
                $(document).find('.popup').addClass('active');
                $(document).find('.popup').find('.button-yes').attr('isOrder', true);
                $(document).find('.popup').find('.button-yes').attr('isWishlist', false);
                $(document).find('.popup').find('.button-yes').attr('addAll', true);
                $(document).find('.popup').find('.button-yes').attr('orderId', orderId);
                $(document).find('.popup').find('.button-yes').attr('productId', "");   
            }
        },
        removerProductandAddalltoCart: function(orderId,e){
                $('[data-mz-action="addAllToCart"][orderToAdd="'+orderId+'"]').addClass('active');
                var products = [];
                var locationCodes = [];
                var locCode;
                var productCodes = [];
                var prodCode;
                //var productQuantity = [];
                 
                //var orderItems = $('[data-mz-QuickOrder][QorderId="'+orderId+'"]').find('[quickOrderProductCode]');
                var orderItems = $('.mz-orderlisting-items[orderid="'+orderId+'"]').find('.quantity-field');
                $(orderItems).each(function(key,val){
                    var product = {
                      productcode:val.getAttribute('orderproductid'),
                      quantity: parseInt(val.value)
                    };
                    if(val.getAttribute('variationcode')){
                        product.variantcode = val.getAttribute('variationcode');
                    }

                    products.push(product);

                    locCode = val.getAttribute('prodLocationCode');
                    prodCode = val.getAttribute('orderproductid');

                    locationCodes.push(locCode);
                    productCodes.push(prodCode);
                });

                var itemNamesElement = $("[orderid='"+orderId+"']").find('.mz-itemlisting-details');
                var itemNames = [];

                itemNamesElement.each(function(key, val){
                    itemNames.push({
                        productCode: $(val).find('div').text().trim(),
                        productName: $(val).find('a').text().trim()
                    });
                });
                /*var orderQuantity = $('[data-mz-QuickOrder][QorderId="'+orderId+'"]').find('[quickOrderQuantity]');
                $(orderQuantity).each(function(key,val){
                    productQuantity.push(val.value);
                });*/
                var el=e;
                this.makeQuickBulkOrder(el, products, orderId, locationCodes, productCodes, itemNames);
                window.targetFocusEl = e.target;    
        },
        makeQuickBulkOrder: function(el, products,orderId,locationCodes,productCodes,itemNames){

            var self = this;
            
            var orderHistoryItems = products; // items from order history
            var miniCartItems = MiniCart.MiniCart.getRenderContext().model.items; // items from cart
            

            var totalItems = []; // total items from both order history and cart

            var removedProducts = []; // items that are more than the inventory
            var addToCartProducts = []; // items that are added to the cart from order history


            // Adding items from cart and order history
            if(miniCartItems.length > 0){
                orderHistoryItems.forEach(function(val, key){
                    miniCartItems.forEach(function(val1, key1){
                        if(val.productcode === val1.product.productCode){
                            totalItems.push({
                                productcode: val.productcode,
                                quantity: parseInt(val.quantity) + parseInt(val1.quantity)
                            });
                        }
                    });
                });
                totalItems = orderHistoryItems;
            }
            else if(totalItems.length === 0){
                totalItems = products;
            }

            // Comparing total items from order history and cart to the inventory
            Api.request('POST','api/commerce/catalog/storefront/products/locationinventory?pageSize=500',{productCodes:productCodes,locationCodes:locationCodes.filter(function(R,i){return locationCodes.indexOf(R) == i;})}).then(function(res){
                totalItems.forEach(function(val, key){
                    res.items.forEach(function(val1, key1){
                        if(val.productcode === val1.productCode){
                            if(val1.stockAvailable < val.quantity){
                                itemNames.forEach(function(val2, key2){
                                    if(val2.productCode === val.productcode){
                                        removedProducts.push({
                                            productcode: val.productcode,
                                            quantity: val.quantity,
                                            productname: val2.productName
                                        });
                                    }
                                });
                            } else {
                                products.forEach(function(val3, key3){
                                    if(val.productcode === val3.productcode){
                                        addToCartProducts.push({
                                            productcode: val3.productcode,
                                            quantity: val3.quantity,
                                        });
                                    }
                                });
                            }
                        }
                    });
                });


                // displaying the error - if the item quantity is more than the inventory
                if(removedProducts.length > 0){
                    $('.order-history-error-popup').css('display','flex');
                    $('.data-item').append('<li style="font-weight:bold">The following products are out of stock, hence they are not added to the cart.</li>');
                    
                    removedProducts.forEach(function(val, key){
                        $('.data-item').append('<li style="font-weight:bold;color:red">'+val.productname+'</li>');
                    });

                    $('.data-item').attr({'tabindex':0,'role':'contentinfo'});
                    $('.data-item').focus();

                    setTimeout(function(){
                        $('.order-history-error-popup').css('display','none');
                        $('.data-item').html(''); 
                        $(el.currentTarget).focus();

                        // finally, adding the items to the cart
                        if(addToCartProducts.length > 0){
                            self.bulkAddToCart(addToCartProducts, removedProducts);
                        }

                    }, 4000);
  
                } else if(addToCartProducts.length > 0){
                    // finally, adding the items to the cart
                    self.bulkAddToCart(addToCartProducts, removedProducts);
                }

                // console.log("removedProducts",removedProducts);
                // console.log("addToCartProducts",addToCartProducts);

                
            });
        },
        bulkAddToCart: function(addToCartProducts, removedProducts){
            Api.request('POST', 'svc/bulkadd', addToCartProducts).then(function(res){
                console.log(res);
                CartMonitor.update();
                MiniCart.MiniCart.showMiniCart(window.targetFocusEl);
            });
        },
        makeQuickOrder: function(products,orderId,locationCodes,productCodes,itemNames){ 
            var errorArray = [], self = this, productAdded = 0,time = 1500;
            $('.order-history-overlay').show();

            $(products).each(function(key,pid){
                setTimeout(function(){
                var count = key;
                Api.get('product', pid.productCode).then(function(sdkProduct) {
                    var PRODUCT = new ProductModels.Product(sdkProduct.data);
                    var variantOpt = sdkProduct.data.options;
                    if(variantOpt !== undefined && variantOpt.length>0){  
                        var newValue = $('.mz-orderlisting-items[orderid="'+orderId+'"] .inline[variationcode="'+pid.variantcode+'"][OrderProductId="'+pid.productCode+'"]').attr('productPrice');
                        var ID =  $('.mz-orderlisting-items[orderid="'+orderId+'"] .inline[variationcode="'+pid.variantcode+'"][OrderProductId="'+pid.productCode+'"]').attr('options');
                        if(newValue != "Select gift amount" && newValue !== ''){
                            if("Tenant~gift-card-prices" !== ID && window.location.host !== "www.jellybelly.com"){
                                ID = "Tenant~gift-card-prices";
                            }
                            var option = PRODUCT.get('options').get(ID);
                            var oldValue = option.get('value');
                            if (oldValue !== newValue && !(oldValue === undefined && newValue === '')) {
                                option.set('value', newValue);
                                //console.log(option);
                            }
                        }
                    }
                     setTimeout(function(){
                        PRODUCT.set({'quantity':pid.qty });
                        PRODUCT.addToCart();
                            PRODUCT.on('addedtocart', function(attr) {
                            productAdded++;
                            PRODUCT = ''; 
                            if(productAdded  === products.length ){
                                self.showMessages(errorArray, productAdded,orderId);
                            }
                            $(document).find('.popup').removeClass('active');
                        });
                        PRODUCT.on('error',function(err){
                            productAdded++;
                            if(err.message.indexOf('out of stock')>-1){
                                var error = PRODUCT.get('content.productName').replace(/\&reg;|&copy;|&trade;/g, '') +' '+ Hypr.getThemeSetting('outofstock');
                                 errorArray.push(error);
                            }else{
                                 errorArray.push(err.message.substring(err.message.indexOf('Validation')));
                            }
                            if(productAdded  === products.length ){
                                self.showMessages(errorArray, productAdded,orderId);
                            }
                            $(document).find('.popup').removeClass('active');
                            
                        }); 
                     },2000);
                    /*
                        Api.on('error', function (badPromise, xhr, requestConf) {
                            productAdded++;
                            errorArray.push(badPromise.message);
                            if(productAdded  === products.length ){
                                self.showMessages(errorArray, productAdded,orderId);
                            }
                            $('.order-history-overlay').hide();
                        });            
                            },2000);
                    */
                    
                },function(errorResp){
                    errorArray.push(errorResp.message);
                    if(productAdded  === products.length - 1){
                        self.showMessages(errorArray, productAdded,orderId);
                    }
                     $('.order-history-overlay').hide();
                });
                },time);
                time+=1000;
            });
        },
        showMessages: function(errorArray, productAdded,orderId){
            //show All error messges
            $('#account-messages').hide();
            var msg = "";
            if(errorArray.length>0){
                $(errorArray).each(function(key ,value){
                    msg = msg + "<p tabindex='0' role='contentinfo'>" + value + "</p>";
                });
                $('#account-messages')[0].style.background = "#F06D6D";
                $('#account-messages')[0].style.border = "1px solid #959494";
                $('#account-messages')[0].style.padding = "5px";
                $('[data-mz-message-bar]').html(msg);
                setTimeout(function(){
                    $('#account-messages').find('p').focus();
                },1000);
                $('html, body').animate({
                    scrollTop: $(".mz-myaccount-panels").offset().top
                }, 500);
                $('#account-messages').show(function(){
                setTimeout(function(){
                    $('#account-messages').slideUp(2000);
                    },10000);
                });
            }
            
            //TODO : update and show minicart
            if(productAdded != errorArray.length){
                CartMonitor.update();
                MiniCart.MiniCart.showMiniCart(window.targetFocusEl);
            }
            $('[data-mz-action="addAllToCart"][orderToAdd="'+orderId+'"]').removeClass('active');
            $('.order-history-overlay').hide();
        },
        startReturnItem: function (e) {
            var $target = $(e.currentTarget),
            itemId = $target.data('mzStartReturn'),
            orderId = $target.data('mzOrderId'),
            currentOrderId = orderId;
            if (itemId && orderId) {
                this.returning = itemId;
                this.model.startReturn(orderId, itemId);
            }
            this.model.attributes.itemReturnOrderID = e.target.getAttribute('data-mz-order-id');
            this.render();
        },
        cancelReturnItem: function () {
            delete this.returning;
            this.model.clearReturn();
            this.render();
        },
        finishReturnItem: function () {
            var self = this,
            op = this.model.finishReturn();
            if (op) {
                return op.then(function () {
                    delete self.returning;
                    self.render();
                });
            }
        }
    }),
    
    ReturnHistoryView = Backbone.MozuView.extend({
        templateName: "modules/my-account/return-history-list",
        initialize: function () {
            var self = this;
            this.listenTo(this.model, "change:pageSize", _.bind(this.model.changePageSize, this.model));
            this.listenTo(this.model, 'returndisplayed', function (id) {
                var $retView = self.$('[data-mz-id="' + id + '"]');
                if ($retView.length === 0) $retView = self.$el;
                $retView.ScrollTo({ axis: 'y' });
            });
        },
        getRenderContext: function () {
            var context = Backbone.MozuView.prototype.getRenderContext.apply(this, arguments);
            if(context.model.hasNextPage) {
                context.model.allLoaded = 1;
            }else{
                context.model.allLoaded = 2;
            }
            return context;
        },
        loadMoreOrders: function(){
            this.model.changePageSize(true);
        }
    });
    
    //var scrollBackUp = _.debounce(function () {
    //    $('#orderhistory').ScrollTo({ axis: 'y', offsetTop: Hypr.getThemeSetting('gutterWidth') });
    //}, 100);
    //var OrderHistoryPageNumbers = PagingViews.PageNumbers.extend({
    //    previous: function () {
    //        var op = PagingViews.PageNumbers.prototype.previous.apply(this, arguments);
    //        if (op) op.then(scrollBackUp);
    //    },
    //    next: function () {
    //        var op = PagingViews.PageNumbers.prototype.next.apply(this, arguments);
    //        if (op) op.then(scrollBackUp);
    //    },
    //    page: function () {
    //        var op = PagingViews.PageNumbers.prototype.page.apply(this, arguments);
    //        if (op) op.then(scrollBackUp);
    //    }
    //});
    
    var PaymentMethodsView = EditableView.extend({
        templateName: "modules/my-account/my-account-paymentmethods",
        autoUpdate: [
            'editingCard.isDefaultPayMethod',
            'editingCard.paymentOrCardType',
            'editingCard.nameOnCard',
            'editingCard.cardNumberPartOrMask',
            'editingCard.expireMonth',
            'editingCard.expireYear',
            'editingCard.cvv',
            'editingCard.isCvvOptional',
            'editingCard.contactId',
            'editingContact.firstName',
            'editingContact.lastNameOrSurname',
            'editingContact.address.address1',
            'editingContact.address.address2',
            'editingContact.address.address3',
            'editingContact.address.cityOrTown',
            'editingContact.address.countryCode',
            'editingContact.address.stateOrProvince',
            'editingContact.address.postalOrZipCode',
            'editingContact.address.addressType',
            'editingContact.phoneNumbers.home',
            'editingContact.isBillingContact',
            'editingContact.isPrimaryBillingContact',
            'editingContact.isShippingContact',
            'editingContact.isPrimaryShippingContact',
        ],
        additionalEvents: {
            'click [data-mz-value="editingCard.contactId"]': "showNewContact",
            'click [data-mz-value="editingCard.isDefaultPayMethod"]': "primaryCard"
        },
        renderOnChange: [
            'editingCard.isDefaultPayMethod',
            'editingCard.contactId',
            'editingContact.address.countryCode'
        ],
        showNewContact: function(e){
            window.shipAddressFlag = true;
            var self = this;
            setTimeout(function(){
                if(window.shipAddressFlag) {
                    self.model.set('editingContact.address.countryCode',"US");
                    $(document).find('[data-mz-value="editingCard.contactId"]').filter(':checked').focus();
                    window.shipAddressFlag = false;
                }
            }, 500);
        },
        primaryCard: function(e){
            window.makePrimary = true;
            setTimeout(function(){
                if(window.makePrimary) {
                    $(document).find('[data-mz-value="editingCard.isDefaultPayMethod"]').focus();
                    window.makePrimary = false;
                }
            }, 500);
        },
        beginEditCard: function (e) {
            e.preventDefault();
            var id = this.editing.card = e.currentTarget.getAttribute('data-mz-card');
            if(id === "new"){
               // this.model.endEditCard();
                this.model.beginEditCard(id);
                this.clearAllData();
                 this.render();
            }else{
                this.model.beginEditCard(id);
                this.$el.find('.mz-accountpaymentmethods-form').find('#mz-payment-credit-card-type').focus();
                 this.render();
            }
        },
        clearAllData: function(){
            $('#mz-payment-credit-card-type').val($("#mz-payment-credit-card-type option:first").val());
            $('#mz-payment-credit-card-number').val("");
            $('#mz-payment-credit-card-name').val("");
            $('#mz-payment-expiration-month').val($('#mz-payment-expiration-month option:first').val());
            $('[name="mz-payment-expiration-year"]').val($('[name="mz-payment-expiration-year"] option:first').val());
            $('#mz-payment-security-code').val("");
        },
        finishEditCard: function () {
            var self = this;  
            var operation = this.doModelAction('saveCard');
            $( ".mz-accountpaymentmethods-list .mz-validationmessage").each(function( index ) {
                if($(this).text() !== "") {
                    $(this).attr("tabindex","0");
                }
                
            });
            if (operation && !operation.isError) {
                operation.otherwise(function() {
                    self.editing.card = true;
                });
                this.editing.card = false;  
                this.render();
            }else if(operation && operation.isError){}else{    
                var msg = "Error: Please select or add an address to be used as the Billing Address for this card.";
                $('#account-messages').hide();
                $('#account-messages')[0].style.background = "#F06D6D";
                $('#account-messages')[0].style.border = "1px solid #959494";
                $('#account-messages')[0].style.padding = "5px";
                $('#account-messages')[0].setAttribute('role','contentinfo');
                $('#account-messages')[0].setAttribute('tabindex','0');
                $('#account-messages')[0].focus();
                $('[data-mz-message-bar]').html(msg);
                $('html, body').animate({
                    scrollTop: $("#account-panels").offset().top
                }); 
                $('#account-messages').show(function(){
                $('.mz-accountpaymentmethods-form').find('input,select').attr('aria-invalid',false);
                if($('.mz-accountpaymentmethods-form').find('.is-invalid').length > 0){
                    $('.mz-accountpaymentmethods-form').find('.is-invalid').attr('aria-invalid',true);
                }
                setTimeout(function(){
                    $('#account-messages').slideUp(700);
                    $('.mz-accountpaymentmethods-form').find('.is-invalid').first().focus();
                    },6000);
                }).focus();  
            }
        },
        cancelEditCard: function () {
            this.editing.card = false;
            this.model.endEditCard();
            this.render(); 
            this.$el.find('.add-new').focus();
        },
        beginDeleteCard: function (e) {
            var self = this,
            id = e.currentTarget.getAttribute('data-mz-card'),
            card = this.model.get('cards').get(id);
            if (window.confirm(Hypr.getLabel('confirmDeleteCard', card.get('cardNumberPart')))) {
                this.doModelAction('deleteCard', id).then(function() {
                    this.$el.find('.add-new').focus();
                });
            }
        }
    });
    
    var AddressBookView = EditableView.extend({
        templateName: "modules/my-account/my-account-addressbook",
        autoUpdate: [
            'editingContact.firstName',
            'editingContact.lastNameOrSurname',
            'editingContact.address.address1',
            'editingContact.address.address2',
            'editingContact.address.address3',
            'editingContact.address.cityOrTown',
            'editingContact.address.countryCode',
            'editingContact.address.stateOrProvince',
            'editingContact.address.postalOrZipCode',
            'editingContact.address.addressType',
            'editingContact.phoneNumbers.home',
            'editingContact.isBillingContact',
            'editingContact.isPrimaryBillingContact',
            //'editingContact.isShippingContact',
            'editingContact.isPrimaryShippingContact',
        ],
        renderOnChange: [
            'editingContact.address.countryCode',
            'editingContact.isBillingContact',
            'editingContact.isShippingContact'
        ],
        additionalEvents: {
            "keydown input[name='shippingphone']": "phoneNumberFormating",
            "keyup input[name='shippingphone']": "phoneNumberFormating2",
            "change input[isShippingContact]":"update",
            "change input[isBillingContact]":"update"
        },
        update: function(e){
            if(e.target.getAttribute("data-mz-value") === "editingContact.isBillingContact"){
                setTimeout(function(){ $('input[isPrimaryBillingContact]').trigger('click'); }, 1000);
                // this.model.set("editingContact.isPrimaryBillingContact",e.target.checked);
            }
            if(e.target.getAttribute("data-mz-value") === "editingContact.isShippingContact"){
                e.preventDefault();
                setTimeout(function(){ $('input[isPrimaryShippingContact]').trigger('click'); }, 1000);
                // this.model.set("editingContact.isPrimaryShippingContact",e.target.checked);
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
            if(e.keyCode == 9 || (e.keyCode == 9 && e.shiftKey)) {
            
            }
            else if(e.shiftKey){
                e.preventDefault();
                e.stopPropagation(); 
            }
            if((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)){     
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
            }else{
                if(e.keyCode != 8 && e.keyCode != 9 && !(e.keyCode == 9 && e.shiftKey)){
                    e.stopPropagation();
                    e.preventDefault();
                }
            }
        },
        beginAddContact: function (e) {
            e.preventDefault();
            this.model.set('editingContact.address.countryCode',"US");
            this.model.set('editingContact.address.addressType',"");
            this.editing.contact = "new";
            this.render();
            setTimeout(function(){
                $('.mz-accountaddressbook-form').find('#addresstype').focus();
                $('.mz-accountaddressbook-form').find('#companyname').focus();
            }, 700);
        },
        beginEditContact: function (e) {
            this.model.set('editingContact.address.countryCode',"US");
            
            var meModel = this;
            $(this.model.get('contacts').models).each(function(key,val){
                if(meModel.model.get('contacts').models[key].get('isPrimaryBillingContact')){
                    meModel.model.get('contacts').models[key].set('isBillingContact',meModel.model.get('contacts').models[key].get('isPrimaryBillingContact'));
                }else{
                    meModel.model.get('contacts').models[key].set('isBillingContact',false);
                }
                if(meModel.model.get('contacts').models[key].get('isPrimaryShippingContact')){
                    meModel.model.get('contacts').models[key].set('isShippingContact',meModel.model.get('contacts').models[key].get('isPrimaryShippingContact'));
                }else{
                    meModel.model.get('contacts').models[key].set('isShippingContact',false);
                }
            });
            var id = this.editing.contact = e.currentTarget.getAttribute('data-mz-contact');
            this.model.beginEditContact(id);
            this.render();
            this.$el.find('.mz-accountaddressbook-form input').first().focus();
        },
        finishEditContact: function () {
            var self = this,
                isAddressValidationEnabled = HyprLiveContext.locals.siteContext.generalSettings.isAddressValidationEnabled;
            
            var operation = this.doModelAction('saveContact', { forceIsValid: isAddressValidationEnabled }); // hack in advance of doing real validation in the myaccount page, tells the model to add isValidated: true
            $( ".mz-accountaddressbook-list .mz-validationmessage").each(function( index ) {
                if($(this).text() !== "") {
                    $(this).attr("tabindex","0");
                }

            });
            if (operation) {
                operation.otherwise(function() {
                    self.editing.contact = true;
                });
                this.editing.contact = false;
                setTimeout(function(){
                    self.$el.find('.add-new').focus();  
                }, 1500);
            }
            
            $('.mz-accountaddressbook-form').find('input,select').attr('aria-invalid',false);
            var $errorItem = $('.mz-accountaddressbook-form').find('input.is-invalid[id],select.is-invalid[id]');
            if($errorItem.filter(':visible')) {
                $errorItem.attr('aria-invalid',true);
                $errorItem.first().focus();
            }
        },
        cancelEditContact: function () {
            var self = this;
            this.editing.contact = false;
            this.model.endEditContact();
            this.render();
            setTimeout(function(){
                self.$el.find('.add-new').focus();  
            }, 500);
        },
        beginDeleteContact: function (e) {
            var self = this,
                contact = this.model.get('contacts').get(e.currentTarget.getAttribute('data-mz-contact')),
                associatedCards = this.model.get('cards').where({ contactId: contact.id }),
                windowMessage = Hypr.getLabel('confirmDeleteContact', contact.get('address').get('address1')),
                doDeleteContact = function() {
                    return self.doModelAction('deleteContact', contact.id).then(function() {
                            self.$el.find('.add-new').focus();
                        });
                },
                go = doDeleteContact;


            if (associatedCards.length > 0) {
                windowMessage += ' ' + Hypr.getLabel('confirmDeleteContact2');
                go = function() {
                    return self.doModelAction('deleteMultipleCards', _.pluck(associatedCards, 'id')).then(doDeleteContact);
                };
               
            }

            if (window.confirm(windowMessage)) {
                return go();
            }
        }
    });
    
    var StoreCreditView = Backbone.MozuView.extend({
        templateName: 'modules/my-account/my-account-storecredit',
        addStoreCredit: function (e) {
            var self = this;
            var id = this.$('[data-mz-entering-credit]').val();
            if (id) {
                var temp = this.model.addStoreCredit(id);
                if(temp) {
                    return temp.then(function (data) {
                        return self.model.getStoreCredits();
                    }, function(err) {
                        if(err) {
                            $('#account-messages').find('.mz-errors').focus();
                            setTimeout(function(){
                              self.$el.find('#accountStoreCreditInput') .focus();
                            }, 8000);
                        }
                    });
                } else {
                    // alert();
                }
            }
        }
    });

     var MySubscriptionListView = Backbone.MozuView.extend({
        templateName: 'modules/my-account/my-account-subscriptionList',
        additionalEvents: {
            "click .subscription-list-header": "toggleShow",
            "touchstart .subscription-list-header": "toggleShow",
            "click .mz-more-order":"loadMoreSubscriptions"
        },
        toggleShow:function(e){
            
            if(window.subId){
                //$(window.currentSubEle).removeClass('active');
                this.changeToggleStatus(window.subId,false);
            }
            var subId = window.subId = $(e.currentTarget).attr('data-subscription-id'),active=true,me=this;

            if(window.mySubscription !== undefined){
                var id = window.mySubscription.model.attributes.subscriptionId;
                $(".subscriptionViewDetails[data-subscription-id='"+subId+"']").removeClass('active');
                $("#"+id).removeClass("active");
            }

            if($(e.currentTarget).hasClass('active')){
                $(e.currentTarget).removeClass('active');
                $(e.currentTarget).siblings('.subscription-list-body').slideUp();
                if(window.mySubscription){
                    window.mySubscription.model.set({'open':false});
                    window.mySubscription.render();
                }
                active=false;
                this.changeToggleStatus(subId,false);
                setTimeout(function(){
                    $(e.currentTarget).focus();
                },200);
            }else{
                try {
                    var _this=this,existingEntityDataView=[],
                    subscriptionModel = Backbone.MozuModel.extend({});
                  
                        $('.subscription-list-header').siblings('.subscription-list-body').slideUp();
                        $(e.currentTarget).addClass('active');
                        $(e.currentTarget).siblings('.subscription-list-body').slideDown();
                        setTimeout(function(){
                            _this.changeToggleStatus(subId,true);
                        },200);
                     Api.request('POST', 'svc/getSubscription',{method:"GET",subscriptionId:subId}).then(function(res) {
                        if (!res.error &&  res.res.subscriptionId !== undefined) {
                            if(res.res && res.res.order && res.res.order.billingInfo){
                                var card = res.res.order.billingInfo.card;
                                var lastFour = "";
                                var cardType = card.paymentOrCardType;
                                if(card.cardNumberPartOrMask){
                                     lastFour = card.cardNumberPartOrMask.substr(card.cardNumberPartOrMask.length - 4);
                                }
                                res.res.order.billingInfo.card.lastFour = lastFour;
                                if(res.res.order.billingInfo.paymentType === "PayPalExpress2"){
                                    cardType = "PayPal Express";
                                }
                                res.res.order.billingInfo.card.cardType = cardType;
                            }
                            
                            if(res.res && res.res.order){
                                 //order = res.res.order;
                                var fulfillmentInfo = res.res.order.fulfillmentInfo;
                                res.res.order.estimationInfo  =shippingestimation(fulfillmentInfo,res.res.order);
                                console.log(res.res.order.estimationInfo);
                            }
                            
                            existingEntityDataView = JSON.parse(JSON.stringify(res.res));
                            existingEntityDataView.open = true;
                            window.existingEntityDataView = existingEntityDataView;
                            }
                            
                        var mySubscription = window.mySubscription =  new MySubscriptionView({
                            el: $(".subscriptionViewDetails[data-subscription-id='"+subId+"']"),
                            model: new subscriptionModel(existingEntityDataView)
                        }); 
                        mySubscription.render();
                        setTimeout(function(){
                            console.log("herer in deliveries ");
                            window.mySubscription.deliveries(window.mySubscription.model.attributes,1);
                            window.mySubscription.render();
                            setTimeout(function(){
                            $(document).find('.subscription-list-body').focus();
                            },500);
                        },1000);
                    }, function(er) {
                        // fail condition
                        console.log("Data error " + er);
                    });
                
                } catch (err) {
                    console.log(err);
                }
            }
            
        },
        changeStatus:function(subId,status){
            console.log("this.model ",this.model);
             for(var i=0;i<this.model.get('orderDetails').length;i++){
                if(this.model.get('orderDetails')[i].subscriptionId === subId ){
                    this.model.get('orderDetails')[i].subscribedStatus = status;
                    this.model.get('orderDetails')[i].open = true;
                }
            }
            this.render();
            var subscriptionModel = Backbone.MozuModel.extend({});
            window.existingEntityDataView.subscribedStatus = status;
            var mySubscription = window.mySubscription =  new MySubscriptionView({
                el: $(".subscriptionViewDetails[data-subscription-id='"+subId+"']"),
                model: new subscriptionModel(window.existingEntityDataView)
            }); 
            mySubscription.render();
        },
        changeToggleStatus:function(subId,status){
            console.log("this.model ",this.model);
             for(var i=0;i<this.model.get('orderDetails').length;i++){
                if(this.model.get('orderDetails')[i].subscriptionId === subId ){
                    this.model.get('orderDetails')[i].open = status;
                }
            }
            this.render();
        },
        loadMoreSubscriptions:function(){
             console.log("this.model ",this.model);
             var modelPagesize = this.model.get("page");
             var page = modelPagesize+1;
             var pageSize = this.model.get("pageSize");
             var me = this;
             var existingOrders = this.model.get("orderDetails");
             var totalOrders = this.model.get("totalOrders");
             
             if((pageSize*modelPagesize) < totalOrders){
                 Api.request('POST', 'svc/getSubscription',{method:"GETLIST",pageSize:pageSize,page:page,sortDirection:"DESC"}).then(function(res) {
                    console.log(res.res);
                     if (!res.error) {
                        var response = res.res;
                        for (var i =0 ; i<response.kiboOrderTemplates.length;i++)
                        {
                            var localObj = response.kiboOrderTemplates[i];
                            var obj = {customerId:localObj.customerId,subscriptionId:localObj.subscriptionId,nickname:localObj.nickname,subscribedStatus:localObj.subscribedStatus,order:{total:localObj.order.total}};
                            existingOrders.push(obj);
                        }
                        existingOrders.totalReceivedOrders = response.page*response.pageSize;
                        console.log("existingOrders ------",existingOrders.totalReceivedOrders);
                        window.mySubscriptionList.model.set("orderDetails",existingOrders);
                        window.mySubscriptionList.model.set("page",response.page);
                        window.mySubscriptionList.model.set("pageSize",response.pageSize);
                        window.mySubscriptionList.model.set("totalOrders",response.totalOrders);
                        window.mySubscriptionList.model.set("totalReceivedOrders",existingOrders.totalReceivedOrders);
                        window.mySubscriptionList.render();

                    }
                 });
             }
        },
         render:function() {
            Backbone.MozuView.prototype.render.apply(this);
        }
    });

    var MySubscriptionView = Backbone.MozuView.extend({
        templateName: 'modules/my-account/my-account-subscription',
        initialize: function() {
            var months = ["January", "February","March","April", "May","June","July","August","September","October","November","December"];
            var orderDetails = [], deliveries,totalDeliveries;
            var k = this.model.attributes; 
            if(k != "undefined") {
                orderDetails = this.getNextShippmentDate(k);
                if(k.schedule.endType!==null && k.schedule.endType.toLowerCase() !== "until i cancel"){
                    deliveries = []; 
                    totalDeliveries = parseInt(k.schedule.endType.split(' ')[0],10);
                    if(isNaN(totalDeliveries)){
                      totalDeliveries = 12;
                       if(k.completedOrders.length >=totalDeliveries)
                        totalDeliveries = k.completedOrders.length+1;
                    }
                   
                    for(var i=0;i<totalDeliveries;i++){
                       deliveries.push(i+1);
                    }
                    k.schedule.noOfDeliveries = deliveries;
                }else{
                    deliveries = [];
                    totalDeliveries = 12;
                    for(var j=0;j<totalDeliveries;j++){
                       deliveries.push(j+1);
                    }
                    k.schedule.noOfDeliveries = deliveries;
                }
                k.schedule.delivered = k.completedOrders.length;
               // k.schedule.delivered = 2;
                var date = new Date(k.schedule.startDate.split('T')[0]),
                    day = date.getDate()>9?date.getDate():"0"+date.getDate(),
                    month = months[date.getMonth()],
                    year = date.getFullYear();
                k.schedule.startDate = month+" "+day+", "+year;
            }    
        },
        additionalEvents: {
            "keydown .popup":"closeModal"
        },
        getRenderContext:function(){
            var c = Backbone.MozuView.prototype.getRenderContext.apply(this, arguments);
              this.getNextShippmentDate(c.model);
            return c;
        },   
        getNextShippmentDate:function(subscriptionObj){
            var self = this,k=subscriptionObj;
                if(k.subscribedStatus==="Active"){
                    /*var noOfDeliveries = parseInt(k.schedule.endType.split(' ')[0],10),
                        frequency = k.schedule.frequency,
                        frequencyType = k.schedule.frequencyType,
                        startDate = new Date(k.schedule.startDate.split('T')[0]),
                        modifiedDate = new Date(k.modifiedDate.split('T')[0]),
                        days = frequencyType==="Weeks"?(frequency*7):(frequency*30),
                        finaldate;

                        if(modifiedDate>startDate){
                            if (self.isHeatSensitive(k.order.items)) {
                                k.schedule.nextShippment = self.heatSensitvieDatePicker(modifiedDate,days-1);
                            } else {
                                k.schedule.nextShippment = self.datePicker(modifiedDate,days-1);
                            }
                        }else{
                            if (self.isHeatSensitive(k.order.items)) {
                                k.schedule.nextShippment = self.heatSensitvieDatePicker(startDate,days-1);
                            } else {
                                k.schedule.nextShippment = self.datePicker(startDate,days-1);
                            }
                        }*/
                        if(subscriptionObj.nextOrderDate){
                            var date = new Date(subscriptionObj.nextOrderDate);
                            var months = ["January", "February","March","April", "May","June","July","August","September","October","November","December"];
                            var finaldate =  months[date.getMonth()]+' '+('0' + date.getDate()).slice(-2)+', '+date.getFullYear();
                            console.log("finaldate =====",finaldate);
                            k.schedule.nextShippment = finaldate;
                        }
                }else{
                    k.schedule.nextShippment = k.subscribedStatus==="Paused"?"Unpause to Resume": k.subscribedStatus==="Cancelled"?"N/A":"All Items Sent!";
                }
        },
        isHeatSensitive: function(items) {
            if (Hypr.getThemeSetting('heatsensitive')) {
                var itemsLength = items.length;
                var i = 0;
                for (i; i < itemsLength; i++) {
                    if (items[i].product.properties.length > 0) {
                        var j = 0;
                        var proLength = items[i].product.properties.length;
                        for (j; j < proLength; j++) {
                            if (items[i].product.properties[j].attributeFQN === "tenant~isheatsensitive" || items[i].product.properties[j].attributeFQN === "tenant~IsHeatSensitive") {
                                if (items[i].product.properties[j].values[0].value) {
                                    return true;
                                }
                            }
                        }
                    }
                }
                return false;
            } else {
                return false;
            }
        },
        heatSensitvieDatePicker:function(startDate,businessdays){ 
            var date = new Date(startDate),self=this;
            var restDates = Hypr.getThemeSetting('BlockOutDates');
            var blackoutdates = restDates.length>0?restDates.split(','):[];
            var day, month, year, currentDate, comparedate;
            var months = ["January", "February","March","April", "May","June","July","August","September","October","November","December"];
            if(blackoutdates.length > 0) {
                blackoutdates = blackoutdates.map(function(d) {
                   return self.formatDate(d);
                });
            }
            while (businessdays) {
                date.setFullYear(date.getFullYear(), date.getMonth(), (date.getDate() + 1));
                day = date.getDay();
                month = date.getMonth();
                year = date.getFullYear();
                currentDate = date.getDate();
               
                comparedate = ('0' + (month + 1)).slice(-2) + '/' + ('0' + currentDate).slice(-2) + '/' + year;
                if (day === 0 || day === 6 || day === 3 || day === 4 || day === 5 || blackoutdates.indexOf(comparedate) !== -1) {
                    date.setFullYear(year, month, (currentDate));
                    if(businessdays>1){
                        businessdays--;
                    }
                } else {
                    businessdays--;
                }
            }
            date.setFullYear(year, month, (currentDate));
            var finaldate =  months[date.getMonth()]+' '+('0' + date.getDate()).slice(-2)+', '+date.getFullYear();
            return finaldate;
        },
        datePicker: function(startDate,businessdays){
            var date = new Date(startDate),self=this;
            //var businessdays = 2;
            var restDates = Hypr.getThemeSetting('BlockOutDates');
            var blackoutdates = restDates.length>0?restDates.split(','):[];
            var day, month, year, fulldate, currentDate, comparedate;
            var months = ["January", "February","March","April", "May","June","July","August","September","October","November","December"];
            if(blackoutdates.length > 0) {
                blackoutdates = blackoutdates.map(function(d) {
                   return self.formatDate(d);
                });
            }
            while (businessdays) {
                date.setFullYear(date.getFullYear(), date.getMonth(), (date.getDate() + 1));
                day = date.getDay();
                month = date.getMonth();
                year = date.getFullYear();
                currentDate = date.getDate();
                fulldate = ('0' + (month + 1)).slice(-2) + '-' + ('0' + currentDate).slice(-2) + '-' + year;
                comparedate = ('0' + (month + 1)).slice(-2) + '/' + ('0' + currentDate).slice(-2) + '/' + year;


                if(day === 0 || day === 6 || blackoutdates.indexOf(comparedate) !== -1 || new Date() > comparedate) {
                    date.setFullYear(year, month, (currentDate + 1));
                    if(businessdays>1){
                        businessdays--;
                    }
                }else{
                    businessdays--;
                }
            }
            date.setFullYear(year, month, (date.getDate()));
            var finaldate =  months[date.getMonth()]+' '+('0' + date.getDate()).slice(-2)+', '+date.getFullYear();
            return finaldate;
        },
        formatDate: function(date) {
            var sdate = new Date(date);
            return ('0'+(sdate.getMonth()+1)).slice(-2)+ '/' + ('0'+sdate.getDate()).slice(-2) + '/' + sdate.getFullYear();
        },
        toggleOrderSummary:function(e){
            var subId = $(e.currentTarget).attr('data-subscription-id'),me=this,active=true;
            if($(e.currentTarget).parents('.subscription-order-details').hasClass('showmore')){
                $(e.currentTarget).parents('.subscription-order-details').removeClass('showmore');
                active=false;
            }else{
                $(e.currentTarget).parents('.subscription-order-details').addClass('showmore');
            }

            if(this.model.attributes.subscriptionId===subId && active){
                this.model.attributes.show = true;
            }else{
                this.model.attributes.show = false;
            }
            setTimeout(function(){
                me.render();  
                if($(e.currentTarget).parents('.subscription-order-details').hasClass('showmore')){
                    $('.address-container .subscription-shipping').attr('aria-hidden', false);
                    $('.subscription-product-details').attr('aria-hidden', false);
                    $('.address-container .subscription-shipping').focus();
                    active=false;
                }else{
                    $('.address-container .subscription-shipping').attr('aria-hidden', true);
                    $('.subscription-product-details').attr('aria-hidden', true);
                    $(e.currentTarget).focus();
                }  
            },300);
        },
        deliveries:function(currentSub,currentpage){
            var subId = this.model.attributes.subscriptionId;
            var width = $(document).width(),
            pageWidth = width>767?49:41,
            noOfDeliveries = currentSub.schedule.noOfDeliveries.length,
            deliveriesWidth = $(document).find('.subscription-delivery-details[data-subscription-id="'+subId+'"] ul').outerWidth(),
            page = Math.floor(deliveriesWidth/pageWidth);
            currentSub.currentPage = currentpage;
            currentSub.pages = Math.ceil(noOfDeliveries/page);
            currentSub.startDelivery = currentpage>1?(currentpage-1)*page:0;
            currentSub.endDeliivery = currentpage*page;
           /* console.log(" deliveriesWidth ----",deliveriesWidth);
            console.log("currentSub.startDelivery ----",currentSub.startDelivery,currentSub.endDeliivery);
            console.log(" this.model.attributes ----",this.model.attributes);*/
        },
        nextDelivery:function(e){
            var nextPage = parseInt($(e.currentTarget).attr('index'),10)+1,
                subId = $(e.currentTarget).attr('data-subscription-id'),me=this;
                if(this.model.attributes.subscriptionId===subId){
                    me.deliveries(this.model.attributes,nextPage);
                }
            setTimeout(function(){
                me.render();    
            },200);
        },
        previousDelivery:function(e){
            var prevPage = parseInt($(e.currentTarget).attr('index'),10)-1,
                subId = $(e.currentTarget).attr('data-subscription-id'),me=this;
                if(this.model.attributes.subscriptionId===subId){
                    me.deliveries(this.model.attributes,prevPage);
                }
            setTimeout(function(){
                me.render();    
            },200);
        },
        popup:function(e){
            var popupData,orderId = $(e.currentTarget).attr('data-order-id');
            if($(e.currentTarget).attr('data-action')==="pause"){
                popupData = {
                    "isEnabled" : true,
                    "aria-label":"Pause Subscription Modal",
                    "message" : "If you <strong>Pause your Subscription,</strong> all pending deliveries will be cancelled until you Unpause it. Are you sure?",
                    "buttons" : [
                        {
                            "buttonLabel" : "No",
                            "action" : "closePopup",
                            "class" : "no"   
                        },
                        {
                            "buttonLabel" : "Yes, Pause",
                            "action" : "pauseSubcription",
                            "class" : "yes",
                            "orderId": orderId
                        }
                    ]
                };
            }else if($(e.currentTarget).attr('data-action')==="cancel"){
                popupData = {
                    "isEnabled" : true,
                    "aria-label":"Cancel Subscription Modal",
                    "message" : "If you <strong>Cancel your Subscription</strong> and then change your mind, you will have to start over. Are you sure?",
                    "buttons" : [
                        {
                            "buttonLabel" : "No",
                            "action" : "closePopup",
                            "class" : "no"   
                        },
                        {
                            "buttonLabel" : "Yes, Cancel",
                            "action" : "cancelSubcription",
                            "class" : "yes",
                            "orderId": orderId
                        }
                    ]
                };
            }else if($(e.currentTarget).attr('data-action')==="unpause"){
                popupData = {
                    "isEnabled" : true,
                    "aria-label":"Unpause Subscription Modal",
                    "message" : "Are you sure you want to <strong>Unpause your Subscription?</strong>",
                    "buttons" : [
                        {
                            "buttonLabel" : "No",
                            "action" : "closePopup",
                            "class" : "no"   
                        },
                        {
                            "buttonLabel" : "Yes, Unpause",
                            "action" : "unPauseSubcription",
                            "class" : "yes",
                            "orderId": orderId
                        }
                    ]
                };
            }
            else if($(e.currentTarget).attr('data-action')==="edit"){
                var me = this;
                var obj = me.model.attributes;
               /*  var self = this;
                this.model.get('subscriptionData').Data.qty = $(document).find('.quantity-sub').val();
                this.model.get('subscriptionData').Data.howOften = $(document).find('.how-often-val').val();
                this.model.get('subscriptionData').Data.weeks = $(document).find('.span-tabs.week').hasClass("active");
                this.model.get('subscriptionData').Data.months = $(document).find('.span-tabs.months').hasClass("active");
                this.model.get('subscriptionData').Data.when = $(document).find('#interval-startdate').val();
                this.model.get('subscriptionData').Data.howLong = $(document).find('.how-long-val').val();
                // $.cookie("subscriptionCreated", true);
                $.cookie("subscriptionData", JSON.stringify(this.model.get('subscriptionData').Data));*/
                window.location.href = window.location.origin+"/subscription?subscriptionId="+obj.subscriptionId;  
            }
            this.model.set('popupData',popupData);
            this.render();
            this.loopInPopups();
           // setTimeout(function(){
                $(document).find('.subscriptionpopup .popup-body .message').focus();
           // },100);
        },
        closePopup:function(e,type){
            var button = $(document).find('.popup-body .button-yes').attr('data-mz-action'),
                subId =$(document).find('.popup-body .button-yes').attr('data-subscription');
            this.model.get('popupData').isEnabled = false;
            this.render();  
            if(type){
                if(type === "unpause"){
                    $(document).find('.subscription-actions [data-action="pause"][data-order-id="'+subId+'"]').focus();
                }else if(type === "pause"){
                    $(document).find('.subscription-actions [data-action="unpause"][data-order-id="'+subId+'"]').focus();
                }else if(type === "cancel"){
                    $(document).find('.subscription-list-header.active').focus();
                }
            }else{
                if(button === "unPauseSubcription"){
                    $(document).find('.subscription-actions [data-action="unpause"][data-order-id="'+subId+'"]').focus();
                }else if(button === "pauseSubcription"){
                    $(document).find('.subscription-actions [data-action="pause"][data-order-id="'+subId+'"]').focus();
                }else if(button === "cancelSubcription"){
                    $(document).find('.subscription-actions [data-action="cancel"][data-order-id="'+subId+'"]').focus();
                }
            }
        },
        pauseSubcription: function(e) {
            var currentAction = window.currentAction = $(e.target).attr('data-subscription');
            var me = this,paused = window.paused = true,
            customerId = me.model.get("customerId");
            if(window.paused) {
               $(".overlay-for-complete-page").hide();
                var counter = 1,postData;
                while(counter){
                    if(me.model.attributes.subscriptionId == window.currentAction){
                        me.model.attributes.subscribedStatus = "Paused";
                        me.model.attributes.modifiedDate = new Date().toISOString();
                        postData =  me.model.attributes;
                        counter = 0;
                        window.paused = false;
                    }else{ 
                        counter++;
                    } 
                }
                try {
                    Api.request('POST', 'svc/getSubscription',{method:"UPDATE",data:postData}).then(function(res) {
                        $(".overlay-for-complete-page").hide();
                        me.closePopup(e,"unpause");
                       window.mySubscriptionList.changeStatus(postData.subscriptionId,"Paused");
                       me.render();
                    }).then(function(er) {
                        $(".overlay-for-complete-page").hide();
                        me.closePopup(e,"pause");
                    });
                } catch(error) {
                    console.error(error);
                    $(".overlay-for-complete-page").hide();
                    me.closePopup(e,"pause");
                }
            }else {
                me.closePopup(e,"pause");
            }
        },
        unPauseSubcription: function(e) {
            var currentAction = window.currentAction = $(e.target).attr('data-subscription');
            var me = this,unpaused = window.unpaused = true,
            customerId = me.model.get("customerId");
            if(window.unpaused) {
                $(".overlay-for-complete-page").hide();
                var counter = 1,postData;
                while(counter && window.unpaused){
                    if(me.model.attributes.subscriptionId == window.currentAction){
                        me.model.attributes.subscribedStatus = "Active";
                        me.model.attributes.modifiedDate = new Date().toISOString();
                        postData =  me.model.attributes;
                        counter = 0;
                        window.unpaused = false;
                    }else{
                        counter++;
                    } 
                }
                
                try {
                    Api.request('POST', 'svc/getSubscription',{method:"UPDATE",data:postData}).then(function(res) {
                        $(".overlay-for-complete-page").hide();
                        me.closePopup(e,"pause");
                        window.mySubscriptionList.changeStatus(postData.subscriptionId,"Active");
                        me.render();
                    }).then(function(er) {
                        console.log(er);
                        $(".overlay-for-complete-page").hide();
                        me.closePopup(e,"unpause");
                    });
                } catch(error) {
                    console.error(error);
                    $(".overlay-for-complete-page").hide();
                    me.closePopup(e,"unpause");
                }
            }
            else {
                me.closePopup(e,"unpause");
            }
        },
        cancelSubcription: function(e) {
            var currentAction = window.currentAction = $(e.target).attr('data-subscription');
            var me = this,cancel = window.cancel = true,
                customerId = me.model.get("customerId"),postData;
                if(window.cancel) {
                   $(".overlay-for-complete-page").hide();
                    window.cancel = false; 
                    var obj = me.model.attributes;
                        if(obj.subscriptionId == window.currentAction) { 
                            obj.subscribedStatus = "Cancelled";
                            obj.modifiedDate = new Date().toISOString();
                            postData = obj;
                            postData.subscriptionId = obj.subscriptionId;
                        }
                    try {
                        //need to test against multiple accounts
                        Api.request('POST', 'svc/getSubscription',{method:"UPDATE",data:postData}).then(function(res) {
                            $(".overlay-for-complete-page").hide();
                            me.closePopup(e,"cancel");
                            //me.render();
                            window.mySubscriptionList.changeStatus(postData.subscriptionId,"Cancelled");
                        }).then(function(er) {
                            console.log(er);
                            $(".overlay-for-complete-page").hide();
                            me.closePopup(e,"cancel");
                        });
                    } catch(error) {
                        console.error(error);
                        $(".overlay-for-complete-page").hide();
                        me.closePopup(e,"cancel");
                    }
                }
                else {
                    me.closePopup(e,"cancel");
                }
        },
        closeModal:function(e){
            var button = $(document).find('.popup-body .button-yes').attr('data-mz-action'),
                subId =$(document).find('.popup-body .button-yes').attr('data-subscription');
            if (e.which === 27 ) {
                this.model.get('popupData').isEnabled = false;
                this.render(); 
                if(button === "unPauseSubcription"){
                    $(document).find('.subscription-actions [data-action="unpause"][data-order-id="'+subId+'"]').focus();
                }else if(button === "pauseSubcription"){
                    $(document).find('.subscription-actions [data-action="pause"][data-order-id="'+subId+'"]').focus();
                }else if(button === "cancelSubcription"){
                    $(document).find('.subscription-actions [data-action="cancel"][data-order-id="'+subId+'"]').focus();
                }
           }
        },
        loopInPopups:function(ele){
            if(ele){
                window.inputs = $(document).find("."+ele).find('button,[tabindex="0"],a,input');
            }
            else
            window.inputs = $(document).find('.subscriptionpopup .popup-body').find('button,[tabindex="0"],a,input');
            
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
            console.log("window.inputs----",window.inputs);
            console.log("window.lastInput----",window.lastInput);
        },
        render:function() {
            Backbone.MozuView.prototype.render.apply(this);
        }
    });

    var getMethod = function(name) {
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
    };
    
    var checkMethod = function(day, method, hs) {
        // given a date, shipping method id, and whether order is heat-sensitive, returns true or false
        // for whether the order can be shipped on the date
        var meth = getMethod(method);
        if (hs) { 
            return meth.hsShipDays.indexOf(day) > -1 ? true:false;
        }else{ 
            return meth.regularShipDays.indexOf(day) > -1 ? true:false;
        }
    };
    
    var getArrival2 = function(d, start, days) {
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
    };
    
    var getNextShipDate = function(n, d, hs, m) {
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
    };

    var shippingestimation = function(shippingmethod,order){
        var testDate = new Date();
        var deadline = new Date(testDate.getTime());
        deadline.setHours(12);
        deadline.setMinutes(0);
        deadline.setSeconds(0);
        deadline.setMilliseconds(0);
        var heatsensitive =hasHeatSensitiveItemsByCategory(order) || false; // document.getElementById('heatsensitive').value;
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
    };
    var hasHeatSensitiveItemsByCategory = function(order) {
        var items = order &&  order.items ? order.items : [];
    
        var result = _.find(items, function(item) {
            return _.find(item.product.categories, function(category){
                return category.id == Hypr.getThemeSetting('heatSensitiveCategoryId');
            });
        });
        if (result === undefined)
                return false;
            else
                return true;
    };

    // switch to appropriate tabpanel
    var tabNavigator = function($el){
        $('.mz-scrollnav-link').attr('aria-selected',false);
        if(($el).hasClass('active')){
            $el.attr('aria-selected',true);
            var myView = $el.attr('forid');
            var $elSelected = $('#account-panels').find('#x-'+myView);
                // focus to first list item if available
            if(myView == "account-orderhistory" || myView == "account-returnhistory"){
                $elSelected.attr('tabindex','0');
                if($elSelected.find('li').length > 0) {
                    $elSelected.find('li').first().find('ul').focus();
                }
                else
                    $elSelected.focus();
            }
            else
                $elSelected.attr('tabindex','0').focus();
        }
    };

    var formatGetListData = function(response){
        var result = {customerId:response.customerId,page:response.page,pageSize:response.pageSize,totalPages:response.totalPages, totalOrders:response.totalOrders };
        var orderDetails = [];
        for (var i =0 ; i<response.kiboOrderTemplates.length;i++)
        {
            var localObj = response.kiboOrderTemplates[i];
            var obj = {customerId:localObj.customerId,subscriptionId:localObj.subscriptionId,nickname:localObj.nickname,subscribedStatus:localObj.subscribedStatus,order:{total:localObj.order.total}};
            orderDetails.push(obj);
        }
        result.orderDetails = orderDetails;
        result.totalReceivedOrders = result.page*result.pageSize;
        return result;
    };
    
  /*  
    var QuickOrderHistoryView = Backbone.MozuView.extend({
        templateName: "modules/my-account/my-account-quick-order-items",
        additionalEvents: {
            "click [data-mz-showQuickOrder]": "showQuickOrderDetails"
        },
        getRenderContext: function () {
            var c = Backbone.MozuView.prototype.getRenderContext.apply(this, arguments);
            $(c.model.items).each(function(key,val){
                c.model.items[key].numberofproducts = c.model.items[key].items.length;
            });
            return c;
        },
        showQuickOrderDetails: function(e){
            var orderId = e.currentTarget.getAttribute('QorderID');
            $('[QorderID]').removeClass('active');
            $('[data-mz-showQuickOrder]').find('.quick-order-plus a').text('+');
            $('[data-mz-QuickOrder]').slideUp();
            if($('[data-mz-QuickOrder][QorderID="'+orderId+'"]')[0].style.display === "none" || $('[data-mz-QuickOrder][QorderID="'+orderId+'"]')[0].style.display === ""){
                $('[data-mz-QuickOrder][QorderID="'+orderId+'"]').slideDown();
                $(e.currentTarget).addClass('active');
                $('[data-mz-showQuickOrder][ QorderID="'+orderId+'"]').find('.quick-order-plus a').text('-');
            }
        },
        loadMoreItems: function(){
            this.model.changePageSize(true);    
        },
        addAllToCart: function(e){
            var orderId = e.currentTarget.getAttribute('orderToAdd');
            $('[data-mz-action="addAllToCart"][orderToAdd="'+orderId+'"]').addClass('active');
            var productCodes = [];
            var productQuantity = [];
            var orderItems = $('[data-mz-QuickOrder][QorderId="'+orderId+'"]').find('[quickOrderProductCode]');
            $(orderItems).each(function(key,val){
                productCodes.push(val.getAttribute('quickorderproductcode'));
            });
            var orderQuantity = $('[data-mz-QuickOrder][QorderId="'+orderId+'"]').find('[quickOrderQuantity]');
            $(orderQuantity).each(function(key,val){
                productQuantity.push(val.value);
            });
            this.makeQuickOrder(productCodes,productQuantity,orderId);
        },
        addInlineItemToCart: function(e){
            var productId = e.currentTarget.getAttribute('quickOrderProductCode');
            var orderNumber = e.currentTarget.getAttribute('orderNumber');
            var quantityElement = $('[data-mz-QuickOrder][QorderID="'+orderNumber+'"]').find('[quickOrderQuantity][quickOrderProductId="'+productId+'"]');
            var productCodes = [];
            var productQuantity = [];
            productCodes.push(productId);
            productQuantity.push(quantityElement[0].value); 
            this.makeQuickOrder(productCodes,productQuantity);
        },
        decreaseQuickOrderQuantity: function(e){
            var productId = e.currentTarget.getAttribute('quickOrderProductCodeQuantityChanger');
            $('[quickOrderQuantity][quickOrderProductId="'+productId+'"]').val($('[quickOrderQuantity][quickOrderProductId="'+productId+'"]').val()===""?1:parseInt($('[quickOrderQuantity][quickOrderProductId="'+productId+'"]').val())-1);
        
         ///prevent negative quantity
        
         $('[data-mz-action="increaseQuickOrderQuantity"][quickorderproductcodequantitychanger="'+productId+'"]').click(function(){
             $('[data-mz-action="decreaseQuickOrderQuantity"][quickorderproductcodequantitychanger="'+productId+'"]').prop('disabled', false);
        });
        $('[data-mz-action="decreaseQuickOrderQuantity"][quickorderproductcodequantitychanger="'+productId+'"]').click(function(e){
        if($('[quickOrderQuantity][quickOrderProductId="'+productId+'"]').val()<=1) {
       $('[data-mz-action="decreaseQuickOrderQuantity"][quickorderproductcodequantitychanger="'+productId+'"]').prop('disabled', true); 
        $('[data-mz-action="increaseQuickOrderQuantity"][quickorderproductcodequantitychanger="'+productId+'"]').click();
     
      } 
          }); },
        increaseQuickOrderQuantity: function(e){
            var productId = e.currentTarget.getAttribute('quickOrderProductCodeQuantityChanger');
            $('[quickOrderQuantity][quickOrderProductId="'+productId+'"]').val($('[quickOrderQuantity][quickOrderProductId="'+productId+'"]').val()===""?1:parseInt($('[quickOrderQuantity][quickOrderProductId="'+productId+'"]').val())+1);
        },
        makeQuickOrder: function(products,quantities,orderId){
            var errorArray = [], self = this, productAdded = 0,time = 1500;
            $(products).each(function(key,pid){
                setTimeout(function(){
                var count = quantities[key];
                Api.get('product', pid).then(function(sdkProduct) {
                    var PRODUCT = new ProductModels.Product(sdkProduct.data);
                    PRODUCT.set({'quantity':quantities[key]});
                    PRODUCT.addToCart();
                        PRODUCT.on('addedtocart', function(attr) {
                        productAdded++;
                        PRODUCT = ''; 
                        if(productAdded  === products.length ){
                            self.showMessages(errorArray, productAdded,orderId);
                        }
                    });
                    Api.on('error', function (badPromise, xhr, requestConf) {
                        productAdded++;
                        errorArray.push(badPromise.message);
                        if(productAdded  === products.length ){
                            self.showMessages(errorArray, productAdded,orderId);
                        }
                    });
                },function(errorResp){
                    errorArray.push(errorResp.message);
                    if(productAdded  === products.length - 1){
                        self.showMessages(errorArray, productAdded,orderId);
                    }
                });
                },time);
                time+=1000;
            });
        },
        showMessages: function(errorArray, productAdded,orderId){
            //show All error messges
            $('#account-messages').hide();
            var msg = "";
            if(errorArray.length>0){
                $(errorArray).each(function(key ,value){
                    msg = msg + "<p>" + value + "</p>";
                });
                $('#account-messages')[0].style.background = "#F06D6D";
                $('#account-messages')[0].style.border = "1px solid #959494";
                $('#account-messages')[0].style.padding = "5px";
                $('[data-mz-message-bar]').html(msg);
                $('#account-messages').show(function(){
                setTimeout(function(){
                    $('#account-messages').slideUp(500);
                    },errorArray.length*1500);
                });
            }
            
            //TODO : update and show minicart
            if(productAdded != errorArray.length){
                CartMonitor.update();
                MiniCart.MiniCart.showMiniCart();
            }
            $('[data-mz-action="addAllToCart"][orderToAdd="'+orderId+'"]').removeClass('active');
        }
    });
    
    */
    $(document).ready(function () {

        // flexi function
        $(document).find('.popup').on('click', '.close-icon, .button-no', function(){
            $(document).find('.popup').removeClass('active');
        });

        $(document).find('.popup').on('click', '.button-yes', function(){
            $(document).find('.popup').removeClass('active');

            var isOrder = $(document).find('.popup').find('.button-yes').attr('isOrder');
            var isWishlist = $(document).find('.popup').find('.button-yes').attr('isWishlist');
            var addAll = $(document).find('.popup').find('.button-yes').attr('addAll');
            var orderId = $(document).find('.popup').find('.button-yes').attr('orderId');
            var productId = $(document).find('.popup').find('.button-yes').attr('productcode');
            var count = $(document).find('.popup').find('.button-yes').attr('quantity');
            if(isOrder == "true" && addAll == "false"){
                window.accountViews.orderHistory.removerProductandAddtocart(orderId, productId);
            }else if(isOrder == "true" && addAll == "true"){
               window.accountViews.orderHistory.removerProductandAddalltoCart(orderId); 
            }else if(isWishlist){
            }   
        });
        
        var targetFocusEl = window.targetFocusEl;
        
        var accountModel = window.accountModel = CustomerModels.EditableCustomer.fromCurrent();
        var $accountSettingsEl = $('.x-account-settings'),
        $orderHistoryEl = $('#x-account-orderhistory'),
        $returnHistoryEl = $('#x-account-returnhistory'),
        $paymentMethodsEl = $('#x-account-paymentmethods'),
        $loyatlyProgramEL = $('#account-loyalty-program'),
        $helpEl = $('#account-help'),
        $addressBookEl = $('#x-account-addressbook'),
        $wishListEl = $('#x-account-wishlist'),
        $messagesEl = $('#account-messages'),
        $storeCreditEl = $('#x-account-storecredit'),
        orderHistory = accountModel.get('orderHistory'),
        returnHistory = accountModel.get('returnHistory'),
        $quickOrderHistoryEl = $('#x-quick-order');
        
        var accountViews = window.accountViews = {
            settings: new AccountSettingsView({
                el: $accountSettingsEl,
                model: accountModel,
                messagesEl: $messagesEl 
            }),
            password: new PasswordView({
                el: $('.mz-accountsettings-password'),
                model: accountModel,
                messagesEl: $messagesEl
            }),
            orderHistory: new OrderHistoryView({
                el: $orderHistoryEl.find('[data-mz-orderlist]'),
                model: orderHistory
            }),
            orderHistoryPagingControls: new PagingViews.PagingControls({
                templateName: 'modules/my-account/order-history-paging-controls',
                el: $orderHistoryEl.find('[data-mz-pagingcontrols]'),
                model: orderHistory
            }),
            orderHistoryPageNumbers: new PagingViews.PageNumbers({
                el: $orderHistoryEl.find('[data-mz-pagenumbers]'),
                model: orderHistory
            }),
            returnHistory: new ReturnHistoryView({
                el: $returnHistoryEl.find('[data-mz-orderlist]'),
                model: returnHistory
            }),
            returnHistoryPagingControls: new PagingViews.PagingControls({
                templateName: 'modules/my-account/order-history-paging-controls',
                el: $returnHistoryEl.find('[data-mz-pagingcontrols]'),
                model: returnHistory
            }),
            returnHistoryPageNumbers: new PagingViews.PageNumbers({
                el: $returnHistoryEl.find('[data-mz-pagenumbers]'),
                model: returnHistory
            }),
            paymentMethods: new PaymentMethodsView({
                el: $paymentMethodsEl,
                model: accountModel,
                messagesEl: $messagesEl
            }),
            addressBook: new AddressBookView({
                el: $addressBookEl,
                model: accountModel,
                messagesEl: $messagesEl
            }),
            storeCredit: new StoreCreditView({
                el: $storeCreditEl,
                model: accountModel,
                messagesEl: $messagesEl
            })
            /*quickOrderHistoryView : new QuickOrderHistoryView({
                el: $quickOrderHistoryEl.find('[data-mz-quick-orderlist]'),
                model: orderHistory,
                messagesEl: $messagesEl
            })*/
        };
        
        if (Hypr.getThemeSetting('allowWishlist')){
            var url = "api/commerce/wishlists/"+accountModel.get('wishlist').get('id')+"/items?startIndex=0&pageSize=21&sortBy=createDate desc"; 
            Api.request('GET',url).then(function(resp) {
                resp.showWishlistLoadMore = true;
                if(resp.items.length < 21){
                    resp.showWishlistLoadMore = false;
                }
                resp.WishlistId = accountModel.get('wishlist').get('id'); 
                if(resp.items.length > 20)resp.items.pop();
                resp.totalCount = resp.totalCount-1;
                var wishlist = Backbone.MozuModel.extend({});
                if (Hypr.getThemeSetting('allowWishlist')) accountViews.wishList = window.WishListView = new WishListView({
                    el: $wishListEl,
                    model: new wishlist(resp),
                    messagesEl: $messagesEl
                });
                _.invoke(window.accountViews, 'render');
            });
        }else{
            _.invoke(window.accountViews, 'render');    
        }
        var customerId = require.mozuData("user").userId,existingEntityData = [],
        subscriptionModel = Backbone.MozuModel.extend({}); 
        try {
            Api.request('POST', 'svc/getSubscription',{method:"GETLIST",pageSize:10,page:1,sortDirection:"DESC"}).then(function(res) {
                console.log(res.res);
                 if (!res.error) {
                    existingEntityData = formatGetListData(res.res);
                }
                
                /*var mySubscription = new MySubscriptionView({
                    el: $(".mz-accountsubscription"),
                    model: new subscriptionModel(existingEntityData)
                }); 
                mySubscription.render();  */
                   var mySubscriptionList = window.mySubscriptionList =  new MySubscriptionListView({
                    el: $(".mz-accountsubscriptionlist"),
                    model: new subscriptionModel(existingEntityData)
                }); 
                mySubscriptionList.render();
             });
        } catch (e) {
            console.error(e);
        }
        
        // if (Hypr.getThemeSetting('allowWishlist')) accountViews.wishList = new WishListView({
        //     el: $wishListEl,
        //     model: accountModel.get('wishlist'),
        //     messagesEl: $messagesEl
        // });
        
        // TODO: upgrade server-side models enough that there's no delta between server output and this render,
        // thus making an up-front render unnecessary.
        // _.invoke(window.accountViews, 'render');
        
        //Mask for phone number field - 
        $('input[name="shippingphone"]').mask("(999) 999-9999");
        // Handler to open-close order return panels
        $(document).on('click','[returnorderhead]', function(e){
            var orderID = e.currentTarget.getAttribute('returnorderhead');
            
            e.preventDefault();
            e.stopPropagation();
            $('[returnorderhead]').removeClass('active');
            $('[orderidhead]').attr('aria-expanded',false);
            
            if($(e.currentTarget).find('a[returnOrderID="'+orderID+'"]').text()=='+'){
                $('[returnorderdetails]').parent().slideUp();
                $('[returnorderdetails="'+orderID+'"]').parent().slideDown();
                $('[returnorderhead]').find('a[returnOrderID]').text('+');
                $('[returnorderhead]').find('a[returnOrderID="'+orderID+'"]').text(' -');
                $(e.currentTarget).addClass('active');
                $(e.currentTarget).attr('aria-expanded',true);
            }else{
                $('[returnorderdetails]').parent().slideUp();
                $('[returnorderhead]').find('a[returnOrderID]').text('+');
            }
        });
        
        //order history close hide
        $('[orderID]').hide();
        $(document).on('click','[orderidhead]', function(e){
            e.preventDefault();
            e.stopPropagation();
            $('[orderidhead]').removeClass('active');
            $('[orderidhead]').attr('aria-expanded',false);
            
            var orderID = e.currentTarget.getAttribute('orderidhead');
            if($('a[orderidhead="'+orderID+'"]').text() == '+'){ 
                $('[orderID]').hide();
                $('a[orderidhead]').text('+');
                $('a[orderidhead="'+orderID+'"]').text(' -');
                $('[orderID="'+orderID+'"]').slideDown();
                $(e.currentTarget).addClass('active');
                $(e.currentTarget).attr('aria-expanded',true);
                $('html, body').animate({
                    scrollTop: $(e.currentTarget).parent().offset().top
                }, 500);
            }else{
                $('a[orderidhead="'+orderID+'"]').text('+');
                $('[orderID="'+orderID+'"]').slideUp();
            }
        });
        $(document).on('keydown','[orderidhead], [returnorderhead]', function(e) {
            if(e.keyCode == 13 || e.keyCode == 32) {
                $(this).trigger('click');
                e.preventDefault();
            }
        });
        
        /*var $myAccountNav = $('.mz-scrollnav-list');
        if($myAccountNav.length > 0) {
            if($myAccountNav.find().hasClass('active')){
                
            }
        }*/
        
        
        var scrollNavLinksFocus = function() {
            var trapFocusInputs = $(document).find('.mobile-popupmenu-myaccount.mz-mobile').find('.mz-scrollnav-link-mobile').filter(':visible');   
            var trapFocusFirstinput = trapFocusInputs.first();
            var trapFocusLastinput = trapFocusInputs.last(); 
            
             // if current element is last, get focus to first element on tab press.
            trapFocusLastinput.on('keydown', function (e) {
               if ((e.which === 9 && !e.shiftKey)) {
                   e.preventDefault();
                   trapFocusFirstinput.focus(); 
               }
            });
            
            // if current element is first, get focus to last element on tab+shift press.
            trapFocusFirstinput.on('keydown', function (e) {
                if ((e.which === 9 && e.shiftKey)) {
                    e.preventDefault();
                    trapFocusLastinput.focus();  
                }
            });      
        };
        
        
        
       // var myObj = navigator();
        $(document).find('.mz-scrollnav-link.active').trigger('click');
        $(document).on('click','.mz-scrollnav-link, .mz-scrollnav-link-mobile', function(){
            tabNavigator($(this));
        });
        $(document).on('keypress','.mz-scrollnav-link', function(e){
            if(e.keyCode == 13 || e.keyCode == 32) {
                $(this).trigger('click');
                e.preventDefault();
            }
        });
        $(document).on('keydown','#x-account-settings, #x-account-orderhistory, #x-account-returnhistory, #x-account-paymentmethods, #x-account-addressbook, #x-account-wishlist, #x-account-storecredit, #x-account-loyalty-program', function(e) {
            if(e.target == e.currentTarget) {
                if(e.which == 9 && e.shiftKey) {
                    if($(window).width() > 600) {
                        if($('.mz-scrollnav-list').find('.mz-scrollnav-item>.mz-scrollnav-link').hasClass('active')) {
                            $('.mz-scrollnav-list').find('.mz-scrollnav-item>.mz-scrollnav-link.active').focus();
                            e.preventDefault();
                        }
                    }
                    else {
                        if($('.selected-menu-mobile.mz-mobile').is(':visible')) {
                            $('.selected-menu-mobile.mz-mobile').focus();
                            e.preventDefault();
                        }
                    }
                }
            }
        });
        
        $(document).on('click','.selected-menu-mobile.mz-mobile', function() {
            $('.mobile-popupmenu-myaccount.mz-mobile').find('.mz-scrollnav-link-mobile.active').focus();
            scrollNavLinksFocus();
        });
        
        $(document).on('keypress','.selected-menu-mobile.mz-mobile', function(e) {
            if(e.keyCode == 13 || e.keyCode == 32) {
                $('.mobile-popupmenu-myaccount.mz-mobile').find('.mz-scrollnav-link-mobile.active').focus();
                scrollNavLinksFocus();
            }
        });
        
        // address-selection keyboard interactions
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
        
        $(document).on('keypress','#editingcard-is-primary', function(e) {
            if(e.keyCode == 13 || e.keyCode == 32) {
                $(this).trigger('click');
                e.preventDefualt();
            }
        });
        
        $(document).on('focus','#toolTipStock', function(e) { 
            $(this).next().show();
        });
        
        $(document).on('blur','#toolTipStock', function(e) { 
            $(this).next().hide();
        });
        
        $(document).on('keypress',
        '.add-all-to-cart,[data-mz-action="decreaseQuickOrderQuantity"],[data-mz-action="increaseQuickOrderQuantity"],[data-mz-action="addInlineItemToCart"],[data-mz-action="addItemToCart"],[data-mz-action="finishRemoveItem"],[data-mz-action="beginAddContact"],[data-mz-action="beginEditContact"],[data-mz-action="beginDeleteContact"],[data-mz-action="beginEditCard"],[data-mz-action="beginEditCard"],[data-mz-action="beginDeleteCard"]',
        function(e){
            if(e.keyCode == 13 || e.keyCode == 32) {
                e.preventDefault();
                $(this).trigger('click');
            }    
        });
    });
});  




