/*
Based on following demos: 
http://html5demos.com/geo
https://developers.google.com/maps/documentation/javascript/examples/place-search */
var map;
var service;

function success(position) {
	var s = document.querySelector('#status');
	s.innerHTML = "Over there?";
	s.className = 'success';

	// Look for nearest places
	var user_loc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	// Wont let you call places API without a map.
	map = new google.maps.Map(document.getElementById('map-canvas'), {
		center: user_loc,
		zoom: 15
	});

	var request = {
		location: user_loc,
		radius: '500',
		types: Object.keys(pusheenImages)
	}
	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, places_callback);
}

// Executed when places information is returned about location.
function places_callback(results, status) {
	var s = document.querySelector('#status');
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		s.innerHTML = "There she is!";
		// Create pusheen based on first result.
		// Get type. guaranteed at least 1 is ok (specificed in request)
		var ok_types = Object.keys(pusheenImages);
		var type;
		for (var i = 0; i < results[0].types.length; i++) {
			var temptype = results[0].types[i];
			if (ok_types.indexOf(temptype) != -1) {
				type = temptype;
				break;
			}
		};
		// get image
		var pusheen_image = new Image();
		pusheen_image.src = "images/" + pusheenImages[type] + ".gif";
		pusheen_image.id = "pusheen_image";
		pusheen_image.className = "thumbnail";
		var place = document.createElement('p');
		// Span to update with a URL link later.
		place.innerHTML = "Pusheen is at <span id='place-name'>" + results[0].name + "</span>, a " + placetype(type) + " near " + results[0].vicinity + ".";
		var container = document.getElementById("pusheen");
		container.appendChild(pusheen_image);
		container.appendChild(place);

		// Request url/details
		var request = {
			placeId: results[0].place_id
		};
		service.getDetails(request, details_callback);
	} else {
		s.innerHTML = "Couldn't find her :(";
	}
}

// Changes name of place to a link to their website.
// Executed when places details are returned.
function details_callback(place, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		// Update URL.
		var span = document.getElementById("place-name");
		// Alternative: change it to text node with href. This works too!
		span.innerHTML = "<a href='" + place.url + "'>" + span.innerHTML + "</a>";
	}
}

function error(msg) {
	var s = document.querySelector('#status');
	s.innerHTML = typeof msg == 'string' ? msg : "Couldn't find her :(";
	// console.log(arguments);
}

// Some place types need different phrasing...most just their underscores removed.
function placetype(type) {
	var suffix = "";
	// these dont make sense by themselves
	if (["food", "meal_delivery", "meal_takeaway", "parking", "hair_care"].indexOf(type) != -1) suffix = " place";
	return type.replace("_", " ") + suffix;
}