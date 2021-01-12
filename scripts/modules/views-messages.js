define(['modules/jquery-mozu','backbone','hyprlive'], 
    function($, Backbone, Hypr) {
    // because mozuviews need mozumessageviews and mozumessageviews extend mozuviews, we're risking circular reference problems.
    // we fix this by making a factory method that extends the mozu message view only when asked.
    // this avoids the circular reference problem by not asking for backbone-mozuview until we know it's been provided.
    var MozuMessagesView,
        offset = parseInt(Hypr.getThemeSetting('gutterWidth'),10) || 10;
        offset = offset+ 107; 
    return function(opts) {
        if (!MozuMessagesView) MozuMessagesView = Backbone.MozuView.extend({
            templateName: 'modules/common/message-bar',
            initialize: function() {
                this.model.on('reset', this.render, this);
            },
            render: function() {
                var code = $("input[data-mz-entering-credit]").val();
                if(!code){
                    code = $('.mz-checkout-digitalcredit-enter-code').val();
                } 
                var self = this;
                var ua = navigator.userAgent.toLowerCase();
                var isAndroid = ua.indexOf("android") > -1;
                
                $('.overlay').hide();
                if(this.model.length > 0){
                    if(this.model.models[0].get('name') !== "ADD_CUSTOMER_FAILED" && this.model.models[0].get('name') !== "CARD_NUMBER_UNRECOGNIZED"){
                        if(this.model.models){
                            if(this.model.models[0].get("errorCode") !== "ITEM_NOT_FOUND" && this.model.models[0].get("errorCode") !== "VALIDATION_CONFLICT" ){ 
                                //this.model.models[0].set("message",Hypr.getLabel('promoCodeError', code));
                                if(this.model.models[0].get('message').indexOf('Unable to parse response:') !== -1 || this.model.models[0].get('message') == "Invalid characters are entered." || $('#storecredit-panel').hasClass('active') || $('.mz-scrollnav-link-mobile.active').attr('forid') == 'account-storecredit' || $('#digital-credit-code').length === 1){
                                    
                                    if(this.model.models[0].get('message').indexOf('This code has already been used.') === -1)
                                        this.model.models[0].set("message","Invalid characters are entered.");
                                    
                                    if($('#storecredit-panel').hasClass('active') || $('.mz-scrollnav-link-mobile.active').attr('forid') == 'account-storecredit'){
                                           
                                        $(document).find('#giftcard-messages').html('Error: '+this.model.models[0].get('message'));
                                        $(document).find('#giftcard-messages').css('display','block');
                                        
                                        $(document).find('input[aria-describedby="giftcard-messages"]').attr('aria-invalid','true');
                                        
                                        setTimeout(function(){ 
                                            $(document).find('#giftcard-messages').html('');
                                            $(document).find('#giftcard-messages').css('display','none');
                                            $(document).find('input[aria-describedby="giftcard-messages"]').attr('aria-invalid','false');
                                        },6000);
                                            
                                        // if(isAndroid){
                                        //     $('#accountStoreCreditInput').attr('aria-label', 'Error: '+this.model.models[0].get('message'));
                                        // }
                                        
                                        setTimeout(function(){
                                            $('#accountStoreCreditInput').focus();
                                        },1000);
                                    } else if($('#digital-credit-code').length === 1 && this.model.models[0].get('code') && this.model.models[0].get('code') != "UNKNOWN"){
                                            console.log("this.model.models",this.model.models);  
                                            $('#digital-credit-code').attr('aria-describedby','storecredit-messages');                                            
                                            $(document).find('#storecredit-messages').html('Error: '+this.model.models[0].get('message'));
                                            $(document).find('#storecredit-messages').css('display','block');
                                            $(document).find('#digital-credit-code').attr('aria-invalid','true');                                            
                                            if(isAndroid)
                                                $('#storecredit-messages').attr('aria-label', 'Error: '+this.model.models[0].get('message'));
                                            
                                            setTimeout(function(){
                                                $('#digital-credit-code').focus();  
                                            },1000);
                                            setTimeout(function(){
                                                $(document).find('#storecredit-messages').html('');
                                                $(document).find('#storecredit-messages').css('display','none');
                                                $(document).find('#digital-credit-code').attr('aria-invalid','false');
                                            },6000);
                                    } else if(this.model.models[0].get('name')!==undefined){
                                        if(this.model.models[0].get('name').indexOf("billingContact") == -1 || this.model.models[0].get('name').indexOf("billingContact") == -1 ){
                                            Backbone.MozuView.prototype.render.apply(this, arguments);
                                            self.$el.css('display','block');
                                            // $('#giftcard-messages').css('display','block');
                                                
                                            
                                            
                                            if (this.model.length > 0) {
                                                this.$el.ScrollTo({
                                                    onlyIfOutside: true,
                                                    offsetTop: offset,  
                                                    offsetLeft: offset * 1.5,
                                                    axis: 'y'
                                                });
                                                this.$el.find('.mz-errors').attr({'tabindex':'0','aria-invalid': true}).focus();
                                                if(window.location.pathname == "/cart"){
                                                    setTimeout(function(){ 
                                                        self.$el.css('display','none');
                                                    },12000);
                                                }
                                                if(window.location.pathname != "/checkout" && window.location.pathname != "/cart"){
                                                    setTimeout(function(){ 
                                                        self.$el.css('display','none');
                                                    },8000);
                                                } 
                                            
                                            }
                                        }
                                    }
                                }else{
                                    Backbone.MozuView.prototype.render.apply(this, arguments);
                                    $(document).find('#giftcard-messages').css('display','none');
                                    $(document).find('#storecredit-messages').css('display','none');
                                    self.$el.css('display','block');
                                    // $('#giftcard-messages').css('display','block');
                                    
                                    if (this.model.length > 0) {
                                        this.$el.ScrollTo({
                                            onlyIfOutside: true,
                                            offsetTop: offset,  
                                            offsetLeft: offset * 1.5,
                                            axis: 'y'
                                        });
                                        
                                        if(require.mozuData('pagecontext').pageType === 'product')
                                            self.$el.find('p').focus();
                                        else if(self.$el.find('.mz-errors').find('p').length === 1)
                                            self.$el.find('.mz-errors').find('p').focus();
                                        else
                                            self.$el.find('.mz-errors').attr({'tabindex':'0','aria-invalid': true, 'role':'contentinfo'}).focus();                   
                                       

                                        if(window.location.pathname == "/cart"){
                                            setTimeout(function(){ 
                                                self.$el.css('display','none');
                                            },12000);
                                        }
                                        if(window.location.pathname != "/checkout" && window.location.pathname != "/cart"){
                                            setTimeout(function(){
                                                self.$el.css('display','none');
                                            },8000); 
                                        }
                                      
                                    }
                                }
                            } else if($('#storecredit-panel').hasClass('active') || $('.mz-scrollnav-link-mobile.active').attr('forid') == 'account-storecredit'){
                                  
                                    $(document).find('#giftcard-messages').html('Error: '+Hypr.getLabel('promoCodeError', code));
                                    $(document).find('#giftcard-messages').css('display','block');
                                    $(document).find('input[aria-describedby="giftcard-messages"]').attr('aria-invalid','true');
                                    setTimeout(function(){
                                        $(document).find('#giftcard-messages').html('');
                                        $(document).find('#giftcard-messages').css('display','none');
                                        $(document).find('input[aria-describedby="giftcard-messages"]').attr('aria-invalid','false');
                                    },6000);
                                    
                                    if(isAndroid)
                                        $('#accountStoreCreditInput').attr('aria-label', 'Error: '+this.model.models[0].get('message'));
                                    
                                    setTimeout(function(){ 
                                        $('#accountStoreCreditInput').focus();
                                    },1000); 
                                    
                            } else if(require.mozuData('pagecontext').pageType === "my_account"){  
                                this.model.models[0].set("message",Hypr.getLabel('promoCodeError', code));  
                                Backbone.MozuView.prototype.render.apply(this, arguments);
                                $(document).find('#giftcard-messages').css('display','none');
                                $(document).find('#storecredit-messages').css('display','none');
                                self.$el.css('display','block'); 
                                if (this.model.length > 0) {
                                    this.$el.ScrollTo({
                                        onlyIfOutside: true,
                                        offsetTop: offset, 
                                        offsetLeft: offset * 1.5, 
                                        axis: 'y'
                                    });
                                    this.$el.find('.mz-errors').attr({'tabindex':'0','aria-invalid': true}).focus();
                                    if(window.location.pathname != "/checkout"){
                                        setTimeout(function(){
                                            self.$el.css('display','none');
                                        },8000);
                                    }
                                }
                            } else if(this.model.models[0].get("errorCode") === "ITEM_NOT_FOUND"){
                                // $('.digitalcrediterror-msg').attr('id','storecredit-messages-2');
                                // $('#digital-credit-code').attr('aria-describedby','storecredit-messages-2');
                                // $('#digital-credit-code').attr('aria-invalid','true');
                                    //Commented by shruthi as coupon code error is getting disaplyed
                                $(document).find('#storecredit-messages-2').html('Error: '+Hypr.getLabel('promoCodeError1', code));
                                    $(document).find('#storecredit-messages-2').css('display','block');
                                    $('#digital-credit-code').attr('aria-invalid','true');
                                    
                                    setTimeout(function(){
                                        $('#digital-credit-code').focus();
                                    },1000);
                                    setTimeout(function(){
                                        $(document).find('#storecredit-messages-2').html('');
                                        $(document).find('#storecredit-messages-2').css('display','none');
                                        $('#digital-credit-code').attr('aria-invalid','false');
                                    },10000); 
                                
                                this.model.models[0].set("message",Hypr.getLabel('promoCodeError1', code));  
                            }
                            else{
                                Backbone.MozuView.prototype.render.apply(this, arguments);
                                $(document).find('#giftcard-messages').css('display','none');
                                $(document).find('#storecredit-messages').css('display','none');
                                self.$el.css('display','block');
                                    
                                    if (this.model.length > 0) {
                                        this.$el.ScrollTo({
                                            onlyIfOutside: true,
                                            offsetTop: offset,  
                                            offsetLeft: offset * 1.5,
                                            axis: 'y'
                                        });
                                        
                                        if(require.mozuData('pagecontext').pageType === 'product')
                                            self.$el.find('p').focus();
                                        else if(self.$el.find('.mz-errors').find('p').length === 1)
                                            self.$el.find('.mz-errors').find('p').focus();
                                        else
                                            self.$el.find('.mz-errors').attr({'tabindex':'0','aria-invalid': true, 'role':'contentinfo'}).focus();                   
                                       

                                        if(window.location.pathname == "/cart"){
                                            setTimeout(function(){ 
                                                self.$el.css('display','none');
                                            },12000);
                                        }
                                        if(window.location.pathname != "/checkout" && window.location.pathname != "/cart"){
                                            setTimeout(function(){
                                                self.$el.css('display','none');
                                            },8000); 
                                        }
                                      
                                    }
                                }
                        }
                    }else if( this.model.models[0].get('name') == "CARD_NUMBER_UNRECOGNIZED"){
                        this.model.models[0].set("message","Please correct the Card Number.");
                        $(document).find('#mz-payment-credit-card-number').siblings('.mz-validationmessage').html('Error: '+this.model.models[0].get('message')).attr('aria-invalid','true').show();
                        setTimeout(function(){ 
                           $(document).find('#mz-payment-credit-card-number').siblings('.mz-validationmessage').html('').attr('aria-invalid','false').hide();
                        },10000);
                        setTimeout(function(){
                            $(document).find('#mz-payment-credit-card-number').focus();
                        },1000);
                    }
                }
            }
        });
        return new MozuMessagesView(opts);
    };

});


