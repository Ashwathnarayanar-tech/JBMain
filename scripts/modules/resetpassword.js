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
                    window.showGlobalOverlay("Resetting password please wait","",false);
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
                window.hideGlobalOverlay();
                if(msg=== "The system does not permit the attempted operation.  User account is locked, Please contact System Administrator "){
                    msg = Hypr.getThemeSetting('lockedaccount');
                }else{
                    msg = msg? msg: Hypr.getLabel('resetEmailSent');    
                }
                
                this.$messagebar.html(this.messageTemplate.render({
                    model: [{ message: msg }]
                }));
            },
            displayApiMessage: function (xhr) {
                window.hideGlobalOverlay();
                //UCP Changes
                if(xhr.errors){
                    if(xhr.errors.applicationName === "MozuStorefront" && xhr.errors.errorCode === "ITEM_NOT_FOUND"){
                        xhr.message =   Hypr.getThemeSetting('resetPasswordMessage');//Hypr.getLabel('resetPasswordMessage');  
                    }
                }else if(xhr.applicationName === "Customer" && xhr.errorCode === "ITEM_NOT_FOUND"){
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




