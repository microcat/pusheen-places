/*
Based on following demos: 
http://html5demos.com/geo
https://developers.google.com/maps/documentation/javascript/examples/place-search */
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
		// TODO: Reference keys of map to pusheen instead.
		types: Object.keys(pusheenImages)
	}
	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, places_callback);
}

function places_callback(results, status) {
	var s = document.querySelector('#status');
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		s.innerHTML = "There she is!";
		s.className = 'success';
		// Create pusheen based on first result.
		var pusheen = document.createElement('div');
		pusheen.id = 'pusheen';
		pusheen.innerHTML=results[0].name + results[0].types;
		document.getElementById("pusheen").appendChild(pusheen);
	} else {
		s.innerHTML = "Couldn't find her :(";
	}
}

function error(msg) {
	var s = document.querySelector('#status');
	s.innerHTML = typeof msg == 'string' ? msg : "failed";
	s.className = 'fail';
	// console.log(arguments);
}