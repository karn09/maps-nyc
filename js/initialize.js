// Set Globals
var map;
var allMarkers = [];
var newYork = new google.maps.LatLng(40.714623, -74.006505);
var cony_data_url = "https://data.cityofnewyork.us/resource/xx67-kt59.json?";

// Load Google map
function initMap() {

    var mapOptions = {
        zoom: 14,
        center: newYork
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
};

// return search_results
function searchMap(query) {
    var service = new google.maps.places.PlacesService(map);
    
    this.search_results = [];
    
    var request = {
        location: newYork,
       query: query, // TODO: take search input, name & address info
        radius: 5000,
        types: ['restaurant', 'food']
    };

    service.textSearch(request, function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(function (result) {
                var name = result.name.toUpperCase().toUpperCase();
                var street = result.formatted_address.split(',')[0].toUpperCase()
                var zipcode = result.formatted_address.split(',')[2].split(' ')[2]
                this.search_results.push({ 
                    'name': name, 
                    'street': street, 
                    'zipcode': zipcode
                });
            });
        }
    });
    
    if (this.search_results != []) {
        return this.search_results;
    } else {
        
    }
    
}

function nyc_healthAjax(searchFor) {
    
}
    

// find a way to get current zipcode? pass to NYC open api with query + zipcode..

var searchQuery = function(query) {
    var queryBuilder = this.baseUrl + "$q=" + query;
    return this.getSodaData(queryBuilder);
}

var getSodaData = function(query) {
    // Make the API call to Soda
    // scope 'this' for use inside inner functions

    $.getJSON(query, function(result) {}).done(function(json) {

        json.forEach(function(obj) {
            //console.log(obj)
            self.searchResults.push({
                'name': obj.dba,
                'grade': obj.grade,
                'violations': obj.violation_description
            });
        })
    }).fail(function(err) {
        console.log(err)
    })
}


initMap();