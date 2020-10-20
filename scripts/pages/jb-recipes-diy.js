require([
    "modules/jquery-mozu"
], function($) {
    $(document).ready(function() {
        //ADA for recipes and diy 
        $(document).find('.recipe').on('keydown', function(e) {
            if (e.which == 13 || e.which == 32) {
                e.preventDefault();
                $(document.activeElement).click();
                setTimeout(function() {
                    $(document).find('.filtr-container').find('.mz-cms-col-6-12').filter(function() {
                        return $(this).find('.filtr-item').css('opacity') == '1';
                    }).first().find('.filtr-item').children().first().focus();
                }, 1000);
            }
        });

        $(document).find('.mz-cms-col-6-12').find('.description a').on('keydown', function(e) {
            if ((e.which === 9 && !e.shiftKey)) {
                if ($(document.activeElement).parents('.mz-cms-col-6-12').nextAll().filter(function() {
                        return $(this).find('.filtr-item').css('opacity') == '1';
                    }).length > 0) {
                    e.preventDefault();
                    $(document.activeElement).parents('.mz-cms-col-6-12').nextAll().filter(function() {
                        return $(this).find('.filtr-item').css('opacity') == '1';
                    }).first().find('.filtr-item').children().first().focus();
                } else {
                    e.preventDefault();
                    setTimeout(function() {
                        $(document).find('.jb-footer-evrgreen').find('a').first().focus();
                    }, 10);

                }
            }
        });

        $(document).find('.recipe').last().on('keydown', function(e) {
            if ((e.which === 9 && !e.shiftKey)) {
                e.preventDefault();
                $(document).find('.filtr-container').find('.mz-cms-col-6-12').filter(function() {
                    return $(this).find('.filtr-item').css('opacity') == '1';
                }).first().find('.filtr-item').children().first().focus();
            }
        });

        $(document).find('.jb-footer-evrgreen').find('a').first().on('keydown', function(e) {
            if ((e.which === 9 && e.shiftKey)) {
                $(document).find('.filtr-container').find('.mz-cms-col-6-12').filter(function() {
                    return $(this).find('.filtr-item').css('opacity') == '1';
                }).last().find('.filtr-item').find('.description').last().find('a').focus();
            }
        });

        $(document).find('.mz-cms-col-6-12').find('.heading').on('keydown', function(e) {
            if ((e.which === 9 && e.shiftKey)) {
                if ($(document.activeElement).parents('.mz-cms-col-6-12').prevAll().filter(function() {
                        return $(this).find('.filtr-item').css('opacity') == '1';
                    }).length > 0) {
                    e.preventDefault();
                    $(document.activeElement).parents('.mz-cms-col-6-12').prevAll().filter(function() {
                        return $(this).find('.filtr-item').css('opacity') == '1';
                    }).first().find('.filtr-item').find('.description').last().find('a').focus();
                } else {
                    e.preventDefault();
                    $(document).find('.recipe').last().focus();
                }
            }
        });

        //Cooking Ideas
        $('[close-open-coocking-ideas]').click(function(e) {
            $(e.target.parentElement).find('.baking-recipe').slideToggle();
        });
    });
});