require(['modules/backbone-mozu',
		'modules/jquery-mozu',
		'modules/api'
	],
	function (Backbone,
		$,
		Api) {
			
	var SlotMachineView = Backbone.MozuView.extend({
			templateName : "modules/poll-form",
			initialize : function () {
				var me = this;
			}
		});

	$(document).ready(function () {	

		$(".vote").click(function (e) {
			
			//assign user choice to variables
			var poll = e.currentTarget.getAttribute('poll');
			var choice = e.currentTarget.getAttribute('choice');
			//total votes
			var votes = 0;

			//calculate vote total
			function calculateVoteTotal(data){
				for (var i = 0; i < data.length ; i++){
					votes= votes + data[i].votes;
				}
			}
				
			//display returned data into results
			function appendResults(data){
				for (var i = 0; i < data.length ; i++){
					$("#answer-result" + i).html(Math.floor((data[i].votes / votes) * 100) + "% " + "of people said: " + data[i].id);
				}
				$("#poll-choices").hide();
				$("#poll-results").show();
			}
			//api request to User Poll application
			Api.request('GET', '/svc/examplePoll?poll='+poll+'&choice='+choice).then(function(res) {
				
			//res[x] determines where poll data gets pulled from
				calculateVoteTotal(res[1].data);
				appendResults(res[1].data);
				
			});
		});
	});
	
	});


