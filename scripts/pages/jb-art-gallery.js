require([
    "modules/jquery-mozu",
    "shim!vendor/owl.carousel[jquery=jQuery]>jQuery",
    'shim!vendor/jquery-colorbox/jquery.colorbox[jquery=jQuery]', 'modules/candy-calculator'
], function($, _) {
    $(document).ready(function() {
        //Art gallery
        $('.art-galleries .art-galleries-head').click(function(e) {
            $('.art-galleries .art-galleries-head').removeClass('active');
            $('.art-gallery-item .art-gallery-details').hide();
            $(e.target).addClass('active');
            var galleryName = e.target.getAttribute('galleryname');
            var galleryItemURL = e.target.getAttribute('galleryItemURL');
            $('.art-gallery-item .galleryItemURL').fadeOut(400, function() {
                    $('.art-gallery-item .galleryItemURL').attr('src', galleryItemURL);
                })
                .fadeIn(400);
            $('.art-gallery-item-thumbs').hide();
            $('.' + galleryName).show();
        });

        $(document).on('keypress', ".faq", function(e) {
            if (e.keyCode == 13) {
                $(this).find('h2').trigger('click');
            }
        });

        var owlArtThump = $('.art-gallery-item-thumbs');

        owlArtThump.owlCarousel({
            loop: true,
            nav: true,
            margin: 2,
            dots: false,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1
                },
                400: {
                    items: 3
                },
                600: {
                    items: 4
                },
                1000: {
                    items: 7
                }
            }
        });

        // ADA fixed for art gallery
        $(document).on('keydown', '.art-galleries-head', function(e) {
            if (e.which == 13 || e.which == 32) {
                e.preventDefault();
                $(document.activeElement).click();
                $(document).find('.owl-item.active').filter(':visible').first().focus();
                updatetabindex();
            }
        });

        $(document).find('.owl-item').each(function() {
            $(this).attr('aria-label', $(this).find('img').attr('alt'));
        });

        $(document).find('.owl-prev,.owl-next').each(function() {
            if ($(this).hasClass('owl-prev')) {
                $(this).attr('aria-label', 'slide previous');
                $(this).attr('tabindex', 0);
            } else {
                $(this).attr('aria-label', 'slide next');
                $(this).attr('tabindex', 0);
            }
        });

        $(document).on('keydown', '.owl-next', function(e) {
            if (e.which == 13 || e.which == 32) {
                e.preventDefault();
                owlArtThump.trigger('next.owl');
                setTimeout(function() {
                    updatetabindex();
                    $(document).find('.owl-item.active').filter(':visible').last().focus();
                }, 500);
            }
        });

        $(document).on('keydown', '.owl-prev', function(e) {
            if (e.which == 13 || e.which == 32) {
                e.preventDefault();
                owlArtThump.trigger('prev.owl');
                setTimeout(function() {
                    updatetabindex();
                    $(document).find('.owl-item.active').filter(':visible').first().focus();
                }, 500);
            }
        });

        $(document).on('click', '.owl-next,.owl-prev', function(e) {
            setTimeout(function() {
                updatetabindex();
            }, 500);
        });

        updatetabindex();

        $(document).on('click', '.owl-item', function(e) {
            showslidedetails($(e.currentTarget));
        });

        $(document).on('keydown', '.owl-item', function(e) {
            if (e.which == 13 || e.which == 32) {
                e.preventDefault();
                showslidedetails($(document.activeElement));
            }
        });

        function updatetabindex() {
            $(document).find('.owl-item').each(function() {
                if ($(this).hasClass('active') && $(this).is(':visible')) {
                    $(this).attr('tabindex', 0);
                } else {
                    $(this).attr('tabindex', -1);
                }
            });
        }

        function showslidedetails(ele) {
            var AGD = ele.find('img').attr('AGD');

            $('.art-gallery-item .galleryItemURL').hide();
            $('.art-gallery-item .art-gallery-details').hide();
            $('.art-gallery-item .art-gallery-details[AGD=' + AGD + ']').show();
            $('.art-gallery-item .art-gallery-details[AGD=' + AGD + ']').find('.banner-detail').find('h3').focus();
        }

    });
});