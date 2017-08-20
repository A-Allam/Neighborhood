// locations i will display

var markers = [{
    title: "Pyramids",
    lat: 29.979235,
    lng: 31.134202,
    cityAddress: "Giza, Cairo",
    url: "www.pyramids.com",
    id: "loc0",
    visible: ko.observable(true),
    boolTest: true
  },
  {
    title: "tahrir square",
    lat: 30.044456,
    lng: 31.235646,
    cityAddress: "Cairo, Egypt",
    url: "www.tahrir.com",
    id: "loc1",
    visible: ko.observable(true),
    boolTest: true
  },
  {
    title: "Cairo Opera House",
    lat: 30.042721,
    lng: 31.223917,
    cityAddress: "cairo",
    url: "www.opera.com",
    id: "loc2",
    visible: ko.observable(true),
    boolTest: true
  },
  {
    title: "Al Azhar Park",
    lat: 30.041161,
    lng: 31.265030,
    cityAddress: "cairo,Egypt",
    url: "www.alazhar.com",
    id: "loc3",
    visible: ko.observable(true),
    boolTest: true
  },
  {
    title: "Cairo International Airport (CAI)",
    lat: 30.112464,
    lng: 31.400299,
    cityAddress: "Air port",
    url: "www.airport.com",
    id: "loc4",
    visible: ko.observable(true),
    boolTest: true
  }
];
// global variables
var map;
var markersArray = [];

//Initialize the map
function initMap() {
  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(30.038022, 31.243057),
    mapTypeControl: false,
    disableDefaultUI: true
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  setMarkers(markers);
  setAllMap();
}

//Determines if markers should be visible
//This function is passed in the knockout viewModel function
function setAllMap() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].boolTest === true) {
      markers[i].holdMarker.setMap(map);
    } else {
      markers[i].holdMarker.setMap(null);
    }
  }
}

//Get Google Street View image

var streetViewImage;
var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=180x90&location=';

function streetView() {
  streetViewImage = streetViewUrl + markers[i].lat + ',' + markers[i].lng;
}

//add markers to map
function setMarkers(location) {

  for (i = 0; i < location.length; i++) {
    location[i].holdMarker = new google.maps.Marker({
      position: new google.maps.LatLng(location[i].lat, location[i].lng),
      map: map,
      title: location[i].title,
      animation: google.maps.Animation.DROP
    });

    //call street view function
    streetView();

    //add info window to every marker
    location[i].contentString = '<img src="' + streetViewImage +
      '" alt="Street View Image of ' + location[i].title + '"><br><hr style="margin-bottom: 5px"><strong>' +
      location[i].title + '</strong><p>' +
      location[i].cityAddress + '<br></p><a class="web-links" href="http://' + location[i].url +
      '" target="_blank">' + location[i].url + '</a>';

    var infowindow = new google.maps.InfoWindow({
      content: markers[i].contentString
    });

    //view infoWindow
    new google.maps.event.addListener(location[i].holdMarker, 'click', (function(marker, i) {
      return function() {
        infowindow.setContent(location[i].contentString);
        infowindow.open(map, this);
        var windowWidth = $(window).width();
        location[i].picBoolTest = true;
      };
    })(location[i].holdMarker, i));

    //Click nav element to view infoWindow
    //zoom in and center location on click
    var searchNav = $('#loc' + i);
    searchNav.click((function(marker, i) {
      return function() {
        infowindow.setContent(location[i].contentString);
        infowindow.open(map, marker);
        location[i].picBoolTest = true;
      };
    })(location[i].holdMarker, i));
  }
}


var viewModel = {
  query: ko.observable(''),
};

viewModel.markers = ko.dependentObservable(function() {
  var self = this;
  var search = self.query().toLowerCase();
  return ko.utils.arrayFilter(markers, function(marker) {
    if (marker.title.toLowerCase().indexOf(search) >= 0) {
      marker.boolTest = true;
      return marker.visible(true);
    } else {
      marker.boolTest = false;
      setAllMap();
      return marker.visible(false);
    }
  });
}, viewModel);

ko.applyBindings(viewModel);

//show $ hide markers while adding data to input fields
$("#input").keyup(function() {
  setAllMap();
});



