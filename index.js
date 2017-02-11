/**
	 * @author Narvik
	 */
	function initMap() {
	  var map = new google.maps.Map(document.getElementById('map'), {
	    center: {
	      lat: 23, lng:-102
	    },
	    zoom: 5,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	  });


	  var input = document.getElementById('pac-input');
	  var searchBox = new google.maps.places.SearchBox(input);
	  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	  map.addListener('bounds_changed', function() {
	    searchBox.setBounds(map.getBounds());
	  });
	  // 1: Variables infowindow and service:
	  var infowindow = new google.maps.InfoWindow();
	  var service = new google.maps.places.PlacesService(map);
	  var markers = [];
	  searchBox.addListener('places_changed', function() {
	    var places = searchBox.getPlaces();
	    if (places.length == 0) {
	      return;
	    }
	    markers.forEach(function(marker) {
	      marker.setMap(null);
	    });
	    markers = [];
	    var bounds = new google.maps.LatLngBounds();
	    places.forEach(function(place) {
	        var icon = {
	          url: place.icon,
	          size: new google.maps.Size(71, 71),
	          origin: new google.maps.Point(0, 0),
	          anchor: new google.maps.Point(17, 34),
	          scaledSize: new google.maps.Size(25, 25)
	        };
		    
	        var marker = new google.maps.Marker({
	          map: map,
	          icon: icon,
	          title: place.name,
	          position: place.geometry.location,
	          placeId: place.place_id
	        });
	        markers.push(marker);
	        google.maps.event.addListener(marker, 'click', function(evt) {
	          // 2: getDetails, referring to the "places" (var places = searchBox.getPlaces();) already on the map
	          // 3: addlistener on the markers, to show an infowindow upon a clickevent   

	          service.getDetails({
	            placeId: this.placeId
	          }, (function(marker) {
	            return function(place, status) {
	              if (status === google.maps.places.PlacesServiceStatus.OK) {
	            	  var xhttp = new XMLHttpRequest();
	    			  xhttp.onreadystatechange = function() {
	    			    if (this.readyState == 4 && this.status == 200) {
	    			    	var response=this.responseText;
	    			    	var objeto_json = JSON.parse(response);
	    			    	var municipio = objeto_json.municipio;
	    			    	var html='<div><strong>' + place.name + '</strong><br>' +
			                  'Ontologia: ' + municipio + '<br></div>';
	    			    	infowindow.setContent(html);
	    			        infowindow.open(map, marker,html);
	    			    }
	    			  };
	    			  var url='http://localhost:8080/WebServices/search/dosearch?municipio='+place.name;
	    			  xhttp.open("GET",url, true);
	    			  xhttp.send();
	              }
	            }
	          }(marker)));
	        });
	        if (place.geometry.viewport) {
	        // Only geocodes have viewport.
	        bounds.union(place.geometry.viewport);
	      } else {
	        bounds.extend(place.geometry.location);
	      }
	    });
	    map.fitBounds(bounds);
	  });
	}
	google.maps.event.addDomListener(window, "load", initMap);