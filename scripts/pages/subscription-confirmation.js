require([
    "modules/jquery-mozu",
    "hyprlive",
    "modules/backbone-mozu",
    "modules/api",
    'modules/models-cart',
    "vendor/jquery-ui.min",
    "shim!vendor/owl.carousel[jquery=jQuery]>jQuery"
], function($, Hypr, Backbone, api, CartModels) {
  var order="";
    function getMethod(name) {
        // Helper function. Returns an object containing information about that shipping method
        //
        // method: Kibo id for shipping method
        // regularShipDays: Days of the week when this shipping method can be used - 0,1,2,3,4,5,6
            // 0 = Sunday, 1 = Monday ... 6 = Saturday
        // hsShipDays: Days of the week when this shipping method can be used on orders containing heat sensitive items
            // 0 = Sunday, 1 = Monday ... 6 = Saturday
        // arrivalBegin and arrivalEnd: A range indicating the expected arrival (in days) of an order after ship date
        //		Note: should be same for specific delivery methods
    
        var shipMethods = [{
                "method": "ups_UPS_GROUND", 
                "regularShipDays": [1,2,3,4,5],
                "hsShipDays": [1,2],
                "arrivalBegin": 4,
                "arrivalEnd" : 7
            },
            {
                "method": "ups_UPS_SUREPOST_LESS_THAN_1LB",
                "regularShipDays": [1,2,3,4,5],
                "hsShipDays": [1,2,3,4,5],
                "arrivalBegin": 6,
                "arrivalEnd" : 9
            },
            {
                "method": "ups_UPS_SUREPOST_1LB_OR_GREATER",
                "regularShipDays": [1,2,3,4,5],
                "hsShipDays": [1,2,3,4,5],
                "arrivalBegin": 6,
                "arrivalEnd" : 9
            },
            {
                "method": "ups_UPS_THREE_DAY_SELECT",
                "regularShipDays": [1,2,3,4,5],
                "hsShipDays": [1,2],
                "arrivalBegin": 3,
                "arrivalEnd" : 3
            },
            {
                "method": "ups_UPS_SECOND_DAY_AIR",
                "regularShipDays": [1,2,3,4,5],
                "hsShipDays": [1,2],
                "arrivalBegin": 2,
                "arrivalEnd" : 2
            },
            {
                "method": "ups_UPS_NEXT_DAY_AIR_SAVER",
                "regularShipDays": [1,2,3,4,5],
                "hsShipDays": [1,2],
                "arrivalBegin": 1,
                "arrivalEnd" : 1
            },
            {
                "method": "ups_UPS_NEXT_DAY_AIR",
                "regularShipDays": [1,2,3,4,5],
                "hsShipDays": [1,2],
                "arrivalBegin": 1,
                "arrivalEnd" : 1
            }
        ];
        //return shipMethods.find(function(method){return method.method === name;});
        
        for (var i = 0; i < shipMethods.length; i++) {
                if (shipMethods[i].method === name)
                    return shipMethods[i];
        }
    
    //	shipMethods.forEach(function(method){
    //		if (method.method === name)
    //			shipMethod = method;
    //	});
    //	return shipMethod;
    }
    
    function checkMethod(day, method, hs) {
        // given a date, shipping method id, and whether order is heat-sensitive, returns true or false
        // for whether the order can be shipped on the date
        var meth = getMethod(method);
        if (hs) { 
            return meth.hsShipDays.indexOf(day) > -1 ? true:false;
        }else{ 
            return meth.regularShipDays.indexOf(day) > -1 ? true:false;
        }
    }
    
    function getArrival2(d, start, days) {
        // given a shipdate d, a start index (should be 0), and the number of days from the shipdate, returns the first
        // eligible business day
        if (start === days)
            return d;
        
        var d2 = new Date(d);
        var dd = d.getDate();
        d2.setDate(dd + 1);
    
        var s = (start);
        // we'll assume orders can only arrive on Monday - Friday, or 1,2,3,4,5
        if ([1,2,3,4,5].indexOf(d2.getDay()) > -1) {
            s=s+1;
        }
        return getArrival2(d2, s, days);
    }
    
    function getNextShipDate(n, d, hs, m) {
        // given a date n, a 12PM deadline d, a heat sensitive boolean, and a shipping method id, finds the first
        // eligible business day on which an order can ship (according to the shipping method definition)
        if (n.getTime() < d.getTime() && checkMethod(d.getDay(), m, hs)) {
            return d;
        }
        else {
            var d2 = new Date(d);
            var cd = d.getDate();
            d2.setDate(cd + 1);
            return getNextShipDate(n, d2, hs, m);
        }
    }

    function shippingestimation(shippingmethod){
        var testDate = new Date();
        var deadline = new Date(testDate.getTime());
        deadline.setHours(12);
        deadline.setMinutes(0);
        deadline.setSeconds(0);
        deadline.setMilliseconds(0);
        var heatsensitive =hasHeatSensitiveItemsByCategory() || false; // document.getElementById('heatsensitive').value;
        var state;		
        // error handling in case there is not a state available yet on the order
        try {
            //var order = require.mozuData('order');
            var fulfillmentInfo = order.fulfillmentInfo;
            state = fulfillmentInfo.fulfillmentContact.address.stateOrProvince;
        } catch(e) { 
            state = "ZZ";
        }
        var mdef = getMethod(shippingmethod.shippingMethodCode);
        var shipDate = getNextShipDate(testDate, deadline, heatsensitive, mdef.method);
        var a1 = getArrival2(shipDate, 0, mdef.arrivalBegin);
        var a2 = getArrival2(shipDate, 0, mdef.arrivalEnd);
        var estimation = "", estimationDate="";
        if(state == 'AK' || state == 'HI' || state == 'AA'|| state == 'AP' || state == 'AE'){
            if (mdef.method === "ups_UPS_NEXT_DAY_AIR" || mdef.method === "ups_UPS_SECOND_DAY_AIR" || mdef.method === "ups_UPS_NEXT_DAY_AIR_SAVER" || mdef.method === "ups_UPS_THREE_DAY_SELECT") {
                estimation = "Expected Arrival Date: "+a1.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                estimationDate = shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                $(document).find('.shippingAKHI').hide();
            }else{
                estimation = "Up to 6 Weeks";
                estimationDate = "Up to 6 Weeks";
                $(document).find('.shippingAKHI').show();
            }
        }else if (mdef.method === "ups_UPS_GROUND") {
            estimation = "4 to 7 business days from ship date";
            estimationDate = shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }else if (mdef.method === "ups_UPS_SUREPOST_LESS_THAN_1LB") {
            estimation = "6 to 9 business days from ship date";
            estimationDate = shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }else if (mdef.method === "ups_UPS_SUREPOST_1LB_OR_GREATER") {
            estimation = "6 to 9 business days from ship date";
            estimationDate = shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }else if (mdef.method === "ups_UPS_THREE_DAY_SELECT") {
            estimation = a1.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            estimationDate = shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }else if (mdef.method === "ups_UPS_SECOND_DAY_AIR") {
            estimation = a1.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            estimationDate = shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }else if (mdef.method === "ups_UPS_NEXT_DAY_AIR_SAVER") {
            estimation = a1.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            estimationDate = shipDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }
        return {"estimation": estimation,"estimationDate" : estimationDate};  
    }
    function hasHeatSensitiveItemsByCategory() {
        var items = order.items;
    
        var result = _.find(items, function(item) {
            return _.find(item.product.categories, function(category){
                return category.id == Hypr.getThemeSetting('heatSensitiveCategoryId');
            });
        });
        if (result === undefined)
                return false;
            else
                return true;
    }
	var SubscribedItemsSummary = Backbone.MozuView.extend({
        templateName: "modules/subscription-details",
        additionalEvents:{
            "click .Take-Survey":"takeSurvey"

        },
		render: function() {
            console.log("this ---",this);
            Backbone.MozuView.prototype.render.call(this);
            order=this.model.toJSON().order;
            var fulfillmentInfo = order.fulfillmentInfo;
            var estimationInfo=shippingestimation(fulfillmentInfo);
            console.log(estimationInfo);
            if(estimationInfo){
                $('.estimation-info').text(estimationInfo.estimation);
            }
        },
        takeSurvey:function(e){
            e.preventDefault();
			$('#brmerchantLogo,.invitation-navigation-element').trigger('click'); 
			$('.Take-Survey').attr('disabled','diabled');
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

function printform(){
    var printpage = "page-content";
    var headstr = "<html><head><title></title></head><body>";
    var footstr = "</body>";
    var newstr = document.all.item(printpage).innerHTML;
    var oldstr = document.body.innerHTML;
    document.body.innerHTML = headstr + newstr + footstr;
    window.print();
    setTimeout(function() {
        document.body.innerHTML = oldstr;
        return false;
    },2000);
    
}