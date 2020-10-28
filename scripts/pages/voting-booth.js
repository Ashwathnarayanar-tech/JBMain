require(['modules/backbone-mozu',
		'underscore',
		'modules/jquery-mozu',
		'modules/api'
	],
	function (Backbone,
		_,
		$,
		Api) {

	var VoteView = Backbone.MozuView.extend({
			templateName : "modules/voting-booth/default",
			initialize : function () {
				var me = this;
			}
		});

	$(document).ready(function () {


		var day = $('#daydiv').attr('data-mz-day');
		//alert(day);
		var previousVotes = decodeURIComponent($.cookie("flavorbattles-voted-" + day)).split(',');
		$('.vote-button').each(function(b) {
			if (previousVotes.indexOf($(this).attr('data-mz-match-id')) === -1)
				$(this).css({ "display" : "inline-block" });
			else {
				$(this).parent().html("<span class='already-voted'>Thank you for voting! Come back tomorrow to vote again.</span>");
				}
		});

		var matches = [];

		$(".bean-candidate").click(function (e) {

			var match = e.currentTarget.getAttribute('data-mz-match');
			var selection = e.currentTarget.getAttribute('data-mz-bean');

			$("[data-mz-match='" + match + "']").each(function (bean) {
				var tempSelection = $(this).attr('data-mz-bean');
				if (tempSelection != selection) {
					$(this).attr("data-mz-selected", "false");
					$(this).css({
						"background" : "#ffffff"
					});
					//$(this).css({ "border": "1px solid ffffff"});
				}
			});

			matches = _.filter(matches, function (tempmatch) {
					return match != tempmatch.matchName;
				});

			matches.push({
				matchName : match,
				selected : e.currentTarget.getAttribute('data-mz-bean')
			});
			$(e.currentTarget).attr("data-mz-selected", "true");
			console.log(matches);
		});

		var alreadyVoted = decodeURIComponent($.cookie("flavorbattles-voted-" + day)).split(',');

		_.each(alreadyVoted, function (matchid) {
			//$('.vote-button[data-mz-match-id="' + matchid + '"]').fadeOut(3000);
		});

		function updateVotes(battles) {
			_.each(battles, function (battle) {
				var totalVotes = 0;
				Object.keys(battle.votes).forEach(function (key) {
					totalVotes = totalVotes + battle.votes[key];
				});

				Object.keys(battle.votes).forEach(function (key) {
					//console.log(key, battle.votes[key]);
					//totalVotes = totalVotes + battle.votes[key];
					$('[data-mz-votes][data-mz-match-id="' + battle.matchid + '"][data-mz-bean="' + key + '"]').html((battle.votes[key] === 0 ? 0 : (battle.votes[key]/totalVotes)*100).toFixed(0) + '%' );
				});

			});
		}

		Api.request('GET', '/svc/vote?command=getallmatches').then(function (data) {
			updateVotes(data.items);
			$('.flavorbattle-votes').fadeIn(750);
		});

		$(".save-votes").click(function (e) {
			var matchid = e.currentTarget.getAttribute('data-mz-match-id');
			var winner = e.currentTarget.getAttribute('data-mz-bean');
			$('.vote-button[data-mz-match-id="'+matchid+'"]').css({ "display" : "none" });
			$('.vote-button[data-mz-match-id="'+matchid+'"]').parent().html("<span class='already-voted'>Thank you for voting! Come back tomorrow to vote again.</span>");
				//			var winner = $('[data-mz-match="' + matchid + '"][data-mz-selected="true"]').first().attr('data-mz-bean');
			$('.flavorbattle-votes').html("<i class='fa fa-refresh fa-spin' aria-hidden='true'></i>");
			Api.request('GET', '/svc/vote?command=vote&matchid=' + matchid + '&choice=' + winner).then(function (resp) {
				//console.log(resp);

				setTimeout(function () {
					updateVotes(resp);
					$('.flavorbattle-votes').fadeIn(750);
				}, 1000);
				//alert($.cookie("flavorbattles-voted-" + day));
				var previouslyVoted;
				if ($.cookie("flavorbattles-voted-" + day))
					previouslyVoted = decodeURIComponent($.cookie("flavorbattles-voted-" + day)).split(',');
				else
					previouslyVoted = [];
				
				if (previouslyVoted.indexOf(matchid) === -1) {
					previouslyVoted.push(matchid);
				}
				$.cookie("flavorbattles-voted-" + day, encodeURIComponent(previouslyVoted.join(',')), {
					expires : 1
				});
				//$.cookie("flavorbattles-voted", "something", { expires:1 });
			});
		});
	});
});
