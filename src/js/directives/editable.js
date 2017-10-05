angular
  .module('planitApp')
  .directive('editable', editable);

editable.$inject = [];
function editable() {
  return {
    restrict: 'E',
    transclude: true,
    template: `<div class="editable" ng-class="{ editing: editing }">
      <button ng-click="toggle()" ng-if="canEdit"></button>
      <ng-transclude></ng-transclude>
    </div>`,
    scope: {
      canEdit: '=',
      update: '&'
    },
    link: function(scope) {
      scope.toggle = () => {
        if(scope.editing) scope.update();
        scope.editing = !scope.editing;
      };
    }
  };
}
