angular
  .module('planitApp')
  .factory('Invitee', Invitee);

Invitee.$inject = ['$resource'];
function Invitee($resource) {
  return new $resource('/api/events/:eventId/invitees/:id', { id: '@id' });
}
