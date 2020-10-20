/**
 * Watches for changes to the quantity of items in the shopping cart, to update
 * cart count indicators on the storefront.
 */
 // The code is changed by Amit on 15-jun-15 for mini cart and main cart sync issue.
define(['modules/jquery-mozu', 'modules/api'], function ($, api) {

    var $cartCount,
        user = require.mozuData('user'),
        userId = user.userId,
        $document = $(document),
        CartMonitor = {
            setCount: function (count) {
                this.$el.text(count);
                if (count > 1)
                    $('[data-mz-text="carttext"]').text('');
                else
                    $('[data-mz-text="carttext"]').text('');
                if(count < 1){
                    $(document).find('.showHidePipe').hide();
                    $(document).find('.mz-pageheader-mobile').find('.mini-cart-header').find('.cartcount').hide();
                }else{
                    $(document).find('.showHidePipe').show();
                    $(document).find('.mz-pageheader-mobile').find('.mini-cart-header').find('.cartcount').show();
                }
					// the below code commented by amit , beacuse we are not creating the cookie for mini cart count
                /*savedCounts[userId] = count;
                $.cookie('mozucartcount', JSON.stringify(savedCounts), { path: '/' });*/
            },
            addToCount: function (count) {
                this.setCount(this.getCount() + count);
            },
            getCount: function () {
                return parseInt(this.$el[0].textContent,10) || 0;
            },
            update: function () {
                api.get('cartsummary').then(function (summary) {
				CartMonitor.setCount(summary.count());
				// comment by amit
                   /* $document.ready(function () {
                        CartMonitor.setCount(summary.count());
                    });*/
                });
            }
        },
        savedCounts,
        savedCount;
// The below code comment by amit, because we are not using it.
    /*
	try {
        savedCounts = JSON.parse($.cookie('mozucartcount'));
    } catch (e) { }

    if (!savedCounts) savedCounts = {};
    savedCount = savedCounts && savedCounts[userId];

    if (isNaN(savedCount)) {
        CartMonitor.update();
    }
*/
    $(document).ready(function () {
      if(require.mozuData("pagecontext").pageType != "checkout") {
        CartMonitor.update();// making API call to get the mini cart count by Amit
      }
        CartMonitor.$el = $('[data-mz-role="cartmonitor"]').text(savedCount || 0);
        if(savedCount < 1){
            $(document).find('.showHidePipe').hide();
            $(document).find('.mz-pageheader-mobile').find('.mini-cart-header').find('.cartcount').hide();
        }else{
            $(document).find('.showHidePipe').show();
            $(document).find('.mz-pageheader-mobile').find('.mini-cart-header').find('.cartcount').show();
        }
        if (savedCount > 1)
            $('[data-mz-text="carttext"]').text('');
        else
            $('[data-mz-text="carttext"]').text('');
    });

    return CartMonitor;

});



