define(['modules/jquery-mozu', 'hyprlive',
        'shim!vendor/bootstrap/js/affix[jquery=jQuery]', 'shim!vendor/bootstrap/js/scrollspy[jquery=jQuery]'], 
        function ($, Hypr) {
    // if (!Modernizr.mq('(max-width: 800px)')) {
        var gutterWidth = parseInt(Hypr.getThemeSetting('gutterWidth'));
        $(document).ready(function () {
            
            /** navigation functionality for each nav item **/
            $(document).on('click','a.mz-scrollnav-link',function(e){
                // e.preventDefault();
                e.stopPropagation();
                $('a.mz-scrollnav-link').removeClass('active');
                $(e.target).addClass('active');
                if(e.target.attributes.getNamedItem('forid').value === "gotoTop"){
                    $("html, body").animate({scrollTop:  $(".mz-myaccount").offset().top }, 250);
                }else{
                    var nav = e.target.attributes.getNamedItem('forid').value;
                    $('#account-panels .mz-l-stack-section').hide();
                    $('#x-'+nav).show();
                }
                hideAllErrorMessages();
                // $("html, body").animate({scrollTop:  $(".mz-columnfull").offset().top+30 }, 200);
            });
            //SHow pop up on  mobile
            $(document).on('click','a.selected-menu-mobile',function(e){
                $('div.mobile-popupmenu-myaccount').slideDown();
            });
            //Click handler to change menu in mobile
            $(document).on('click','a.mz-scrollnav-link-mobile',function(e){
                var text = $('a.mz-scrollnav-link[forID="'+e.target.getAttribute('forid')+'"]').text();
                $('a.selected-menu-mobile').text(text);
                $('a.mz-scrollnav-link-mobile').removeClass('active');
                $(e.target).addClass('active');
                var nav = e.target.attributes.getNamedItem('forid').value;
                $('#account-panels .mz-l-stack-section').hide();
                $('#x-'+nav).show();
                $('div.mobile-popupmenu-myaccount').slideUp();
                trapFocus();
                hideAllErrorMessages();
            });
            function trapFocus(){
                $('.myaccount-close').focus();
                    var trapFocusInputs = $(document).find('.mobile-popupmenu-myaccount.mz-mobile').find('.mz-scrollnav-link-mobile,.myaccount-close').filter(':visible');   
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
              
            }
            if(window.location.hash.length > 0){
                $('#x-'+window.location.hash.substring(1,window.location.hash.length)).show();
                $('[forID="'+window.location.hash.substring(1,window.location.hash.length)+'"]').addClass('active');
                // mobile
                var text = $('a.mz-scrollnav-link[forID="'+window.location.hash.substring(1,window.location.hash.length)+'"]').text();
                $('a.selected-menu-mobile').text(text);
            }else{
                $('#x-account-settings').show();
                $('[forID="account-settings"]').addClass('active');
                //mobile
                $('a.selected-menu-mobile').text('PREFERENCES');
                
            }
            
            function hideAllErrorMessages(){
                $('#account-messages').css('display','none');
            }
        });
    // }
});
