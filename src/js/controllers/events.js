angular
  .module('planitApp')
  .controller('EventsIndexCtrl', EventsIndexCtrl)
  .controller('EventsNewCtrl', EventsNewCtrl)
  .controller('EventsShowCtrl', EventsShowCtrl);

EventsIndexCtrl.$inject = ['Event'];
function EventsIndexCtrl(Event) {
  const vm = this;

  vm.all = Event.query();
}

EventsNewCtrl.$inject = ['Event', '$state'];
function EventsNewCtrl(Event, $state) {
  const vm = this;
  vm.event = {};

  function eventsCreate() {
    if(vm.newForm.$valid) {
      Event
        .save(vm.event)
        .$promise
        .then(() => $state.go('eventsIndex'));
    }
  }

  vm.create = eventsCreate;
}

EventsShowCtrl.$inject = ['Event', '$state', 'Location'];
function EventsShowCtrl(Event, $state, Location) {
  const vm = this;
  vm.event = Event.get($state.params);

  function eventsDelete() {
    vm.event
      .$remove()
      .then(() => $state.go('eventsIndex'));
  }

  vm.delete = eventsDelete;

  function addLocation() {
    const location = {
      name: vm.placesData.name,
      address: vm.placesData.formatted_address,
      website: vm.placesData.website,
      phone: vm.placesData.formatted_phone_number,
      time: vm.location.time,
      lat: vm.placesData.geometry.location.lat(),
      lng: vm.placesData.geometry.location.lng()
    };
    
    Location
      .save({ eventId: vm.event.id }, location)
      .$promise
      .then((location) => {
        vm.event.locations.push(location);
        vm.newLocation = {};
      });
  }

  vm.addLocation = addLocation;

  // function deleteLocation(location) {
  //   Location
  //     .delete({ eventId: vm.event.id, id: location.id })
  //     .$promise
  //     .then(() => {
  //       // locate the location in the array of locations
  //       const index = vm.event.locations.indexOf(location);
  //       // splice it from the array, take 1 element starting from that index
  //       vm.event.locations.splice(index, 1);
  //     });
  // }
  //
  // vm.deleteLocation = deleteLocation;
}
