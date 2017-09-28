angular
  .module('planitApp')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$rootScope', '$state', '$auth', '$transitions'];
function MainCtrl($rootScope, $state, $auth, $transitions) {
  const vm = this;
  vm.navIsOpen = false;
  vm.isAuthenticated = $auth.isAuthenticated;
  const protectedStates = ['postsNew'];

  $rootScope.$on('error', (e, err) => {
    vm.message = err.data.message;

    if(err.status === 401 && vm.pageName !== 'login') {
      vm.stateHasChanged = false;
      $state.go('login');
    }
  });

  $transitions.onSuccess({}, (transition) => {
    vm.navIsOpen = false; // Making the burger menu closed by default on page load
    vm.pageName = transition.$to().name; // Storing the current state name as a string

    // if the user is not logged in and the protectedStates array includes the state name
    if(!$auth.isAuthenticated() && protectedStates.includes(vm.pageName)) {
      // set a message and send the user to the login page
      vm.message = 'You must be logged in to view this page.';
      return $state.go('login');
    }

    if($auth.getPayload()) vm.currentUserId = $auth.getPayload().userId;
    if(vm.stateHasChanged) vm.message = null;
    if(!vm.stateHasChanged) vm.stateHasChanged = true;
  });

  function logout() {
    $auth.logout();
    $state.go('login');
  }

  vm.logout = logout;
}
