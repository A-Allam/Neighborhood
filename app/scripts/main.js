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

// map on error 
mapError = () => {
  alert("map can't load");
};



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
    gettingJSON();

    //call weather API
    var currentTemperature;
    function gettingJSON(){
      $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + markers[i].lat + "&lon="+ markers[i].lng+"&APPID=0d38d2be30cd0730296b1f76cfdc3159")
      .done(function( data ) {
        currentTemperature = data.main.temp;
        console.log("currentTemperature", currentTemperature);
      });
    };



    //add info window to every marker

    location[i].contentString = '<img src="' + streetViewImage +
      '" alt="Street View Image of ' + location[i].title + '"><br><hr style="margin-bottom: 5px"><strong>' +
      location[i].title + '</strong><p>' +
      '<br> current temp:' + currentTemperature +
      '<br>' + location[i].cityAddress + '<br></p><a class="web-links" href="http://' + location[i].url +
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


    google.maps.event.addListener(location[i].holdMarker, 'click', clickListener);

    var bouncingMarker = null;

    var clickListener = function() {
        if(bouncingMarker)
            bouncingMarker.setAnimation(null);
        if(bouncingMarker != this) {
            this.setAnimation(google.maps.Animation.BOUNCE);
            bouncingMarker = this;
        } else
            bouncingMarker = null;
    }

    //Click nav element to view infoWindow
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
  enterSearch : function(){
    setAllMap();
  },
  clickOnElement : function(){
    console.log("clicked");
  }
};


viewModel.markers = ko.computed(function() {
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


// hide aside menue on small screens
$(".menu-toggle").click(function(){
  $('#floating-panel').toggle();
});

if($(window).width() < 600) {
  $('#floating-panel').hide();
}



