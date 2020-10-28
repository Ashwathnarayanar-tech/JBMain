/* jshint scripturl: true */
/* global POWERREVIEWS */

define(['modules/jquery-mozu','underscore', 'hyprlive', "modules/backbone-mozu", "modules/models-product", "modules/api", 'modules/models-orders', 'hyprlivecontext'],
    function($, _, Hypr, Backbone, ProductModels, Api, OrderModels, HyprLiveContext) {
      var returnUrl = window.location.href;

      var mzPowerReview = {
        getpageID: function(){
            var currentProduct = require.mozuData("product");  
            var currentPageId = ""; 
            var pageIds = {
              92581: "JUICY-PEAR",
              72581: "JUICY-PEAR",  
              92580: "GREEN-APPLE",  
              72580: "GREEN-APPLE",
              92593: "LEMON-LIME",
              72593: "LEMON-LIME",
              93594: "FRUIT-PUNCH",
              72594: "FRUIT-PUNCH",
              92595: "ASSORTED-FLAVORS",
              72595: "ASSORTED-FLAVORS",
              72686: "ASSORTED-FLAVORS",
              93596: "BERRY",
              72596: "BERRY",
              92597: "ORANGE",
              72597: "ORANGE",
              92582: "STRAWBERRY-BANANA-SMOOTHIE",
              72582: "STRAWBERRY-BANANA-SMOOTHIE",
              92598: "EXTREME-WATERMELON",
              72598: "EXTREME-WATERMELON",
              92599: "EXTREME-CHERRY",
              72599: "EXTREME-CHERRY",
              92584: "EXTREME-POMEGRANATE",
              72603: "EXTREME-POMEGRANATE",
              92583: "EXTREME-ASSORTED",
              72604: "EXTREME-ASSORTED",
              7001213: "JERSEY-BUTTERED-POPCORN",
              7001214: "JERSEY-BUTTERED-POPCORN",
              7001218: "JERSEY-BUTTERED-POPCORN",
              7001216: "JERSEY-BUTTERED-POPCORN",
              7001215: "JERSEY-BUTTERED-POPCORN",
              7001883: "JERSEY-VERY-CHERRY-RETRO",
              7001885: "JERSEY-VERY-CHERRY-RETRO",
              7001886: "JERSEY-VERY-CHERRY-RETRO",
              7001887: "JERSEY-VERY-CHERRY-RETRO",
              7001888: "JERSEY-VERY-CHERRY-RETRO",
              7002627: "JERSEY-TEAM-2017",
              7002628: "JERSEY-TEAM-2017",
              7002629: "JERSEY-TEAM-2017",
              7002630: "JERSEY-TEAM-2017",
              7001195: "JERSEY-BLUEBERRY",
              7001196: "JERSEY-BLUEBERRY",
              7001197: "JERSEY-BLUEBERRY",
              7001198: "JERSEY-BLUEBERRY",
              7001199: "JERSEY-BLUEBERRY",
              7001200: "JERSEY-BLUEBERRY",
              7001201: "JERSEY-GREEN-APPLE",
              7001202: "JERSEY-GREEN-APPLE",
              7001203: "JERSEY-GREEN-APPLE",
              7001204: "JERSEY-GREEN-APPLE",
              7001205: "JERSEY-GREEN-APPLE",
              7001206: "JERSEY-GREEN-APPLE",
              7001207: "JERSEY-TANGERINE",
              7001208: "JERSEY-TANGERINE",
              7001209: "JERSEY-TANGERINE",
              7001210: "JERSEY-TANGERINE",
              7001211: "JERSEY-TANGERINE",
              7001212: "JERSEY-TANGERINE",
              7001890: "JERSEY-ISLAND-PUNCH-RETRO",
              7001891: "JERSEY-ISLAND-PUNCH-RETRO",
              7001892: "JERSEY-ISLAND-PUNCH-RETRO",
              7001893: "JERSEY-ISLAND-PUNCH-RETRO",
              7001894: "JERSEY-ISLAND-PUNCH-RETRO",
              7001895: "JERSEY-ISLAND-PUNCH-RETRO",
              7001896: "JERSEY-SOUR-GRAPE-RETRO",
              7001897: "JERSEY-SOUR-GRAPE-RETRO",
              7001898: "JERSEY-SOUR-GRAPE-RETRO",
              7001899: "JERSEY-SOUR-GRAPE-RETRO",
              7001900: "JERSEY-SOUR-GRAPE-RETRO",
              7001901: "JERSEY-SOUR-GRAPE-RETRO",
              7001902: "JERSEY-SOUR-GRAPE-RETRO",
              7002508: "JERSEY-BEANBOOZLED",
              7002509: "JERSEY-BEANBOOZLED",
              7002510: "JERSEY-BEANBOOZLED",
              7002511: "JERSEY-BEANBOOZLED",
              7002512: "JERSEY-BEANBOOZLED",
              7001189: "JERSEY-VERY-CHERRY",
              7001190: "JERSEY-VERY-CHERRY",
              7001191: "JERSEY-VERY-CHERRY",
              7001192: "JERSEY-VERY-CHERRY",
              7001193: "JERSEY-VERY-CHERRY",
              7001194: "JERSEY-VERY-CHERRY",
              7000855: "WATER-BOTTLE-24OZ",
              7002609: "WATER-BOTTLE-24OZ"            
            };

            $.each(pageIds,function(k,v){
              if(currentProduct.productCode == k){
              //if(currentProduct.content.productName.toLowerCase().indexOf(k.toLowerCase()) >= 0){
                currentPageId = v;
              }
            });
            
            return currentPageId; 
         },
         getConfig: function() {
           return Api.get('entity', {
               listName: Hypr.getThemeSetting('powerReviewsSettingsList'),
               id: Api.context.site
           }).then(function(result){
             return result.data;
           });
         },
         getProductCode : function(config, product) {
           var pr_safe_code= product.productCode;
            if(config.regex) {
              pr_safe_code = pr_safe_code.replace(new RegExp(config.regex, "g"),"");              
           } 
           return pr_safe_code;
        },
         displayReviewsAnQA: function(config) {
           var self = this;
               var currentProduct = require.mozuData("product");
               var productCode = self.getProductCode(config, currentProduct);
               console.log(currentProduct);
               var product = {
                 name: currentProduct.content.productName,
                 url: window.location.protocol+"//"+window.location.host+currentProduct.url,
                 description: currentProduct.content.productShortDescription
               };

               if (currentProduct.price) {
                 product.price = currentProduct.price.price;
               } else if (currentProduct.priceRange) {
                  product.price = currentProduct.priceRange.lower.price;
               }
               if (currentProduct.upcs)
                 product.upc = currentProduct.upcs[0];

               if (currentProduct.mfgPartNumbers)
                  product.manufacturer_id = currentProduct.mfgPartNumbers[0];

               if (currentProduct.mainImage)
                   product.image_url = window.location.protocol+currentProduct.mainImage.imageUrl;

               var in_stock = 'True';
               if (currentProduct.inventoryInfo.manageStock && currentProduct.inventoryInfo.onlineStockAvailable === 0 && currentProduct.inventoryInfo.outOfStockBehavior === "")
                 in_stock = 'False';

               product.in_stock  = in_stock;
               if (currentProduct.categories)
               {
                 var primary = _.find(currentProduct.categories, function(category) {
                   return category.sequence === 1;
                 });
                 if (!primary) primary = currentProduct.categories[0];
                 if (primary)
                   product.category_name = primary.content.name; //"build category hierarchy";
               }

               if (currentProduct.properties) {
                 var brandProperty = _.find(currentProduct.properties, function(property){
                   return property.attributeFQN === "tenant~brand";
                 });
                 if (brandProperty)
                  product.brand_name  = brandProperty.values[0].stringValue; //Get from property
               }


               //TODO: add variants
               var components = {};
               if ($("#pr-reviewsnippet").length > 0) components.ReviewSnippet = "pr-reviewsnippet";
               if ($("#pr-reviewdisplay").length > 0) components.ReviewDisplay = "pr-reviewdisplay";
               if ($("#pr-qasnippet").length > 0) components.QuestionSnippet = "pr-qasnippet";
               if ($("#pr-qadisplay").length > 0) components.QuestionDisplay = "pr-qadisplay";
               if ($("#pr-wyb").length > 0) components.WhydYouBuyDisplay = "pr-wyb";
                var pageidhere = self.getpageID();
                var productCoden = "";
                if(pageidhere) productCoden = pageidhere; else productCoden = productCode;

                var prConfig = self.getPrConfig(config, productCoden);
                if ($("#reviewDisplayType").val() === "paging")
                  prConfig.REVIEW_DISPLAY_PAGINATION_TYPE="VERTICAL";
                else if ($("#reviewDisplayType").val() === "paging")
                  prConfig.REVIEW_DISPLAY_LIST_TYPE ='CONDENSED';
                else
                  prConfig.REVIEW_DISPLAY_SNAPSHOT_TYPE ='SIMPLE';

                prConfig.style_sheet = "/stylesheets/widgets/powerreview.css";
                prConfig.review_wrapper_url = '/write-a-review?pr_page_id='+currentProduct.productCode+'&locale='+config.locale+'&pr_returnUrl=' + returnUrl;
                prConfig.product = product;
                prConfig.components = components;

                POWERREVIEWS.display.render(prConfig);

         },
         displayRoi: function(config) {
            var self = this; 
           var order = require.mozuData('order');

               try {
                   var tracker = POWERREVIEWS.tracker.createTracker({
                       merchantGroupId: config.merchantGrpId
                   });
                   var customerId = "";
                   var firstName;
                   var lastName;
                   if (order.customerAccountId !== null)
                       customerId = order.customerAccountId;
                   if (order.fulfillmentInfo !== null && order.fulfillmentInfo.fulfillmentContact !== null) {
                       firstName = order.fulfillmentInfo.fulfillmentContact.firstName;
                       lastName = order.fulfillmentInfo.fulfillmentContact.lastNameOrSurname;
                   } else {
                       firstName = order.billingInfo.billingContact.firstName;
                       lastName = order.billingInfo.billingContact.lastNameOrSurname;
                   }

                   var items = [];
                   var item = {};

                   order.items.forEach(function(lineItem){
                     console.log(lineItem);
                     //var lineItem = order.items.models[i].attributes;
                     var pageidhere = self.getpageID();
                      var productCoden = '';
                      if(pageidhere) productCoden = pageidhere; else productCoden = self.getProductCode(config,lineItem.product.productCode);
                     item.pageId = productCoden;
                     item.unitPrice = lineItem.total;
                     item.qty = lineItem.quantity;
                     item.name = lineItem.product.name;
                     if (lineItem.product.imageUrl !== null)
                         item.imageURL = lineItem.product.imageUrl;
                     items.push(item);
                   });

                   tracker.trackPageview("c", {
                       merchantId: config.merchantId,
                       locale: config.locale,
                       merchantUserId: customerId,
                       marketingOptIn: order.acceptsMarketing,
                       userEmail: order.email,
                       userFirstName: firstName,
                       userLastName: lastName,
                       orderId: order.orderNumber,
                       orderSubtotal: order.total,
                       orderNumberOfItems: items.length,
                       orderItems: items
                       //orderDate: TODO
                   });

                 } catch(e){
                   console.log(e);
                 }

           if ($(".pr-wyb")) {
               var maxPriceItem = _.max(order.items, function(item) {
                 return item.total; 
               });
               //Get expensive items
               var pageidhere = self.getpageID();
                  var productCoden = '';
                  if(pageidhere) productCoden = pageidhere; else productCoden = self.getProductCode(config,maxPriceItem.product.productCode);
               POWERREVIEWS.display.render({
                 api_key: config.apiKey,
                 locale: config.locale,
                 merchant_group_id: config.merchantGrpId,
                 merchant_id: config.merchantId,
                 page_id: productCoden,
                 components: {
                   WhydYouBuy: 'pr-wyb'
                 }});
           }

           if ($("#includeSellerRatings").val() === "1") {
             var script = "(function(p, o, w, e, r) {"+
                  "p.POWERREVIEWS = p.POWERREVIEWS || {config: {}};"+
                  "p.POWERREVIEWS.config.merchant_id = "+config.merchantId+";"+
                  "p.POWERREVIEWS.config.page_id = '"+$("#sellerRatingPageId").val()+";"+
                  "p.POWERREVIEWS.config.locale = "+config.locale+";"+
                  "p.POWERREVIEWS.config.srwVariant = 'mini';"+
                  "r = o.getElementsByTagName('body')[0]; e = o.createElement('div');"+
                  "e.id = 'pr-srw-container'; e.className = 'p-w-r'; r.appendChild(e, r);"+
                  "if (!document.getElementById('pwr-ui')) {"+
                  "  e = o.createElement(w);"+
                  "  e.src = '//ui.powerreviews.com/stable/3.0/ui.js';"+
                  "  e.id = 'pwr-ui';"+
                  "  e.onload = function() {POWERREVIEWS.display.renderSRW;};"+
                  "  r.appendChild(e, r);"+
                  "}"+
                "}(window, document, 'script'))";

              $('<script>')
                            .attr('type', 'text/javascript')
                            .text(script)
                            .appendTo('head');
           }
         },
         displayInlineRatings: function(config) {
          var self = this;
           var allInlineRatings = $('.pr-inline-rating');
           console.log(allInlineRatings);
           var productReviews = allInlineRatings.map(function() {
              var productCode = $(this).data('mzProductCode');
              var pageidhere = self.getpageID();
              var productCoden = '';
              if(pageidhere) productCoden = pageidhere;  else productCoden = productCode;
              return {
                locale: config.locale,
                merchant_group_id: config.merchantGrpId,
                page_id: productCoden,
                merchant_id: config.merchantId,
                enable_client_side_structured_data: true,
                api_key: config.apiKey,
                review_wrapper_url: '/write-a-review?pr_page_id='+productCode+'&locale='+config.locale+'&returnUrl=' + returnUrl,
                components: {
                  CategorySnippet: 'pr-snippet-'+productCode
                }
              };
            }).get(); 
            console.log(productReviews);
                POWERREVIEWS.display.render(productReviews);
        },
        getPrConfig : function(config, pageId) {
          var prConfig = {
              api_key: config.apiKey,
              locale: config.locale,
              merchant_group_id: config.merchantGrpId,
              merchant_id: config.merchantId
           };

           if (pageId)
            prConfig.page_id =  pageId;

          return prConfig;
        }
      };



      $(document).ready(function() {
        var isProductDetail = $("#prProductDetail").val() == 1;
        var isROIWidget = $("#prROIWidget").val() == 1;

        mzPowerReview.getConfig().then(function(config){
          if (isProductDetail) {
            mzPowerReview.displayReviewsAnQA(config);
          } else if (isROIWidget) {
            mzPowerReview.displayRoi(config);
          } else {
            mzPowerReview.displayInlineRatings(config);
          }

        });
      });
});
