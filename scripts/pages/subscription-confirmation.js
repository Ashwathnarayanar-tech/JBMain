require([
    "modules/jquery-mozu",
    "hyprlive",
    "modules/backbone-mozu",
    "modules/api",
    'modules/models-cart',
    "vendor/jquery-ui.min",
    "shim!vendor/owl.carousel[jquery=jQuery]>jQuery"
], function($, Hypr, Backbone, api, CartModels) {

	var SubscribedItemsSummary = Backbone.MozuView.extend({
        templateName: "modules/subscription-details",
		render: function() {
            console.log("this ---",this);
			 Backbone.MozuView.prototype.render.call(this);
		}
	});	
    function updatePreviousSubscriptionStatus(){
       var  subscriptionId = $.cookie("editsubscriptionId");
       if(subscriptionId && subscriptionId!="null"){
            api.request('POST', '/svc/getSubscription',{method:"GET",subscriptionId:subscriptionId}).then(function(res) {
                if (!res.error &&  res.res.subscriptionId !== undefined) {
                    var result = res.res;
                    result.subscribedStatus = "Cancelled";
                    result.isSubscriptionEdited = true;
                    result.modifiedDate = new Date().toISOString();
                    
                    api.request('POST', 'svc/getSubscription',{method:"UPDATE",data:result}).then(function(res) {
                          console.log("updatePreviousSubscriptionStatus successfully updated ");
                          $.cookie("editsubscriptionId", null, { path: '/'});
                    }, function(er) {
                        // fail condition
                        console.log("updatePreviousSubscriptionStatus failed to get updated");
                    });

                }   
            }, function(er) {
                // fail condition
                console.log("updatePreviousSubscriptionStatus failed to get subscription-details ");
            });
       }
    } 
    $(document).ready(function() {
        console.log("page init");
        /*Detect IE browser and add js Array.find*/
        if (/MSIE (\d+\.\d+);/.test(navigator.userAgent) || navigator.userAgent.indexOf("Trident/") > -1) {
            console.log("IE detected");
            if (!Array.prototype.find) {
                Object.defineProperty(Array.prototype, 'find', {
                    value: function(predicate) {
                        if (this === null) {
                            throw new TypeError('"this" is null or not defined');
                        }

                        var o = Object(this);

                        var len = o.length >>> 0;

                        if (typeof predicate !== 'function') {
                            throw new TypeError('predicate must be a function');
                        }

                        var thisArg = arguments[1];
                        var k = 0;

                        while (k < len) {
                            var kValue = o[k];
                            if (predicate.call(thisArg, kValue, k, o)) {
                                return kValue;
                            }
                            k++;
                        }
                        return undefined;
                    },
                    configurable: true,
                    writable: true
                });
            }
        }
        
        var customerId = require.mozuData("user").userId;
        var subscriptionId = window.location.search.split("=")[1];
        var existingEntityData = "";
        var subscribedItems = "";
        try {
            api.request('POST', '/svc/getSubscription',{method:"GET",subscriptionId:subscriptionId}).then(function(res) {
                if (!res.error &&  res.res.subscriptionId !== undefined) {
                    if(res.res && res.res.order && res.res.order.billingInfo){
                        var card = res.res.order.billingInfo.card;
                        var lastFour = "";
                        var cardType = card.paymentOrCardType;
                        if(card.cardNumberPartOrMask){
                             lastFour = card.cardNumberPartOrMask.substr(card.cardNumberPartOrMask.length - 4);
                        }
                        res.res.order.billingInfo.card.lastFour = lastFour;
                        if(res.res.order.billingInfo.paymentType === "PayPalExpress2"){
                            cardType = "PayPal Express";
                        }
                        res.res.order.billingInfo.card.cardType = cardType;
                    }
					var subModel = Backbone.MozuModel.extend({});
					var subscribedItemsSummary = new SubscribedItemsSummary({
						el: $(".subscription-summary"),
						model: new subModel(res.res)
					});
                    console.log(" res ----",res.res);
					subscribedItemsSummary.render();
                    //updatePreviousSubscriptionStatus();
				}	
            }, function(er) {
                // fail condition
                console.log("Data error " + er);
            });
			
        } catch (e) {
            console.log(e);
        }
    });

});