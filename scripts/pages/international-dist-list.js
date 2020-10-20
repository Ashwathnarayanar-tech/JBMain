require(['modules/jquery-mozu','underscore', 'modules/api','modules/backbone-mozu', 'hyprlive'], function($, _, api,Backbone, Hypr) {

$(document).ready(function () {
//prints list of distributors after target div
  function printData(itemsToPrint) {
    itemsToPrint.forEach(function(currentCountry) {
      $('#full-distributors-list').after(
        '<h3>' + currentCountry.Country + "</h3>",
        (currentCountry.Distributor !== "") ? '<p> Distributor: ' + currentCountry.Distributor + '</p>' : "",
        (currentCountry.Contact !== "") ? '<p> Contact: ' + currentCountry.Contact + '</p>' : "",
        (currentCountry.Phone !== "") ? '<p> Phone: ' + currentCountry.Phone + '</p>' : "",
        (currentCountry.Direct !== "") ? '<p> Direct: ' + currentCountry.Direct + '</p>' : "",
        (currentCountry.Mobile !== "") ? '<p> Mobile: ' + currentCountry.Mobile + '</p>' : "",
        (currentCountry.Fax !== "") ? '<p> Fax: ' + currentCountry.Fax + '</p>' : "",
        (currentCountry.Address1 !== "") ? '<p> Address: ' + currentCountry.Address1 + '</p>' : "",
        (currentCountry.Address2 !== "") ? '<p>\u2001\u2001\u2001\u2001\u2006' + currentCountry.Address2 + '</p>' : "",
        (currentCountry.Address3 !== "") ? '<p>\u2001\u2001\u2001\u2001\u2006' + currentCountry.Address3 + '</p>' : "",
        (currentCountry.PostalCode !== "") ? '<p> Postal Code: ' + currentCountry.PostalCode + '</p>' : "",
        (currentCountry.Email !== "") ? '<p> Email: <a href="mailto:' + currentCountry.Email + '">' + currentCountry.Email + '</a></p>' : "",
        (currentCountry.Website1 !== "") ? '<p> Website: <a href="' + currentCountry.Website1 + '">' + currentCountry.Website1 + '</a></p>': "",
        (currentCountry.Website2 !== "") ? '<p> Website 2: <a href="' + currentCountry.Website2 + '">' + currentCountry.Website2 + '</a></p>': "",
        '<hr />'
      );
    });
  }

//gets full list of international distributors from entity list
  var distList =   api.get('entity', {
    "listName" : "int-distributors-test",
    "entityListFullName" : "int-distributors-test@jbelly",
    "pageSize": 55
    }).then(function(response) {
      var fullDataSet = response.data.items;
      var countryList = [];
      fullDataSet.forEach(function(element) {
        countryList.push(element.Country);
      });
        var sortedData = _.sortBy(fullDataSet, 'Country');
        sortedData.reverse();
        printData(sortedData);
      });
    });
    
    
  });

  
