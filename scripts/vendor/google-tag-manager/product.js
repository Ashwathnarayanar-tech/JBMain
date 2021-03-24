require(["modules/jquery-mozu", "modules/api"],
  function($, api) {
    var pageContext = require.mozuData('pagecontext');
    var product = require.mozuData('product');
    // Measure a view of product details. This example assumes the detail view occurs on pageload, 
    // and also tracks a standard pageview of the details page. 
    window.dataLayer.push({
      'ecommerce': {
        'detail': {
          'products': [{
            'name': product.content.productName,
            'id': product.productCode,
            'price': product.price ? product.price.price : "",
            'brand': 'Jelly Belly',
            'category': product.categories.length ? product.categories[0].content.name : "",
            'variant': 'standard',
          }]
        }
      }
    }, {'event': 'productView'});

    $(document).on('click', '.gtm-add-to-cart', function(e) {
      console.log(product.content.productName);
      console.log($("#quantity").children(":selected").attr("value"));
      window.dataLayer.push({
        'event': 'addToCart',
        'ecommerce': {
          'currencyCode': '',
          'add': {
            'products': [{
              'name': product.content.productName,
              'id': product.productCode,
              'price': product.price?product.price.price:"",
              'brand': 'Jelly Belly',
              'category': product.categories.length ? product.categories[0].content.name:"",
              'variant': 'standard',
              'quantity': $("#quantity").children(":selected").attr("value")
            }]
          }
        }
      });

    });

    $(document).on('click', '.jb-add-to-cart-cur', function(e) {
      console.log(e);

      window.dataLayer.push({
        'event': 'addToCart',
        'ecommerce': {
          'currencyCode': '',
          'add': {
            'products': [{
              'name': e.target.getAttribute("data-mz-product-name"),
              'id': e.target.getAttribute("data-mz-prcode"),
              'price': e.target.getAttribute("data-jb-price"),
              'brand': 'Jelly Belly',
              'category': e.target.getAttribute("data-jb-category-name"),
              'variant': 'standard',
              'quantity': $(e.target.parentNode.parentNode).children(".mz-productdetail-conversion-controls").children(".quantity").children(":selected").attr("value") || 1
            }]
          }
        }
      });

    });
  });