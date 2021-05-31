define(["modules/jquery-mozu", "underscore","hyprlive", 'shim!vendor/jquery-colorbox/jquery.colorbox[jquery=jQuery]>jQuery', 'modules/zinrelo'], function($, _, hypr) {
  var zinreloModalObj = {
    loggedOutUser: function() {
      var zinereloHeaderContent = '<div id="zinrelo-header-wrapper"><h1 id="zinrelo-modal-header" tabindex="0">Jelly Belly Sweet Rewards</h1></div>';
      var zinreloLoggedOutContent = zinereloHeaderContent;

      // Non Logged-in User Content
      zinreloLoggedOutContent += '<p class="zinrelo-subheader" tabindex="0">Join our rewards program today and start earning points right away!</p>';
      zinreloLoggedOutContent += '<section class="benefits-section">';
      zinreloLoggedOutContent += '<div class="benefits-list-wrapper"><h2 tabindex="0">Multiple Earning Opportunities</h2>';
      zinreloLoggedOutContent += '<ul class="benefits-list">';
      zinreloLoggedOutContent += '<li><span class="benefits-list-item-heading" tabindex="0">Purchase on website</span><p tabindex="0">Earn points for every dollar you spend in purchases.</p></li>';
      zinreloLoggedOutContent += '<li><span class="benefits-list-item-heading" tabindex="0">Refer a Friend</span><p tabindex="0">Earn points when you refer a friend.</p></li>';
      zinreloLoggedOutContent += '<li><span class="benefits-list-item-heading" tabindex="0">Account Creation</span><p tabindex="0">Earn points when you create your loyalty account.</p></li>';
      zinreloLoggedOutContent += '<li><span class="benefits-list-item-heading" tabindex="0">Write a Review</span><p tabindex="0">Earn points for writing a review.</p></li>';
      zinreloLoggedOutContent += '<li><span class="benefits-list-item-heading" tabindex="0">Become an Email Subscriber</span><p tabindex="0">Become an Email Subscriber</p></li>';
      zinreloLoggedOutContent += '</ul></div>';
      zinreloLoggedOutContent += '<div class="benefits-list-wrapper"><h2 tabindex="0">Fabulous Rewards For You</h2>';
      zinreloLoggedOutContent += '<ul class="benefits-list">';
      zinreloLoggedOutContent += '<li><span class="benefits-list-item-heading" tabindex="0">$5 REDEMPTION</span><p tabindex="0">For 500 points</p></li>';
      zinreloLoggedOutContent += '<li><span class="benefits-list-item-heading" tabindex="0">$10 REDEMPTION</span><p tabindex="0">For 950 points</p></li>';
      zinreloLoggedOutContent += '<li><span class="benefits-list-item-heading" tabindex="0">$20 REDEMPTION</span><p tabindex="0">For 1800 points</p></li>';
      zinreloLoggedOutContent += '</ul></div>';
      zinreloLoggedOutContent += '</section>';
      zinreloLoggedOutContent += '<div class="login-btns-wrapper"><a aria-label="Login to your Jelly Belly Sweet Rewards Account" href="/user/login">Login</a><a aria-label="Create a Jelly Belly Sweet Rewards Account" href="/user/signup">Create an Account</a></div>';
      zinreloLoggedOutContent += '<a class="terms-link" aria-label="Jelly Belly Sweet Rewards Terms and Conditions" href="/sweet-rewards-terms-and-conditions" target="_blank" >Terms</a>';
      zinreloLoggedOutContent += '<button aria-label="Close Sweet Rewards Modal Box" class="close-colorbox">✕</button>';

      return zinreloLoggedOutContent;
    },
    loggedInUser: function(userData) {
      var zinereloHeaderContent = '<div id="zinrelo-header-wrapper"><h1 id="zinrelo-modal-header" tabindex="0">Jelly Belly Sweet Rewards</h1></div>';
      var zinreloLoggedInContent = zinereloHeaderContent;

      // Logged In User Content
      zinreloLoggedInContent += '<div id="zrl-user-info-wrapper"><div class="user-name-wrapper"><p tabindex="0" style="margin: 0;">Welcome <span class="user-name">' + userData.user_data.first_name + '</span></p><br><span tabindex="0" class="tier-level" aria-label="Tier Level ' + userData.user_data.loyalty_tier_name + '">' + userData.user_data.loyalty_tier_name + '</div>';
      zinreloLoggedInContent += '<div class="available-points-wrapper" tabindex="0">Available Points<br><span aria-label="' + userData.user_data.available_points + '" tabindex="0">' + userData.user_data.available_points + '</span></div></div>';
      zinreloLoggedInContent += '<section class="benefits-section">';
      zinreloLoggedInContent += '<div class="benefits-list-wrapper"><h2 tabindex="0" style="text-transform: uppercase">Earn Points</h2>';
      zinreloLoggedInContent += '<ul class="benefits-list">';
      zinreloLoggedInContent += '<li><span class="benefits-list-item-heading" tabindex="0">Purchase on website</span><p tabindex="0">10 Points (Per Dollar Spent)</p></li>';
      zinreloLoggedInContent += '<li><span class="benefits-list-item-heading" tabindex="0">Refer a Friend</span><p tabindex="0">500 Points</p></li>';
      zinreloLoggedInContent += '<li><span class="benefits-list-item-heading" tabindex="0">Account Creation</span><p tabindex="0">100 Points</p></li>';
      zinreloLoggedInContent += '<li><span class="benefits-list-item-heading" tabindex="0">Write a Review</span><p tabindex="0">25 Points</p></li>';
      zinreloLoggedInContent += '<li><span class="benefits-list-item-heading" tabindex="0">Become an Email Subscriber</span><p tabindex="0">100 Points</p></li>';
      zinreloLoggedInContent += '</ul></div>';
      zinreloLoggedInContent += '<div class="benefits-list-wrapper"><h2 tabindex="0" style="text-transform: uppercase">Spend Points</h2>';
      zinreloLoggedInContent += '<ul class="benefits-list redeem-list">';
      zinreloLoggedInContent += '<li><a href="/cart" class="redeem-pts-btn five"><div class="five">$5 REDEMPTION</div>500 points</a></li>';
      zinreloLoggedInContent += '<li><a href="/cart" class="redeem-pts-btn ten"><div class="ten">$10 REDEMPTION</div>950 points</a></li>';
      zinreloLoggedInContent += '<li><a href="/cart" class="redeem-pts-btn twenty"><div class="twenty">$20 REDEMPTION</div>1800 points</a></li>';
      zinreloLoggedInContent += '</ul></div>';
      zinreloLoggedInContent += '</section>';

      zinreloLoggedInContent += '<a class="terms-link" aria-label="Jelly Belly Sweet Rewards Terms and Conditions" href="/sweet-rewards-terms-and-conditions" target="_blank" >Terms</a>';
      zinreloLoggedInContent += '<button aria-label="Close Sweet Rewards Dialog Box" class="close-colorbox">✕</button>';

      return zinreloLoggedInContent;
    }
  };
  return zinreloModalObj;
});