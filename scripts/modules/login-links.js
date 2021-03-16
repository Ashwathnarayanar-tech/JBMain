/**
 * Adds a login popover to all login links on a page.
 */
define(['shim!vendor/bootstrap/js/popover[shim!vendor/bootstrap/js/tooltip[modules/jquery-mozu=jQuery]>jQuery=jQuery]>jQuery', 'modules/api', 'hyprlive', 'underscore'], function ($, api, Hypr, _) {

    var usePopovers = function () {
        return !Modernizr.mq('(max-width: 480px)');
    },
    returnFalse = function () {
        return false;
    },
    $docBody;

    var DismissablePopover = function () { };

    $.extend(DismissablePopover.prototype, {
        boundMethods: [],
        setMethodContext: function () {
            for (var i = this.boundMethods.length - 1; i >= 0; i--) {
                this[this.boundMethods[i]] = $.proxy(this[this.boundMethods[i]], this);
            }
        },
        dismisser: function (e) {
            if (!$.contains(this.popoverInstance.$tip[0], e.target) && !this.loading) {
                // clicking away from a popped popover should dismiss it
                this.$el.popover('destroy');
                this.$el.on('click', this.createPopover);
                this.$el.off('click', returnFalse);
                this.bindListeners(false);
                $docBody.off('click', this.dismisser);
            }
        },
        setLoading: function (yes) {
            this.loading = yes;
            this.$parent[yes ? 'addClass' : 'removeClass']('is-loading');
        },
        onPopoverShow: function () {
            var self = this;
            _.defer(function () {
                $docBody.on('click', self.dismisser);
                self.$el.on('click', returnFalse);
            });
            this.popoverInstance = this.$el.data('bs.popover');
            this.$parent = this.popoverInstance.tip();
            this.bindListeners(true);
            this.$el.off('click', this.createPopover);
        },
        createPopover: function (e) {
            // in the absence of JS or in a small viewport, these links go to the login page.
            // Prevent them from going there!
            
            var self = this;
            if (usePopovers()) {
                
                e.preventDefault();
                $(document).find('.popover').show();
                // If the parent element's not positioned at least relative,
                // the popover won't move with a window resize
                //var pos = $parent.css('position');
                //if (!pos || pos === "static") $parent.css('position', 'relative');
                this.$el.popover({
                    //placement: "auto right",
                    animation: true,
                    html: true,
                    trigger: 'manual',
                    content: this.template,
                    container: '.mz-utilitynav'
                }).on('shown.bs.popover', this.onPopoverShow)
                .popover('show');
                setTimeout(function(){
                    $('.popover-content').find('input').first().focus();
                    self.activateloopinginmodal();   
                }, 500); 
            }
            
        },
        activateloopinginmodal: function(){ 
            var self = window.self = this;
            window.inputs = $(document).find('.popover-content').find('select, input, textarea, button, a, .labelmodel');
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
            
            $(document).on('keydown',function(e){
                if(e.which == 27){
                    if($(document.activeElement).hasClass('popover') || $(document.activeElement).parents().hasClass('popover')){
                        if($(document.activeElement).hasClass('mz-popover-login') || $(document.activeElement).parents().hasClass('mz-popover-login')){
                             $('[data-mz-action="login"]').focus(); 
                             closepopover(window.self);
                              e.preventDefault();
                        }else if($(document.activeElement).hasClass('mz-popover-signup') || $(document.activeElement).parents().hasClass('mz-popover-signup')){
                             $('a[data-mz-action="signup"]').focus(); 
                             closepopover(window.self);
                              e.preventDefault(); 
                        }       
                    }
                }
            });
            
            function closepopover(element){
                element.$el.popover('destroy');
                element.$el.on('click', element.createPopover);
                element.$el.off('click', returnFalse);
                element.bindListeners(false);
                $docBody.off('click', element.dismisser);
            }
            
            $(document).on('keydown','.mz-validationmessage',function(e){
                if(e.which === 9 && !e.shiftKey){
                    e.preventDefault();
                    window.firstInput.focus();      
                }else if(e.which == 27){ 
                    if($(e.currentTarget).hasClass('mz-popover-login') || $(e.currentTarget).parents().hasClass('mz-popover-login')){
                         $('[data-mz-action="login"]').focus(); 
                         closepopover(window.self);
                          e.preventDefault();
                    }else if($(e.currentTarget).hasClass('mz-popover-signup') || $(e.currentTarget).parents().hasClass('mz-popover-signup')){
                         $('a[data-mz-action="signup"]').focus(); 
                         closepopover(window.self); 
                          e.preventDefault(); 
                    }     
                }   
            });
            $(document).on('keydown','.testreset',function(e){
                if(e.which === 9 && !e.shiftKey){
                    e.preventDefault();
                    window.firstInput.focus();     
                }
                if(e.which == 13 || e.which == 32){ 
                    $(e.currentTarget).click(); 
                    e.preventDefault();
                    setTimeout(function(){ $(document).find('[data-mz-forgotpassword-email]').focus(); }, 500);
                }
            });  
            $(document).on('keydown','.testreset1',function(e){
               if(e.which == 13 || e.which == 32){
                    $(e.currentTarget).click(); 
                    e.preventDefault();
                    setTimeout(function(){ $(document).find('[data-mz-forgotpassword-email]').focus(); }, 500);
                } 
            });
            $(document).on('keydown','[data-mz-action="submitforgotpassword"]',function(e){
                if(e.which == 9 && !e.shiftKey){
                    e.preventDefault();
                     $(document).find('[data-mz-forgotpassword-email]').focus();     
                }
                if(e.which == 13 || e.which == 32){
                    $(e.currentTarget).click(); 
                    e.preventDefault();    
                }    
            });
            $(document).on('keydown','[data-mz-action="loginform"]',function(e){
                if(e.which == 13 || e.which == 32){
                    $(e.currentTarget).click(); 
                    window.firstInput.focus();  
                    e.preventDefault();    
                }       
            });
            $(document).on('keydown','[data-mz-forgotpassword-email]',function(e){
                if ((e.which === 9 && e.shiftKey)) {
                    e.preventDefault();
                    window.lastInput.focus(); 
                }     
            });
            $(document).on('keydown','[data-mz-login-email]',function(e){
                if ((e.which === 9 && e.shiftKey)) {
                    e.preventDefault(); 
                    $(document).find('.testreset').focus(); 
                }         
            }); 
        }, 
        retrieveErrorLabel: function (xhr) {
            var message = "";
            if (xhr.message) {
                message = Hypr.getLabel(xhr.message); 
            } else if ((xhr && xhr.responseJSON && xhr.responseJSON.message)) {
                message = Hypr.getLabel(xhr.responseJSON.message);
            }

            if (!message || message.length === 0) { 
                this.displayApiMessage(xhr);
            } else {
                var msgCont = {};
                msgCont.message = message;  
                this.displayApiMessage(msgCont); 
            }
        },  
        displayApiMessage: function (xhr) {
            window.hideGlobalOverlay();
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var patt = new RegExp(re);
            if(xhr.applicationName === "Customer" && xhr.errorCode === "ITEM_NOT_FOUND" ){
                xhr.message = Hypr.getThemeSetting('resetPasswordMessage');//Hypr.getLabel('resetPasswordMessage');
            }
            if(xhr.message){
                if(xhr.message.indexOf('Login as')>-1 && xhr.message.indexOf('failed. Please try again.')>-1  ){
                    if($('[data-mz-login-email]').val().length>0 || $('[data-mz-login-password]').val().length>0){
                        if( !patt.test($('[data-mz-login-email]').val())){
                            xhr.message = Hypr.getThemeSetting('validEmialSignUp');  
                        }else if(patt.test($('[data-mz-login-email]').val()) && $('[data-mz-login-password]').val().length===0 ){
                            xhr.message = Hypr.getThemeSetting('passwordMissing');  
                            }
                            else{
                                var emailId = xhr.message.substring(xhr.message.indexOf('Login as') +('Login as').length ,xhr.message.indexOf('failed. Please try again.'));
                                xhr.message = Hypr.getLabel('loginFailedMessage',emailId);    
                            }
                            
                        
                    
                    }else {   
                        xhr.message = Hypr.getThemeSetting('missingcredentials');  
                    }
                }
            }
            if(xhr.message === "Missing or invalid parameter: resetPasswordInfo UserName or EmailAddress must be provided"){
                this.displayMessage(Hypr.getThemeSetting('validEmialSignUp'));
            }else if(xhr.message === "The system does not permit the attempted operation.  User account is locked, Please contact System Administrator "){
                this.displayMessage(Hypr.getThemeSetting('lockedaccount'));
            }else if(xhr.message === "Login failed. Please specify a user."){
                this.displayMessage("Error:"+xhr.message || (xhr && xhr.responseJSON && xhr.responseJSON.message) || Hypr.getLabel('unexpectedError')); 
            }else{
                var ordermsg=xhr.message?xhr.message:xhr;// Added by shruthi as in UAT order status page where getting only xhr not xhr.message
                this.displayMessage(("Error:"+ordermsg) || (xhr && xhr.responseJSON && xhr.responseJSON.message) || Hypr.getLabel('unexpectedError'));     
            }
        },
        displayMessage: function (msg) {
            this.setLoading(false);
            if(msg === "Missing or invalid parameter: password Password must be a minimum of 6 characters with at least 1 number and 1 alphabetic character"){
                msg = "Password must be a minimum of 6 characters with at least 1 number and 1 alphabetic character";
            }
            if(msg == "Error:Missing or invalid parameter: EmailAddress EmailAddress already associated with a login"){ 
                this.$parent.find('[data-mz-role="popover-message"]').html('<span tabindex="0" class="mz-validationmessage" aria-label="Error: Thanks for trying to register, but there is already an account with that email address. Please visit the Forgot Password page to update your password or Contact Us for additional assistance." style="display: inline;">Thanks for trying to register, but there is already an account with that email address. Please visit the <a href="/user/forgotpassword" title="forgot password">Forgot Password</a> page to update your password or <a href="/contact-us" title="contact us">Contact Us</a> for additional assistance.</span>');  
                this.$parent.find('[data-mz-role="popover-message"] span.mz-validationmessage').focus();
            }else{
                this.$parent.find('[data-mz-role="popover-message"]').html('<span tabindex="0" class="mz-validationmessage" aria-label="'+msg+'" style="display: inline;"> '+ msg + '</span>');
                this.$parent.find('[data-mz-role="popover-message"] span.mz-validationmessage').focus();  
            } 
        },
        init: function (el) {
            this.$el = $(el);
            this.loading = false;
            this.setMethodContext();
            if (!this.pageType){
                 this.$el.on('click', this.createPopover);
             }
              else {
              this.$el.on('click', _.bind(this.doFormSubmit, this));
             }    
         },
         doFormSubmit: function(e){
             e.preventDefault();
             this.$parent = this.$el.closest(this.formSelector);
             this[this.pageType]();
         }  
        });

    var LoginPopover = function() {
        DismissablePopover.apply(this, arguments);
    };
    LoginPopover.prototype = new DismissablePopover();
    $.extend(LoginPopover.prototype, {
        boundMethods: ['handleEnterKey', 'handleLoginComplete', 'displayResetPasswordMessage', 'dismisser', 'displayMessage', 'displayApiMessage', 'createPopover', 'slideRight', 'slideLeft', 'login', 'retrievePassword', 'onPopoverShow'],
        template: Hypr.getTemplate('modules/common/login-popover').render(),
        bindListeners: function (on) {
            var onOrOff = on ? "on" : "off";
            this.$parent[onOrOff]('click', '[data-mz-action="forgotpasswordform"]', this.slideRight);
            this.$parent[onOrOff]('click', '[data-mz-action="loginform"]', this.slideLeft);
            this.$parent[onOrOff]('click', '[data-mz-action="submitlogin"]', this.login);
            this.$parent[onOrOff]('click', '[data-mz-action="submitforgotpassword"]', this.retrievePassword);
            this.$parent[onOrOff]('keypress', 'input', this.handleEnterKey);
        },
        onPopoverShow: function () {
            DismissablePopover.prototype.onPopoverShow.apply(this, arguments);
            this.panelWidth = this.$parent.find('.mz-l-slidebox-panel').first().outerWidth();
            this.$slideboxOuter = this.$parent.find('.mz-l-slidebox-outer');
        },
        handleEnterKey: function (e) {
            if (e.which === 13) {
                var $parentForm = $(e.currentTarget).parents('[data-mz-role]');
                switch ($parentForm.data('mz-role')) {
                    case "login-form":
                        this.login();
                        break;
                    case "forgotpassword-form":
                        this.retrievePassword();
                        break;
                }
                return false;
            }
        }, 
        slideRight: function () {
            if($('.mz-validationmessage').html() && $('.mz-validationmessage').html().length>0){
                $('.mz-validationmessage').html('');
            }
            this.$slideboxOuter.css('left', -this.panelWidth);
            $('[data-message-resetpassword]').hide();
            $('.mz-validationmessage').hide(); 
            $(document).find('.mz-forgot-password').addClass('active');
        },
        slideLeft: function () {  
            $(document).find('.mz-forgot-password').removeClass('active');
            this.$slideboxOuter.css('left', 0);
            $('.mz-validationmessage').hide(); 
            $('[data-message-resetpassword]').show();
        },
        login: function () {
            this.setLoading(true);
            this.validData();
            window.showGlobalOverlay(); 
            api.action('customer', 'loginStorefront', {
                email: this.$parent.find('[data-mz-login-email]').val(),
                password: this.$parent.find('[data-mz-login-password]').val()
            }).then(this.handleLoginComplete, this.displayApiMessage);
        },
       anonymousorder: function() {
            var email = "";
           var billingZipCode = "";
            var billingPhoneNumber = "";
           
      switch (this.$parent.find('[data-mz-verify-with]').val()) {
               case "zipCode":
                   {
                       billingZipCode = this.$parent.find('[data-mz-verification]').val();
                       email = null;
                       billingPhoneNumber = null;
                     
                  }
                     break;
                case "phoneNumber":
                  {
                    billingZipCode = null;
                    email = null;
                    billingPhoneNumber = this.$parent.find('[data-mz-verification]').val();
              }
                    break;
                case "email":
                    {
                    billingZipCode = null;
                    email = this.$parent.find('[data-mz-verification]').val();
                    billingPhoneNumber = null;
                      
                    } 
                     break;
               default:
                    {
                       billingZipCode = null;
                       email = null;
                       billingPhoneNumber = null;
                      
                    }
                     break;
           }

          this.setLoading(true);
            // the new handle message needs to take the redirect.
			var updatedbillingPhoneNumber = null;
            if(billingPhoneNumber!==null){
                updatedbillingPhoneNumber = billingPhoneNumber.replace(/[^0-9]/g, "");
            }
            var orderNumber = this.$parent.find('[data-mz-order-number]').val(),self = this;
            api.action('customer', 'orderStatusLogin', {
                ordernumber: orderNumber,
                email: email,
                billingZipCode: billingZipCode,
                billingPhoneNumber: updatedbillingPhoneNumber
            }).then(function () { 
                window.location.href = "/my-anonymous-account"; 
            }, function(err){
                if(billingPhoneNumber!==null){
                    api.action('customer', 'orderStatusLogin', {
                        ordernumber: orderNumber,
                        email: email,
                        billingZipCode: billingZipCode,
                        billingPhoneNumber: billingPhoneNumber
                   }).then(function () { 
                        window.location.href = "/my-anonymous-account";
                   },function(err){
                    _.bind(self.retrieveErrorLabel,self)(err);
                   });
                }else{
                    _.bind(self.retrieveErrorLabel,self)(err);
                }
            });
        },
        validData: function(){
            var validity = true;
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var patt = new RegExp(re);
            if(this.$parent.find('[data-mz-login-email]').val().length === 0){
                this.$parent.find('[data-mz-login-email]').css({'border':'1px solid #e9000f'});
                validity = false;
            }else if(patt.test(this.$parent.find('[data-mz-login-email]').val())){
                this.$parent.find('[data-mz-login-email]').css({'border':'1px solid #c2c2c2'});    
            }else{
                this.$parent.find('[data-mz-login-email]').css({'border':'1px solid #e9000f'});
                validity = false;
            }
            if(this.$parent.find('[data-mz-login-password]').val().length === 0){
                this.$parent.find('[data-mz-login-password]').css({'border':'1px solid #e9000f'});    
                validity = false;
            }else{
                this.$parent.find('[data-mz-login-password]').css({'border':'1px solid #c2c2c2'});    
            }
            return validity;
        },
        retrievePassword: function () {
            this.setLoading(true);
            if(this.$parent.find('[data-mz-forgotpassword-email]').val().length === 0){
                this.$parent.find('[data-mz-forgotpassword-email]').css({'border':'1px solid #e9000f'});
            }else{
                this.$parent.find('[data-mz-forgotpassword-email]').css({'border':'1px solid #c2c2c2'});
            }
            api.action('customer', 'resetPasswordStorefront', {
                EmailAddress: this.$parent.find('[data-mz-forgotpassword-email]').val()
            }).then(_.bind(this.displayResetPasswordMessage,this), this.displayApiMessage);
        },
        handleLoginComplete: function () {
            if (window.location.pathname !== "/login-sweet-rewards" && window.location.pathname !== "/user/login" && window.location.pathname !== "/myaccount#account-loyalty-program" && window.location.pathname.indexOf("/user/resetpasswordconfirm") == -1 && window.location.href.indexOf('checkout') === -1) {
                window.location.reload();
            }
            else if (window.location.pathname === "/myaccount#account-loyalty-program") {
                window.location = '/myaccount';
            }
            else if(window.location.href.indexOf('checkout') === -1 && window.location.pathname.indexOf("/user/resetpasswordconfirm") == -1 && window.location.pathname !== "/user/login" ){
                window.location = '/myaccount#account-loyalty-program';
            }
            else if(window.location.href.indexOf('checkout')>-1){
                $('#minicartform').submit();
            }else{
                window.location = '/';
            }
            window.hideGlobalOverlay();
        },
        displayResetPasswordMessage: function () {
            this.displayMessage(Hypr.getThemeSetting('resetEmailSent'));
            $('.mz-validationmessage').css({'color':'#6CCB51'});
        }
    });

    var SignupPopover = function() {
        DismissablePopover.apply(this, arguments);
    };
    SignupPopover.prototype = new DismissablePopover();
    $.extend(SignupPopover.prototype, LoginPopover.prototype, {
        boundMethods: ['handleEnterKey', 'dismisser', 'displayMessage', 'displayApiMessage', 'createPopover', 'signup', 'onPopoverShow'],
        template: Hypr.getTemplate('modules/common/signup-popover').render(),
        bindListeners: function (on) {
            var onOrOff = on ? "on" : "off";
            this.$parent[onOrOff]('click', '[data-mz-action="signup"]', this.signup);
            this.$parent[onOrOff]('keypress', 'input', this.handleEnterKey);
            $('.mz-popover-signup-password').focusin(function(){
                $('.pwd-message').show(); 
            });
            $('.mz-popover-signup-password').focusout(function(){
                $('.pwd-message').hide(); 
            });
        },
        handleEnterKey: function (e) {
            if (e.which === 13) { this.signup(); }
        },
        validate: function (payload) {
            if (!payload.account.emailAddress) return this.displayMessage(Hypr.getThemeSetting('emailMissing')), false;
            if (!payload.password) return this.displayMessage(Hypr.getThemeSetting('passwordMissing')), false;
            if (payload.password !== this.$parent.find('[data-mz-signup-confirmpassword]').val()) return this.displayMessage(Hypr.getThemeSetting('passwordsDoNotMatch')), false;
            return true;
        },
        signup: function () {
            var self = this,
                email = this.$parent.find('[data-mz-signup-emailaddress]').val(),
                firstName = this.$parent.find('[data-mz-signup-firstname]').val(),
                lastName = this.$parent.find('[data-mz-signup-lastname]').val(),
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
                    password: this.$parent.find('[data-mz-signup-password]').val()
                };
            if (this.validData() && this.validate(payload)) {
                //var user = api.createSync('user', payload);
                this.setLoading(true);
                return api.action('customer', 'createStorefront', payload).then(function () {
                    window.location = '/myaccount';
                }, self.displayApiMessage);
            }
        },
        validData: function(){
            var validity = true;
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var patt = new RegExp(re);
            if(this.$parent.find('[data-mz-signup-firstname]').val().length === 0){
                this.$parent.find('[data-mz-signup-firstname]').css({'border':'1px solid #e9000f'});
                validity = false;
                return this.displayMessage(Hypr.getThemeSetting('firstName')), false;
            }else{
                this.$parent.find('[data-mz-signup-firstname]').css({'border':'1px solid #c2c2c2'});
            }
            if(this.$parent.find('[data-mz-signup-lastname]').val().length === 0){
                this.$parent.find('[data-mz-signup-lastname]').css({'border':'1px solid #e9000f'});
                validity = false;
                return this.displayMessage(Hypr.getThemeSetting('lastName')), false;
            }else{
                this.$parent.find('[data-mz-signup-lastname]').css({'border':'1px solid #c2c2c2'});
            }
            if(this.$parent.find('[data-mz-signup-emailaddress]').val().length === 0){
                this.$parent.find('[data-mz-signup-emailaddress]').css({'border':'1px solid #e9000f'});
                validity = false;
                return this.displayMessage(Hypr.getThemeSetting('validEmail')), false;
            }else if(patt.test(this.$parent.find('[data-mz-signup-emailaddress]').val())){
                this.$parent.find('[data-mz-signup-emailaddress]').css({'border':'1px solid #c2c2c2'});
            }else{
                this.$parent.find('[data-mz-signup-emailaddress]').css({'border':'1px solid #e9000f'});
                validity = false;
                return this.displayMessage(Hypr.getThemeSetting('validEmialSignUp')), false;
            }
            if(this.$parent.find('[data-mz-signup-password]').val().length === 0){
                this.$parent.find('[data-mz-signup-password]').css({'border':'1px solid #e9000f'});
                validity = false;
                return this.displayMessage(Hypr.getThemeSetting('validPassword')), false;
            }else{
                this.$parent.find('[data-mz-signup-password]').css({'border':'1px solid #c2c2c2'});
            }
            if(this.$parent.find('[data-mz-signup-confirmpassword]').val().length === 0){
                this.$parent.find('[data-mz-signup-confirmpassword]').css({'border':'1px solid #e9000f'});
                validity = false;
                return this.displayMessage(Hypr.getThemeSetting('validPassword')), false;
            }else{
                this.$parent.find('[data-mz-signup-confirmpassword]').css({'border':'1px solid #c2c2c2'});
            }
            // var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
            if(this.$parent.find('[data-mz-signup-confirmpassword]').val() != this.$parent.find('[data-mz-signup-password]').val()){
                validity = false;
                return this.displayMessage(Hypr.getThemeSetting('validPasswordSecond')), false;
            }
            
            return validity;
        }
    });


    $(document).ready(function () {
        
        // script to validate the empty fields submittion in reset password page.
        $(document).find('form.reset-password-form').find('.submit-similarbutton').click(function(e){
            var flag = false;
            $(document).find('form.reset-password-form').find('input').filter(function(val){
                if($(this).val() === ""){
                    flag = true;
                }
            });
            if(flag){
                $(document).find('form.reset-password-form').find('.mz-messagebar').html('<ul class="is-showing mz-errors"><li>'+Hypr.getThemeSetting('passwordMissing')+'</li></ul>'); 
            }else{
                $(document).find('form.reset-password-form').find('.mz-button-large').click();   
            }
        });
        $("#login-cpp-checkbox").on("change", function() {
        if (this.checked) {
            $('.login-btn-signup').prop('disabled',false);
        }else{
            $('.login-btn-signup').prop('disabled',true);
        }
    });
    $("#orderstatus-cpp-checkbox").on("change", function() {
        if (this.checked) {
            $('.orderstatus-btn').prop('disabled',false);
        }else{
            $('.orderstatus-btn').prop('disabled',true);
        } 
    }); 
       
        
        $docBody = $(document.body); 
        $('[data-mz-action="login"]').each(function () {
            var popover = new LoginPopover();
            popover.init(this);
            $(this).data('mz.popover', popover);
        });
        $('[data-mz-action="signup"]').each(function () {
            var popover = new SignupPopover();
            popover.init(this);
            $(this).data('mz.popover', popover);
        });
        $('input[name="ordernum"]').keypress(function(e)  {
           if((e.charCode >=65 && e.charCode <=90)|| (e.charCode >=97 && e.charCode <=122)) {
                return false;
            }   
        });
      
       $('input[name="verification"]').on("change keyup paste", function (e) {
            if($('[data-mz-verify-with]').val()=="zipCode") {
                if((e.charCode >=65 && e.charCode <=90)|| (e.charCode >=97 && e.charCode <=122)) {
                    return false;
                }  
            }
           if($('[data-mz-verify-with]').val()=="phoneNumber") {
               var output;
                var input = $(".onlyverification").val();
                input = input.replace(/[^0-9]/g, '');  
                var area = input.substr(0, 3);  
                var pre = input.substr(3, 3);   
                var tel = input.substr(6, 4);
                if (area.length < 3) {
                    output = "(" + area;
                } else if (area.length == 3 && pre.length < 3) {
                    output = "(" + area + ")" + " " + pre;      
                } else if (area.length == 3 && pre.length == 3) {
                    output = "(" + area + ")" + " " + pre + "-" + tel;
                }
                $(".onlyverification").val(output);
            } 
        });  
        
 
        $('[data-mz-action="loginpage-submit"]').each(function(){
            var loginPage = new LoginPopover();
            loginPage.formSelector = 'form[name="mz-loginform"]';
            loginPage.pageType = 'login';
            loginPage.init(this); 
        });
        
        $('[data-mz-action="anonymousorder-submit"]').each(function () {
            var loginPage = new SignupPopover(); 
            loginPage.formSelector = 'form[name="mz-anonymousorder"]';
            loginPage.pageType = 'anonymousorder';
            loginPage.init(this);
            $('mz-more-order').css('display','none');
        });
        var referrer =  document.referrer;
    
        if(referrer !== ""){  
            var a= referrer;
         
            
            var b= a.split('/');
            var url = "";
                for(var i = 3 ; i<b.length; i++){ 
                     url= url+'/'+b[i]; 
                    }
            if(url != "/user/login" && url.indexOf('/user/resetpasswordconfirm') == -1){        
                $('.urllink').attr("value", url);  
            }else if(url === "" || url ==="/"  ){
                $('.urllink').attr("value", "/home");  
            }
            else{
                $('.urllink').attr("value", "/home");
                }           
        }  
        else{
            $('.urllink').attr("value", "/home");
        }
        
          $('[data-mz-action="logout"]').each(function(){
            var el = $(this);

         //if were in edit mode, we override the /logout GET,
         //to preserve the correct referrer/page location | #64822
            if (require.mozuData('pagecontext').isEditMode) { 

                el.on('click', function(e) {
                    e.preventDefault();
                   $.ajax({
                        method: 'GET', 
                        url: '../../logout',
                       complete: function() { location.reload();}
                    });
                });
            }
            
        });
        
        //select arrow function
        $(document).on('click', '[data-mz-verify-with]', function(){
            var caretDown = $(this).parent().find('.down-caret-order-status');
            var caretUp = $(this).parent().find('.up-caret-order-status');
            
            if(caretDown.length == 1 && caretDown.css('display') == 'none'){
                caretDown.show();
                caretUp.hide();
            }
            else {
                caretUp.show();
                caretDown.hide();
            }
            $('[data-mz-verify-with]').focusout(function(){
                $('.up-caret-order-status').hide();
                $('.down-caret-order-status').show();
            });
        });
        
        //sweet rewards
        $(document).find('.sweet-rewards-login').on('click',function(e){
            $(document).find('.zinrelo-tab').click();
        }); 
        
        
        /*$('[data-mz-action="login"]').on('mouseover',function(e){
            if(popoverS.$parent){
                popoverS.dismisser(e);
            }
        });
        $('[data-mz-action="signup"]').on('mouseover',function(e){
            if(popoverL.$parent){
                popoverL.dismisser(e);
            }
        });
    */
    });
        
});












