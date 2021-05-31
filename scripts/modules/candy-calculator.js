
define(["modules/jquery-mozu", "underscore",
		"hyprlive", "modules/backbone-mozu"], function ($, _, Hypr, Backbone) {
var JellyBellyCandyCalculator = Backbone.View.extend({
			templateName : 'pages/candy-calculator',
			initialize : function () {
				this.render();
			},
			events : {
				"click .cboxClose" : "closeThis",
				// "keypress .cboxClose" : "closeThisKeypress",
				"click .candyCalcSlideOne_a" : "openCalculator",
				'change #container_shape' : "changeContainerDimensionOption",
				'change #candyType' : "changeImage",
				'click #submit' : 'validateDataValues',
				'click #recalculateAll' : 'recalculate'
			},
			render : function () {
				var template = _.template((Hypr.getTemplate(this.templateName).render()), {});	
				this.$el.html(template);
			},	
			closeThis : function (e) {
				e.preventDefault();
				$(document).find(lastClicked).focus();
				this.remove();
			},
			closeThisKeypress : function (e) {
					if(e.keyCode == 27) {
							$('.cboxClose').trigger('click');
					}
			},
			openCalculator : function () {
				$('.candyCalcSlideOne').hide();
				$('.candyCalcSlideTwo').show();
			},
			changeContainerDimensionOption : function (e) {
				switch (this.$("#container_shape").val()) {
				case 'none':
					$('#cube').hide();
					$('#cyl').hide();
					$('#containerChoice').hide();
					this.updateSubmit(false);
					break;
				case 'Square':
					$('#cyl').hide();
					$('#cube').show();
					$('#containerChoice').show();
					$('#containerChoice').css({
						'background-position' : '0 0px'
					});
					this.updateSubmit(true);
					break;
				case 'Circular':
					$('#cube').hide();
					$('#cyl').show();
					$('#containerChoice').show();
					$('#containerChoice').css({
						'background-position' : '0 -145px'
					});
					this.updateSubmit(true);
					break;
				}

			},
			updateSubmit : function (b) {
				if (b)
					$('#submit_with_label').show();
				else
					$('#submit_with_label').hide();
			},
			recalculate : function (event) {
				event.preventDefault();
				this.render();
			},
			changeImage : function (e) {
				switch (this.$("#candyType").val()) {
				case 'none':
					$('#cube').hide();
					$('#cyl').hide();
					$('#candyChoice').hide();
					break;
				case '.523':
					$('#candyChoice').show();
					$('#candyChoice').css({
						'background-position' : '0 0px'
					});
					break;
				case '.383':
					$('#candyChoice').show();
					$('#candyChoice').css({
						'background-position' : '0 -125px'
					});
					break;
				case '.3830':
					$('#candyChoice').show();
					$('#candyChoice').css({
						'background-position' : '0 -250px'
					});
					break;
				case '.463':
					$('#candyChoice').show();
					$('#candyChoice').css({
						'background-position' : '0 -375px'
					});
					break;
				case '.44':
					$('#candyChoice').show();
					$('#candyChoice').css({
						'background-position' : '0 -500px'
					});
					break;
				}
			},
			validateDataValues : function () {
				if (this.$("#candyType").val() === 'none') {
					alert("Please choose a candy type");
					return false;
				}
				if (this.$("#container_shape").val() === 'none') {
					alert("Please choose a container");
					return false;
				}
				if (!this.$('input[name="numCont"]').val()) {
					alert("Please enter number of containers");
					return false;
				}
				this.validateDimension();
			},
			validateDimension : function () {
				switch (this.$("#container_shape").val()) {
				case 'none':
					alert("Please choose a container type");
					return false;
				case 'Square':
					var $w = $('input[name = "widthCube"]').val() + $('select[name = "widthCubeFrac"]').val();
					var $h = $('input[name = "heightCube"]').val() + $('select[name = "heightCubeFrac"]').val();
					var $d = $('input[name = "depthCube"]').val() + $('select[name = "depthCubeFrac"]').val();
					if ($w && $h && $d) {
						this.volume($w, $h, $d);
					} else {
						alert("Looks like the container type selected and the dimensions don't match up. Make sure you plugged in the dimensions for the selected container type.");
					}
					break;
				case 'Circular':
					var $wc = $('input[name = "widthCyl"]').val() + $('select[name = "widthCylFrac"]').val();
					var $hc = $('input[name = "heightCyl"]').val() + $('select[name = "heightCylFrac"]').val();
					if ($wc && $hc) {
						this.volume($wc, $hc);
					} else {
						alert("Looks like the container type selected and the dimensions don't match up. Make sure you plugged in the dimensions for the selected container type.");
					}
					break;
				}
			},
			volume : function ($w, $h, $d) {
				var v;
				if (arguments.length === 2)
					v = $h * (Math.pow($w / 2, 2) * Math.PI);
				if (arguments.length === 3)
					v = $h * $w * $d;

				var $candy = $('select[name = "candyType"]').val();
				var $quantity = this.$('input[name="numCont"]').val();
				var totalOunceVolume = ($quantity * v) * $candy;
				this.getResults(totalOunceVolume);
			},
			getResults : function (tov) {
				var sixteenOunceBags = tov / 16;
				var $candyName = this.$("#candyType").find('option[value="' + this.$("#candyType").val() + '"]').text();
				if (sixteenOunceBags === 0 || isNaN(sixteenOunceBags)) {
					alert("Looks like the container type selected and the dimensions don't match up. Make sure you plugged in the dimensions for the selected container type.");
					return false;
				}
				if (tov < 16) {
					$('#candyCalcSlideTwo').fadeOut('fast');
					$('#candyCalcSlideThree').fadeIn();
					$('#resultsDiv div').prepend('<p class="candyResults" style="  font-size: 20px;  line-height: 25px;    text-align: center;    padding: 118px 50px 0px 50px;" >You will need ' + Math.ceil(tov) + ' ounces of <span style="font-weight: bold;font-size: 22px;">' + $candyName + '</span>. We recommend buying <span  style="font-weight: bold;font-size: 22px;">1</span> 16 oz bag.</p>');
				} else {
					$('#candyCalcSlideTwo').fadeOut('fast');
					$('#candyCalcSlideThree').fadeIn();
					$('#resultsDiv div').prepend('<p class="candyResults" style="  font-size: 20px;  line-height: 25px;    text-align: center;    padding: 118px 50px 0px 50px;">You will need ' + Math.ceil(tov) + ' ounces of <span  style="font-weight: bold;font-size: 22px;">' + $candyName + '</span>. We recommend buying <span  style="font-weight: bold;font-size: 22px;">' + Math.ceil(sixteenOunceBags) + '</span> 16 oz bags.</p>');
				}
				this.createLink($candyName);
			},
			createLink : function ($candyName) {
				var candyLink;
				if ($candyName === "Jelly Belly® Jelly Beans")
					candyLink = "/search?query=jelly beans";
				if ($candyName === "Champagne Bubbles")
					candyLink = "/search?query=Champagne Bubbles";
				if ($candyName === "Raspberries & Blackberries")
					candyLink = "/search?query=Raspberries & Blackberries";
				if ($candyName === "Jordan Almonds")
					candyLink = "/search?query=Jordan Almonds";
				if ($candyName === "Dutch Mints")
					candyLink = "/search?query=Dutch Mints";

				$('#resultsDiv p:first-child').append('<p><a class="buttonStandard action" style="background: linear-gradient(to bottom, rgba(255,48,25,1) 0%,rgba(216,0,0,1) 47%,rgba(198,0,3,1) 48%,rgba(207,4,4,1) 100%);color: #fff; box-shadow: inset 0px -80px 20px -70px rgba(0, 0, 0, .2),1px 1px 2px 0px rgba(0, 0, 0, .4); text-decoration: none;padding: 4px 16px;border-radius: 4px;" target="_blank" href="' + candyLink + '">Shop ' + $candyName + '</a></p>');
			}
		});
		
    // DEV: Pradeep D. ADA changes for Quick view.
		$(document).on('keyup', function(e) {
			if(e.keyCode == 27 && !$("#candyCalcFields").is(":hidden")) {
				$('.cboxClose').trigger('click');
			}
		});
     
    var inputs = window.inputs;
    var firstInput = window.firstInput;
    var lastInput = window.lastInput;
		var lastClicked;
	$(document).on('click','.candyCalculatorModal',function (e) {
		e.preventDefault();
		lastClicked = e.target;
		
		var jbcccView = new JellyBellyCandyCalculator();
		$('body').append(jbcccView.el);
		$(document).find('.cboxClose').focus(); 
		
		$("#candyCalcFields #cboxClose, #candyCalcFields a.candyCalcSlideOne_a, .candyCalcButton #submit, #recalculateAll").on('keydown', function(e){ 
			if($(this).attr('id') === 'cboxClose' && e.shiftKey && e.which == 9) {
					e.preventDefault();
					if($('#candyCalcFields a.candyCalcSlideOne_a').is(':visible'))
						$('#candyCalcFields a.candyCalcSlideOne_a').focus();
					else if ($('.candyCalcButton #submit').is(':visible'))
						$('.candyCalcButton #submit').focus();
					else if ($('#recalculateAll').is(':visible'))
						$('#recalculateAll').focus();
					else 
						console.log("nothing else visible");
				}
			else if(($(this).hasClass('candyCalcSlideOne_a') || $(this).attr('id') === 'submit' || $(this).attr('id') === 'recalculateAll') && e.which == 9 && !e.shiftKey) {
					e.preventDefault();
					$('#candyCalcFields #cboxClose').focus();
				}
		});
		
		
	});
});
