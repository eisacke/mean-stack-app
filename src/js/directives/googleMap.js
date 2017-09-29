angular
  .module('planitApp')
  .directive('googleMap', googleMap);

googleMap.$inject = ['$window', 'mapStyles'];
function googleMap($window, mapStyles) {
  return {
    restrict: 'E',
    template: '<div class="map"></div>',
    replace: true,
    scope: {
      locations: '=',
      selectedLocation: '='
    },
    link: function(scope, element) {

      let markers = [];
      let bounds = new $window.google.maps.LatLngBounds();

      const rocketIcon = {
        url: '../images/rocket.svg',
        scaledSize: new $window.google.maps.Size(30, 30),
        anchor: new $window.google.maps.Point(15, 15)
      };

      const selectedRocketIcon = {
        url: '../images/selectedRocket.svg',
        scaledSize: new $window.google.maps.Size(40, 40),
        anchor: new $window.google.maps.Point(20, 20)
      };

      const map = new $window.google.maps.Map(element[0], {
        center: { lat: 51.5074, lng: -0.1278 },
        zoom: 12,
        styles: mapStyles,
        scrollwheel: false
      });

      function centerMapOnUser() {
        if (navigator.geolocation) navigator.geolocation.getCurrentPosition((position) => {
          map.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
        });
      }

      scope.$watch('locations', addMarkers, true);
      scope.$watch('selectedLocation', findMarkerToHighlight);

      function clearMarkers() {
        markers.forEach(marker => marker.setMap(null));
        bounds = new $window.google.maps.LatLngBounds();
        return [];
      }

      function findMarkerToHighlight(selectedLocation) {
        if(!selectedLocation) return false;

        const markerToChange = markers.find(marker => marker.id === selectedLocation.id);
        highlightMarker(markerToChange);
      }

      function highlightMarker(marker) {
        markers.forEach(marker => marker.setIcon(rocketIcon));
        marker.setIcon(selectedRocketIcon);
      }

      function addMarkers(locations) {
        if(!locations) return false;
        markers = clearMarkers();

        locations.forEach(addMarker);
        fitToBounds();
      }

      function fitToBounds (){
        if(!markers.length) return centerMapOnUser();
        if(markers.length > 1) return map.fitBounds(bounds);
        map.setCenter(markers[0].position);
        map.setZoom(16);
      }

      function addMarker(location) {
        const latLng = { lat: location.lat, lng: location.lng };
        const marker = new $window.google.maps.Marker({
          map: map,
          position: latLng,
          id: location.id,
          icon: rocketIcon
        });

        marker.addListener('click', selectLocation);

        function selectLocation() {
          highlightMarker(this);
          scope.selectedLocation = scope.locations.find((location) => location.id === marker.id);
          scope.$apply();
        }

        markers.push(marker);
        bounds.extend(latLng);
      }

    }
  };
}
