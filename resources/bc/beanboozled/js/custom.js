// JavaScript Document

var videoval = '';
var videoid = '';
var player
var popplayer
var blnk
var vidcount
var vid1sec, vid2sec, vid3sec, vid4sec, vid5sec, vid6sec, vid7sec, vid8sec, vid9sec, vid10sec

var os = (function () {
	var ua = navigator.userAgent.toLowerCase();
	return {
		isWin2K : /windows nt 5.0/.test(ua),
		isXP : /windows nt 5.1/.test(ua),
		isVista : /windows nt 6.0/.test(ua),
		isWin7 : /windows nt 6.1/.test(ua),
		isWin8 : /windows nt 6.2/.test(ua),
		isWin81 : /windows nt 6.1/.test(ua)
	};
}
	());

function iOSversion(v) {
	if (/iP(hone|od|ad)/.test(navigator.platform)) {
		// supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
		v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
		var arr = new Array();
		arr.push(parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10))
		if (arr[0] <= 5) {
			$('.andfiremeg').fadeIn();
			$('.values_sec').fadeOut();
		}
		/*return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];*/
	}
}

function onYouTubePlayerAPIReady() {
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
				'onStateChange' : onPlayerStateChange
			}
		});

	popplayer = new YT.Player('popvideo', {
			playerVars : {
				'controls' : 0,
				'showinfo' : 0,
				'rel' : 0
			},
			events : {
				'onReady' : onPlayerReady
			}
		});

}

$(window).load(function () {
	$('#preloader').fadeOut();
	$('#preloaderoverlay').delay(350).fadeOut('slow');
});

$(function () {
	if (navigator.userAgent.match(/Android/i)) {
		$('.values_sec input').addClass('android');
	}

	if ((navigator.userAgent.match(/Android/i)) && (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)) {
		$('.andfiremeg').fadeIn();
		$('.values_sec').fadeOut();
	}

	iOSversion();

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

	//		if (os.isWin7) {
	//           if (!!navigator.userAgent.match(/Trident\/7\./)){
	//		   $('.video_sec h3').css('top', '28px');
	//		   $('#video_frame').css('visibility', 'hidden');
	//		   }
	//        }


	vid1sec = 0,
	vid2sec = 0,
	vid3sec = 0,
	vid4sec = 0,
	vid5sec = 0,
	vid6sec = 0,
	vid7sec = 0,
	vid8sec = 0,
	vid9sec = 0,
	vid10sec = 0;
	vidcount = 0;

	var $elie = $("img.rot"),
	degree = 0,
	timer = 0,
	iter,
	tmr;
	//rotate();
	function rotate() {

		$elie.css({
			'transform' : 'rotate(' + degree + 'deg)'
		});
		$elie.css({
			'-webkit-transform' : 'rotate(' + degree + 'deg)'
		});
		$elie.css({
			'-moz-transform' : 'rotate(' + degree + 'deg)'
		});

		tmr = setTimeout(function () {
				clearInterval(tmr);
				degree += iter;
				rotate();
			}, timer);

		if ((degree >= 0 && degree <= 18) || (degree >= 342 && degree <= 360)) {
			if (!$('.jelly_selectors ul li:nth-child(1)').hasClass('done')) {
				$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
				$('.jelly_selectors ul li:nth-child(1)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt=""><img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">');
			}
		} else if (degree >= 19 && degree <= 54) {
			if (!$('.jelly_selectors ul li:nth-child(2)').hasClass('done')) {
				$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
				$('.jelly_selectors ul li:nth-child(2)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt=""><img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">');
			}
		} else if (degree >= 55 && degree <= 90) {
			if (!$('.jelly_selectors ul li:nth-child(3)').hasClass('done')) {
				$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
				$('.jelly_selectors ul li:nth-child(3)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt=""><img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">');
			}
		} else if (degree >= 91 && degree <= 126) {
			if (!$('.jelly_selectors ul li:nth-child(4)').hasClass('done')) {
				$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
				$('.jelly_selectors ul li:nth-child(4)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt=""><img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">');
			}
		} else if (degree >= 127 && degree <= 162) {
			if (!$('.jelly_selectors ul li:nth-child(5)').hasClass('done')) {
				$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
				$('.jelly_selectors ul li:nth-child(5)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt=""><img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">');
			}
		} else if (degree >= 163 && degree <= 198) {
			if (!$('.jelly_selectors ul li:nth-child(6)').hasClass('done')) {
				$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
				$('.jelly_selectors ul li:nth-child(6)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt=""><img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">');
			}
		} else if (degree >= 199 && degree <= 234) {
			if (!$('.jelly_selectors ul li:nth-child(7)').hasClass('done')) {
				$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
				$('.jelly_selectors ul li:nth-child(7)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt=""><img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">');
			}
		} else if (degree >= 235 && degree <= 270) {
			if (!$('.jelly_selectors ul li:nth-child(8)').hasClass('done')) {
				$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
				$('.jelly_selectors ul li:nth-child(8)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt=""><img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">');
			}
		} else if (degree >= 271 && degree <= 306) {
			if (!$('.jelly_selectors ul li:nth-child(9)').hasClass('done')) {
				$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
				$('.jelly_selectors ul li:nth-child(9)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt=""><img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">');
			}
		} else if (degree >= 307 && degree <= 342) {
			if (!$('.jelly_selectors ul li:nth-child(10)').hasClass('done')) {
				$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
				$('.jelly_selectors ul li:nth-child(10)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt=""><img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">');
			}
		}

		if (degree > 360) {
			degree = 0;
		}

	}

	$("input, #spagain").click(function () {
		// $('#spagain').hide();
		vidcount += 1;
		//if (os.isWin7) {
		//			   if (!!navigator.userAgent.match(/Trident\/7\./)){
		//			   $('#video_frame').css('visibility', 'visible');
		//			   }
		//           }
		if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
			$('.values_sec').fadeIn();
			$('.video_sec').css('margin-top', '30px');
		} else if (navigator.userAgent.match(/Android/i)) {
			$('.values_sec').fadeIn();
			$('.video_sec').css('margin-top', '30px');
		}

		if (navigator.userAgent.match(/iPad/i)) {}
		else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {}
		else {
			$('#soundeff').prop("currentTime", 0);
		}
		$('#soundeff').get(0).play();
		$('#placeholder').fadeOut();
		// $('#captionshow').hide();
		$('.jelly_selectors ul li').removeClass('done');
		$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
		// $('#captionshow').fadeOut();
		player.cueVideoById("8tPnX7OPo0Q")
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

					if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
						$('.values_sec').fadeOut();
						$('.video_sec').css('margin-top', '13px');
					} else if (navigator.userAgent.match(/Android/i)) {
						$('.values_sec').fadeOut();
						$('.video_sec').css('margin-top', '13px');
					}

					if ((degree >= 0 && degree <= 18) || (degree >= 342 && degree <= 360)) {
						//console.log('value 1');
						// $('h3 a').attr('rel','http://www.youtube.com/embed/7M-jsjLB20Y?rel=0&enablejsapi=1&html5=1');
						vid1sec += 1;
						$('#soundeff').get(0).pause();
						videoval = "Video1 Value1";
						$('h3 a').html('Will it be Tutti-Fruitti or Stinky Socks?');
						// sessionStorage.setItem('selector',Math.floor((Math.random() * 2) + 1));
						if (vid1sec % 2 === 0) {
							$('#popvideo').attr('src', 'https://www.youtube.com/embed/B2I2o9xC0AM?rel=0&enablejsapi=1&html5=1');
							videoval = "Video1 Value1"
								if (navigator.userAgent.match(/Android/i)) {
									player.cueVideoById({
										'videoId' : 'rph3bsdXtL8',
										'startSeconds' : 165,
										'endSeconds' : 173,
										'suggestedQuality' : 'small'
									});
								} else if (navigator.userAgent.match(/iPad/i)) {
									player.cueVideoById({
										'videoId' : 'rph3bsdXtL8',
										'startSeconds' : 165,
										'endSeconds' : 173,
										'suggestedQuality' : 'small'
									});
								} else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
									player.cueVideoById({
										'videoId' : 'rph3bsdXtL8',
										'startSeconds' : 165,
										'endSeconds' : 173,
										'suggestedQuality' : 'small'
									});
								} else {
									player.loadVideoById({
										'videoId' : 'rph3bsdXtL8',
										'startSeconds' : 165,
										'endSeconds' : 173
									});
								}
						} else {
							$('#popvideo').attr('src', 'https://www.youtube.com/embed/zVZP-CbQVGA?rel=0&enablejsapi=1&html5=1');
							videoval = "Video1 Value2"
								if (navigator.userAgent.match(/Android/i)) {
									player.cueVideoById({
										'videoId' : 'aO1_1ztYVVw',
										'startSeconds' : 50,
										'endSeconds' : 60,
										'suggestedQuality' : 'small'
									});
								} else if (navigator.userAgent.match(/iPad/i)) {
									player.cueVideoById({
										'videoId' : 'aO1_1ztYVVw',
										'startSeconds' : 50,
										'endSeconds' : 60,
										'suggestedQuality' : 'small'
									});
								} else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
									player.cueVideoById({
										'videoId' : 'aO1_1ztYVVw',
										'startSeconds' : 50,
										'endSeconds' : 60,
										'suggestedQuality' : 'small'
									});
								} else {
									player.loadVideoById({
										'videoId' : 'aO1_1ztYVVw',
										'startSeconds' : 50,
										'endSeconds' : 60
									});
								}
						}
						$('h3 img').attr('src', '//content.jellybelly.com/beanboozled/images/jelly9.png');
						$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
						$('.jelly_selectors ul li:nth-child(1)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt=""><img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">');
					} else if (degree >= 19 && degree <= 54) {
						vid2sec += 1;
						$('#soundeff').get(0).pause();
						//console.log('value 2');
						//$('h3 a').attr('rel','http://www.youtube.com/embed/Nroo-i8t8vg?rel=0&enablejsapi=1&html5=1');
						videoval = "Video2 Value1";
						$('h3 a').html('Will it be Lime or Lawn Clippings?');
						// sessionStorage.setItem('selector',Math.floor((Math.random() * 2) + 1));
						if (vid2sec % 2 === 0) {
							$('#popvideo').attr('src', 'https://www.youtube.com/embed/Hq_Jt4YxI90?rel=0&enablejsapi=1&html5=1');
							videoval = "Video2 Value1"
								if (navigator.userAgent.match(/Android/i)) {
									player.cueVideoById({
										'videoId' : '4McZqYR7rQY',
										'startSeconds' : 244,
										'endSeconds' : 249,
										'suggestedQuality' : 'small'
									});
								} else if (navigator.userAgent.match(/iPad/i)) {
									player.cueVideoById({
										'videoId' : '4McZqYR7rQY',
										'startSeconds' : 244,
										'endSeconds' : 249,
										'suggestedQuality' : 'small'
									});
								} else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
									player.cueVideoById({
										'videoId' : '4McZqYR7rQY',
										'startSeconds' : 244,
										'endSeconds' : 249,
										'suggestedQuality' : 'small'
									});
								} else {
									player.loadVideoById({
										'videoId' : '4McZqYR7rQY',
										'startSeconds' : 244,
										'endSeconds' : 249
									});
								}
						} else {
							$('#popvideo').attr('src', 'https://www.youtube.com/embed/OQVYT8CU1f0?rel=0&enablejsapi=1&html5=1');
							videoval = "Video2 Value2"
								if (navigator.userAgent.match(/Android/i)) {
									player.cueVideoById({
										'videoId' : 'NTgGk2vWQbo',
										'startSeconds' : 64,
										'endSeconds' : 75,
										'suggestedQuality' : 'small'
									});
								} else if (navigator.userAgent.match(/iPad/i)) {
									player.cueVideoById({
										'videoId' : 'NTgGk2vWQbo',
										'startSeconds' : 64,
										'endSeconds' : 75,
										'suggestedQuality' : 'small'
									});
								} else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
									player.cueVideoById({
										'videoId' : 'NTgGk2vWQbo',
										'startSeconds' : 64,
										'endSeconds' : 75,
										'suggestedQuality' : 'small'
									});
								} else {
									player.loadVideoById({
										'videoId' : 'NTgGk2vWQbo',
										'startSeconds' : 64,
										'endSeconds' : 75
									});
								}
						}
						//                        if( sessionStorage.getItem('selector')==1)
						//                        {$('.video_sec iframe').attr('src','http://www.youtube.com/embed/Nroo-i8t8vg?rel=0&enablejsapi=1&html5=1'); videoval="Video2 Value1";}
						//                        else if( sessionStorage.getItem('selector')==2)
						//                        {$('.video_sec iframe').attr('src','http://www.youtube.com/embed/yqgxMwCFHwY?rel=0&enablejsapi=1&html5=1'); videoval="Video2 Value2";}
						$('h3 img').attr('src', '//content.jellybelly.com/beanboozled/images/jelly5.png');
						$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
						$('.jelly_selectors ul li:nth-child(2)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt=""><img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">');
					} else if (degree >= 55 && degree <= 90) {
						vid3sec += 1;
						$('#soundeff').get(0).pause();
						//console.log('value 3');
						//$('h3 a').attr('rel','http://www.youtube.com/embed/h_7wV1OzTX8?rel=0&enablejsapi=1&html5=1');
						videoval = "Video3 Value1";
						$('h3 a').html('Will it be Toothpaste or Berry Blue?');
						// sessionStorage.setItem('selector',Math.floor((Math.random() * 2) + 1));
						if (vid3sec % 2 === 0) {
							$('#popvideo').attr('src', 'https://www.youtube.com/embed/Hq_Jt4YxI90?rel=0&enablejsapi=1&html5=1');
							videoval = "Video3 Value1"
								if (navigator.userAgent.match(/Android/i)) {
									player.cueVideoById({
										'videoId' : '4McZqYR7rQY',
										'startSeconds' : 40,
										'endSeconds' : 45,
										'suggestedQuality' : 'small'
									});
								} else if (navigator.userAgent.match(/iPad/i)) {
									player.cueVideoById({
										'videoId' : '4McZqYR7rQY',
										'startSeconds' : 40,
										'endSeconds' : 45,
										'suggestedQuality' : 'small'
									});
								} else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
									player.cueVideoById({
										'videoId' : '4McZqYR7rQY',
										'startSeconds' : 40,
										'endSeconds' : 45,
										'suggestedQuality' : 'small'
									});
								} else {
									player.loadVideoById({
										'videoId' : '4McZqYR7rQY',
										'startSeconds' : 40,
										'endSeconds' : 45
									});
								}
						} else {
							$('#popvideo').attr('src', 'https://www.youtube.com/embed/B2I2o9xC0AM?rel=0&enablejsapi=1&html5=1');
							videoval = "Video3 Value2"
								if (navigator.userAgent.match(/Android/i)) {
									player.cueVideoById({
										'videoId' : 'rph3bsdXtL8',
										'startSeconds' : 75,
										'endSeconds' : 83,
										'suggestedQuality' : 'small'
									});
								} else if (navigator.userAgent.match(/iPad/i)) {
									player.cueVideoById({
										'videoId' : 'rph3bsdXtL8',
										'startSeconds' : 75,
										'endSeconds' : 83,
										'suggestedQuality' : 'small'
									});
								} else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
									player.cueVideoById({
										'videoId' : 'rph3bsdXtL8',
										'startSeconds' : 75,
										'endSeconds' : 83,
										'suggestedQuality' : 'small'
									});
								} else {
									player.loadVideoById({
										'videoId' : 'rph3bsdXtL8',
										'startSeconds' : 75,
										'endSeconds' : 83
									});
								}
						}
						//                        if( sessionStorage.getItem('selector')==1)
						//                        {$('.video_sec iframe').attr('src','http://www.youtube.com/embed/h_7wV1OzTX8?rel=0&enablejsapi=1&html5=1'); videoval="Video3 Value1";}
						//                        else if( sessionStorage.getItem('selector')==2)
						//                        {$('.video_sec iframe').attr('src','http://www.youtube.com/embed/eLijkt4rc2w?rel=0&enablejsapi=1&html5=1'); videoval="Video3 Value2";}
						$('h3 img').attr('src', '//content.jellybelly.com/beanboozled/images/jelly6.png');
						$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
						$('.jelly_selectors ul li:nth-child(3)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt=""><img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">');
					} else if (degree >= 91 && degree <= 126) {
						vid4sec += 1;
						$('#soundeff').get(0).pause();
						//console.log('value 4');
						//$('h3 a').attr('rel','http://www.youtube.com/embed/DJI_-32yI78?list=PL3Hx4Q52NsKRVAaWbeD347SH5QhdtqSQy?rel=0&enablejsapi=1&html5=1');
						videoval = "Video4 Value1";
						$('h3 a').html('Will it be Buttered Popcorn or Rotten Egg?');
						// sessionStorage.setItem('selector',Math.floor((Math.random() * 2) + 1));
						if (vid4sec % 2 === 0) {
							$('#popvideo').attr('src', 'https://www.youtube.com/embed/B2I2o9xC0AM?rel=0&enablejsapi=1&html5=1');
							videoval = "Video4 Value1"
								if (navigator.userAgent.match(/Android/i)) {
									player.cueVideoById({
										'videoId' : 'rph3bsdXtL8',
										'startSeconds' : 225,
										'endSeconds' : 236,
										'suggestedQuality' : 'small'
									});
								} else if (navigator.userAgent.match(/iPad/i)) {
									player.cueVideoById({
										'videoId' : 'rph3bsdXtL8',
										'startSeconds' : 225,
										'endSeconds' : 236,
										'suggestedQuality' : 'small'
									});
								} else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
									player.cueVideoById({
										'videoId' : 'rph3bsdXtL8',
										'startSeconds' : 225,
										'endSeconds' : 236,
										'suggestedQuality' : 'small'
									});
								} else {
									player.loadVideoById({
										'videoId' : 'rph3bsdXtL8',
										'startSeconds' : 225,
										'endSeconds' : 236
									});
								}
						} else {
							$('#popvideo').attr('src', 'https://www.youtube.com/embed/OQVYT8CU1f0?rel=0&enablejsapi=1&html5=1');
							videoval = "Video4 Value2"
								if (navigator.userAgent.match(/Android/i)) {
									player.cueVideoById({
										'videoId' : 'NTgGk2vWQbo',
										'startSeconds' : 246,
										'endSeconds' : 254,
										'suggestedQuality' : 'small'
									});
								} else if (navigator.userAgent.match(/iPad/i)) {
									player.cueVideoById({
										'videoId' : 'NTgGk2vWQbo',
										'startSeconds' : 246,
										'endSeconds' : 254,
										'suggestedQuality' : 'small'
									});
								} else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
									player.cueVideoById({
										'videoId' : 'NTgGk2vWQbo',
										'startSeconds' : 246,
										'endSeconds' : 254,
										'suggestedQuality' : 'small'
									});
								} else {
									player.loadVideoById({
										'videoId' : 'NTgGk2vWQbo',
										'startSeconds' : 246,
										'endSeconds' : 254
									});
								}
						}
						//                        if( sessionStorage.getItem('selector')==1)
						//                        {$('.video_sec iframe').attr('src','http://www.youtube.com/embed/DJI_-32yI78?list=PL3Hx4Q52NsKRVAaWbeD347SH5QhdtqSQy?rel=0&enablejsapi=1&html5=1'); videoval="Video4 Value1";}
						//                        else if( sessionStorage.getItem('selector')==2)
						//                        {$('.video_sec iframe').attr('src','http://www.youtube.com/embed/6prDkkarkj8?rel=0&enablejsapi=1&html5=1'); videoval="Video4 Value2";}
						$('h3 img').attr('src', '//content.jellybelly.com/beanboozled/images/jelly7.png');
						$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
						$('.jelly_selectors ul li:nth-child(4)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt=""><img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">');
					} else if (degree >= 127 && degree <= 162) {
						vid5sec += 1;
						$('#soundeff').get(0).pause();
						//console.log('value 1');
						//$('h3 a').attr('rel','http://www.youtube.com/embed/NbpB5F9CcLc?rel=0&enablejsapi=1&html5=1');
						videoval = "Video5 Value1";
						$('h3 a').html('Will it be Chocolate Pudding or Canned Dog Food?');
						// sessionStorage.setItem('selector',Math.floor((Math.random() * 2) + 1));
						if (vid5sec % 2 === 0) {
							$('#popvideo').attr('src', 'https://www.youtube.com/embed/B2I2o9xC0AM?rel=0&enablejsapi=1&html5=1');
							videoval = "Video5 Value1"
								if (navigator.userAgent.match(/Android/i)) {
									player.cueVideoById({
										'videoId' : 'rph3bsdXtL8',
										'startSeconds' : 260,
										'endSeconds' : 267,
										'suggestedQuality' : 'small'
									});
								} else if (navigator.userAgent.match(/iPad/i)) {
									player.cueVideoById({
										'videoId' : 'rph3bsdXtL8',
										'startSeconds' : 260,
										'endSeconds' : 267,
										'suggestedQuality' : 'small'
									});
								} else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
									player.cueVideoById({
										'videoId' : 'rph3bsdXtL8',
										'startSeconds' : 260,
										'endSeconds' : 267,
										'suggestedQuality' : 'small'
									});
								} else {
									player.loadVideoById({
										'videoId' : 'rph3bsdXtL8',
										'startSeconds' : 260,
										'endSeconds' : 267
									});
								}
						} else {
							$('#popvideo').attr('src', 'https://www.youtube.com/embed/Ij-uUHRJkyU?rel=0&enablejsapi=1&html5=1');
							videoval = "Video5 Value2"
								if (navigator.userAgent.match(/Android/i)) {
									player.cueVideoById({
										'videoId' : 'znPedusb3Dk',
										'startSeconds' : 549,
										'endSeconds' : 559,
										'suggestedQuality' : 'small'
									});
								} else if (navigator.userAgent.match(/iPad/i)) {
									player.cueVideoById({
										'videoId' : 'znPedusb3Dk',
										'startSeconds' : 549,
										'endSeconds' : 559,
										'suggestedQuality' : 'small'
									});
								} else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
									player.cueVideoById({
										'videoId' : 'znPedusb3Dk',
										'startSeconds' : 549,
										'endSeconds' : 559,
										'suggestedQuality' : 'small'
									});
								} else {
									player.loadVideoById({
										'videoId' : 'znPedusb3Dk',
										'startSeconds' : 549,
										'endSeconds' : 559
									});
								}
						}
						//                        if( sessionStorage.getItem('selector')==1)
						//                        {$('.video_sec iframe').attr('src','http://www.youtube.com/embed/NbpB5F9CcLc?rel=0&enablejsapi=1&html5=1'); videoval="Video5 Value1";}
						//                        else if( sessionStorage.getItem('selector')==2)
						//                        {$('.video_sec iframe').attr('src','http://www.youtube.com/embed/O7dHJhKRgbY?rel=0&enablejsapi=1&html5=1'); videoval="Video5 Value2";}
						$('h3 img').attr('src', '//content.jellybelly.com/beanboozled/images/jelly4.png');
						$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
						$('.jelly_selectors ul li:nth-child(5)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt=""><img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">');
					} else if (degree >= 163 && degree <= 198) {
						vid6sec += 1;
						$('#soundeff').get(0).pause();
						//console.log('value 2');
						//$('h3 a').attr('rel','http://www.youtube.com/embed/aJUuotjE3u8?rel=0&enablejsapi=1&html5=1');
						videoval = "Video6 Value1";
						$('h3 a').html('Will it be Barf or Peach?');
						// sessionStorage.setItem('selector',Math.floor((Math.random() * 2) + 1));
						if (vid6sec % 2 === 0) {
							$('#popvideo').attr('src', 'https://www.youtube.com/embed/DnOXH2F2YrQ?rel=0&enablejsapi=1&html5=1');
							videoval = "Video6 Value1"
								if (navigator.userAgent.match(/Android/i)) {
									player.cueVideoById({
										'videoId' : 'orIe75iXADI',
										'startSeconds' : 444,
										'endSeconds' : 452,
										'suggestedQuality' : 'small'
									});
								} else if (navigator.userAgent.match(/iPad/i)) {
									player.cueVideoById({
										'videoId' : 'orIe75iXADI',
										'startSeconds' : 444,
										'endSeconds' : 452,
										'suggestedQuality' : 'small'
									});
								} else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
									player.cueVideoById({
										'videoId' : 'orIe75iXADI',
										'startSeconds' : 444,
										'endSeconds' : 452,
										'suggestedQuality' : 'small'
									});
								} else {
									player.loadVideoById({
										'videoId' : 'orIe75iXADI',
										'startSeconds' : 444,
										'endSeconds' : 452
									});
								}
						} else {
							$('#popvideo').attr('src', 'https://www.youtube.com/embed/Ij-uUHRJkyU?rel=0&enablejsapi=1&html5=1');
							videoval = "Video6 Value2"
								if (navigator.userAgent.match(/Android/i)) {
									player.cueVideoById({
										'videoId' : 'znPedusb3Dk',
										'startSeconds' : 296,
										'endSeconds' : 304,
										'suggestedQuality' : 'small'
									});
								} else if (navigator.userAgent.match(/iPad/i)) {
									player.cueVideoById({
										'videoId' : 'znPedusb3Dk',
										'startSeconds' : 296,
										'endSeconds' : 304,
										'suggestedQuality' : 'small'
									});
								} else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
									player.cueVideoById({
										'videoId' : 'znPedusb3Dk',
										'startSeconds' : 296,
										'endSeconds' : 304,
										'suggestedQuality' : 'small'
									});
								} else {
									player.loadVideoById({
										'videoId' : 'znPedusb3Dk',
										'startSeconds' : 296,
										'endSeconds' : 304
									});
								}
						}
						//                        if( sessionStorage.getItem('selector')==1)
						//                        {$('.video_sec iframe').attr('src','http://www.youtube.com/embed/aJUuotjE3u8?rel=0&enablejsapi=1&html5=1'); videoval="Video6 Value1";}
						//                        else if( sessionStorage.getItem('selector')==2)
						//                        {$('.video_sec iframe').attr('src','http://www.youtube.com/embed/sSzuBf6QHRE?rel=0&enablejsapi=1&html5=1'); videoval="Video6 Value2";}
						$('h3 img').attr('src', '//content.jellybelly.com/beanboozled/images/jelly1.png');
						$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
						$('.jelly_selectors ul li:nth-child(6)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt=""><img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">');
					} else if (degree >= 199 && degree <= 234) {
						vid7sec += 1;
						$('#soundeff').get(0).pause();
						//console.log('value 3');
						//$('h3 a').attr('rel','http://www.youtube.com/embed/-UZxEo8k894?rel=0&enablejsapi=1&html5=1');
						videoval = "Video7 Value1";
						$('h3 a').html('Will it be Moldy Cheese or Caramel Corn?');
						// sessionStorage.setItem('selector',Math.floor((Math.random() * 2) + 1));
						if (vid7sec % 2 === 0) {
							$('#popvideo').attr('src', 'https://www.youtube.com/embed/g4fPqmijKXU?rel=0&enablejsapi=1&html5=1');
							videoval = "Video7 Value1"
								if (navigator.userAgent.match(/Android/i)) {
									player.cueVideoById({
										'videoId' : '3a-1U4Y4xJ4',
										'startSeconds' : 51,
										'endSeconds' : 58,
										'suggestedQuality' : 'small'
									});
								} else if (navigator.userAgent.match(/iPad/i)) {
									player.cueVideoById({
										'videoId' : '3a-1U4Y4xJ4',
										'startSeconds' : 51,
										'endSeconds' : 58,
										'suggestedQuality' : 'small'
									});
								} else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
									player.cueVideoById({
										'videoId' : '3a-1U4Y4xJ4',
										'startSeconds' : 51,
										'endSeconds' : 58,
										'suggestedQuality' : 'small'
									});
								} else {
									player.loadVideoById({
										'videoId' : '3a-1U4Y4xJ4',
										'startSeconds' : 51,
										'endSeconds' : 58
									});
								}
						} else {
							$('#popvideo').attr('src', 'https://www.youtube.com/embed/OQVYT8CU1f0?rel=0&enablejsapi=1&html5=1');
							videoval = "Video7 Value2"
								if (navigator.userAgent.match(/Android/i)) {
									player.cueVideoById({
										'videoId' : 'NTgGk2vWQbo',
										'startSeconds' : 84,
										'endSeconds' : 92,
										'suggestedQuality' : 'small'
									});
								} else if (navigator.userAgent.match(/iPad/i)) {
									player.cueVideoById({
										'videoId' : 'NTgGk2vWQbo',
										'startSeconds' : 84,
										'endSeconds' : 92,
										'suggestedQuality' : 'small'
									});
								} else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
									player.cueVideoById({
										'videoId' : 'NTgGk2vWQbo',
										'startSeconds' : 84,
										'endSeconds' : 92,
										'suggestedQuality' : 'small'
									});
								} else {
									player.loadVideoById({
										'videoId' : 'NTgGk2vWQbo',
										'startSeconds' : 84,
										'endSeconds' : 92
									});
								}
						}
						//                        if( sessionStorage.getItem('selector')==1)
						//                        {$('.video_sec iframe').attr('src','http://www.youtube.com/embed/-UZxEo8k894?rel=0&enablejsapi=1&html5=1'); videoval="Video7 Value1";}
						//                        else if( sessionStorage.getItem('selector')==2)
						//                        {$('.video_sec iframe').attr('src','http://www.youtube.com/embed/ZTgN7XdkmnM?rel=0&enablejsapi=1&html5=1'); videoval="Video7 Value2";}
						$('h3 img').attr('src', '//content.jellybelly.com/beanboozled/images/jelly3.png');
						$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
						$('.jelly_selectors ul li:nth-child(7)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt=""><img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">');
					} else if (degree >= 235 && degree <= 270) {
						vid8sec += 1;
						$('#soundeff').get(0).pause();
						//console.log('value 4');
						//$('h3 a').attr('rel','http://www.youtube.com/embed/Cc8JT4A7Sp4?rel=0&enablejsapi=1&html5=1');
						videoval = "Video8 Value1";
						$('h3 a').html('Will it be Booger or Juicy Pear?');
						// sessionStorage.setItem('selector',Math.floor((Math.random() * 2) + 1));
						if (vid8sec % 2 === 0) {
							$('#popvideo').attr('src', 'https://www.youtube.com/embed/g4fPqmijKXU?rel=0&enablejsapi=1&html5=1');
							videoval = "Video8 Value1"
								if (navigator.userAgent.match(/Android/i)) {
									player.cueVideoById({
										'videoId' : '3a-1U4Y4xJ4',
										'startSeconds' : 229,
										'endSeconds' : 239,
										'suggestedQuality' : 'small'
									});
								} else if (navigator.userAgent.match(/iPad/i)) {
									player.cueVideoById({
										'videoId' : '3a-1U4Y4xJ4',
										'startSeconds' : 229,
										'endSeconds' : 239,
										'suggestedQuality' : 'small'
									});
								} else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
									player.cueVideoById({
										'videoId' : '3a-1U4Y4xJ4',
										'startSeconds' : 229,
										'endSeconds' : 239,
										'suggestedQuality' : 'small'
									});
								} else {
									player.loadVideoById({
										'videoId' : '3a-1U4Y4xJ4',
										'startSeconds' : 229,
										'endSeconds' : 239
									});
								}
						} else {
							$('#popvideo').attr('src', 'https://www.youtube.com/embed/Hq_Jt4YxI90?rel=0&enablejsapi=1&html5=1');
							videoval = "Video8 Value2"
								if (navigator.userAgent.match(/Android/i)) {
									player.cueVideoById({
										'videoId' : '4McZqYR7rQY',
										'startSeconds' : 78,
										'endSeconds' : 85,
										'suggestedQuality' : 'small'
									});
								} else if (navigator.userAgent.match(/iPad/i)) {
									player.cueVideoById({
										'videoId' : '4McZqYR7rQY',
										'startSeconds' : 78,
										'endSeconds' : 85,
										'suggestedQuality' : 'small'
									});
								} else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
									player.cueVideoById({
										'videoId' : '4McZqYR7rQY',
										'startSeconds' : 78,
										'endSeconds' : 85,
										'suggestedQuality' : 'small'
									});
								} else {
									player.loadVideoById({
										'videoId' : '4McZqYR7rQY',
										'startSeconds' : 78,
										'endSeconds' : 85
									});
								}
						}
						//                        if( sessionStorage.getItem('selector')==1)
						//                        {$('.video_sec iframe').attr('src','http://www.youtube.com/embed/Cc8JT4A7Sp4?rel=0&enablejsapi=1&html5=1'); videoval="Video8 Value1";}
						//                        else if( sessionStorage.getItem('selector')==2)
						//                        {$('.video_sec iframe').attr('src','http://www.youtube.com/embed/IsH8XIdAdlY?rel=0&enablejsapi=1&html5=1'); videoval="Video3 Value2";}
						$('h3 img').attr('src', '//content.jellybelly.com/beanboozled/images/jelly10.png');
						$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
						$('.jelly_selectors ul li:nth-child(8)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt=""><img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">');
					} else if (degree >= 271 && degree <= 306) {
						vid9sec += 1;
						$('#soundeff').get(0).pause();
						//console.log('value 3');
						//$('h3 a').attr('rel','http://www.youtube.com/embed/U4uCBd4mu3Y?rel=0&enablejsapi=1&html5=1');
						videoval = "Video9 Value1";
						$('h3 a').html('Will it be Baby Wipes or Coconut?');
						videoval = "Video9 Value1"
							// sessionStorage.setItem('selector',Math.floor((Math.random() * 2) + 1));
							if (vid9sec % 2 === 0) {
								$('#popvideo').attr('src', 'https://www.youtube.com/embed/Hq_Jt4YxI90?rel=0&enablejsapi=1&html5=1');
								videoval = "Video9 Value1"
									if (navigator.userAgent.match(/Android/i)) {
										player.cueVideoById({
											'videoId' : '4McZqYR7rQY',
											'startSeconds' : 279,
											'endSeconds' : 290,
											'suggestedQuality' : 'small'
										});
									} else if (navigator.userAgent.match(/iPad/i)) {
										player.cueVideoById({
											'videoId' : '4McZqYR7rQY',
											'startSeconds' : 279,
											'endSeconds' : 290,
											'suggestedQuality' : 'small'
										});
									} else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
										player.cueVideoById({
											'videoId' : '4McZqYR7rQY',
											'startSeconds' : 279,
											'endSeconds' : 290,
											'suggestedQuality' : 'small'
										});
									} else {
										player.loadVideoById({
											'videoId' : '4McZqYR7rQY',
											'startSeconds' : 279,
											'endSeconds' : 290
										});
									}
							} else {
								$('#popvideo').attr('src', 'https://www.youtube.com/embed/zVZP-CbQVGA?rel=0&enablejsapi=1&html5=1');
								videoval = "Video9 Value2"
									if (navigator.userAgent.match(/Android/i)) {
										player.cueVideoById({
											'videoId' : 'aO1_1ztYVVw',
											'startSeconds' : 99,
											'endSeconds' : 108,
											'suggestedQuality' : 'small'
										});
									} else if (navigator.userAgent.match(/iPad/i)) {
										player.cueVideoById({
											'videoId' : 'aO1_1ztYVVw',
											'startSeconds' : 99,
											'endSeconds' : 108,
											'suggestedQuality' : 'small'
										});
									} else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
										player.cueVideoById({
											'videoId' : 'aO1_1ztYVVw',
											'startSeconds' : 99,
											'endSeconds' : 108,
											'suggestedQuality' : 'small'
										});
									} else {
										player.loadVideoById({
											'videoId' : 'aO1_1ztYVVw',
											'startSeconds' : 99,
											'endSeconds' : 108
										});
									}
							}
							//                        if( sessionStorage.getItem('selector')==1)
							//                        {$('.video_sec iframe').attr('src','http://www.youtube.com/embed/U4uCBd4mu3Y?rel=0&enablejsapi=1&html5=1'); videoval="Video9 Value1";}
							//                        else if( sessionStorage.getItem('selector')==2)
							//                        {$('.video_sec iframe').attr('src','http://www.youtube.com/embed/zEy8j98eIcU?rel=0&enablejsapi=1&html5=1'); videoval="Video9 Value2";}
							$('h3 img').attr('src', '//content.jellybelly.com/beanboozled/images/jelly8.png');
						$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
						$('.jelly_selectors ul li:nth-child(9)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt=""><img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">');
					} else if (degree >= 307 && degree <= 342) {
						vid10sec += 1;
						$('#soundeff').get(0).pause();
						//console.log('value 4');
						//$('h3 a').attr('rel','http://www.youtube.com/embed/XD_rdLfGQC4?rel=0&enablejsapi=1&html5=1');
						videoval = "Video10 Value1";
						$('h3 a').html('Will it be Skunk Spray or Licorice?');
						// sessionStorage.setItem('selector',Math.floor((Math.random() * 2) + 1));
						if (vid10sec % 2 === 0) {
							$('#popvideo').attr('src', 'https://www.youtube.com/embed/O0cFbBqZY0w?rel=0&enablejsapi=1&html5=1');
							videoval = "Video10 Value1"
								if (navigator.userAgent.match(/Android/i)) {
									player.cueVideoById({
										'videoId' : 'xfpuKe_axjQ',
										'startSeconds' : 148,
										'endSeconds' : 153,
										'suggestedQuality' : 'small'
									});
								} else if (navigator.userAgent.match(/iPad/i)) {
									player.cueVideoById({
										'videoId' : 'xfpuKe_axjQ',
										'startSeconds' : 148,
										'endSeconds' : 153,
										'suggestedQuality' : 'small'
									});
								} else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
									player.cueVideoById({
										'videoId' : 'xfpuKe_axjQ',
										'startSeconds' : 148,
										'endSeconds' : 153,
										'suggestedQuality' : 'small'
									});
								} else {
									player.loadVideoById({
										'videoId' : 'xfpuKe_axjQ',
										'startSeconds' : 148,
										'endSeconds' : 153
									});
								}
						} else {
							$('#popvideo').attr('src', 'https://www.youtube.com/embed/OQVYT8CU1f0?rel=0&enablejsapi=1&html5=1');
							videoval = "Video10 Value2"
								if (navigator.userAgent.match(/Android/i)) {
									player.cueVideoById({
										'videoId' : 'NTgGk2vWQbo',
										'startSeconds' : 310,
										'endSeconds' : 320,
										'suggestedQuality' : 'small'
									});
								} else if (navigator.userAgent.match(/iPad/i)) {
									player.cueVideoById({
										'videoId' : 'NTgGk2vWQbo',
										'startSeconds' : 310,
										'endSeconds' : 320,
										'suggestedQuality' : 'small'
									});
								} else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
									player.cueVideoById({
										'videoId' : 'NTgGk2vWQbo',
										'startSeconds' : 310,
										'endSeconds' : 320,
										'suggestedQuality' : 'small'
									});
								} else {
									player.loadVideoById({
										'videoId' : 'NTgGk2vWQbo',
										'startSeconds' : 310,
										'endSeconds' : 320
									});
								}
						}
						//                        if( sessionStorage.getItem('selector')==1)
						//                        {$('.video_sec iframe').attr('src','http://www.youtube.com/embed/XD_rdLfGQC4?rel=0&enablejsapi=1&html5=1'); videoval="Video10 Value1";}
						//                        else if( sessionStorage.getItem('selector')==2)
						//                        {$('.video_sec iframe').attr('src','http://www.youtube.com/embed/W4vrwU7fA2U?rel=0&enablejsapi=1&html5=1'); videoval="Video10 Value2";}
						$('h3 img').attr('src', '//content.jellybelly.com/beanboozled/images/jelly2.png');
						$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
						$('.jelly_selectors ul li:nth-child(10)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt=""><img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">');
					}
					clearInterval(tm);
					$('#captionshow').fadeOut(250);
				}
			}, 700);
	});
});

function onPlayerReady(event) {
	var pauseButton = document.getElementById("closevideo");
	pauseButton.addEventListener("click", function () {
		popplayer.pauseVideo();
	});
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.ENDED) {
		//		if (os.isWin7) {
		//           if (!!navigator.userAgent.match(/Trident\/7\./)){
		//		   $('#video_frame').css('visibility', 'hidden');
		//		   }
		//        }
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
		if (videoval == 'Video1 Value1') {
			$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
			$('.jelly_selectors ul li:nth-child(1)').append('<img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">').addClass('done');
		} else if (videoval == 'Video1 Value2') {
			$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
			$('.jelly_selectors ul li:nth-child(1)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">').addClass('done');
		} else if (videoval == 'Video2 Value1') {
			$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
			$('.jelly_selectors ul li:nth-child(2)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">').addClass('done');
		} else if (videoval == 'Video2 Value2') {
			$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
			$('.jelly_selectors ul li:nth-child(2)').append('<img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">').addClass('done');
		} else if (videoval == 'Video3 Value1') {
			$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
			$('.jelly_selectors ul li:nth-child(3)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">').addClass('done');
		} else if (videoval == 'Video3 Value2') {
			$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
			$('.jelly_selectors ul li:nth-child(3)').append('<img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">').addClass('done');
		} else if (videoval == 'Video4 Value1') {
			$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
			$('.jelly_selectors ul li:nth-child(4)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">').addClass('done');
		} else if (videoval == 'Video4 Value2') {
			$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
			$('.jelly_selectors ul li:nth-child(4)').append('<img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">').addClass('done');
		} else if (videoval == 'Video5 Value1') {
			$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
			$('.jelly_selectors ul li:nth-child(5)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">').addClass('done');
		} else if (videoval == 'Video5 Value2') {
			$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
			$('.jelly_selectors ul li:nth-child(5)').append('<img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">').addClass('done');
		} else if (videoval == 'Video6 Value1') {
			$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
			$('.jelly_selectors ul li:nth-child(6)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">').addClass('done');
		} else if (videoval == 'Video6 Value2') {
			$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
			$('.jelly_selectors ul li:nth-child(6)').append('<img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">').addClass('done');
		} else if (videoval == 'Video7 Value1') {
			$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
			$('.jelly_selectors ul li:nth-child(7)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">').addClass('done');
		} else if (videoval == 'Video7 Value2') {
			$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
			$('.jelly_selectors ul li:nth-child(7)').append('<img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">').addClass('done');
		} else if (videoval == 'Video8 Value1') {
			$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
			$('.jelly_selectors ul li:nth-child(8)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">').addClass('done');
		} else if (videoval == 'Video8 Value2') {
			$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
			$('.jelly_selectors ul li:nth-child(8)').append('<img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">').addClass('done');
		} else if (videoval == 'Video9 Value1') {
			$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
			$('.jelly_selectors ul li:nth-child(9)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">').addClass('done');
		} else if (videoval == 'Video9 Value2') {
			$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
			$('.jelly_selectors ul li:nth-child(9)').append('<img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">').addClass('done');
		} else if (videoval == 'Video10 Value1') {
			$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
			$('.jelly_selectors ul li:nth-child(10)').append('<img class="highlight" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">').addClass('done');
		} else if (videoval == 'Video10 Value2') {
			$('.jelly_selectors ul li img.highlight,.jelly_selectors ul li img.highlight2').remove();
			$('.jelly_selectors ul li:nth-child(10)').append('<img class="highlight2" src="//content.jellybelly.com/beanboozled/images/shadow.png" alt="">').addClass('done');
		}
	}

}
