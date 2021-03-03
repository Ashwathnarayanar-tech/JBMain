require(['modules/backbone-mozu',"modules/jquery-mozu", "hyprlive", 'modules/api'], function (Backbone, $, Hypr, Api) {
    $(document).ready(function(){
        // creating header view 
        /** Sign up form **/     
        $('.mz-signup-password').focusin(function(){
            $('.pwd-message-desktop').show();    
        });
        $('.mz-signup-password').focusout(function(){
            $('.pwd-message-desktop').hide();      
        });
        $("#signup-cpp-checkbox").on("change", function() {
        if (this.checked) {
            $('.mz-signup-register').prop('disabled',false);
        }else{
            $('.mz-signup-register').prop('disabled',true);
        }
    });
        var myDomElement = null;
        $(document).mousemove(function(e) {
            // console.log($(e.target));
            myDomElement = $(e.target);
        });

        //ADA for login popover.
        $(document).on('keydown','.popover-label',function(e){
            if(e.which == 13 || e.which == 32){
                e.preventDefault(); 
                $(document).find('.popover-content').addClass('active');
                loopinoverlay();    
                $(document).find('.popover-content').find('select, input, textarea, button, a, [tabindex="0"]').filter(':visible').first().focus(); 
            }
            if((e.which === 9 && !e.shiftKey)){
                e.preventDefault();
                $(document).find('.mz-utilitynav-link-cart').focus(); 
            }
        });

        var loopinoverlay = function(){
            var Menuinputs = window.Menuinputs = null;
            var MenufirstInput = window.MenufirstInput = null;
            var MenulastInput = window.MenulastInput = null;
            Menuinputs = window.Menuinputs = $(document).find('.popover-content').find('select, input, textarea, button, a, [tabindex="0"]').filter(':visible');
            MenufirstInput = window.MenufirstInput = window.Menuinputs.first();
            MenulastInput = window.MenulastInput = window.Menuinputs.last();

            // if current element is last, get focus to first element on tab press.
            window.MenulastInput.on('keydown', function (e) {
               if ((e.which === 9 && !e.shiftKey)) {
                   e.preventDefault();
                   window.MenufirstInput.focus();    
               }
            });
            
            // if current element is first, get focus to last element on tab+shift press.
            window.MenufirstInput.on('keydown', function (e) {
                if ((e.which === 9 && e.shiftKey)) {
                    e.preventDefault();
                    window.MenulastInput.focus(); 
                }
            });

            // go back to parent menu
            window.Menuinputs.on('keydown', function(e){
                if(e.which === 27){
                    e.preventDefault();
                    $(document).find('.popover-content').removeClass('active');
                    $(document).find('.popover-label').focus();
                }
            });
        };

        // $(document).on('keydown','.popover-content',function(e){ 
        //     if((e.which === 9 && e.shiftKey)){
        //         e.preventDefault(); 
        //         $(document).find('.popover-content').removeClass('active');
        //     }
        // });

        var SignupForm = function($el){
            var self = this; 
            this.$el = $el;
            this.$messagebar =  this.$el.find('[data-mz-role="mz-signup-register-message"]');
            this.$el.on('click', '#signup-submit',function(e) {
                e.preventDefault();
                self.signup();
                return false;
            });   

            $.each(this.boundMethods, function(ix, method) {
                self[method] = $.proxy(self[method], self);
            });
        };      

        $.extend(SignupForm.prototype, {
            boundMethods: ['displayMessage', 'displayApiMessage', 'signup'],
            signup: function() {
                var self = this,
                data = {
                    signupemail : this.$el.find('.mz-signup-email')[0].value,
                    confirmpassword : this.$el.find('.mz-signup-password')[0].value,
                    signuppassword : this.$el.find('.mz-signup-confirmpassword')[0].value
                },
                payload = {
                    account: {
                        emailAddress: this.$el.find('.mz-signup-email')[0].value,
                        userName: this.$el.find('.mz-signup-email')[0].value,
                        firstName: this.$el.find('.mz-signup-firstname')[0].value,
                        lastName: this.$el.find('.mz-signup-lastname')[0].value,
                        contacts: [{
                            email: this.$el.find('.mz-signup-email')[0].value,
                            firstName: this.$el.find('.mz-signup-firstname')[0].value,
                            lastNameOrSurname: this.$el.find('.mz-signup-lastname')[0].value
                        }]
                    },
                    password: this.$el.find('.mz-signup-password')[0].value
                };
                if (this.validate(data)) {
                    return Api.action('customer', 'createStorefront', payload).then(function () {
                      if(window.location.pathname.indexOf("/checkout") > -1) {
                        window.location.reload();
                      }
                      else{
                        window.location = '/myaccount';
                      }
                    }, self.displayApiMessage);
                }
            }, 
            validate: function(data) { 
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                var strongRegex = new RegExp(re);
                if(this.$el.find('[data-mz-signup-firstname]').val().length === 0){
                    this.$el.find('[data-mz-signup-firstname]').attr('aria-describedby','mz-errors-list').css({'border':'1px solid #e9000f'}).focus();
                    return this.displayMessage('Error: Please provide your First Name.'), false;
                }else{
                    this.$el.find('[data-mz-signup-firstname]').attr('aria-describedby','').css({'border':'1px solid #c2c2c2'});
                }
                if(this.$el.find('[data-mz-signup-lastname]').val().length === 0){
                    this.$el.find('[data-mz-signup-lastname]').attr('aria-describedby','mz-errors-list').css({'border':'1px solid #e9000f'}).focus();
                    return this.displayMessage('Error: Please provide your Last Name.'), false;
                }else{
                    this.$el.find('[data-mz-signup-lastname]').attr('aria-describedby','').css({'border':'1px solid #c2c2c2'});
                }
                if(strongRegex.test(data.signupemail)) {
                    this.$el.find('[data-mz-signup-emailaddress]').attr('aria-describedby','').css({'border':'1px solid #c2c2c2'});
                }else{
                    this.$el.find('[data-mz-signup-emailaddress]').attr('aria-describedby','mz-errors-list').css({'border':'1px solid #e9000f'}).focus();
                    return this.displayMessage("Error: Please enter a valid Email Address and Password combination. Make sure you include the '@' and the '.' in the Email Address and that your Password has a minimum of 6 characters with at least 1 number and 1 alphabetic character."), false;
                }  
                if(!data.signuppassword || !data.confirmpassword) {
                  this.$el.find('[data-mz-signup-password]').attr('aria-describedby','mz-errors-list').css({'border':'1px solid #e9000f'}).focus();
                  this.$el.find('[data-mz-signup-confirmpassword]').attr('aria-describedby','mz-errors-list').css({'border':'1px solid #e9000f'});
                  return this.displayMessage('Error: Provide both password. Password must be a minimum of 6 characters with at least 1 number and 1 alphabetic character.'),false;
                }
                if(data.signuppassword !== data.confirmpassword) {
                  this.$el.find('[data-mz-signup-password]').attr('aria-describedby','mz-errors-list').css({'border':'1px solid #e9000f'}).focus();
                  this.$el.find('[data-mz-signup-confirmpassword]').attr('aria-describedby','mz-errors-list').css({'border':'1px solid #e9000f'});
                  return this.displayMessage('Error: Password doesn\'t match. Password must be a minimum of 6 characters with at least 1 number and 1 alphabetic character.'), false;
                }
                // if(!strongRegex.test(data.signuppassword)){ return this.displayMessage(Hypr.getLabel('passwordStrong')), false; }
                return true; 
            },
            displayMessage: function(msg) {
                this.$messagebar.html(this.messageTemplate.render({
                    model: [{
                        message: msg
                    }]
                }));
                // this.$el.find('.mz-signup-password').val('');
                // this.$el.find('.mz-signup-confirmpassword').val(''); 
            },
            displayApiMessage: function (xhr) { 
                var err, trimMsg = '';
                if(xhr.errorCode=="MISSING_OR_INVALID_PARAMETER"){
                    var errorMessage = xhr.message;
                    var msgArray = errorMessage.split("Error: Missing or invalid parameter:");  // filter out only the message
                    if(!msgArray[1]){
                        msgArray = errorMessage.split("Missing or invalid parameter:");    
                    }
                    if(msgArray[1]) {
                        trimMsg = msgArray[1].trim();
                    }
                    var errArray =  trimMsg.replace(/^\S+/g, '');  
                    // set the error message
                    if (errArray.includes("Password must be a minimum of 6 characters")) {
                      errArray = Hypr.getLabel("minPasswordReqs");
                    } else if(errArray.indexOf("EmailAddress already associated with a login")){
                        errArray = Hypr.getLabel("signuperror");
                    }    
                    err = errArray; // filter out the 
                }else if(xhr.errorCode =="VALIDATION_CONFLICT"){
                    this.$el.find('[data-mz-signup-email]').val('');
                    this.$el.find('[data-mz-signup-confirmemail]').val(''); 
                    err = 'Error: Username already registered';     
                }else{
                    err = "Error: "+Hypr.getLabel('unexpectedError'); 
                }
                this.displayMessage(err);
                this.$el.find("[data-mz-signup-emailaddress]").attr('aria-describedby','mz-errors-list').css({'border':'1px solid #e9000f'}).focus();
            },
            hideMessage: function() {
                this.$messageBar.html('');
            },
            messageTemplate: Hypr.getTemplate('modules/common/message-bar')
        });
        /** Reset password functionality **/
        var user = require.mozuData('user');
        $(document).on('keypress',function (e) {
            var key = e.which;
            var self=this;
            if(key == 13 && $("#signup-cpp-checkbox").prop('checked') === true)  // the enter key code
            {    
                $('#signup-submit').click();
                return false; 
            }
        }); 
        if(user.isAnonymous){
            var signupForm = new SignupForm($('#jb-signup'));   
        }else{
            if(window.location.pathname == "/signup"){
                window.location = '/logout?returnurl=/signup';
            }
        }
    });
});



