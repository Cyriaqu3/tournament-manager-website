var app = angular.module('tournament', [
'ui.router',
'ui.bootstrap',
'LocalStorageModule'
    ]);

app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states
  $stateProvider
    .state('main', {
      url: "/",
      templateUrl: "views/index.html",
      reload:true
    })
    .state('login', {
      url: "/login",
      templateUrl: "views/login.html",
      controller : "loginCtrl"
    })
    .state('tournament', {
      url: "/tournament/{id:int}",
      templateUrl: "views/tournament/tournament.html",
      controller : "tournamentCtrl"
    })
    .state('tournamentList', {
      url: "/tournament/list",
      templateUrl: "views/tournament/list.html",
      controller : "tournamentListCtrl"
    })
    .state('tournamentNew', {
      url: "/tournament/new",
      templateUrl: "views/tournament/new.html",
      controller : "newTournamentCtrl"
    })
    .state('tournamentProfil', {
      url: "/tournament/edit",
      templateUrl: "views/tournament/edit.html",
      controller : "edittournamentCtrl"
    })
    .state('profil', {
      url: "/profil/{id:int}",
      templateUrl: "views/profil/profil.html",
      controller : "profilCtrl"
    })
    .state('profilList', {
      url: "/profil/list",
      templateUrl: "views/profil/list.html",
      controller : "profilListCtrl"
    })
    .state('editProfil', {
      url: "/profile/edit",
      templateUrl: "views/profil/edit.html",
      controller : "editProfilCtrl"
    });
});

app.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
});

app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);

app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('colab');
});

app.controller('mainCtrl', ['$scope', '$http','$rootScope','$location','$state','localStorageService', function($scope, $http,$rootScope,$location,$state,localStorageService)
{
  var apiAddress = "http://"+$location.host()+":"+$location.port()+"/api";

  $rootScope.apiAddress = apiAddress;

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    // called when a state change
  });
  $rootScope.$on('$stateChangeSuccess', function (event) {
    // called when a state has changed
  });

  $rootScope.logout = function(){
    localStorageService.remove("access_token");
    delete $rootScope.access_token;
    delete $rootScope.me;
    setTimeout(function(){
      location.reload();
    },500);
  }

  //check if the user is logged in and define the current one
  if(localStorageService.get("access_token")){

    console.log("Token is defined ... login the user...");

    $rootScope.access_token = localStorageService.get("access_token");
    $http({
      method: 'GET',
      url: $rootScope.apiAddress+'/me?access_token=' + $rootScope.access_token
    }).then(function successCallback(r) {
      console.log("... logged in successfully !");
      //token valid and user connected

      $rootScope.me = r.data;
      $rootScope.me.birth_date_o = $rootScope.me.birth_date;
      $rootScope.me.birth_date = new Date(moment($rootScope.me.birth_date).format("YYYY-MM-DD"));
      console.log($rootScope.me);

    }, function errorCallback(r) {

        console.log("... Invalid token !");

      //token is invalid, remove the token and logout the user

      localStorageService.remove("access_token");
      $rootScope.logout();
    });
  }

  //initialize Bootstrap components
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

}]);
