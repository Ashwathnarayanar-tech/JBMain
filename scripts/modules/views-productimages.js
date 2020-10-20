// Changes Made By Amit on 26June for Read Review Issue at line No 114

define(['modules/jquery-mozu', 'underscore', "modules/backbone-mozu", 'hyprlive',
    'modules/modal','shim!vendor/jquery-colorbox/jquery.colorbox[jquery=jQuery]',
    "shim!vendor/owl.carousel[jquery=jQuery]>jQuery"], function ($, _, Backbone, Hypr,ModalWindow) {
   
    var zoomViewModelTemplate = Hypr.getTemplate('modules/product_quickview'),
    zoomviewModal = function(prod) {
                        var self = this;
                        self.render(zoomViewModelTemplate.render({model:prod})); 
                        
                        
        };
    $.extend(zoomviewModal.prototype = new ModalWindow(), {
            constructor: zoomviewModal,
            render: function(html) {
                    var $modal = $(html);
                    this.loadWrapper($modal.appendTo('body'));
                    this.bindClose();
                    var container = this.$wrapper;
                    this.open();
            }

    });


    var ProductPageImagesView = Backbone.MozuView.extend({
        templateName: 'modules/product/product-images',
        qmodal: '',
        events: {
            'click [data-mz-productimage-thumb]': 'switchImage',
            "click  .mz-productimages-main" :"zoomView"
            
        },
        initialize: function () {
            // preload images
            var imageCache = this.imageCache = {};
            _.each(this.model.get('content').get('productImages'), function (img) {
                var i = new Image();
                i.src = img.imageUrl + "?max=" + 650;
                i.title = img.imageUrl;
                imageCache[img.sequence.toString()] = i;
            });            
            $(window).bind("resize.app", _.bind(this.windowResized, this));
        },
        switchImage: function (e) {
            var $thumb = $(e.currentTarget);
            this.selectedImageIx = $thumb.data('mz-productimage-thumb');
            this.updateMainImage();
            return false;
        },
        zoomFocus:function(){
            $(document).on('keydown','.zomm-image#cboxClose',function(e){
                var notifyinputs = $(document).find('#cboxContent').find('select, input, textarea, button, a').filter(':visible');
                if((e.which === 9 && !e.shiftKey)||(e.which === 9 && e.shiftKey)){
                    e.preventDefault();
                   notifyinputs.first().focus(); 
                } 
            }) ;
        },
        updateMainImage: function () {
            var self = this;
            if (this.imageCache[this.selectedImageIx]) {
                this.$('[data-mz-productimage-main]').prop('src', this.imageCache[this.selectedImageIx].src);
            }
            var $mainimg = this.$('[data-mz-productimage-main]');
            var tempsrc=$mainimg.attr("src").substr(0,$mainimg.attr("src").indexOf('?'));
            this.zoomImage = tempsrc;
            $('.mz-productimages-main').colorbox({ 
                overlayClose: true, 
                opacity: 1, 
                href:this.zoomImage,
                photo: true,
                maxWidth: "90%", 
                maxHeight: "90%" , 
                fixed: true,
                trapFocus: false,
                onLoad: function (){
                  $('#colorbox').attr("aria-modal",true).attr("aria-label","Product image");
                },
                onComplete: function(){
                    $('#cboxClose').css({'background-image': 'url("../../resources/images/icons/close_popup.png")'});
                    $('#cboxClose').fadeIn();
                    $('#cboxClose').focus().addClass('zomm-image');
                    self.zoomFocus();
					$('#cboxLoadedContent').find('.cboxPhoto').attr('alt', $mainimg.attr('alt'));
                },
                onClosed: function(){
                    $(document).find('.mz-zoom-icon').focus();   
                }
            });
        },
        
        addToImageCache: function(imageUrl, sequenceId) {
                var i = new Image();
                i.src =  imageUrl  + "?max=" + 1200;     
                i.title = imageUrl;
                console.log(Object.keys(this.imageCache).length);
                //this.imageCache[Object.keys(this.imageCache).length + 1] = i;
                this.imageCache[sequenceId] = i;
              
              },

        
        
        
		showVideo: function(youtubeId) {
            var width = $(window).width() * 0.6;
            var height = width * 0.75;
            $.colorbox({
                    open: true,
                    maxWidth: "90%",
                    maxHeight: "90%",
                    scrolling: false,
                    fadeOut: 500,
                    html:  "<iframe width=" + width + " height=" + height + " src=\"//www.youtube.com/embed/" + youtubeId + "?rel=0&autoplay=1\" frameborder=0 allowfullscreen></iframe>", 
                    overlayClose: true,
                    trapFocus: false,
                    onComplete: function(){
                        $('#cboxClose').show();
                        $('#cboxLoadedContent').css({ background: "#000000" });
                        $(window).colorbox.resize();
                        }
                });
        },
        zoomView:function(e){
            if($( window ).width() > 770){
                  var product = this.model.apiModel.data;
                  var $mainimg = $(e.currentTarget).find('[data-mz-productimage-main]');
                  var tempsrc=$mainimg.attr("src").substr(0,$mainimg.attr("src").indexOf('?'));
                  product.selectImageUrl=tempsrc;
            }
        },
        windowResized: function(e){
            if($('#tz-model-dialog').length > 0 ){
                this.qmodal.close();
                $('.mz-productimages-main').trigger('click');
            }
        },
        getRenderContext: function () {
                var c = Backbone.MozuView.prototype.getRenderContext.apply(this, arguments);
                $.each(c.model.properties, function(index,item){
                    if(item.attributeFQN == 'tenant~mixed-variants' && (item.values.length > 0)){
                        c.model.mixvar = item.values[0].value;
                    }
                    if(item.attributeFQN == 'tenant~sku'){
                        c.model.SKU = item.values[0].value;
                    }
                }); 
                c.model.savePrice = (c.model.savePrice).toFixed(2);
                return c;
        },
        render: function () {
            Backbone.MozuView.prototype.render.apply(this, arguments);
            if($('.mz-productimages-thumb').size()<5)$('.mz-productimages-thumb').css('margin','0 2%');
            this.updateMainImage();
                  }
    });
    return {
        ProductPageImagesView: ProductPageImagesView
    };
});
