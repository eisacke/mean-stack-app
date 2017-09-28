angular
  .module('planitApp')
  .factory('Location', Location);

Location.$inject = ['$resource'];
function Location($resource) {
  return new $resource('/api/events/:eventId/locations/:id', { id: '@id' });
}
