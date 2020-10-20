define(["modules/jquery-mozu", "modules/backbone-mozu"], 
    function ($, Backbone) {

        var Location = Backbone.MozuModel.extend({
            mozuType: 'location',
            idAttribute: 'code'
        });

        var LocationCollection = Backbone.MozuModel.extend({
            mozuType: 'locations',
            relations: {
                items: Backbone.Collection.extend({
                    model: Location
                })
            }
        });

        return {
            Location: Location,
            LocationCollection: LocationCollection
        };
    }
);