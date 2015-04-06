// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.directory', {
    url: '/directory',
    views: {
      'tab-directory': {
        templateUrl: 'templates/tab-directory.html',
        controller: 'DirectoryCtrl'
      }
    }
  })

  .state('tab.specialty', {
    url: '/specialty/:specialtyId',
    views: {
      'tab-directory': {
        templateUrl: 'templates/tab-specialty.html',
        controller: 'SpecialtyCtrl'
      }
    }
  })

  .state('tab.team', {
    url: '/team/:teamId',
    views: {
      'tab-directory': {
        templateUrl: 'templates/tab-team.html',
        controller: 'TeamCtrl'
      }
    }
  })

  .state('tab.staff', {
    url: '/staff/:staffId',
    views: {
      'tab-directory': {
        templateUrl: 'templates/tab-staff.html',
        controller: 'StaffCtrl'
      }
    }
  })

  .state('tab.messages', {
      url: '/messages',
      views: {
        'tab-messages': {
          templateUrl: 'templates/tab-messages.html',
          controller: 'MessagesCtrl'
        }
      }
  })
  
  .state('tab.message-detail', {
    url: '/messages/:chatId',
    views: {
      'tab-messages': {
        templateUrl: 'templates/message-detail.html',
        controller: 'MessageDetailCtrl'
      }
    }
  })

  .state('tab.call-log', {
    url: '/call-log',
    views: {
      'tab-call-log': {
        templateUrl: 'templates/tab-call-log.html',
        controller: 'CallLogCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/directory');

});
