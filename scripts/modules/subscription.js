var modelRapidOrder;
var itemClick;
define([
    "modules/jquery-mozu",
    "hyprlive",
    "modules/backbone-mozu",
    "underscore",
    "modules/api",
    "modules/models-cart",
    'modules/cart-monitor',
    'modules/minicart',
    "vendor/jquery-ui.min"
], function($, Hypr, Backbone, _, api, CartModels, CartMonitor, MiniCart) {
    var pageSize = 10;
    var reapidOrder = Backbone.MozuView.extend({
        templateName: "modules/subscription",
        additionalEvents: {
            "keyup .searchBoxSub" : "search",
            "click .search-icon":"search",
            "click .search-box-cointainer":"enableSearch",
           // "click .side-bar-item" : "changeCatList",
            "click .mainCategory" : "changeMainCatList",
            "click .side-bar-item-subCategory" : "changeSubCatList",
            "click .side-bar-item-subCategoryMobile" : "changeSubCatListMobile",
            "click .accordian-headitem" : "changeCategory",
           // "click .icon":"mainCatIconClick",
            //"touchstart .side-bar-item" : "changeCategory",
            "click .increment" : "increment",
            "click .decrement" : "decrement",
            "click .span-tabs" : "changeWeekorMonth",
            "click .removeItem" : "removeFromList",
            "click .clearList" : "showClearPopUp",
            "click .create-subscription" : "createsubbtnClick",
            "click .summary-accordian" : "showMobSummary",
            "change .how-long-val" :"setHowLongVal",
            "change .how-often-val" :"setHowOffenVal",
            "change .quantity-sub" :"changeQuantity",
            "keydown .list-item.third span" : "ADAforLast",
            "keydown .popup-content h2" : "ADAforFirst",
            "click .loadmoreDesktop": "loadMoreProducts",
            "click .loadallDesktop": "loadAllProducts",
            "click .shopall":"changeMainCatList",
            "click .loadMoreMobile": "loadMoreProductsMobile",
            "click .loadallMobile": "loadAllProductsMobile",
        },
        ADAforLast : function(e) {
            if ((e.which === 9 && !e.shiftKey)) {
                e.preventDefault();
                $(document).find('.popup-content h2').focus();
           }

        },
        ADAforFirst : function(e) {
            if ((e.which === 9 && e.shiftKey)) {
                e.preventDefault();
                $(document).find('.popup-content .list-item.third').focus();
            }
        },
        initilizeDatePicker : function(){
            var me = this;
            $('#interval-startdate').datepicker({
            // beforeShowDay: heatSensitive,
               // minDate: '0', 
                //maxDate: '+6m',
                dateFormat: "mm-dd-yy",
                autoclose:true,
                onSelect: function(dateText, inst) {
                    var date = $(this).datepicker('getDate'),
                        day = date.getDate(),
                        month = date.getMonth() + 1,
                        year = date.getFullYear();
                    var shipdate = ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2) + '-' + year;
                    window.shipdate = shipdate;
                    var subscriptionData = me.model.get('subscriptionData');
                    if(subscriptionData && subscriptionData.Data){
                        subscriptionData.Data.when = shipdate;
                        me.model.set('subscriptionData', subscriptionData); 
                    }
                    $('#interval-startdate').datepicker("setDate", shipdate);
                    $('#interval-startdate').val(shipdate);
                },
                beforeShow: function () { 
                    $(document).find('body').removeClass('smooth-scroll');
                    $(document).find('#ui-datepicker-div').show();
                },onClose:function(){
                    $(document).find('body').addClass('smooth-scroll');
                    $(document).find('#ui-datepicker-div').hide();
                }
            });    
        },
        showMobSummary : function(){
            var flag = this.model.get('isMobileShowSummary') ? false : true;
            this.model.set('isMobileShowSummary', flag);
            var _this = this;
            _this.render();
            _this.showShopAllLink();
            setTimeout(function(){
                console.log(" flag ---",flag);
                if(flag){
                    window.scrollTo(0, $('.summary-accordian').offset().top-150);
                }
            },0);
        },
        setHowLongVal:function(){
            this.model.get('subscriptionData').Data.howLong = $(document).find('.how-long-val').val();
        },
        setHowOffenVal:function(){
            this.model.get('subscriptionData').Data.howOften = $(document).find('.how-often-val').val();
        },
        createsubbtnClick : function(){
            var self = this;
            itemClick = "create-subscription";
            $('.create-subscription').attr('disabled',true);
            if(MiniCart.MiniCart.model.get('items').length){
                if($.cookie("subscriptionCreated") && $.cookie("subscriptionCreated") == "true"){
                    this.addtoCartAndProcudeToCheckout();
                }else{
                    var popupData = {
                        "isEnabled" : true,
                        "message" : "We can't mix Subscription and non-Subscription items at this time. <strong>Do you want to Subscribe to everything you have in the Cart?</strong>",
                        "adamessage" : "We can't mix Subscription and non-Subscription items at this time. Do you want to Subscribe to everything you have in the Cart?",
                        "buttons" : [
                            {
                                "buttonLabel" : "Yes! Subscribe",
                                "action" : "addtoCartAndProcudeToCheckout",
                                "class" : "yes-subscribe"   
                            },
                            {
                                "buttonLabel" : "No",
                                "action" : "removeCItemsandPTocheckoutpp",
                                "class" : "no-subscribe"
                            }
                        ]
                    }; 
                    this.model.set('popupData', popupData); 
                    this.render();
                    this.showShopAllLink();
                    $('.create-subscription').attr('disabled',false);
                    $(document).find('.subscription-body .popup-content .message').focus();
                    this.loopInpopup();
                }
            }else{
                var addToCartProducts = [], me = this;
                var itemsinsublist = this.model.get('SubScriptionItemsList');
                itemsinsublist.filter(function(v,i){
                    addToCartProducts.push({
                        productcode: v.productCode, 
                        quantity: v.selectedData.Qty,
                    });
                });  
                var data = {
                    'funName' : "addProducts",
                    'products' : addToCartProducts
                }; 
                window.showGlobalOverlay();         
                api.request('POST', 'svc/subscriptionpage', data).then(function(res){
                    console.log(res);
                    CartMonitor.update();
                   // MiniCart.MiniCart.showMiniCart(window.targetFocusEl);
                    $.cookie("subscriptionCreated", true, { path: '/'});
                    $.cookie("subscriptionData", JSON.stringify(me.model.get('subscriptionData').Data), { path: '/'});
                    me.redirectTosubCheckout();  
                });
                // $.cookie("subscriptionCreated", true, { path: '/'});
                // $.cookie("subscriptionData", JSON.stringify(self.model.get('subscriptionData').Data), { path: '/'});
                // self.redirectTosubCheckout();  
            }
        },
        removeCItemsandPTocheckoutotherpp : function(){
            var popupData = {
                "isEnabled" : true,
                "message" : "Proceeding will <strong> ignore the previously-started Subscription </strong> and allow you to set up the new Subscription",
                "adamessage" : "Proceeding will ignore the previously-started Subscription  and allow you to set up the new Subscription",
                "buttons" : [
                    {
                        "buttonLabel" : "Proceed",
                        "action" : "removeCartItemsandpToCheckout",
                        "class" : "Proceed"   
                    },
                    {
                        "buttonLabel" : "Back To Subscription",
                        "action" : "closePopupdynamic",
                        "class" : "Back-To-Subscription"
                    }
                ]
            }; 
            this.model.set('popupData', popupData); 
            this.render(); 
            this.showShopAllLink();
            $(document).find('.popup .popup-body .message').focus();  
            this.loopInpopup();
        },
        removeCItemsandPTocheckoutpp : function(){
            var popupData = {
                "isEnabled" : true,
                "message" : "To create a Subscription, you may have only Subscription items in the Cart. Do you want to <strong> remove </strong> the <strong> non-subscription </strong> items from the Cart and proceed to Checkout?",
                "adamessage" : "To create a Subscription, you may have only Subscription items in the Cart. Do you want to  remove  the  non-subscription  items from the Cart and proceed to Checkout?",
                "buttons" : [
                    {
                        "buttonLabel" : "Yes! Subscribe",
                        "action" : "removeCartItemsandpToCheckout",
                        "class" : "yes-subscribe"   
                    },
                    {
                        "buttonLabel" : "No",
                        "action" : "oneMoreppIgnoreSubscription",
                        "class" : "no-subscribe"
                    }
                ]
            }; 
            this.model.set('popupData', popupData); 
            this.render();
            this.showShopAllLink();
            $(document).find('.popup .popup-body .message').focus();
            this.loopInpopup();
        },
        oneMoreppIgnoreSubscription: function(){
            var popupData = {
                "isEnabled" : true,
                "message" : "Proceeding will <strong>ignore </strong> your <strong>Subscription List</strong> and allow you to purchase your At Once item(s).",
                "adamessage" : "Proceeding will ignore your Subscription List and allow you to purchase your At Once item(s).",
                "buttons" : [
                    {
                        "buttonLabel" : "Proceed",
                        "action" : "gotonormalCheckout",
                        "class" : "Proceed"   
                    },
                    {
                        "buttonLabel" : "Back To Subscription",
                        "action" : "closePopupdynamic",
                        "class" : "Back-To-Subscription"
                    }
                ]
            }; 
            this.model.set('popupData', popupData); 
            this.render();
            this.showShopAllLink();
            $(document).find('.popup .popup-body .message').focus();
            this.loopInpopup();
        },
        gotonormalCheckout: function(){
            var cartModel = new CartModels.Cart(), self = this;
            try{
                $.cookie("subscriptionCreated", false, { path: '/'});
                $.cookie("subscriptionData", JSON.stringify(self.model.get('subscriptionData').Data), { path: '/'});
                cartModel.apiGet().then(function(cart) {
                    console.log('cart',cart); 
                    cartModel.apiCheckout().then(function(cartId) {
                        console.log('cartId',cartId);
                        window.valid=true;
                        window.location.href = "/checkout/" + cartId.data.id;
                    }, function(err) {
                        console.warn(err);
                    });
                }, function(err) {
                    console.log("cart error" + err);
                });
            }catch (e) { 
                console.warn(e);
            }
        },
        removeCartItemsandpToCheckout : function(){
            var addToCartProducts = [], self = this;
            var itemsinsublist = this.model.get('SubScriptionItemsList');
            itemsinsublist.filter(function(v,i){
                addToCartProducts.push({
                    productcode: v.productCode,
                    quantity: v.selectedData.Qty,
                });
            });  
            var data = {
                'funName' : 'clearCartandAddall',
                'products' : addToCartProducts
            };
            api.request('POST', 'svc/subscriptionpage', data).then(function(res){
                console.log(res);
                CartMonitor.update();
              //  MiniCart.MiniCart.showMiniCart(window.targetFocusEl);
                $.cookie("subscriptionCreated", true, { path: '/'});
                $.cookie("subscriptionData", JSON.stringify(self.model.get('subscriptionData').Data), { path: '/'});
                self.redirectTosubCheckout();                
            });  
        },
        addtoCartAndProcudeToCheckout : function(){ 
            var addToCartProducts = [], self = this;
            var itemsinsublist = this.model.get('SubScriptionItemsList');
            MiniCart.MiniCart.clearCart();
            setTimeout(function(){
                    itemsinsublist.filter(function(v,i){
                        addToCartProducts.push({
                            productcode: v.productCode, 
                            quantity: v.selectedData.Qty,
                        });
                    });  
                var data = {
                    'funName' : "addProducts",
                    'products' : addToCartProducts
                };  
                window.showGlobalOverlay();        
                api.request('POST', 'svc/subscriptionpage', data).then(function(res){
                    console.log(res);
                    CartMonitor.update();
                   // MiniCart.MiniCart.showMiniCart(window.targetFocusEl);
                    $.cookie("subscriptionCreated", true, { path: '/'});
                    $.cookie("subscriptionData", JSON.stringify(self.model.get('subscriptionData').Data), { path: '/'});
                    self.redirectTosubCheckout();  
                }); 
            },500);
                       
        },
        showClearPopUp : function(){
            itemClick = "clearList";
            var itemsinsublist = this.model.get('SubScriptionItemsList');
            if(itemsinsublist.length){
                var popupData = {
                    "isEnabled" : true,
                    "message" : "Are you sure you want to clear the subscription list?",
                    "adamessage" : "Are you sure you want to clear the subscription list?",
                    "buttons" : [
                        {
                            "buttonLabel" : "Yes",
                            "action" : "clearList",
                            "class" : "yes"   
                        },
                        {
                            "buttonLabel" : "No",
                            "action" : "closePopupdynamic",
                            "class" : "no"
                        }
                    ]
                }; 
                this.model.set('popupData', popupData); 
                this.render();  
                this.showShopAllLink();
                $(document).find('.popup .popup-body .message').focus();
                this.loopInpopup();
            }     
        },
        closePopupdynamic : function(){
            var popupData = {
                "isEnabled" : false,
                "message" : "Are you sure you want to clear the subscription list?",
                "adamessage" : "Are you sure you want to clear the subscription list?",
                "buttons" : [
                    {
                        "buttonLabel" : "Yes",
                        "action" : "clearList",
                        "class" : "yes"   
                    },
                    {
                        "buttonLabel" : "No",
                        "action" : "closePopupdynamic",
                        "class" : "no"
                    }
                ]
            }; 
            this.model.set('popupData', popupData); 
            this.render(); 
            this.showShopAllLink();
            $(document).find('.popup .popup-body .message').focus();
            this.loopInpopup();  
            this.showFocus();
        }, 
        showFocus:function(){
            if(itemClick === "clearList"){
                $(document).find('.clearList').focus();
            }
            if(itemClick === "create-subscription"){
                $(document).find('.create-subscription').focus();
            }
        },
        clearList : function(e){
            var catList = this.model.get('categoryList'),newLisr;
            var itemsinsublist = this.model.get('SubScriptionItemsList');
            if(itemsinsublist.length){
                newLisr = catList.filter(function(v,i){
                    v.Items.map(function(a,b){
                        a.isSelected = false;
                        a.selectedData.Qty = 1;
                    });
                    return true;
                });
                var popupData = {
                    "isEnabled" : false,
                    "message" : "Are you sure you want to clear the subscription list?",
                    "adamessage" : "Are you sure you want to clear the subscription list?",
                    "buttons" : [
                        {
                            "buttonLabel" : "Yes",
                            "action" : "clearList",
                            "class" : "yes"   
                        },
                        {
                            "buttonLabel" : "No",
                            "action" : "closePopupdynamic",
                            "class" : "no"
                        }
                    ]
                }; 
                this.model.set('categoryList', newLisr);
                this.model.set('SubScriptionItemsList',[]);
                window.preSelectedProducts = [];
                this.model.set('total', 0);
                this.model.set('popupData', popupData); 
                this.render(); 
                this.showShopAllLink();
                $(document).find('.headertital').focus();
            }
        },
        removeFromList : function(e){
            var productCode = $(e.currentTarget).attr('mz-data-attr');
            var catList = this.model.get('categoryList');  
            var addedproductIds = [];
            var itemsinsublist = this.model.get('SubScriptionItemsList');
            var qty =1;
            var newLisr;
            itemsinsublist.filter(function(v,i){
                addedproductIds.push(v.productCode);
            });
            newLisr = catList.filter(function(v,i){
                v.Items.map(function(a,b){
                    if(a.productCode == productCode && addedproductIds.indexOf(a.productCode) > -1){
                        a.isSelected = false;
                        a.selectedData.Qty = 1; 
                         qty =1;
                        a.total = a.price.salePrice && a.price.salePrice <  a.price.price ? qty*a.price.salePrice : qty*a.price.price;    
                        itemsinsublist.splice(addedproductIds.indexOf(a.productCode),1);   
                        addedproductIds.splice(addedproductIds.indexOf(a.productCode),1);
                    }else if(a.productCode == productCode){
                        a.isSelected = false;
                        a.selectedData.Qty = 1;
                         qty =1;
                        a.total = a.price.salePrice && a.price.salePrice <  a.price.price ? qty*a.price.salePrice : qty*a.price.price;    
                    }  
                });
                return true;
            });
            var remainItems = [];
            itemsinsublist.filter(function(v,i){
                 if(v.productCode !==productCode){
                    remainItems.push(v);
                 }
            });
            this.model.set('categoryList', newLisr);
            this.model.set('SubScriptionItemsList',remainItems);
            window.preSelectedProducts = remainItems;
            this.model.set('total', this.calculateTotal(remainItems));
            var shippingThrashold = Hypr.getThemeSetting('freeshippingBoundingValue');
            this.model.set('remaingAmount', (shippingThrashold-parseFloat(this.calculateTotalWithNoShippingProducts(remainItems))).toFixed(2));
            this.render();
            $(document).find('.headertital').focus();
            this.showShopAllLink();
        },
        changeWeekorMonth : function(e){
            $(e.target).attr('data-mz-value');
            this.model.get('subscriptionData').Data.weeks = $(e.target).attr('data-mz-value') == "weeks" ? true : false;
            this.model.get('subscriptionData').Data.years = $(e.target).attr('data-mz-value') == "months" ? true : false;
            $(".span-tabs").removeClass("active");
            $(e.target).addClass("active");
            //this.render();   
        },
        decrement : function(e){
            var productCode = $(e.target).attr('data-mz-productcode');
            var qty = parseInt($(e.target).parents('.item-li.quantity').find('input')[0].value)-1 < 1 ? 1 : parseInt($(e.target).parents('.item-li.quantity').find('input')[0].value)-1;
            var catList = this.model.get('categoryList');
            var serchList = this.model.get('searchResult');
            var subList = this.model.get('SubScriptionItemsList');
            var newLisr = catList.filter(function(v,i){
                v.Items.map(function(a,b){
                    if(a.productCode == productCode){
                        a.selectedData.Qty = qty;  
                        a.total = a.price.salePrice && a.price.salePrice <  a.price.price ? qty*a.price.salePrice : qty*a.price.price;
                    }   
                });
                return true;
            });
            var searchList = [];
            if(serchList.length){
                searchList = serchList.filter(function(v,i){
                    if(v.productCode == productCode){
                        v.selectedData.Qty = qty;
                        v.total = v.price.salePrice && v.price.salePrice <  v.price.price ? qty*v.price.salePrice : qty*v.price.price;
                    }
                    return true;
                });
            }
            var subscriptionList = [];
            if(subList.length){
                subscriptionList = subList.filter(function(v,i){
                    if(v.productCode == productCode){
                        v.selectedData.Qty = qty;
                        v.total = v.price.salePrice && v.price.salePrice <  v.price.price ? qty*v.price.salePrice : qty*v.price.price; 
                    }
                    return true;
                });
            }
            this.model.set('categoryList', newLisr);
            this.model.set('searchResult', searchList);
            this.model.set('SubScriptionItemsList', subscriptionList);
            window.preSelectedProducts = subscriptionList;
            this.model.set('total', this.calculateTotal(subscriptionList));
            var shippingThrashold = Hypr.getThemeSetting('freeshippingBoundingValue');
            this.model.set('remaingAmount', (shippingThrashold-parseFloat(this.calculateTotalWithNoShippingProducts(subscriptionList))).toFixed(2));
            window.valid=false;
            this.render();  
            var isClearList =  $(e.target).attr('data-mz-clearList');
            this.focusQuantity(productCode,isClearList,"decrement"); 
            this.showShopAllLink(); 
        },
        increment : function(e){
            var productCode = $(e.target).attr('data-mz-productcode');
            var qty = parseInt($(e.target).parents('.item-li.quantity').find('input')[0].value)+1 < 25 ? parseInt($(e.target).parents('.item-li.quantity').find('input')[0].value)+1 : 25 ;
            var catList = this.model.get('categoryList');
            var serchList = this.model.get('searchResult');
            var subList = this.model.get('SubScriptionItemsList');
            var newLisr = catList.filter(function(v,i){
                v.Items.map(function(a,b){
                    if(a.productCode == productCode){
                        a.selectedData.Qty = qty; 
                        a.total = a.price.salePrice && a.price.salePrice <  a.price.price ? qty*a.price.salePrice : qty*a.price.price;   
                    }   
                });
                return true;
            });
            var searchList = [];
            if(serchList.length){
                searchList = serchList.filter(function(v,i){
                    if(v.productCode == productCode){
                        v.selectedData.Qty = qty;
                        v.total = v.price.salePrice && v.price.salePrice <  v.price.price ? qty*v.price.salePrice : qty*v.price.price; 
                    }
                    return true;
                });
            }
            var subscriptionList = [];
            if(subList.length){
                subscriptionList = subList.filter(function(v,i){
                    if(v.productCode == productCode){
                        v.selectedData.Qty = qty; 
                        v.total = v.price.salePrice && v.price.salePrice <  v.price.price ? qty*v.price.salePrice : qty*v.price.price;
                    }
                    return true;
                });
            }
            this.model.set('categoryList', newLisr);
            this.model.set('searchResult', searchList);
            this.model.set('SubScriptionItemsList', subscriptionList);
            window.preSelectedProducts = subscriptionList;
            this.model.set('total', this.calculateTotal(subscriptionList));
            var shippingThrashold = Hypr.getThemeSetting('freeshippingBoundingValue');
            this.model.set('remaingAmount', (shippingThrashold-parseFloat(this.calculateTotalWithNoShippingProducts(subscriptionList))).toFixed(2));
            window.valid=false;
            this.render();
            var isClearList =  $(e.target).attr('data-mz-clearList');
            this.focusQuantity(productCode,isClearList,"increment");  
            this.showShopAllLink();
        },
        updateQuantityChanges : function(productCode,qty,e){
            var catList = this.model.get('categoryList');
            var serchList = this.model.get('searchResult');
            var subList = this.model.get('SubScriptionItemsList');
            var newLisr = catList.filter(function(v,i){
                v.Items.map(function(a,b){
                    if(a.productCode == productCode){
                        a.selectedData.Qty = qty; 
                        a.total = a.price.salePrice && a.price.salePrice <  a.price.price ? qty*a.price.salePrice : qty*a.price.price;   
                    }   
                });
                return true;
            });
            var searchList = [];
            if(serchList.length){
                searchList = serchList.filter(function(v,i){
                    if(v.productCode == productCode){
                        v.selectedData.Qty = qty;
                        v.total = v.price.salePrice && v.price.salePrice <  v.price.price ? qty*v.price.salePrice : qty*v.price.price; 
                    }
                    return true;
                });
            }
            var subscriptionList = [];
            if(subList.length){
                subscriptionList = subList.filter(function(v,i){
                    if(v.productCode == productCode){
                        v.selectedData.Qty = qty; 
                        v.total = v.price.salePrice && v.price.salePrice <  v.price.price ? qty*v.price.salePrice : qty*v.price.price;
                    }
                    return true;
                });
            }
            this.model.set('categoryList', newLisr);
            this.model.set('searchResult', searchList);
            this.model.set('SubScriptionItemsList', subscriptionList);
            window.preSelectedProducts = subscriptionList;
            this.model.set('total', this.calculateTotal(subscriptionList));
            var shippingThrashold = Hypr.getThemeSetting('freeshippingBoundingValue');
            this.model.set('remaingAmount', (shippingThrashold-parseFloat(this.calculateTotalWithNoShippingProducts(subscriptionList))).toFixed(2));
            window.valid=false;
            this.render();
            var isClearList =  $(e.target).attr('data-mz-clearList');
            this.focusQuantity(productCode,isClearList,"inputfield"); 
            this.showShopAllLink(); 
        },
        changeQuantity:function(e){
            var productCode = $(e.target).attr('data-mz-productcode');
            var qty = parseInt($(e.target).val()) >=1 && parseInt($(e.target).val()) <=25 ?  parseInt($(e.target).val()) : (parseInt($(e.target).val()) > 25 ? 25 : 1 ); 
            $(e.target).val(qty);
            console.log(" productCode --- ",productCode,qty);
            var _this = this;
            setTimeout(function(){
                _this.updateQuantityChanges(productCode,qty,e);
            },500);

        },
        focusQuantity:function(productCode,isClearList,type){
            console.log(" itemClick ----- ",itemClick);
            var self = this;
            //setTimeout(function(){
                if(itemClick === "search"){
                    if(type =="increment")
                        $(".suggetion-item .increment[data-mz-productcode='"+productCode+"']").focus();
                    else if(type =="decrement")
                        $(".suggetion-item .decrement[data-mz-productcode='"+productCode+"']").focus();
                    else
                        $(".suggetion-item .quantity-sub[data-mz-productcode='"+productCode+"']").focus();
                    self.loopInpopup("suggetion-list");
                }
                else if(isClearList && isClearList === 'true'){
                    if(type =="increment")
                        $(".listitemlist .increment[data-mz-productcode='"+productCode+"']").focus();
                    else if(type =="decrement")
                        $(".listitemlist .decrement[data-mz-productcode='"+productCode+"']").focus();
                    else
                        $(".listitemlist .quantity-sub[data-mz-productcode='"+productCode+"']").focus();
                }else{
                    if(type =="increment")
                        $(".product-list .increment[data-mz-productcode='"+productCode+"']").focus();
                    else if(type =="decrement")
                        $(".product-list .decrement[data-mz-productcode='"+productCode+"']").focus();
                    else
                        $(".product-list .quantity-sub[data-mz-productcode='"+productCode+"']").focus();
                }  
            //},0);
        },
        selectthecatrgory : function(e){
            var catCode = $(e.target).attr('data-mz-catCode');

            var addedproductIds = [];
            var itemsinsublist = this.model.get('SubScriptionItemsList');
            itemsinsublist.filter(function(v,i){
                addedproductIds.push(v.productCode);
            });
            var catList = this.model.get('categoryList'), newLisr = [];
            if($(e.target)[0].checked){
                newLisr = catList.filter(function(v,i){
                    if(v.Category.categoryCode == catCode){
                        var myflag = false;
                        v.Items.map(function(a,b){
                            if(addedproductIds.indexOf(a.productCode) == -1 && a.purchasableState.isPurchasable){
                                a.isSelected = true;
                                itemsinsublist.push(a); 
                                myflag = true;  
                            }   
                        });
                        if(myflag){
                            v.isAllSelected = true;
                        }
                    }
                    return true;
                });
            }else{
                newLisr = catList.filter(function(v,i){
                    if(v.Category.categoryCode == catCode){
                        v.isAllSelected = false;
                        v.Items.map(function(a,b){
                            if(addedproductIds.indexOf(a.productCode) > -1){
                                a.isSelected = false;
                                itemsinsublist.splice(addedproductIds.indexOf(a.productCode),1);   
                                addedproductIds.splice(addedproductIds.indexOf(a.productCode),1);
                            }   
                        });
                    }
                    return true;
                });
            }
            this.model.set('categoryList', newLisr);
            this.model.set('SubScriptionItemsList',itemsinsublist);
            window.preSelectedProducts = itemsinsublist;
            this.model.set('total', this.calculateTotal(itemsinsublist));
            var shippingThrashold = Hypr.getThemeSetting('freeshippingBoundingValue');
            this.model.set('remaingAmount', (shippingThrashold-parseFloat(this.calculateTotalWithNoShippingProducts(itemsinsublist))).toFixed(2));
            this.render();
            this.showShopAllLink();
        },
        showShopAllLink:function(){
            var mainCat  = window.mainCategory;
            if(mainCat){
                $(".accordian-headitem .shopall").removeClass("show");    
                $(".accordian-headitem .shopall[data-mz-attr='"+mainCat+"']").addClass("show");  
                $(".accordian-headitem .icon").removeClass("open");   
                $(".accordian-headitem .icon[data-mz-attr='"+mainCat+"']").addClass("open"); 
                $(".accordian-headitem .icon").attr('aria-label','Click Arrow to show sub categories');
                $(".accordian-headitem .icon[data-mz-attr='"+mainCat+"']").attr('aria-label','Click Arrow to show sub categories');
                $(".mainCategory .shopall").removeClass("show");    
                $(".mainCategory .shopall[data-mz-attr='"+mainCat+"']").addClass("show");  
                $(".mainCategory .icon").removeClass("open");   
                $(".mainCategory .icon[data-mz-attr='"+mainCat+"']").addClass("open"); 
                $(".mainCategory .icon").attr('aria-label','Click Arrow to show sub categories');
                $(".mainCategory .icon[data-mz-attr='"+mainCat+"']").attr('aria-label','Click Arrow to show sub categories');
                $(".subcategoryMainDiv").removeClass("open");
                $(".subcategoryMainDiv").addClass("close");
                $(".subcategoryMainDiv[data-mz-categorycode-code='"+mainCat+"']").addClass("open");   
                var subcategory = window.subcategory;
                if(subcategory){
                    $(".side-bar-item-subCategory").removeClass("active");   
                    $(".side-bar-item-subCategory[data-mz-attr='"+subcategory+"']").addClass("active");   
                }  
            }
        },
        addtoList : function(e){
            var productCode = $(e.target).attr('data-mz-attribute');
            var mainCat  = $(e.target).attr('data-mz-parentCat');
            var addedproductIds = [];
            var itemsinsublist = this.model.get('SubScriptionItemsList');
            var serchList = this.model.get('searchResult');
            itemsinsublist.filter(function(v,i){
                addedproductIds.push(v.productCode);
            });
            var catList = this.model.get('categoryList'), newLisr = [],searchList = [];
            if($(e.target)[0].checked){
                newLisr = catList.filter(function(v,i){
                    v.Items.map(function(a,b){
                        if(a.productCode == productCode && addedproductIds.indexOf(a.productCode) == -1){
                            a.isSelected = true;
                            itemsinsublist.push(a);  
                            addedproductIds.push(a.productCode); 
                        }else if(a.productCode == productCode){
                            a.isSelected = true;
                        }   
                    });
                    return true;
                });
                searchList = serchList.filter(function(v,i){
                    if(v.productCode == productCode && addedproductIds.indexOf(v.productCode) == -1){
                        v.isSelected = true;
                        itemsinsublist.push(v);  
                        addedproductIds.push(v.productCode); 
                    }else if(v.productCode == productCode){
                        v.isSelected = true;
                    }  
                    return true;
                });
                window.valid=false;
            }else{
                newLisr = catList.filter(function(v,i){
                    v.Items.map(function(a,b){
                        if(a.productCode == productCode && addedproductIds.indexOf(a.productCode) > -1){
                            a.isSelected = false;
                            itemsinsublist.splice(addedproductIds.indexOf(a.productCode),1);   
                            addedproductIds.splice(addedproductIds.indexOf(a.productCode),1);
                        }else if(a.productCode == productCode){
                            a.isSelected = false;
                        }  
                    });
                    return true;
                });
                searchList = serchList.filter(function(v,i){
                    if(v.productCode == productCode && addedproductIds.indexOf(v.productCode) > -1){
                        v.isSelected = false;
                        itemsinsublist.splice(addedproductIds.indexOf(v.productCode),1);   
                        addedproductIds.splice(addedproductIds.indexOf(v.productCode),1);
                    }else if(v.productCode == productCode){
                        v.isSelected = false;
                    }
                    return true;   
                }); 
            } 
            this.model.set('searchResult',searchList);
            this.model.set('categoryList', newLisr);
            this.model.set('SubScriptionItemsList',itemsinsublist);
            window.preSelectedProducts = itemsinsublist;
            this.model.set('total', this.calculateTotal(itemsinsublist));
            var shippingThrashold = Hypr.getThemeSetting('freeshippingBoundingValue');
            this.model.set('remaingAmount', (shippingThrashold-parseFloat(this.calculateTotalWithNoShippingProducts(itemsinsublist))).toFixed(2));
            this.render();
            this.showShopAllLink();
            setTimeout(function(){
                if(itemClick === "search"){
                    $(".suggetion-item .add-to-list-checkbox[data-mz-attribute='"+productCode+"']").focus();
                    $(".suggetion-item .checkmark-style[data-mz-attribute='"+productCode+"']").focus();
                }
                else{
                    $(".product-item .checkmark-style[data-mz-attribute='"+productCode+"']").focus();
                    $(".product-item .add-to-list-checkbox[data-mz-attribute='"+productCode+"']").focus();
                }
            },500);
            
        },
        changeCatList : function(e){
            console.log(" e ----",e.target);
            if(!$(e.target).hasClass('active')){
                this.changeCategory(e);
                var _this= this;
                setTimeout(function(){
                    _this.setProductlistFocus();
                },100); 
            }
        },
        changeMainCatList:function(e){
            var categoryCode = $(e.target).attr('data-mz-attr');
            if(!$(".mainCategory[data-mz-attr='"+categoryCode+"']").hasClass('active')){
                this.getProductsByCategory(categoryCode,0,pageSize,false,false,false); 
                var _this = this;
                setTimeout(function(){
                    _this.setProductlistFocus();
                },100); 
            }
            else{
                $(e.target).removeClass('active');
                $(".subcategoryMainDiv").removeClass("open");
                $(".icon").removeClass("open");
                $(".mainCategory .shopall").removeClass("show");
                $(".mainCategory ").removeClass("active");
                $(".icon").attr('aria-label','Click Arrow to show sub categories');
            }
        },
        mainCatIconClick:function(e){
            var categoryCode = $(e.target).attr('data-mz-attr');
            if(!$(e.target).hasClass('open')){
                this.getProductsByCategory(categoryCode,0,pageSize,false,false,false); 
                var _this = this;
                setTimeout(function(){
                    _this.setProductlistFocus();
                },100); 
            }
            else{
                $(".mainCategory").removeClass('active');
                $(".subcategoryMainDiv").removeClass("open");
                $(".icon").removeClass("open");
                $(".icon").attr('aria-label','Click Arrow to show sub categories');
                $(".mainCategory .shopall").removeClass("show");
            }
        },
        
        changeCategory:function(e,patentCat){
            var categoryCode = $(e.target).attr('data-mz-attr');
            if(!$(e.target).hasClass('active')){
                this.getProductsByCategory(categoryCode,0,pageSize,false,patentCat?patentCat:false,true);     
            }
            else{ 
                var catList = this.model.get('categoryList').filter(function(v,i){
                    if(v.Category.categoryCode == categoryCode && !v.isActive){
                        v.isActive = true;
                    }else{
                        v.isActive = false;
                    }
                    return true;
                });  
                    this.model.set('categoryList', catList); 
                    this.model.set("activeCategoryList",categoryCode);
                    $(".icon").removeClass("open");
                    $(".icon").attr('aria-label','Click Arrow to show sub categories');
                    $(".icon").addClass("close");
                    this.render(); 
                    $(".noProducts").hide();
                    $(".product-item-list").hide();
                    $(".subcategoryMainDivMobile").hide(); 
                    //this.showShopAllLink();  
            }
        },
        changeSubCatList:function(e){
            var categoryCode = $(e.target).attr('data-mz-attr');
            var patentCat = $(e.target).attr('data-mz-parentCat');
            this.getProductsByCategory(categoryCode,0,pageSize,false,patentCat);
        },
        changeSubCatListMobile:function(e){
            var categoryCode = $(e.target).attr('data-mz-attr');
            var patentCat = $(e.target).attr('data-mz-parentCat');
            //this.getProductsByCategory(categoryCode,0,pageSize,false,patentCat,true);
            this.changeCategory(e,parseInt(patentCat));
        },
        enableSearch:function(){
            $(".searchBoxSub").focus();
        },
        search : _.debounce(function (e){
            itemClick = "search";
            var self = this;
            //var query = $(e.target).val();
            var query = $(".searchBoxSub").val();
            var addedproductIds = [], qtyArray = [];
            var itemsinsublist = this.model.get('SubScriptionItemsList');
            itemsinsublist.filter(function(v,i){
                addedproductIds.push(v.productCode);
                qtyArray.push(v.selectedData.Qty);
            });
            this.model.set('searchQuery', query);
            console.log(" query --- ",query,$(".searchBoxSub").val());
            console.log(" e && e.which --",e && e.which);
            if(e && e.which === 13 || e && e.which ===1){
                var body = {
                    "funName" : "search",
                    "query" : query
                };
                api.request('post', "svc/subscriptionpage", body).then(function(result){
                    var mySearch = [];
                    console.log("result", result);
                    if(result){
                        var getItems = result.items;
                        getItems.filter(function(v,i){
                        var heatObj = {};
                        if(v && v.properties){
                             v.properties.filter(function(a,b){
                                if(a.attributeFQN == "tenant~IsHeatSensitive"){
                                    heatObj = a;
                                }
                            });
                        }
                       if(v.price){
                            var temp = {
                                "name" : v.content.productName,
                                "productCode" : v.productCode,
                                "image" : v.content.productImages[0],
                                "price" : v.price,
                                "purchasableState" : v.purchasableState,
                                "inventoryInfo" : v.inventoryInfo,
                                "IsHeatSensitive" : heatObj,
                                "isSelected" : addedproductIds.indexOf(v.productCode) > -1 ? true : false,
                                "total" : (addedproductIds.indexOf(v.productCode) > -1) ? v.price && v.price.salePrice && v.price.salePrice <  v.price.price ? qtyArray[addedproductIds.indexOf(v.productCode)]*v.price.salePrice : qtyArray[addedproductIds.indexOf(v.productCode)]*v.price.price : v.price.salePrice && v.price.salePrice <  v.price.price ? 1*v.price.salePrice : 1*v.price.price,
                                "selectedData" : {
                                    "Qty" : addedproductIds.indexOf(v.productCode) > -1 ? qtyArray[addedproductIds.indexOf(v.productCode)] : 1
                                }
                            };
                            mySearch.push(temp);
                        }
                    });
                }
                    self.model.set('isSearchenabled', true);
                    self.model.set('searchResult', mySearch); 
                    self.render();  
                    setTimeout(function(){
                        $(document).find('.suggetion-list').focus();
                        self.loopInpopup("suggetion-list");

                    },1000); 
                    self.showShopAllLink();
                },function(error){
                    console.log("Error getting search result", error);
                });
            }
        },1000), 
        closeSearchOverlay : function(){
            this.model.set('isSearchenabled', false);
            this.model.set('searchResult', []); 
            this.render();   
            this.showShopAllLink();
            var _this = this;
            setTimeout(function(){
                _this.setProductlistFocus();
            },100);
            itemClick = "";  
        },
        closePopup : function(){
            $.cookie("ClosefirstPopup",true);
            this.model.set('isFirstPopup', false);
            this.render();
            this.showShopAllLink();
        },
        removeBar : function(){
            this.model.set('headBar', false);
            this.render(); 
            this.showShopAllLink();
        },
        calculateTotal : function(itemsinsublist){
            var total = 0;
            itemsinsublist.filter(function(v,i){
                    total += v.total;
            }); 
            return total;  
        },
        calculateTotalWithNoShippingProducts : function(itemsinsublist){
            var total = 0;
            var noShippingProducts = Hypr.getThemeSetting('noFreeShippingSkuList').replace(/ /g, "").split(','); 
            console.log(noShippingProducts);
            itemsinsublist.filter(function(v,i){
                console.log("v--",v.productCode);
                if(noShippingProducts.indexOf(v.productCode) == -1){
                    total += v.total;
                }
               
            }); 
            return total;  
        },
        redirectTosubCheckout: function(e){
            var cartModel = new CartModels.Cart(), self = this;
            try{
                cartModel.apiGet().then(function(cart) {
                    console.log('cart',cart); 
                    cartModel.apiCheckout().then(function(cartId) {
                        console.log('cartId',cartId);
                        window.valid=true;
                        var urlParams = modelRapidOrder.getUrlParams(window.location.href);
                        var subscriptionId = urlParams && urlParams.subscriptionId ? "&subId="+urlParams.subscriptionId :"";
                        //$.cookie("editsubscriptionId", subscriptionId, { path: '/'});
                        window.location.href = "/checkout/" + cartId.data.id + "?chktSub=true"+subscriptionId;
                    }, function(err) {
                        console.warn(err);
                    });
                }, function(err) {
                    console.log("cart error" + err);
                });
            }catch (err) { 
                console.warn(err);
            }
        },
        getUrlParams:function(url){
        var result = {};
        var params = window.location.search;
        params = params.substr(1);
        var queryParamArray = params.split('&');
        queryParamArray.forEach(function(queryParam) {
            var item = queryParam.split('=');
            result[item[0]] = decodeURIComponent(item[1]);
        });
        console.log(result);
        return result;
        },
        getSubscriptionPageData:function(preSelectedProducts){
         if(typeof $.cookie("subscriptionCreated") !== 'undefined' && $.cookie("subscriptionCreated") == 'true' && ((preSelectedProducts.length === 0 && MiniCart.MiniCart.model.get('items').length >0) || (MiniCart.MiniCart.model.get('items').length > preSelectedProducts.length ))){
            var cartItems = MiniCart.MiniCart.model.apiModel.data.items;
            preSelectedProducts = [];
            var subscriptionData =[];
            console.log(" cartItems",cartItems);
            for(var i=0;i<cartItems.length;i++){
                var item = cartItems[i];
                console.log(" edit cart item ---",item);
                 var product = {"skuCode":item.product.productCode,"qty":item.quantity};
                 var urlParam = modelRapidOrder.getUrlParams(window.location.href);
                 var preSelcectedPrd = urlParam && urlParam.productCode ? urlParam.productCode :null;
                 var preSelectedQuantity = urlParam && urlParam.qty ? urlParam.qty :null;
                 if(preSelcectedPrd && preSelectedQuantity && preSelcectedPrd == parseInt(product.skuCode)){
                    product.qty = parseInt(product.qty)+parseInt(preSelectedQuantity);
                 }
                preSelectedProducts.push(product);
                var heatObj = {};
                var properties = item.product.properties ? item.product.properties :[];
                for(var p=0; p<properties.length; p++){
                    if(properties[p].attributeFQN == "tenant~IsHeatSensitive"){
                        heatObj = properties[p];
                    }
                }
                var subItem = {IsHeatSensitive:heatObj,image:{imageUrl:item.product.imageUrl},inventoryInfo:{},isSelected:true,name:item.product.name,price:item.product.price,productCode:item.product.productCode,selectedData: {Qty: item.quantity},total:item.total,purchasableState:{}};
                subscriptionData.push(subItem);
            }
            this.model.set('SubScriptionItemsList',subscriptionData);
         }
            var _this = this;
            api.request("GET","/api/commerce/catalog/storefront/categories/tree").then(function (resp) {
                _this.model.set('subscriptionCategories', resp);
                console.log(" response ---",resp);
                if(resp && resp.totalCount >0){
                    var categoryId = resp.items[0].categoryCode;
                    window.preSelectedProducts = [];
                    _this.getProductsByCategory(categoryId,0,pageSize);
                }
               
            },function(error){
                console.log(error);
                window.hideGlobalOverlay();
            });
           
        },
        getProductsByCategory:function(catId,startIndex,pageSize,isloadmore,parentCatId,isMobileView){
            window.showGlobalOverlay();
            window.mainCategory = parentCatId ? parentCatId: catId;
            window.subcategory = parentCatId ? catId : "";
            var body = {
                "funName" : "getprodsbycategory",
                "categoryId":catId,
                "startIndex":startIndex,
                "pageSize":pageSize
            };
            var existingItems = [];
            var _this = this;
            if(isloadmore){
                var catLists  = modelRapidOrder.model.get('categoryList');
                console.log("catLists ---",catLists);
                catLists.filter(function(v,i){
                    if(parseInt(v.Category.categoryCode) === parseInt(catId)){
                        existingItems =   v.Items;
                    }
                }); 
            }
           var preSelectedProducts = window.preSelectedProducts;
           console.log(" preSelectedProducts  ---",preSelectedProducts);
            api.request('post', "svc/subscriptionpage", body).then(function(result){
                    var myResult = [];
                    var dataPCodes = [];
                    var preSelecteArray = [], grandtotal = 0;
                    var existingList = modelRapidOrder.model.get('SubScriptionItemsList');
                    if(existingList && existingList.length > 0){
                        preSelecteArray =  existingList;  
                    }
                    var isLessThanMobileWidth = $(window).width() <= 664 ? true : false;
                    result.items.filter(function(v,i){
                        var myTemp = {
                            "Category" : v.category[0],
                            "Items" : [],
                            "isActive" : (i === 0 && !isLessThanMobileWidth) ? true : false,
                            "isAllSelected" : false
                        };
                        if(isloadmore && parseInt(v.category[0].categoryCode) === parseInt(catId)){
                            myTemp.Items =  existingItems;
                        }
                        v.items.filter(function(m,n){
                            var heatObj = {};
                            m.properties.filter(function(a,b){
                                if(a.attributeFQN == "tenant~IsHeatSensitive"){
                                    heatObj = a;
                                } 
                            });
                            var preSelcectedProduct =null,preSelectedQty=null;
                            //  console.log("preSelectedProducts --- ",preSelectedProducts);
                                for(var l=0;l<preSelectedProducts.length;l++){  
                                    if(preSelectedProducts[l].productCode === m.productCode  && dataPCodes.indexOf(m.productCode) == -1 ){
                                        preSelcectedProduct = preSelectedProducts[l].productCode;
                                        preSelectedQty = preSelectedProducts[l].qty ?  preSelectedProducts[l].qty : preSelectedProducts[l].selectedData ?preSelectedProducts[l].selectedData.Qty : 1 ;
                                        break;
                                    }
                                } 
                                if(m.price)
                                {
                                    var temp = { 
                                            "name" : m.content.productName,
                                            "productCode" : m.productCode,
                                            "image" : m.content.productImages[0],
                                            "price" : m.price,
                                            "purchasableState" : m.purchasableState,
                                            "inventoryInfo" : m.inventoryInfo,
                                            "IsHeatSensitive" : heatObj,
                                            "isSelected" : (preSelcectedProduct && preSelcectedProduct == m.productCode) ? true : false,
                                            "total" : (preSelcectedProduct && preSelcectedProduct == m.productCode) ? m.price.salePrice && m.price.salePrice <  m.price.price ? preSelectedQty*m.price.salePrice : preSelectedQty*m.price.price : m.price.salePrice && m.price.salePrice <  m.price.price ? 1*m.price.salePrice : 1*m.price.price,  
                                            "selectedData" : {
                                                "Qty" : (preSelectedQty && preSelcectedProduct && preSelcectedProduct == m.productCode) ? preSelectedQty : 1
                                            }
                                        }; 
                                    //  console.log("preSelcectedProduct ----",preSelcectedProduct,m.productCode);
                                    // 
                                        if(preSelcectedProduct && preSelcectedProduct == m.productCode){
                                            var prdExists = false;
                                            if(preSelecteArray.length > 0 ){
                                                preSelecteArray.filter(function(v,i){
                                                    if(v.productCode === temp.productCode){
                                                        prdExists = true;
                                                    }
                                                });
                                            }    
                                            if(!prdExists){
                                                dataPCodes.push(m.productCode);
                                                preSelecteArray.push(temp);
                                            }
                                        }
                                       
                                        myTemp.Items.push(temp);  
                                }        
                            
                        });
                        myResult.push(myTemp); 
                    });
                    
                // console.log(" preSelecteArray ---- ",preSelecteArray);
                    modelRapidOrder.model.set('SubScriptionItemsList', preSelecteArray);
                    console.log(" preSelecteArray ----",preSelecteArray);
                    modelRapidOrder.model.set('total', modelRapidOrder.calculateTotal(preSelecteArray));
                    var shippingThrashold = Hypr.getThemeSetting('freeshippingBoundingValue');
                    modelRapidOrder.model.set('remaingAmount', (shippingThrashold-parseFloat(modelRapidOrder.calculateTotalWithNoShippingProducts(preSelecteArray))).toFixed(2)); 
                    modelRapidOrder.model.set('categoryList', myResult); 
                    console.log(" categoryList ---",myResult);
                    modelRapidOrder.model.set("totalCount",result.totalCount);
                    modelRapidOrder.model.set("startIndex",result.startIndex);
                    modelRapidOrder.model.set("pageSize",result.pageSize);
                    modelRapidOrder.model.set("totalReceivedOrders",parseInt(result.startIndex+result.pageSize));
                    modelRapidOrder.model.set("currentCategoryId",parseInt(catId));
                    modelRapidOrder.model.set("isSubcategoryFlow",parentCatId ? true:false);
                    modelRapidOrder.model.set("parentCatId",parentCatId );
                    modelRapidOrder.render(); 
                    
                        if(isMobileView){
                            var catList = modelRapidOrder.model.get('categoryList').filter(function(v,i){
                                if(v.Category.categoryCode == catId){
                                    v.isActive = true;
                                }else{
                                    v.isActive = false;
                                }
                                return true;
                            }); 
                            console.log(" categoryList ----",catList); 
                            modelRapidOrder.model.set('categoryList', catList);
                            modelRapidOrder.render();
                            $(".side-bar-item-subCategoryMobile").removeClass("active");   
                            $(".side-bar-item-subCategoryMobile[data-mz-attr='"+catId+"']").addClass("active");
                            if(parentCatId){
                                catId = parentCatId;
                            }
                            $(".accordian-headitem .icon").removeClass("open");   
                            $(".accordian-headitem .icon[data-mz-attr='"+catId+"']").addClass("open");
                            $(".accordian-headitem .icon").attr('aria-label','Click Arrow to show sub categories');
                            $(".accordian-headitem .icon[data-mz-attr='"+catId+"']").attr('aria-label','Click Arrow to show sub categories');
                            $(".accordian-headitem").removeClass("active");   
                            $(".accordian-headitem[data-mz-attr='"+catId+"']").addClass("active");  
                            $(".accordian-headitem .shopall").removeClass("showAnchor");    
                            $(".accordian-headitem .shopall[data-mz-attr='"+catId+"']").addClass("showAnchor"); 
                            $(".subcategoryMainDivMobile[data-mz-categoryCode-code='"+catId+"']").focus();

                        } 
                        else{
                            _this.setProductlistFocus();
                        }
                        if(!isloadmore){
                            if(parentCatId){
                                $(".side-bar-item-subCategory").removeClass("active");   
                                $(".side-bar-item-subCategory[data-mz-attr='"+catId+"']").addClass("active");   
                                catId = parentCatId;
                            }
                                $(".mainCategory").removeClass("active");   
                                $(".mainCategory[data-mz-attr='"+catId+"']").addClass("active");
                               
                            if(result.items.length === 0 && !parentCatId){
                                $(".accordian-headitem .shopall[data-mz-attr='"+catId+"']").removeClass("showAnchor");
                                $(".mainCategory .shopall[data-mz-attr='"+catId+"']").removeClass("show");
                            }
                        }
                        $(".subcategoryMainDiv").removeClass("open");
                        $(".subcategoryMainDiv").addClass("close");
                        $(".subcategoryMainDiv[data-mz-categorycode-code='"+catId+"']").addClass("open");   
                        $(".mainCategory .shopall").removeClass("show");    
                        $(".mainCategory .shopall[data-mz-attr='"+catId+"']").addClass("show");  
                        $(".mainCategory .icon").removeClass("open");   
                        $(".mainCategory .icon[data-mz-attr='"+catId+"']").addClass("open");  
                        $(".mainCategory .icon").attr('aria-label','Click Arrow to show sub categories');
                        $(".mainCategory .icon[data-mz-attr='"+catId+"']").attr('aria-label','Click Arrow to show sub categories'); 
                    window.hideGlobalOverlay();       
                    setTimeout(function(){
                    var subData =  modelRapidOrder.model.get('subscriptionData');
                    if(subData && subData.Data){
                            $('#interval-startdate').datepicker("setDate", subData.Data.when);
                            $('#interval-startdate').val(subData.Data.when);
                         } 
                    },500);  
                },function(error){
                    console.log("Error getting search result", error);
                    window.hideGlobalOverlay();
            }).catch(function(e){
                window.hideGlobalOverlay();
            });
        },
        getSubscriptionData:function(subscriptionId){
            api.request('POST', 'svc/getSubscription',{method:"GET",subscriptionId:subscriptionId}).then(function(res) {
            if (!res.error &&  res.res.subscriptionId !== undefined) {
               var products = [];
               var result = res.res;
               var subscriptionData = [];
               console.log(" result ---",result);
               for(var i=0;i<result.order.items.length;i++){
                var item = result.order.items[i];
                var product = {"skuCode":item.product.productCode,"qty":item.quantity};
                products.push(product);
                console.log("item ---",item);
                var heatObj = {};
                var properties = item.product.properties ? item.product.properties :[];
                for(var p=0; p<properties.length; p++){
                    if(properties[p].attributeFQN == "tenant~IsHeatSensitive"){
                        heatObj = properties[p];
                    }
                }
                var subItem = {IsHeatSensitive:heatObj,image:{imageUrl:item.product.imageUrl},inventoryInfo:{},isSelected:true,name:item.product.name,price:item.product.price,productCode:item.product.productCode,selectedData: {Qty: item.quantity},total:item.total,purchasableState:{}};
                subscriptionData.push(subItem);
               }
                var date = new Date(),
                    day = date.getDate()>9?date.getDate():"0"+date.getDate(),
                    month = date.getMonth()>8?date.getMonth()+1:"0"+(date.getMonth()+1),
                    year = date.getFullYear();
                 var startDate = month+"-"+day+"-"+year;   
                 console.log("result.schedule.startDate ----",result.schedule.startDate,date,date.getMonth());
               var  myObj = {
                'howOften' : result.schedule.frequency,
                'weeks' : result.schedule.frequencyType === 'Weeks' ? true:false,
                'years' : result.schedule.frequencyType === 'Months' ? true:false,
                'when' : startDate, 
                'howLong' : result.schedule.endType
            };
            console.log("myObj ----",myObj);
            modelRapidOrder.model.set('subscriptionData',{ 'Data' : myObj});
            modelRapidOrder.model.set('SubScriptionItemsList',subscriptionData);
                modelRapidOrder.getSubscriptionPageData(products);
            }
               
        }, function(er) {
            // fail condition
            console.log("Data error " + er);
            }).catch(function(e){
                window.hideGlobalOverlay();
            });
        },
       
        dateSelector: function() {
            var finaldate;
            var heat;
            var finalDate;
            var me = this;
            console.log("DateSelector ----");
            if (this.isHeatSensitive()) {
                finaldate = this.heatSensitvieDatePicker();
                finalDate = finaldate.replace(/-/g, '/');
                heat = true;
            } else {
                finaldate = this.datePicker();
                finalDate = finaldate.replace(/-/g, '/');
                heat = false;
            }

            // Date Picker 
            $('#interval-startdate').datepicker({
                beforeShowDay: heatSensitive,
                minDate: '0',
                maxDate: '+6m',
                dateFormat: "mm-dd-yy",
                autoclose:true,
                onSelect: function(dateText, inst) {
                    var date = $(this).datepicker('getDate'),
                        day = date.getDate(),
                        month = date.getMonth() + 1,
                        year = date.getFullYear();
                    var shipdate = ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2) + '-' + year;

                    window.shipdate = shipdate;
                    var subscriptionData = me.model.get('subscriptionData');
                    if(subscriptionData && subscriptionData.Data){
                        subscriptionData.Data.when = shipdate;
                        me.model.set('subscriptionData', subscriptionData); 
                    }

                    $('#interval-startdate').datepicker("setDate", shipdate);
                    $('#interval-startdate').val(shipdate);
                    //$('.estimateddate').text(shipdate);  
                    //me.render(); 
                },
                beforeShow: function () { 
                    $(document).find('body').removeClass('smooth-scroll');
                    $(document).find('#ui-datepicker-div').show();
                },onClose:function(){
                    $(document).find('body').addClass('smooth-scroll');
                    $(document).find('#ui-datepicker-div').hide();
                }
            });

            //if (window.shipdate && !window.isPreviouslyStarted) {
            var selectedDate = window.shipdate;
            if (window.shipdate == finaldate) {
                if(this.isHeatSensitive()) {
                    var currentHeatDate = new Date(window.shipdate);
                    if( heatSensitive(currentHeatDate)[0] === true ) {
                        $('#interval-startdate').val(window.shipdate);
                    } else {
                        $('#interval-startdate').datepicker("setDate", finaldate);
                        $('#interval-startdate').val(finaldate);
                        window.shipdate = finaldate;
                    }
                } else {
                    $('#interval-startdate').datepicker("setDate", window.shipdate);
                    if(me.model.get("scheduleInfo")) {
                        $('#interval-startdate').val(me.model.get("scheduleInfo").startDate);
                    }
                }
            } else {
                var date = selectedDate ? selectedDate : finaldate;
                $('#interval-startdate').datepicker("setDate", date);
                $('#interval-startdate').val(date);
                var subscriptionData = me.model.get('subscriptionData');
                if(subscriptionData && subscriptionData.Data){
                    subscriptionData.Data.when = date;
                    me.model.set('subscriptionData', subscriptionData); 
                }
            }

            function heatSensitive(date) {
                var restDates = Hypr.getThemeSetting('shipping_date') ? Hypr.getThemeSetting('shipping_date') : "01/01/2019,02/18/2019,05/27/2019,07/04/2019,05/25/2020" ;
                //var blackoutdates = restDates.split(',');
                var blackoutdates = window.blockedShippingDates;
                var day;
                var m = date.getMonth();
                var d = date.getDate();
                var y = date.getFullYear();

                var dd = new Date();
                var mm = dd.getMonth();
                var ddd = dd.getDate();
                var yy = dd.getFullYear();

                var shipdate = new Date(finalDate);
                var currentDate = ('0' + (mm + 1)).slice(-2) + "/" + ('0' + ddd).slice(-2) + "/" + yy;
                var compareDate = ('0' + (m + 1)).slice(-2) + '/' + ('0' + d).slice(-2) + '/' + y;
                if (heat) {
                    if ($.inArray(compareDate, blackoutdates) != -1 || new Date() > date || shipdate > date) {
                       // console.log("blackoutdates --- ",$.inArray(compareDate, blackoutdates),compareDate);
                        return [false];
                    }
                    else{
                        day = date.getDay();
                        //console.log(" day ---",day);
                        if (day === 3 || day === 4 || day === 5 || day === 6 || day === 0) {
                            return [false];
                        } else {
                            return [true];
                        }
                    }   
                } else {
                    if ($.inArray(compareDate, blackoutdates) != -1 || new Date() > date || shipdate > date) {
                        return [false];
                    }
                    else{
                        day = date.getDay();
                        if (day === 6 || day === 0) {
                            return [false];
                        } else {
                            return [true];
                        }
                    }
                    
                }
            }
        },
        datePicker: function() {
            var date = new Date();
            var businessdays = 2;
            var restDates = Hypr.getThemeSetting('shipping_date') ? Hypr.getThemeSetting('shipping_date') : "01/01/2019,02/18/2019,05/27/2019,07/04/2019,05/25/2020" ;
            //var blackoutdates = restDates.split(',');
            var blackoutdates = window.blockedShippingDates;
            var day, month, year, fulldate, currentDate, comparedate;
            while (businessdays) {
                date.setFullYear(date.getFullYear(), date.getMonth(), (date.getDate() + 1));
                day = date.getDay();
                month = date.getMonth();
                year = date.getFullYear();
                currentDate = date.getDate();
                fulldate = ('0' + (month + 1)).slice(-2) + '-' + ('0' + currentDate).slice(-2) + '-' + year;
                comparedate = ('0' + (month + 1)).slice(-2) + '/' + ('0' + currentDate).slice(-2) + '/' + year;


                if (day === 0 || day === 6 || blackoutdates.indexOf(comparedate) !== -1 || new Date() > comparedate) {
                    date.setFullYear(year, month, currentDate);
                } else {
                    businessdays--;
                }
            }
            date.setFullYear(year, month, (date.getDate()));
            var finaldate = ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + '-' + date.getFullYear();
            $('.earliest-date span').text(finaldate);
            //$('#interval-startdate').datepicker("setDate",final);
            return finaldate;
        },
        heatSensitvieDatePicker: function() {
            var date = new Date();
            var businessdays = 2;
            var restDates = Hypr.getThemeSetting('shipping_date') ? Hypr.getThemeSetting('shipping_date') : "01/01/2019,02/18/2019,05/27/2019,07/04/2019,05/25/2020" ;
            //var blackoutdates = restDates.split(',');
            var blackoutdates = window.blockedShippingDates;
            var day, month, year, currentDate, comparedate;
            while (businessdays) {
                date.setFullYear(date.getFullYear(), date.getMonth(), (date.getDate() + 1));
                day = date.getDay();
                month = date.getMonth();
                year = date.getFullYear();
                currentDate = date.getDate();
                // fulldate= ('0'+(month+1)).slice(-2)+ '-' + ('0'+currentDate).slice(-2) + '-' + year;
                comparedate = ('0' + (month + 1)).slice(-2) + '/' + ('0' + currentDate).slice(-2) + '/' + year;

                if (day === 0 || day === 6 || day === 3 || day === 4 || day === 5 || blackoutdates.indexOf(comparedate) !== -1) {
                    date.setFullYear(year, month, (currentDate));
                } else {
                    businessdays--;
                }
            }
            date.setFullYear(year, month, (currentDate));
            var finaldate = ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + '-' + date.getFullYear();
            $('.earliest-date span').text(finaldate);
            return finaldate;
        },
        isHeatSensitive: function() {
            var heatSensitiveEnabled = Hypr.getThemeSetting('heatsensitive') ? Hypr.getThemeSetting('heatsensitive') : true;
            if (heatSensitiveEnabled) {
                var items = this.model.get('SubScriptionItemsList');
                var heatCount = 0;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if(item.IsHeatSensitive && item.IsHeatSensitive.values && item.IsHeatSensitive.values.length > 0 && item.IsHeatSensitive.values[0].value){
                        heatCount++;
                    }
                }
                if (heatCount > 0) {
                    return true;
                } else return false;

            } else {
                return false;
            }
        },
        loopInpopup:function(ele){
            if(ele){
                window.inputs = $(document).find("."+ele).find('button,[tabindex="0"],a,input');
            }
            else
            window.inputs = $(document).find('.popup .popup-body').find('button,[tabindex="0"],a,input,span');
            
            window.firstInput = window.inputs.first();
            window.lastInput = window.inputs.last(); 
            
            // if current element is last, get focus to first element on tab press.
            window.lastInput.on('keydown', function (e) {
               if ((e.which === 9 && !e.shiftKey)) {
                   e.preventDefault();
                  window.firstInput.focus(); 
               }
            });
            /*
            window.lastInput[0].addEventListener('keydown', function (e) {
                if ((e.which === 9 && !e.shiftKey)) {
                    e.preventDefault();
                   window.firstInput.focus(); 
                }
             });
            */
            // if current element is first, get focus to last element on tab+shift press.
            window.firstInput.on('keydown', function (e) {
                if ((e.which === 9 && e.shiftKey)) {
                    e.preventDefault();
                    window.lastInput.focus();  
                }
            }); 
           // console.log("window.inputs----",window.inputs);
           // console.log(" window.lastInput --- ",window.lastInput);
        },
        loadMoreProducts:function(e){
            var catId = this.model.get("currentCategoryId");
            var startIndex = this.model.get("startIndex");
            var pageSize = this.model.get("pageSize");
            this.getProductsByCategory(catId,parseInt(startIndex+pageSize),pageSize,true,true);
            e.preventDefault();
        },
        loadMoreProductsMobile:function(e){
            var catId = this.model.get("currentCategoryId");
            var startIndex = this.model.get("startIndex");
            var pageSize = this.model.get("pageSize");
            var categoryCode = $(e.target).attr('data-mz-attr');
            this.getProductsByCategory(catId,parseInt(startIndex+pageSize),pageSize,true,categoryCode,true);     

        },
        loadAllProducts:function(e){
            var catId = this.model.get("currentCategoryId");
            var startIndex = this.model.get("startIndex");
            var pageSize = this.model.get("pageSize");
            var totalCnt =  this.model.get("totalCount");
            this.getProductsByCategory(catId,parseInt(startIndex+pageSize),totalCnt,true);
            e.preventDefault();
           // e.stoppro
        },
        loadAllProductsMobile:function(e){
            var catId = this.model.get("currentCategoryId");
            var startIndex = this.model.get("startIndex");
            var pageSize = this.model.get("pageSize");
            var totalCnt =  this.model.get("totalCount");
            var categoryCode = $(e.target).attr('data-mz-attr');
            this.getProductsByCategory(catId,parseInt(startIndex+pageSize),totalCnt,true,categoryCode,true);     

        },
        getBlockOutDates :function(){
            var items = [];
            var _this = this;
            $.each($('[data-mz-productcode]'),function(i,v){
                if(items.length> 0 && items.indexOf($(v).attr('data-mz-productcode'))<0){
                    items.push($(v).attr('data-mz-productcode'));
                }else if(items.length<1){
                    items.push($(v).attr('data-mz-productcode'));
                }
            });
            if(items.length === 0)
             items = ["20027","62030","1745","5365","4015","20026","1540","1715","1271","66120","1252","1245","1025","5337","20025","1078","1415","1295","1405","66155","52820","52989","52923","52895","1015","52825","f001","52973","52942","52956","111000","zero1234","BryanBundle","b0002","b0003","b0004","VCRVRK03-BNDL","VSBDSPLY01-BNDL","Test123","61800","66340","62213","7000442","f0001","VSB01-BNDL","SB_001","SB_002","SB_003"];
            var apiResult = {dates:[],isSuccess:false,blockoutDates:[]};
            api.request("post","svc/shippingdate",{data:items}).then(function(result){
                console.log( " result ---",result);
                var formatedDates = window.formatApiData(result);
                window.blockedShippingDates = formatedDates;
                window.getDatesItems = result.Items;
                _this.dateSelector();
                return (apiResult);
            },function(er){
                console.log("error ---",er);
             return (apiResult);
            });
        },
        setProductlistFocus:function(){
           // $(window).scrollTop($(".product-list").offset().top - 500);
           // $(".product-list").focus();
        },
        initialize: function () {
            console.log(" alter changes");
            this.getBlockOutDates();
         },
        render : function(){
            var me = this;
            Backbone.MozuView.prototype.render.apply(this);
            var currentUser = require.mozuData("user");
            if(currentUser.isAnonymous){
                console.log("yes user is guest ");
                window.location.href = "/user/login?returnURL=subscription";
            }
            if(window.blockedShippingDates && window.blockedShippingDates.length>0)
                this.dateSelector();

            if(this.model.get('isFirstPopup')){
                $(document).find('.popup-content').focus();
            }

        } 
    });
    $(document).ready(function() {
        var QOModel = Backbone.MozuModel.extend({}); 
        var showpopup = $.cookie("ClosefirstPopup");
        console.log("$.cookie('subscriptionData')",$.cookie('subscriptionData'));
        var shippingThrashold = Hypr.getThemeSetting('freeshippingBoundingValue');
    
        var dateObj = new Date();
        var month = dateObj.getMonth() +1 ;  
        var day = String(dateObj.getDate()).padStart(2, '0');
        var year = dateObj.getFullYear();
        var output = month  + '-'+ day  + '-' + year;
        var myObj = {
            'howOften' : 1,
            'weeks' : true,
            'years' : false,
            'when' : output, 
            'howLong' : "until i cancel" 
        };
        //if(typeof $.cookie("subscriptionCreated") !== 'undefined' && $.cookie("subscriptionCreated") == 'true'){
            if(typeof $.cookie("subscriptionData") !== 'undefined'){
            var myval = JSON.parse($.cookie("subscriptionData"));
            myObj = {
                'howOften' : myval.howOften,
                'weeks' : myval.weeks,
                'years' : myval.months ? myval.months : myval.years,
                'when' : myval.when, 
                'howLong' : myval.howLong
            };
            window.shipdate = myval.when;
            console.log(" window.shipdate ---- ",window.shipdate);
        }
        var dataVal = {
            'Data' : myObj,
            'singnupopoup' : {
                'isEnabled' : false,
                'signup' : false,
                'login' : true
            } 
        };
        var popupData = {
            "isEnabled" : false,
            "message" : "You can subscribe to this item (and others) to get regular deliveries on your own schedule! Click below to start the process.",
            "adamessage" : "You can subscribe to this item (and others) to get regular deliveries on your own schedule! Click below to start the process.",
            "buttons" : [
                {
                    "buttonLabel" : "Cancel",
                    "action" : "closePopup",
                    "class" : "cancel"   
                },
                {
                    "buttonLabel" : "Get Started",
                    "action" : "getStarted",
                    "class" : "Get-Started"
                }
            ]
        };
        var myModel = {
            "isFirstPopup" : false,
            "headBar" : true,
            "searchQuery" : "",
            "searchResult" : [],
            "isSearchenabled" : false,
            "SubScriptionItemsList" : [],
            "categoryList": [],
            "total" : 0, 
            "subtotal" : 0, 
            'isMobile' : $(window).width() < 768 ? true : false,
            'isTablet' : $(window).width() < 1025 && $(window).width() > 767 ? true : false,
            'isDesktop' : $(window).width() > 1024 ? true : false,
            'isPotreate' : $(window).width() < $(window).height() ? true : false,
            'isLandscape' : $(window).width() > $(window).height() ? true : false,
            'isMobileShowSummary' : true,
            'subscriptionData' : dataVal,
            'popupData' : popupData,
            'remaingAmount' : 0,
            'shippingThrashold' : shippingThrashold,
            'activeCategoryList' : 0
        };
        console.log("myModel ----",myModel);
         modelRapidOrder = window.modelRapidOrder = new reapidOrder({
            el: $('#subscription-body'),
            model: new QOModel(myModel)
        });
        modelRapidOrder.render();
        var urlParams = modelRapidOrder.getUrlParams(window.location.href);
        console.log(urlParams);
        var preSelcectedProduct = urlParams && urlParams.productCode ? urlParams.productCode :null;
        var preSelectedQty = urlParams && urlParams.qty ? urlParams.qty :null;
        var subscriptionId = urlParams && urlParams.subscriptionId ? urlParams.subscriptionId :null;
        window.showGlobalOverlay();
        modelRapidOrder.model.set('isFirstPopup',showpopup && showpopup == 'true' ? false : true);
        setTimeout(function(){
            var products = [];
             if(subscriptionId){
                modelRapidOrder.getSubscriptionData(subscriptionId);
            }
            else{
                if(preSelcectedProduct && preSelectedQty){
                    products = [{"skuCode":preSelcectedProduct,"qty":parseInt(preSelectedQty)}];
                }
                modelRapidOrder.getSubscriptionPageData(products);
            }
          // $.cookie("subscriptionCreated", false, { path: '/'});
           $.cookie("editsubscriptionId", null, { path: '/'});
        },1000);

        

        $(document).on('click', function(e){
            if((!$(e.target).hasClass('search-box-cointainer')) && $(e.target).parents('.search-box-cointainer').length === 0 && $(document).find('.suggetion-item').length > 0){
                modelRapidOrder.closeSearchOverlay();   
            }
        });
       /* $(window).on('load', function() {
            console.log(" window on load ");
            setTimeout(function(){
                if(typeof $.cookie("subscriptionData") != "undefined") {
                    var prevDate = JSON.parse($.cookie("subscriptionData")).when;
                    console.log(" prev Date ",prevDate);
                    window.shipdate = prevDate;
                    $("#interval-startdate").val(prevDate);
                }
            },2000);
        });*/

        if(myModel && myModel.isFirstPopup){
            setTimeout(function(e){
                $(document).find('.first-popup .popup-content').focus();
                modelRapidOrder.loopInpopup("first-popup");
            },500);
           
        }

        $(window).on('resize orientationchange', function(e){
            console.log(" event resize",window);
            modelRapidOrder.model.set('isMobile',$(window).width() < 768 ? true : false);
            modelRapidOrder.model.set('isTablet',$(window).width() < 1025 && $(window).width() > 767 ? true : false);
            modelRapidOrder.model.set('isDesktop',$(window).width() > 1024 ? true : false);
            modelRapidOrder.model.set('isPotreate',$(window).width() < $(window).height() ? true : false);
            modelRapidOrder.model.set('isLandscape',$(window).width() > $(window).height() ? true : false);
            modelRapidOrder.render();
          });

        wireUpEvents();
    });

    window.valid=true;
    function wireUpEvents() {

        window.addEventListener("pagehide",function(event){
            if(!window.valid){
                window.event.cancelBubble = true;
                event.persisted = true;
            }
            return event;
        },false);

        window.addEventListener("beforeunload",function(event){
            console.log("sdsdsd ",window.valid);
            if(!window.valid){
                window.event.cancelBubble = true;
                var msg;
                msg = "You're leaving the page, do you really want to?";
                event = event || window.event;
                event.returnValue = msg;
               
            }
            return event;
        },false);
        document.addEventListener('visibilitychange', function () {
            // code goes here
            console.log("document.hidden ---",document.hidden);
           // alert(document.hidden);
          }, false);
 }
    
});
