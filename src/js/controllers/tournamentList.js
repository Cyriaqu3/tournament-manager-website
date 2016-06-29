app.controller('tournamentListCtrl', ['$scope', '$http','$rootScope','$location','$state','localStorageService', function($scope, $http,$rootScope,$location,$state,localStorageService)
{

  if(!$rootScope.me){
    $state.go('login');
  }

  $http({
    method: 'GET',
    url: $rootScope.apiAddress+'/tournaments?access_token=' + $rootScope.access_token
  }).then(function successCallback(r) {
    $scope.tournaments = r.data;
    for (var i = 0; i < $scope.tournaments.length; i++) {
      $scope.tournaments[i].players_count = $scope.tournaments[i].accounts.length;
    }
  }, function errorCallback(r) {
      console.log(r);
  });

}]);
