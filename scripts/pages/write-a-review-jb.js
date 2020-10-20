define(["modules/jquery-mozu"], function($) {
  $('.pr-btn-review').click(function() {
      window.zrl_mi.award_loyalty_points('write_a_review', 25);
    });
});