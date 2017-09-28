angular
  .module('planitApp')
  .factory('Event', Event);

Event.$inject = ['$resource'];
function Event($resource) {
  return new $resource('/api/events/:id', { id: '@id' }, {
    update: { method: 'PUT' }
  });
}
