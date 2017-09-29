angular
  .module('planitApp')
  .directive('googlePlaces', googlePlaces);

googlePlaces.$inject = ['$window'];
function googlePlaces($window) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, model) {
      const options = {
        types: []
      };

      const autocomplete = new $window.google.maps.places.Autocomplete(element[0], options);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        model.$setViewValue(place);
      });
    }
  };
}
