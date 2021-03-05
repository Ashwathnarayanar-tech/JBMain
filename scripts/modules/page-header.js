require([
    "modules/jquery-mozu", "underscore", "modules/backbone-mozu","modules/contextify" ,"modules/search-autocomplete"
    ,"modules/login-links"
], function($, _,  Backbone,contextify,searchAutocomplete,loginLinks) {
    var pageHeadeView = Backbone.MozuView.extend({
        templateName: 'modules/page-header-new',
         render:function() {
             console.log(" this--- render",this);
            Backbone.MozuView.prototype.render.apply(this);
        }
    });


    $(window).on('resize orientationchange', function(e){
        console.log(" event resize",window);
        getScreenOrientation();
      });
     function getScreenOrientation(){
        var pageModel = window.getDeviceMode();
        var newMode = window.getcurrentMode(pageModel);
        console.log(" new mode ",newMode,window.currentMode);
        //if(newMode !=window.currentMode){
            window.currentMode = newMode;
           // updateHeader(pageModel);
           updateMenus();
        //}
     }


    function generateheader(){
        var pageModel = {"pageContext":window.getDeviceMode()};
        window.currentMode = window.getcurrentMode(pageModel);
        console.log("pageModel -- window.currentMode",window.currentMode);
        var pageHeaderModel = Backbone.MozuModel.extend({}); 
        var pageHeader = window.pageHeader =  new pageHeadeView({
            el: $(".pageheaderView"),
            model: new pageHeaderModel(pageModel)
        }); 
        pageHeader.render();
    }
    function updateHeader(obj){
        window.pageHeader.model.set("pageContext",obj);
        window.pageHeader.render();
       updateMenus();
    }
    function updateMenus(){
        setTimeout(function(){
            window.invokeContextify();
            var newminiCartView = new window.MiniCartView({
                el: $('[data-mz-minicart]'),
                model: window.cartModel
            });
            setTimeout(function(){
                newminiCartView.render();
            },500);
        },1000);
    }
    //generateheader();
   
});

window.getDeviceMode =  function getDeviceMode(){
    var obj = {isDesktop:false,isTablet:false,isMobile:false};
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream; 
    var wdt = (iOS) ? window.screen.width : window.innerWidth;
    console.log(" window width ---",wdt,iOS);
    if(iOS){
        var ua = navigator.userAgent;
        console.log("ua----",ua);
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            obj.isTablet = true;

        }
        else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            obj.isMobile = true;
        }
        else
            obj.isDesktop = true;
    }
    else {
        if(wdt <= 765 || (window.orientation === 90 && wdt<=812)){
            obj.isMobile = true;
        }
        else if (wdt >765 && wdt<=1030){
            obj.isTablet = true;
        }
        else{
            obj.isDesktop = true;
        }
    }    
    return obj;
};

window.getcurrentMode = function getcurrentMode(pageModel){
  return ( pageModel.isDesktop ? "Desktop": (pageModel.isTablet ? "Tablet": (pageModel.isMobile ? "Mobile":"")));
};
