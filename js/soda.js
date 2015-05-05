

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