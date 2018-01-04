// a variable for map starting center position
var centerLocation = {lat: 41.8333925, lng: -88.0121478};
var map;

// Location array
var locations = [
    {
        category: 'Work',
        title: 'Chicago',
        location: {
            lat: 41.8844626,
            lng: -87.6349813
        }
    },
    {
        category: 'Work',
        title: 'Des Plaines',
        location: {
            lat: 42.0228132,
            lng: -87.9284833
        }
    },
    {
        category: 'Work',
        title: 'Harwood Heights',
        location: {
            lat: 41.9661792,
            lng: -87.8038933
        }
    },
    {
        category: 'Home',
        title: 'Glen Ellyn',
        location: {
            lat: 41.8535493,
            lng: -88.063832
        }
    },
    {
        category: 'Home',
        title: 'Lombard',
        location: {
            lat: 41.8565625,
            lng: -88.0036689
        }
    },
    {
        category: 'Home',
        title: 'Vernon Hills',
        location: {
            lat: 42.2507524,
            lng:-87.96064
        }
    }
];
        
var infowindowDefault = '<div style="width: 100px; height: 60px;"><p style="text-align: center;">Loading your StreetViewPanorama</p></div>';

var openWindow = false;

var infowindowContent = 'Error';

// setting up viewmodel
var ViewModel = function() {
    // assign self to this perimeter so we can easily point objects to viewmodel
    var self = this;

    // knockout observable variable for the input given by a user
    self.locationInput = ko.observable("");

    // knockout observable array to store location list items
    self.locationList = ko.observableArray([]);

    // we initialize Loc objects and story them in the ko observable array
    locations.forEach(function(item){
        self.locationList.push( new Loc(item) );
    });

    self.populateInfoWindow = function(location){
        var thisContent;
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, location.marker.position);
                self.infowindow.setContent('<div class="locationName"><span>' + location.cat() + ':</span> ' + location.name() + '</div>'+infowindowContent+'<div id="pano"></div>');
                var panoramaOptipons = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 20
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptipons);
            } else {
                self.infowindow.setContent('<div class="locationName">' + location.cat() + ':</span> ' + location.name() + '</div>'+infowindowContent+'<div>No Street View Found</div>');
            }
        }
        streetViewService.getPanoramaByLocation(location.marker.position, radius, getStreetView);
    };

    // google map infowindow object
    self.infowindow = new google.maps.InfoWindow({
        content: infowindowDefault
    });

    self.weather = function(location) {
        var weatherURL = 'http://api.openweathermap.org/data/2.5/weather?lat=' + location.latLng.lat + '&lon=' + location.latLng.lng + '&units=imperial&APPID=24fe1091a58e1b8c1660ac9a7c2965c0';
        // create settings object for ajax call
        var settings = {
            url: weatherURL,
            // set infowindow content to say the provided string when error is thrown
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                infowindowContent = '<div class="weatherBug">OpenWeatherMap Error</div>';
            },
            // what ajax function should do when the http request works fine
            success: function(results) {
                // an object to store the relevant information that returned from JSON
                var context = {
                    temp: Math.round(results.main.temp),
                    pressure: results.main.pressure,
                    humidity: results.main.humidity,
                    status: results.weather[0].main,
                    desc: results.weather[0].description
                };
                // self.infowindow.setContent(html);
                infowindowContent = '<div class="weatherBug" id="weather'+location.name()+'">'+context.status+', '+context.temp+'&deg;F</div>';
                // return weather;
            }
        };
        // call ajax function
        $.ajax(settings);
    }

    // this function is for displaying infowindow on clicked objects
    self.infoWindowMessage = function(location) {
        // reset all markers to red and set the location infowindow active state to false
        for (var j = 0; j < locations.length; j++) {
            self.locationList()[j].marker.setIcon("https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png");
            self.locationList()[j].activeWindow("false");
        }

        // reset infowindow content to be "loading" screen
        self.infowindow.setContent(infowindowDefault);

        // set clicked marker to a blue marker
        location.marker.setIcon("https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png");

        // animate the marker for a single bounce on click (or menu click - same thing)
        // moved to separate method when hovering self.hintLocation
            // location.marker.setAnimation(google.maps.Animation.BOUNCE);
            // setTimeout (function(){
            //     location.marker.setAnimation(null);
            // }, 700);
        self.weather(location);

        // populate infowindow
        self.populateInfoWindow(location);


        // update the activeWindow variable on the location to assist in hinting, etc
        location.activeWindow("true");

        // open infowindow on the clicked marker
        self.infowindow.open(map, location.marker);
    };

    self.hintLocation = function(location) {
        // if this location does not have an active infowindow
        if (location.activeWindow() === "false") {
            // hint with a green marker
            location.marker.setIcon("https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png");
            // bounce it
            location.marker.setAnimation(google.maps.Animation.BOUNCE);
            // kill the bounce
            setTimeout (function(){
                location.marker.setAnimation(null);
            }, 1400);
        }
    };

    self.removeHint = function(location){
        // if this location does not have an active infowindow
        if (location.activeWindow() === "false") {
            // reset the marker to red
            location.marker.setIcon("https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png");
        }
        location.marker.setAnimation(null);
    };

    // iterate through locationList ko observable array
    self.locationList().forEach(function(location){
        // add event listener for 'click' to each location.marker then we pass location to the return function, then run it right after with location as parameter
        google.maps.event.addListener(location.marker, 'click', (function(){
            return function(){
                self.infoWindowMessage(location);
            }
        })(location));
        // add event listener for 'closeclick' to each infowindow then we pass location to the return function, then run it right after with location as parameter
        google.maps.event.addListener(self.infowindow, 'closeclick', (function(){
            return function(){
                location.activeWindow("false");
                infowindowContent = '';
                // reset all other markers to default red
                for (var j = 0; j < locations.length; j++) {
                    self.locationList()[j].marker.setIcon("https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png");
                }
            }
        })(location));
    });

    // create a computed list out of locationList ko array and locationInput ko
    self.computedList = ko.computed(function(){
        // array to store the result
        var tempFilteredList = [], sorted = [];
        var listLength = self.locationList().length;
        
        // turn on markers for all items in locationList
        for (var i = 0; i < listLength; i++){
            if (self.locationList()[i].name().toLowerCase().indexOf(self.locationInput().toLowerCase()) != -1) {
                tempFilteredList.push(self.locationList()[i]);
                // items in list, turn on the markers
                self.locationList()[i].showMarker(map);
            } else {
                // items not in list turn off the markers (turn off button sets item to " ")
                self.locationList()[i].showMarker(null);
            }
        }

        tempFilteredList.sort(orderByProperty('cat', 'name'));

        //build new array separating by location category for dynamic navigation list
        for( var j = 0, max = tempFilteredList.length; j < max ; j++ ){
            if( sorted[tempFilteredList[j].cat()] == undefined ){
                sorted[tempFilteredList[j].cat()] = [];
            }
            sorted[tempFilteredList[j].cat()].push(tempFilteredList[j]);
        }

        return sorted;
    });

    self.buttonActions = function() {
        var listLength = self.locationList().length;
        for (var i = 0; i < listLength; i++){
            self.locationList()[i].showMarker(null);
        }
    };
}

// Loc method creates an object to hold all information for each location 
var Loc = function(data) {
    // assign self to this variable so we can point objects to viewmodel
    var self = this;

    // store location's name data as ko observables
    self.name = ko.observable(data.title);
    self.cat = ko.observable(data.category);
    // latitude and longitude to set the marker location
    self.latLng = data.location;
    
    // image for the marker
    var image = {
        url: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
    };
    
    self.activeWindow = ko.observable("false");

    // new marker object
    self.marker = new google.maps.Marker({
        position: self.latLng,
        map: null,
        icon: image,
        animation: google.maps.Animation.DROP
    });
    
    // function to display or hide marker
    self.showMarker = function(mapOrNull) {
         if (mapOrNull === map) {
            if (self.marker.map === null) {
                self.marker.setMap(mapOrNull);
            }
        } else {
            self.marker.setMap(null);
        }
    };
}


// initialize google map
function initMap() {
    var myLatLng = centerLocation;

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    ko.applyBindings(new ViewModel());
}


// additional helper methods

function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function orderByProperty(prop) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function (a, b) {
        var equality = a[prop] - b[prop];
        if (equality === 0 && arguments.length > 1) {
            return orderByProperty.apply(null, args)(a, b);
        }
        return equality;
    };
}
