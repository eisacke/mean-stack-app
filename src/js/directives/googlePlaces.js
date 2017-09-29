angular
  .module('planitApp')
  .directive('googlePlaces', googlePlaces);

googlePlaces.$inject = ['$window', '$http'];
function googlePlaces($window, $http) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, model) {
      const autocomplete = new $window.google.maps.places.Autocomplete(element[0]);

      if (navigator.geolocation) navigator.geolocation.getCurrentPosition(getCountryCode);

      function getCountryCode(position) {
        $http.get('/api/code', { params: { lat: position.coords.latitude, lng: position.coords.longitude }})
          .then((response) => autocomplete.setComponentRestrictions({'country': response.data.countryCode}));
      }

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        model.$setViewValue(place);
      });
    }
  };
}
