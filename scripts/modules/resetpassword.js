require([
    "modules/jquery-mozu",
    "underscore", 
    "hyprlive", 
    'modules/api'], function ($, _, Hypr, Api) {
    $(document).ready(function(){
    
        /** reset passwor form **/    
        
        var ResetPasswordForm = function($el){
            var self = this;
            this.$el = $el;
            this.$messagebar =  this.$el.find('[data-mz-role="popover-message"]');
            this.$el.on('click', '#submitforgotpassword',function(e) {
                e.preventDefault();
                self.resetPassword();
                return false;
            });    
            
            $.each(this.boundMethods, function(ix, method) {
                self[method] = $.proxy(self[method], self);
            });
        };
        
        
        $.extend(ResetPasswordForm.prototype, {
            boundMethods: ['displayMessage', 'displayApiMessage', 'resetPassword'],
            resetPassword: function() {
                var self = this;
                var email = this.$el.find('[data-mz-forgotpassword-email]')[0];
                if(email.value.length>0){
                    Api.action('customer', 'resetPasswordStorefront', {
                    EmailAddress: email.value
                }).then(
                    self.displayMessage,
                    self.displayApiMessage
                );
                }else{
                    this.displayMessage(Hypr.getThemeSetting('validEmialSignUp'));
                }
            },
            displayMessage: function(msg) {
                if(msg=== "The system does not permit the attempted operation.  User account is locked, Please contact System Administrator "){
                    msg = Hypr.getThemeSetting('lockedaccount');
                }else{
                    msg = msg? msg: Hypr.getLabel('resetEmailSent');    
                }
                
                this.$messagebar.html(this.messageTemplate.render({
                    model: [{ message: msg }]
                }));
                if($(this.$messagebar).find(".mz-errors #error-inventory").length > 0) {
                    $(this.$messagebar).find(".mz-errors").attr("role","list").focus();
                    $(this.$messagebar).find(".mz-errors").removeAttr("tabindex");
                    $(this.$messagebar).find(".mz-errors li").attr("role","listitem");
                    $(this.$messagebar).find(".mz-errors li").focus();
                    $(this.$messagebar).find(".mz-errors li").removeAttr("aria-describedby");
                    $(this.$messagebar).find(".mz-errors li p").attr("tabindex","-1");
                    $(this.$messagebar).find(".mz-errors li p").removeAttr("role");
                } else if($(this.$messagebar).find(".mz-errors").length > 0){
                    $(this.$messagebar).find(".mz-errors").attr("role","list").focus();
                    $(this.$messagebar).find(".mz-errors").removeAttr("tabindex");
                    $(this.$messagebar).find(".mz-errors li").attr("role","listitem");
                    $(this.$messagebar).find(".mz-errors li").attr("tabindex","0").focus();
                }
            },
            displayApiMessage: function (xhr) {
                if(xhr.applicationName === "Customer" && xhr.errorCode === "ITEM_NOT_FOUND"){
                    xhr.message =   Hypr.getThemeSetting('resetPasswordMessage');//Hypr.getLabel('resetPasswordMessage');  
                }
                this.displayMessage(xhr.message);
            }, 
            displayResetPasswordMessage: function () {
                this.displayMessage(Hypr.getLabel('resetEmailSent'));
            },
            hideMessage: function() {
            this.$messageBar.html('');
            },
            messageTemplate: Hypr.getTemplate('modules/common/message-bar')
        });
        
        var user = require.mozuData('user');
        var resetPasswordForm = new ResetPasswordForm($('#jb-resetpassword'));   
    });
});




