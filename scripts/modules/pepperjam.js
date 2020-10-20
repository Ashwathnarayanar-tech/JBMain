require([
  "modules/jquery-mozu"
], function($) {
  $(document).ready(function() {
    (function(w) {
      w.URLSearchParams = w.URLSearchParams || function(searchString) {
        var self = this;
        self.searchString = searchString;
        self.has = function(name) {
          return false;
        };
        self.get = function(name) {
          console.log(name);
          var results = null; // new RegExp('[\?&]' + name + '=([^&#]*)').exec(self.searchString);
          if (results === null) {
            return null;
          } else {
            return decodeURI(results[1]) || 0;
          }
        };
      };
    })(window);

    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('clickId')) {
      if ($.cookie('pepperjam_clickid_list')) {
        var pcl = decodeURIComponent($.cookie('pepperjam_clickid_list')).split(',');
        pcl.push(urlParams.get('clickId'));
        var pcl_str = pcl.join(',');
        $.cookie('pepperjam_clickid_list', encodeURIComponent(pcl_str), {
          expires: 60,
          path: '/'
        });
      } else {
        $.cookie('pepperjam_clickid_list', encodeURIComponent(urlParams.get('clickId')), {
          expires: 60,
          path: '/'
        });
      }
    }
  });
});