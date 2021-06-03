define([
  "modules/jquery-mozu",
], function($) {
  // close modal if escape key is pressed
  $(document).keyup(function(e) {
    if (e.keyCode === 27)
      $('.Add-to-cart-popup .cross-close-popup').click();
  });
  $('.wishlist-section,#mz-drop-zone-rti-cart,.rec-prod-list-popup').on('change','.plpquantityinput',function(e){
        if(parseInt($(this).val()) > 1) {
            $(this).parent(".qty").addClass("qtydecrementenable");
        }  else {
            $(this).parent(".qty").removeClass("qtydecrementenable");
        }          
    });
    $('.wishlist-section,#mz-drop-zone-rti-cart,.rec-prod-list-popup').on('click','.plpquantitydicrement',function(e){
        var findQtyValue = $(this).parent(".qty").find("input");
       if(parseInt($(findQtyValue).val()) > 1) {
            $(this).parent(".qty").addClass("qtydecrementenable");
        }  else {
            $(this).parent(".qty").removeClass("qtydecrementenable");
        }          
    });
    
    $('.wishlist-section,#mz-drop-zone-rti-cart,.rec-prod-list-popup').on('click','.plpquantityincrement',function(e){
        var findQtyValue = $(this).parent(".qty").find("input");
        if(parseInt($(findQtyValue).val()) > 1) {
            $(this).parent(".qty").addClass("qtydecrementenable");
        }  else {
            $(this).parent(".qty").removeClass("qtydecrementenable");
        }          
    });
});
