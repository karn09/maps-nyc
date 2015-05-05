// Set Globals
var map;
var newYork = new google.maps.LatLng(40.714623, -74.006505);
var cony_data_url = "https://data.cityofnewyork.us/resource/xx67-kt59.json?";
var search_results = [];
var allMarkers = [];
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
    
    var request = {
        location: newYork,
       query: query, // TODO: take search input, name & address info
        radius: 5000,
        types: ['restaurant', 'food']
    };

    service.textSearch(request, callback);
    
    function callback (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(function (result) {
                var name = result.name.toUpperCase().toUpperCase();
                var street = result.formatted_address.split(',')[0].toUpperCase()
                var zipcode = result.formatted_address.split(',')[2].split(' ')[2]
                var geometry = result.geometry;
                search_results.push({ 
                    'name': name, 
                    'street': street, 
                    'zipcode': zipcode
                });
                newMarker(geometry.location, result.name);
            });
        }
    }
    
}

function newMarker (pos, name) {
    marker = new google.maps.Marker({
        position: pos,
        animation: google.maps.Animation.DROP,
        map: map,
        title: name
    })
    var info = new google.maps.InfoWindow({
        content: name
    });
    google.maps.event.addListener(marker, 'click', (function(marker, info) {
        return function() {
            toggleBounce(marker)
            infoWindow(info, marker)
        }
    })(marker, info)) // bug, only showing bounce on first marker
}
function toggleBounce (marker) {
    if (marker.getAnimation() != null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}
function infoWindow (info, marker) {
    info.open(map,marker);
}
// need to take textSearch results and expand retrieved data in order to create markers on map
function nyc_healthAjax(searchFor) {
    
}

// take results from places search, and parse each object into a string
var parseResults = function (resultsObj) {
    var queryForSoda = [];
    
    for (var i = 0; i < resultsObj.length; i++) {
        var tempStr = "";
        for (var obj in resultsObj[i]) {
            tempStr += resultsObj[i][obj] + " ";
        }
        queryForSoda.push(tempStr)
    }
    
    return queryForSoda;
}



var baseUrl = "https://data.cityofnewyork.us/resource/xx67-kt59.json?"

var searchQuery = function(query) {
    var queryBuilder = this.baseUrl + "$q=" + query;
    return this.getSodaData(queryBuilder);
}

// take formatted results from places search, and pass needed data to soda search
// limited to one array index at a time. 
var sodaResults = []
var getSodaData = function(query) {
    // Make the API call to Soda
    // scope 'this' for use inside inner functions
    var baseUrl = "https://data.cityofnewyork.us/resource/xx67-kt59.json?$q="
    var searchUrl = baseUrl + query;
    $.getJSON(baseUrl, query, function (obj) {
        obj.forEach(function(obj) {
            //console.log(obj)
            sodaResults.push({
                'name': obj.dba,
                'grade': obj.grade,
                'violations': obj.violation_description,
                'street': obj.street
            });
        })
    })
    // $.getJSON(baseUrl, function(result) { console.log(result)}).done(function(json) {
    //     // broken, pulling entire gradings database
    //     json.forEach(function(obj) {
    //         //console.log(obj)
    //         sodaResults.push({
    //             'name': obj.dba,
    //             'grade': obj.grade,
    //             'violations': obj.violation_description,
    //             'street': obj.street
    //         });
    //     })
    // }).fail(function(err) {
    //     console.log(err)
    // })
    return sodaResults
}

var getSodaAll = function () {
    search_results.forEach(function (result) {
        getSodaData(parseResults(result))
    })
}
// once sodaResults array is built, need to parse objects within array for display on screen

initMap();
