define('pages/fiery-five-challenge', ["modules/jquery-mozu"], function ($) {
    
    var videoval = '', videoid = '', player, popplayer, blnk, vidcount, vid1sec, vid2sec, vid3sec, vid4sec, vid5sec, vid6sec, vid7sec, vid8sec, vid9sec, vid10sec;
    
    var customObject = {
        // self defining function.
        os : function () {
            var ua = navigator.userAgent.toLowerCase();
            return {
                isWin2K : /windows nt 5.0/.test(ua),
                isXP : /windows nt 5.1/.test(ua),
                isVista : /windows nt 6.0/.test(ua),
                isWin7 : /windows nt 6.1/.test(ua),
                isWin8 : /windows nt 6.2/.test(ua),
                isWin81 : /windows nt 6.1/.test(ua)
            };
        },
        iOSversion : function(v) {
            if (/iP(hone|od|ad)/.test(navigator.platform)) {
                // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
                v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                var arr = [];
                arr.push(parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10));
                if (arr[0] <= 5) {
                    $('.andfiremeg').show();
                    $('.andfiremeg').fadeIn();
                    $('.values_sec').fadeOut();
                }
                /*return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];*/
            }
        },
        openColorbox: function(youtubeId) {
          var w = $(window).width();
          var h = $(window).height();
          var wm = 0.9;
          var hm = 0.5;
          if (require.mozuData('pagecontext').isDesktop) {
            wm = 0.4; 
          }
          $.colorbox({
                  open: true,
                  maxWidth: (w*wm) + 20 + "%",
                  maxHeight: (h*hm) + 20 + "%",
                  scrolling: false,
                  fadeOut: 500,
                  html: '<iframe width="'+(w*wm)+'" height="'+(h*hm)+'" src="https://www.youtube.com/embed/' + youtubeId + '?autoplay=1" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                  overlayClose: true,
                  onComplete : function(){
                      $('#cboxLoadedContent').css({
                          background : "#ffffff",
                          padding: "24px 1px"
                      });
                      
                  }
              });
        },
        loadPlayer: function() { 
            if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
                var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                
                window.onYouTubePlayerAPIReady = function() {
                    customObject.onYouTubePlayer();
                };
            }else{ 
                 customObject.onYouTubePlayer();
                // window.onYouTubePlayerAPIReady = function() {
                //     customObject.onYouTubePlayer();
                // };
            }
        },
        onYouTubePlayer: function() {
            player = new YT.Player('video_frame', {
                width : 510,
                height : 300,
                videoId : '8tPnX7OPo0Q',
                playerVars : {
                    'controls' : 0,
                    'showinfo' : 0,
                    //'wmode': 'transparent',
                    'rel' : 0,
                    'modestbranding' : 1,
                    'html5' : 1
                    //'origin': 'http://nd.dev.nerdydragon.com/demo/fullpage'
                },
                events : {
                    'onStateChange' : customObject.onPlayerStateChange
                }
            });
            
            popplayer = new YT.Player('popvideo', {
                playerVars : {
                    'controls' : 0,
                    'showinfo' : 0,
                    'rel' : 0
                },
                events : {
                'onReady' : customObject.onPlayerReady
                }
            });
        },
        autoload: function(){
            if (navigator.userAgent.match(/Android/i)) {
                $('.values_sec input').addClass('android');
            }
    
            if ((navigator.userAgent.match(/Android/i)) && (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)) {
                $('.andfiremeg').show();
                $('.andfiremeg').fadeIn();
                $('.values_sec').fadeOut();
            }
    
            customObject.iOSversion(); 
            // initilize the Youtube player.
            customObject.loadPlayer();
            /*if (ver[0] <= 5) {
            $('.andfiremeg').fadeIn();
            $('.values_sec').fadeOut();
            }*/
    
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/player_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
            $('#fullvideo').click(function () {
                $('.holdervideo').fadeIn();
            });
    
            $('#closevideo').click(function () {
                $('.holdervideo').fadeOut();
            });
    
            // if (os.isWin7) {
            //     if (!!navigator.userAgent.match(/Trident\/7\./)){
            //         $('.video_sec h3').css('top', '28px');
            //         $('#video_frame').css('visibility', 'hidden');
            //     }
            // }
    
            vid1sec = 0; vid2sec = 0; vid3sec = 0; vid4sec = 0;	vid5sec = 0; vid6sec = 0; vid7sec = 0; vid8sec = 0; vid9sec = 0; vid10sec = 0; vidcount = 0;
    
            var $elie = $("img.rot"), degree = 0, timer = 0, iter, tmr;
            //rotate();
            function rotate() {
                $elie.css({
                    'transform' : 'translate(-50%) rotate(' + degree + 'deg)'
                });
                $elie.css({
                    '-webkit-transform' : 'translate(-50%) rotate(' + degree + 'deg)'
                });
                $elie.css({
                    '-moz-transform' : 'translate(-50%) rotate(' + degree + 'deg)'
                });
    
                tmr = setTimeout(function () {
                    if(iter>0){
                        clearInterval(tmr); 
                        degree += iter;
                        rotate();
                    }
                }, timer);
//                $('.beans-wrapper div img.highlight').remove();
                $('.beans-wrapper div img.ff-beans').each(function(index){ 
                  $(this).attr('src', '/resources/images/fieryfive/' + $(this).attr('regular'));
                });
                if (degree >= 32 && degree < 104) {
                    if (!$('.beans-wrapper div img.reaper').hasClass('done')) {
                      $('.beans-wrapper div img.reaper').attr('src', function(i) { return '/resources/images/fieryfive/' + $(this).attr('shadow'); });
                    }
                } else if (degree >= 104 && degree < 176) {
                    if (!$('.beans-wrapper div img.jalapeno').hasClass('done')) {
                      $('.beans-wrapper div img.jalapeno').attr('src', function(i) { return '/resources/images/fieryfive/' + $(this).attr('shadow'); });
                  }
                } else if (degree >= 176 && degree < 248) {
                  if (!$('.beans-wrapper div img.sriracha').hasClass('done')) {
                    $('.beans-wrapper div img.sriracha').attr('src', function(i) { return '/resources/images/fieryfive/' + $(this).attr('shadow'); });
                  }
                } else if (degree >= 248 && degree < 320) {
                  if (!$('.beans-wrapper div img.cayenne').hasClass('done')) {
                    $('.beans-wrapper div img.cayenne').attr('src', function(i) { return '/resources/images/fieryfive/' + $(this).attr('shadow'); });
                  }
                } else if (degree >= 320 || degree < 32) {
                  if (!$('.beans-wrapper div img.habanero').hasClass('done')) {
                    $('.beans-wrapper div img.habanero').attr('src', function(i) { return '/resources/images/fieryfive/' + $(this).attr('shadow'); });
                  }
                }
                if (degree > 360) {
                    degree = 0;
                }
            }
            
            $(document).find('.spin').click(function () {
              //alert(degree);
                // $("input, #spagain").click(function () {
                // $('#spagain').hide();
                vidcount += 1;
                // if (os.isWin7) {
                //     if (!!navigator.userAgent.match(/Trident\/7\./)){
                //         $('#video_frame').css('visibility', 'visible');
                //     }
                // }
        
                if (navigator.userAgent.match(/iPad/i)) {}
                else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {}
                else {
                    $('#soundeff').prop("currentTime", 0);
                }
                $('#soundeff').get(0).play();
                $('#placeholder').fadeOut();
                // $('#captionshow').hide();
                $('.beans-wrapper div img').removeClass('done');
                //$('.beans-wrapper ul li img.highlight.beans-wrapper ul li img.highlight2').remove();
                // $('#captionshow').fadeOut();
                player.cueVideoById("8tPnX7OPo0Q");
                // iter = 10-Math.floor((Math.random() * 3) + 1);
                if (vidcount == 1) {
                    iter = 9;
                } else if (vidcount == 2) {
                    iter = 7;
                } else if (vidcount == 3) {
                    iter = 10;
                } else if (vidcount == 4) {
                    iter = 8;
                    vidcount = 0;
                }
                rotate();
                var tm = setInterval(function () {
                    if (iter > 0) {
                        --iter;
                    }
                    if (iter <= 0) {
                        iter = 0;
                        // if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
                        //     $('.values_sec').fadeOut();
                        //     $('.video_sec').css('margin-top', '13px');
                        // } else if (navigator.userAgent.match(/Android/i)) {
                        //     $('.values_sec').fadeOut();
                        //     $('.video_sec').css('margin-top', '13px');
                        // }
                        
                        var mydegree = degree;
                        mydegree = (degree >= 0 && degree < 270) ? degree + 90 : 90 - (360-degree);
                        //alert(degree);
                        //alert(mydegree);
                        $('.beans-wrapper div img.ff-beans').each(function(index){ 
                          $(this).attr('src', '/resources/images/fieryfive/' + $(this).attr('regular'));
                        });
                        if (mydegree >= 32 && mydegree < 104 ) {
                          // CAROLINA REAPER
                            vid1sec += 1;
                            $('#soundeff').get(0).pause();
                            customObject.openColorbox('Ng4XZ0t3LsU');
                            videoval = "reaper";
                            //$('h3 img').attr('src', '//content.jellybelly.com/beanboozled/images/jelly9.png');
                            
                            $('.beans-wrapper div img.reaper').attr('src', function(i) { return '/resources/images/fieryfive/' + $(this).attr('shadow'); });
                            //$('.beans-wrapper div:nth-child(1)').append('<img class="highlight" src="//content.jellybelly.com/fieryfive/images/yellow_outline.png" alt="">');
                        } else if (mydegree >= 104 && mydegree < 176 ) {
                          // JALAPENO
                            vid2sec += 1;
                            $('#soundeff').get(0).pause();
                            customObject.openColorbox('rlMBN04FcfQ');
                            videoval = "jalapeno";
                            $('.beans-wrapper div img.jalapeno').attr('src', function(i) { return '/resources/images/fieryfive/' + $(this).attr('shadow'); });
                            //$('.beans-wrapper div:nth-child(4)').append('<img class="highlight" src="//content.jellybelly.com/fieryfive/images/yellow_outline.png" alt="">');
                        } else if (mydegree >= 176 && mydegree < 248) {
                          // SIRACHA
                            vid3sec += 1;
                            $('#soundeff').get(0).pause();
                            customObject.openColorbox('s21Pq-4YEis');
                            videoval = "sriracha";
                            $('.beans-wrapper div img.sriracha').attr('src', function(i) { return '/resources/images/fieryfive/' + $(this).attr('shadow'); });
                            //$('.beans-wrapper div:nth-child(5)').append('<img class="highlight" src="//content.jellybelly.com/fieryfive/images/yellow_outline.png" alt="">');
                        } else if (mydegree >= 248 && mydegree < 320) {
                          // CAYENNE
                            vid4sec += 1;
                            $('#soundeff').get(0).pause();
                            customObject.openColorbox('HVPruV6le44');
                            videoval = "cayenne";
                            $('.beans-wrapper div img.cayenne').attr('src', function(i) { return '/resources/images/fieryfive/' + $(this).attr('shadow'); });
                            //$('.beans-wrapper div:nth-child(3)').append('<img class="highlight" src="//content.jellybelly.com/fieryfive/images/yellow_outline.png" alt="">');
                        } else if (mydegree >= 320 || mydegree < 32) {
                          // HABANERO
                            vid5sec += 1;
                            $('#soundeff').get(0).pause();
                            customObject.openColorbox('WTyXeSchLFY');
                            videoval = "habanero";
                            $('.beans-wrapper div img.habanero').attr('src', function(i) { return '/resources/images/fieryfive/' + $(this).attr('shadow'); });
                            //$('.beans-wrapper div:nth-child(2)').append('<img class="highlight" src="//content.jellybelly.com/fieryfive/images/yellow_outline.png" alt="">');
                        } 
                      
                        clearInterval(tm);
                        $('#captionshow').fadeOut(250);
                    }
                }, 700);
            });
        }, 
        onPlayerReady: function(event) {
            var pauseButton = document.getElementById("closevideo");
            pauseButton.addEventListener("click", function () {
                popplayer.pauseVideo();
            });
        }, 
        onPlayerStateChange: function(event) {
        if (event.data == YT.PlayerState.ENDED) {
            // if (os.isWin7) {
            //     if (!!navigator.userAgent.match(/Trident\/7\./)){
            //         $('#video_frame').css('visibility', 'hidden');
            //     }
            // }
            $('#captionshow').fadeIn();
            //alert('Spin-again or click to see full video');
            blnk = setInterval(function () {
                $('.values_sec input').toggleClass('active');
            }, 100);
            
            window.setTimeout(function () {
                clearInterval(blnk);
                if ($('.values_sec input').hasClass('active')) {
                    $('.values_sec input').removeClass('active');
                }
            }, 2000);
        }

        if (event.data == YT.PlayerState.ENDED) {
            if (videoval == 'reaper') {
                //$('.beans-wrapper ul li img.highlight,.beans-wrapper ul li img.highlight2').remove();
                $('.beans-wrapper div img.reaper').addClass('done');
            } else if (videoval == 'habanero') {
                //$('.beans-wrapper ul li img.highlight,.beans-wrapper ul li img.highlight2').remove();
                $('.beans-wrapper div img.habanero').addClass('done');
            } else if (videoval == 'cayenne') {
                //$('.beans-wrapper ul li img.highlight,.beans-wrapper ul li img.highlight2').remove();
                $('.beans-wrapper div img.cayenne').addClass('done');
            } else if (videoval == 'jalapeno') {
                //$('.beans-wrapper ul li img.highlight,.beans-wrapper ul li img.highlight2').remove();
                $('.beans-wrapper div img.jalapeno').addClass('done');
            } else if (videoval == 'sriracha') {               
                //$('.beans-wrapper ul li img.highlight,.beans-wrapper ul li img.highlight2').remove();
                $('.beans-wrapper div img.sriracha').addClass('done');
            } 
        }
    } 
    };
    // $(window).load(function () {  
    //     $('#preloader').fadeOut();
    //     $('#preloaderoverlay').delay(350).fadeOut('slow');
    // }); 
    // customObject.os();
    // customObject.autoload();
    return {customObject : customObject}; 
});




