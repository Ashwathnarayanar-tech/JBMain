define([
    "modules/jquery-mozu",
    "hyprlive",
    "modules/backbone-mozu",
    "underscore",
    "modules/api",
    "modules/models-cart",
    'modules/cart-monitor',
    'modules/minicart',
    "modules/models-cart",
    "vendor/jquery-ui.min"
], function($, Hypr, Backbone, _, api, CartModels, CartMonitor, MiniCart, CartModels) {
    var reapidOrder = Backbone.MozuView.extend({
        templateName: "modules/subscription",
        additionalEvents: {
            "keyup .searchBoxSub" : "search",
            //"click .side-bar-item" : "changeCatList",
            "click .accordian-headitem" : "changeCatList",
            "click .increment" : "increment",
            "click .decrement" : "decrement",
            "click .span-tabs" : "changeWeekorMonth",
            "click .removeItem" : "removeFromList",
            "click .clearList" : "showClearPopUp",
            "click .create-subscription" : "createsubbtnClick",
            "click .summary-accordian" : "showMobSummary",
            "change .how-long-val" :"setHowLongVal",
            "change .how-often-val" :"setHowOffenVal",
            "change .quantity-sub" :"changeQuantity"
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
            setTimeout(function(){
                console.log(" flag ---",flag);
                if(flag){
                    $(".subscription").focus();
                    //$(".itemListTotal-bottom").focus();
                }
            },500)
        },
        setHowLongVal:function(){
            this.model.get('subscriptionData').Data.howLong = $(document).find('.how-long-val').val();
        },
        setHowOffenVal:function(){
            this.model.get('subscriptionData').Data.howOften = $(document).find('.how-often-val').val();
        },
        createsubbtnClick : function(){
            var self = this;
            if(MiniCart.MiniCart.model.get('items').length){
                if($.cookie("subscriptionCreated") && $.cookie("subscriptionCreated") == "true"){
                    this.addtoCartAndProcudeToCheckout();
                }else{
                    var popupData = {
                        "isEnabled" : true,
                        "message" : "We can't mix Subscription and non-Subscription items at this time. Do you want to Subscribe to everything you have in the Cart?",
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
                }
            }else{
                var addToCartProducts = [], self = this;
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
                }          
                api.request('POST', 'svc/subscriptionpage', data).then(function(res){
                    console.log(res);
                    CartMonitor.update();
                   // MiniCart.MiniCart.showMiniCart(window.targetFocusEl);
                    $.cookie("subscriptionCreated", true, { path: '/'});
                    $.cookie("subscriptionData", JSON.stringify(self.model.get('subscriptionData').Data), { path: '/'});
                    self.redirectTosubCheckout();  
                });
                // $.cookie("subscriptionCreated", true, { path: '/'});
                // $.cookie("subscriptionData", JSON.stringify(self.model.get('subscriptionData').Data), { path: '/'});
                // self.redirectTosubCheckout();  
            }
        },
        removeCItemsandPTocheckoutotherpp : function(){
            var popupData = {
                "isEnabled" : true,
                "message" : "Proceeding will ignore the previous Subscription List and allow you to purchase newly created subscription list",
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
        },
        removeCItemsandPTocheckoutpp : function(){
            var popupData = {
                "isEnabled" : true,
                "message" : "To create a Subscription, you may have only Subscription items in the Cart. Do you want to remove the non-subscription items from the Cart and proceed to Checkout?",
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
        },
        oneMoreppIgnoreSubscription: function(){
            var popupData = {
                "isEnabled" : true,
                "message" : "Proceeding will ignore your Subscription List and allow you to purchase your At Once item(s)",
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
        },
        gotonormalCheckout: function(){
            var cartModel = new CartModels.Cart(), self = this;
            try{
                $.cookie("subscriptionCreated", '', { path: '/'});
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
            }
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
                }          
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
            var itemsinsublist = this.model.get('SubScriptionItemsList');
            if(itemsinsublist.length){
                var popupData = {
                    "isEnabled" : true,
                    "message" : "Are you sure you want to clear the subscription list?",
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
            }     
        },
        closePopupdynamic : function(){
            var popupData = {
                "isEnabled" : false,
                "message" : "Are you sure you want to clear the subscription list?",
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
           // return;     
        }, 
        clearList : function(e){
            var catList = this.model.get('categoryList');
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
                this.model.set('total', 0);
                this.model.set('popupData', popupData); 
                if(typeof $.cookie("subscriptionCreated") !== 'undefined' && $.cookie("subscriptionCreated") == 'true'){
                    MiniCart.MiniCart.clearCart();
                    setTimeout(function(){ 
                        $.cookie("subscriptionCreated", false);
                    },2000);
                }
                this.render(); 
            }
        },
        removeFromList : function(e){
            var productCode = $(e.currentTarget).attr('mz-data-attr');
            var catList = this.model.get('categoryList');  
            var addedproductIds = [];
            var itemsinsublist = this.model.get('SubScriptionItemsList');
            itemsinsublist.filter(function(v,i){
                addedproductIds.push(v.productCode);
            });
            newLisr = catList.filter(function(v,i){
                v.Items.map(function(a,b){
                    if(a.productCode == productCode && addedproductIds.indexOf(a.productCode) > -1){
                        a.isSelected = false;
                        a.selectedData.Qty = 1; 
                        var qty =1;
                        a.total = a.price.salePrice && a.price.salePrice <  a.price.price ? qty*a.price.salePrice : qty*a.price.price;    
                        itemsinsublist.splice(addedproductIds.indexOf(a.productCode),1);   
                        addedproductIds.splice(addedproductIds.indexOf(a.productCode),1);
                    }else if(a.productCode == productCode){
                        a.isSelected = false;
                        a.selectedData.Qty = 1;
                        var qty =1;
                        a.total = a.price.salePrice && a.price.salePrice <  a.price.price ? qty*a.price.salePrice : qty*a.price.price;    
                    }  
                });
                return true;
            });
            this.model.set('categoryList', newLisr);
            this.model.set('SubScriptionItemsList',itemsinsublist);
            this.model.set('total', this.calculateTotal(itemsinsublist));

            this.render();
        },
        changeWeekorMonth : function(e){
            $(e.target).attr('data-mz-value');
            this.model.get('subscriptionData').Data.weeks = $(e.target).attr('data-mz-value') == "weeks" ? true : false;
            this.model.get('subscriptionData').Data.years = $(e.target).attr('data-mz-value') == "months" ? true : false;
            this.render();   
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
            this.model.set('total', this.calculateTotal(subscriptionList));
            var shippingThrashold = Hypr.getThemeSetting('freeshippingBoundingValue');
            this.model.set('remaingAmount', (shippingThrashold-parseFloat(this.calculateTotal(subscriptionList))).toFixed(2));
            this.render();    
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
            this.model.set('total', this.calculateTotal(subscriptionList));
            var shippingThrashold = Hypr.getThemeSetting('freeshippingBoundingValue');
            this.model.set('remaingAmount', (shippingThrashold-parseFloat(this.calculateTotal(subscriptionList))).toFixed(2));
            this.render();
        },
        updateQuantityChanges : function(productCode,qty){
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
            this.model.set('total', this.calculateTotal(subscriptionList));
            var shippingThrashold = Hypr.getThemeSetting('freeshippingBoundingValue');
            this.model.set('remaingAmount', (shippingThrashold-parseFloat(this.calculateTotal(subscriptionList))).toFixed(2));
            this.render();
        },
        changeQuantity:function(e){
            var productCode = $(e.target).attr('data-mz-productcode');
            var qty = parseInt($(e.target).val()) >=1 && parseInt($(e.target).val()) <=25 ?  parseInt($(e.target).val()) : 1; 
            $(e.target).val(qty);
            console.log(" productCode --- ",productCode,qty);
            var _this = this;
            setTimeout(function(){
                _this.updateQuantityChanges(productCode,qty);
            },500);

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
            this.model.set('total', this.calculateTotal(itemsinsublist));
            var shippingThrashold = Hypr.getThemeSetting('freeshippingBoundingValue');
            this.model.set('remaingAmount', (shippingThrashold-parseFloat(this.calculateTotal(itemsinsublist))).toFixed(2));
            this.render();
        },
        addtoList : function(e){
            var productCode = $(e.target).attr('data-mz-attribute');
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
            this.model.set('total', this.calculateTotal(itemsinsublist));
            var shippingThrashold = Hypr.getThemeSetting('freeshippingBoundingValue');
            this.model.set('remaingAmount', (shippingThrashold-parseFloat(this.calculateTotal(itemsinsublist))).toFixed(2));
            this.render();
        },
        changeCatList : function(e){
            var categoryCode = $(e.target).attr('data-mz-attr'); 
            var catList = this.model.get('categoryList').filter(function(v,i){
                if(v.Category.categoryCode == categoryCode && !v.isActive){
                    v.isActive = true;
                }else{
                    v.isActive = false;
                }
                return true;
            });  
            this.model.set('categoryList', catList); 
            this.render();
        },
        search : _.debounce(function (e){
            var self = this;
            var query = $(e.target).val();
            var addedproductIds = [], qtyArray = [];
            var itemsinsublist = this.model.get('SubScriptionItemsList');
            itemsinsublist.filter(function(v,i){
                addedproductIds.push(v.productCode);
                qtyArray.push(v.selectedData.Qty);
            });
            this.model.set('searchQuery', query);
            if(query.length >= 3){
                var body = {
                    "funName" : "search",
                    "query" : query
                };
                api.request('post', "svc/subscriptionpage", body).then(function(result){
                    var mySearch = [];
                    console.log("result", result);
                    result.filter(function(v,i){
                        var heatObj = {};
                        v.suggestion.properties.filter(function(a,b){
                            if(a.attributeFQN == "tenant~IsHeatSensitive"){
                                heatObj = a;
                            }
                        });
                        var temp = {
                            "name" : v.suggestion.content.productName,
                            "productCode" : v.suggestion.productCode,
                            "image" : v.suggestion.content.productImages[0],
                            "price" : v.suggestion.price,
                            "purchasableState" : v.suggestion.purchasableState,
                            "inventoryInfo" : v.suggestion.inventoryInfo,
                            "IsHeatSensitive" : heatObj,
                            "isSelected" : addedproductIds.indexOf(v.suggestion.productCode) > -1 ? true : false,
                            "total" : (addedproductIds.indexOf(v.suggestion.productCode) > -1) ? v.suggestion.price.salePrice && v.suggestion.price.salePrice <  v.suggestion.price.price ? qtyArray[addedproductIds.indexOf(v.suggestion.productCode)]*v.suggestion.price.salePrice : qtyArray[addedproductIds.indexOf(v.suggestion.productCode)]*v.suggestion.price.price : v.suggestion.price.salePrice && v.suggestion.price.salePrice <  v.suggestion.price.price ? 1*v.suggestion.price.salePrice : 1*v.suggestion.price.price,
                            "selectedData" : {
                                "Qty" : addedproductIds.indexOf(v.suggestion.productCode) > -1 ? qtyArray[addedproductIds.indexOf(v.suggestion.productCode)] : 1
                            }
                        };
                        mySearch.push(temp);
                    });
                    self.model.set('isSearchenabled', true);
                    self.model.set('searchResult', mySearch); 
                    self.render();   
                },function(error){
                    console.log("Error getting search result", error);
                });
            }
        },1000), 
        closeSearchOverlay : function(){
            this.model.set('isSearchenabled', false);
            this.model.set('searchResult', []); 
            this.render();     
        },
        closePopup : function(){
            $.cookie("ClosefirstPopup",true);
            this.model.set('isFirstPopup', false);
            this.render();
        },
        removeBar : function(){
            this.model.set('headBar', false);
            this.render(); 
        },
        calculateTotal : function(itemsinsublist){
            var total = 0;
            itemsinsublist.filter(function(v,i){
                total += v.total;
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
            }catch (e) { 
                console.warn(e);
            }
        },
        getUrlParams:function(url){
        var regex = /[?&]([^=#]+)=([^&#]*)/g,params = {},match;
          while (match = regex.exec(url)) {
            params[match[1]] = match[2];
          }
          return params;
        },
        getSubscriptionPageData:function(preSelectedProducts){
         if(typeof $.cookie("subscriptionCreated") !== 'undefined' && $.cookie("subscriptionCreated") == 'true' && ((preSelectedProducts.length === 0 && MiniCart.MiniCart.model.get('items').length >0) || (MiniCart.MiniCart.model.get('items').length > preSelectedProducts.length ))){
            var cartItems = MiniCart.MiniCart.model.apiModel.data.items;
            console.log(" cartItems",cartItems);
            for(var i=0;i<cartItems.length;i++){
                var item = cartItems[i];
                 var product = {"skuCode":item.product.productCode,"qty":item.quantity};
                preSelectedProducts.push(product);
            }
         }

            var body = {
                "funName" : "getcatprods"
            };

        api.request('post', "svc/subscriptionpage", body).then(function(result){
                var myResult = [], dataPCodes = [];
                var preSelecteArray = [], grandtotal = 0;;
                result.items.filter(function(v,i){
                    var myTemp = {
                        "Category" : v.category[0],
                        "Items" : [],
                        "isActive" : (i === 0 && !($(window).width() < 768)) ? true : false,
                        "isAllSelected" : false
                    };
                    v.items.filter(function(m,n){
                        var heatObj = {};
                        m.properties.filter(function(a,b){
                            if(a.attributeFQN == "tenant~IsHeatSensitive"){
                                heatObj = a;
                            } 
                        });
                        var preSelcectedProduct =null,preSelectedQty=null;
                            console.log("preSelectedProducts --- ",preSelectedProducts);
                            for(var l=0;l<preSelectedProducts.length;l++){
                                if(preSelectedProducts[l].skuCode === m.productCode  && dataPCodes.indexOf(m.productCode) == -1){
                                     preSelcectedProduct = preSelectedProducts[l].skuCode;
                                     preSelectedQty = preSelectedProducts[l].qty;
                                    break;
                                }
                            } 
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
                                console.log("preSelcectedProduct ----",preSelcectedProduct,m.productCode);
                               // 
                                if(preSelcectedProduct && preSelcectedProduct == m.productCode){
                                    dataPCodes.push(m.productCode);
                                    preSelecteArray.push(temp);
                                }
                                myTemp.Items.push(temp);  
                          
                    });
                    myResult.push(myTemp); 
                });
                console.log(" preSelecteArray ---- ",preSelecteArray);
                modelRapidOrder.model.set('SubScriptionItemsList', preSelecteArray);
                modelRapidOrder.model.set('total', modelRapidOrder.calculateTotal(preSelecteArray));
                var shippingThrashold = Hypr.getThemeSetting('freeshippingBoundingValue');
                modelRapidOrder.model.set('remaingAmount', (shippingThrashold-parseFloat(modelRapidOrder.calculateTotal(preSelecteArray))).toFixed(2)); 
                modelRapidOrder.model.set('categoryList', myResult); 
                modelRapidOrder.render();  
                setTimeout(function(){
                   var subData =  modelRapidOrder.model.get('subscriptionData');
                   if(subData && subData.Data){
                        $('#interval-startdate').datepicker("setDate", subData.Data.when);
                        $('#interval-startdate').val(subData.Data.when);
                   } 
                },1000);  
            },function(error){
                console.log("Error getting search result", error);
            });
        },
        getSubscriptionData:function(subscriptionId){
            api.request('POST', 'svc/getSubscription',{method:"GET",subscriptionId:subscriptionId}).then(function(res) {
            if (!res.error &&  res.res.subscriptionId !== undefined) {
               var products = [];
               var result = res.res;
               for(var i=0;i<result.order.items.length;i++){
                var item = result.order.items[i];
                var product = {"skuCode":item.product.productCode,"qty":item.quantity};
                products.push(product);
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
                modelRapidOrder.getSubscriptionPageData(products);
            }
               
        }, function(er) {
            // fail condition
            console.log("Data error " + er);
        });
        },
        dateSelector: function() {
            var finaldate;
            var heat;
            var finalDate;
            var me = this;
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
                var blackoutdates = restDates.split(',');
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
                    for (var i = 0; i < blackoutdates.length; i++) {
                        if ($.inArray(compareDate, blackoutdates) != -1 || new Date() > date || shipdate > date) {
                            return [false];
                        }
                    }
                    day = date.getDay();
                    if (day === 3 || day === 4 || day === 5 || day === 6 || day === 0) {
                        return [false];
                    } else {
                        return [true];
                    }
                } else {
                    for (var j = 0; j < blackoutdates.length; j++) {
                        if ($.inArray(compareDate, blackoutdates) != -1 || new Date() > date || shipdate > date) {
                            return [false];
                        }
                    }
                    day = date.getDay();
                    if (day === 6 || day === 0) {
                        return [false];
                    } else {
                        return [true];
                    }
                }
            }
        },
        datePicker: function() {
            var date = new Date();
            var businessdays = 2;
            var restDates = Hypr.getThemeSetting('shipping_date') ? Hypr.getThemeSetting('shipping_date') : "01/01/2019,02/18/2019,05/27/2019,07/04/2019,05/25/2020" ;
            var blackoutdates = restDates.split(',');
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
            var blackoutdates = restDates.split(',');
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
        render : function(){
            Backbone.MozuView.prototype.render.apply(this);
            var currentUser = require.mozuData("user");
            if(currentUser.isAnonymous){
                console.log("yes user is guest ");
                window.location.href = "/user/login"

            }
            this.dateSelector();
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
            'howLong' : "untill i cancel" 
        };
        if(typeof $.cookie("subscriptionCreated") !== 'undefined' && $.cookie("subscriptionCreated") == 'true'){
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
            "isFirstPopup" : showpopup && showpopup == 'true' ? false : true,
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
            'isMobileShowSummary' : false,
            'subscriptionData' : dataVal,
            'popupData' : popupData,
            'remaingAmount' : 0,
            'shippingThrashold' : shippingThrashold
        };
        var modelRapidOrder = window.modelRapidOrder = new reapidOrder({
            el: $('#subscription-body'),
            model: new QOModel(myModel)
        });
        modelRapidOrder.render();
        var urlParams = modelRapidOrder.getUrlParams(window.location.href);
        console.log(urlParams);
        var preSelcectedProduct = urlParams && urlParams.productCode ? urlParams.productCode :null;
        var preSelectedQty = urlParams && urlParams.qty ? urlParams.qty :null;
        var subscriptionId = urlParams && urlParams.subscriptionId ? urlParams.subscriptionId :null;
        setTimeout(function(){
            var products = [];
             if(subscriptionId){
                modelRapidOrder.getSubscriptionData(subscriptionId);
            }
            else{
                if(preSelcectedProduct && preSelectedQty){
                    products = [{"skuCode":preSelcectedProduct,"qty":preSelectedQty}];
                }
                modelRapidOrder.getSubscriptionPageData(products);
            }
          // $.cookie("subscriptionCreated", false, { path: '/'});
           $.cookie("editsubscriptionId", null, { path: '/'});
        },1000);

        

        $(document).on('click', function(e){
            if((!$(e.target).hasClass('search-box-cointainer')) && $(e.target).parents('.search-box-cointainer').length == 0 && $(document).find('.suggetion-item').length > 0){
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

        wireUpEvents();
    });

    window.valid=false;
    function wireUpEvents() {
        if(window.valid){
            alert("Page Refreshed or Redirected");
        }else{
            window.onbeforeunload = askWhetherToClose;
        }
    function askWhetherToClose(event) {
        if(!window.valid){
            var msg;
            msg = "You're leaving the page, do you really want to?";
            event = event || window.event;
            event.returnValue = msg;
            return msg;
        }
    }
 }
    
});
