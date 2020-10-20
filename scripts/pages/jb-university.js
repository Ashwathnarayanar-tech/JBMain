require([
    "modules/jquery-mozu"
], function($) {
    $(document).ready(function() {
        // ADA for JB tour and JB university pages   
        try {
            $(document).on('click', '#accordian h2', function() {
                accordianFunction($(this));
            });

            $(document).on('keydown', '#accordian h2', function(e) {
                e.preventDefault();
                if (e.which == 13 || e.which == 32) {
                    accordianFunction($(this));
                }
            });

            //accordian fucntionality
            var accordianFunction = function($ele) {
                for(var i=0;i<$('#accordian h2').length ;i++){
                    $($('#accordian h2')[i]).removeClass("static-accord-close");
                    $($('#accordian h2')[i]).addClass("static-accord-open");
                }
                if (!$ele.parent().hasClass("active")) {
                    $ele.parent().find('.new-icon-plus').hide();
                    $ele.parent().find('.new-icon-minus').show();
                    $('#accordian li').removeClass('active');
                    $('#accordian li').attr("aria-expanded", "false");
                    $ele.parent().addClass("active");
                    $ele.removeClass("static-accord-open");
                    $ele.addClass("static-accord-close");
                    $ele.parent().attr("aria-expanded", "true");
                    $("#accordian ul ul").slideUp();
                    if (!$ele.next().is(":visible")) {
                        $ele.next().slideDown();
                        $ele.next().find('div').focus();
                    }
                } else {
                    $ele.parent().find('.new-icon-plus').show();
                    $ele.parent().find('.new-icon-minus').hide();
                    $('#accordian li').removeClass('active');
                    $('#accordian li').attr("aria-expanded", "false");
                    $("#accordian ul ul").slideUp();
                }
            };
        } catch (ex) {
            console.warn(ex.message);
        }

    });
});