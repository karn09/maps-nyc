function mapViewModel() {
    var self = this;
    var map;
    var service;
    var infowindow;
    // nw 40.917577, -74.25909
    // se 40.477399, -73.700272
    var newYork = new google.maps.LatLng(40.714623, -74.006505);
    var test = ko.observableArray()
    test = "Hello"
    function initMap() {


        var mapOptions = {
            zoom: 14,
            center: newYork
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);


        // search around map for type
        var request = {
            location: newYork,
            keyword: 'mcdonalds', // TODO: take search input, name & address info
            radius: 30,
            types: ['restaurant', 'food']
        };

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, function(results) {
            //console.log(results)
            results.forEach(function(result) {
                // access Soda API with formatted data...does not work as planned because restaurant names don't always match.
                // console.log(result.vicinity.toUpperCase().split(',')[0] + " : " + result.name.toUpperCase())
                Model.searchQuery('"' + result.vicinity.toUpperCase().split(',')[0] + '" ' + ' AND "' + result.name.toUpperCase() + '"')

                //console.log(result.name + " at " + result.vicinity)
            })
        });


    }

    var Model = {
        baseUrl: "https://data.cityofnewyork.us/resource/xx67-kt59.json?",

        searchResults: ko.observableArray(),

        searchQuery: function(query) {
            var queryBuilder = this.baseUrl + "$q=" + query;
            return this.getSodaData(queryBuilder);
        },

        getSodaData: function(query) {
            // Make the API call to Soda
            var self = this; // scope 'this' for use inside inner functions

            $.getJSON(query, function(result) {
            }).done(function(json) {
                
                json.forEach(function(obj) {
                    
                    self.searchResults.push({
                        'name': obj.dba,
                        'grade': obj.grade,
                        'violations': obj.violation_description
                    });
                })
            }).fail(function(err) {
                console.log(err)
            })
        },

        searchSodaDataByName: function(street, name) {
            return this.getSodaData(Model.baseUrl, street, name)
        }

    }




    // Start map, do not remove
    initMap()
}


// Model

var ratings = "";

$(document).ready(function() {
    ko.applyBindings(mapViewModel);
});

// "https://data.cityofnewyork.us/resource/xx67-kt59.json?$where=street='Morris Park Ave' AND zipcode='10462'"

// {
//   "boro" : "MANHATTAN",
//   "building" : "237987    ",
//   "phone" : "2122830559",
//   "camis" : "40401953",
//   "dba" : "MCDONALD'S",
//   "street" : "ADAM CLAYTON POWELL BOULEVARD                                                                       ",
//   "zipcode" : "10030",
//   "inspection_type" : "Cycle Inspection / Re-inspection",
//   "grade_date" : "2015-03-09T00:00:00",
//   "score" : "13",
//   "cuisine_description" : "Hamburgers",
//   "violation_description" : "Cold food item held above 41º F (smoked fish and reduced oxygen packaged foods above 38 ºF) except during necessary preparation.",
//   "inspection_date" : "2015-03-09T00:00:00",
//   "critical_flag" : "Critical",
//   "violation_code" : "02G",
//   "record_date" : "2015-04-11T06:01:38",
//   "action" : "Violations were cited in the following area(s).",
//   "grade" : "A"
// }

// var Model = {
//     baseUrl: "https://data.cityofnewyork.us/resource/xx67-kt59.json?",

//     searchResults: ko.observableArray(),

//     searchQuery: function(query) {
//       var queryBuilder =  Model.baseUrl + "$q=" + query;
//       return Model.getSodaData(queryBuilder);
//     },

//     getSodaData: function(query) {
//         // Make the API call to Soda
//         $.getJSON(query, function(result) {

//         }).done(function(json) {
//             json.forEach(function(obj) {
//                 Model.searchResults.push({ 
//                     'name': obj.dba, 
//                     'grade': obj.grade, 
//                     'violations': obj.violation_description
//                 });
//             })
//         }).fail(function(err) {
//             console.log(err)
//         })
//     },

//     searchSodaDataByName: function(street, name) {
//         return Model.getSodaData(Model.baseUrl, street, name)
//     }

// }


//Model.getSodaData(Model.baseUrl, 10030, "mcdonald's");
