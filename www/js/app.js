angular.module('playlytics', ['ionic', 'playlytics.controllers', 'playlytics.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider) {
  $ionicConfigProvider.views.maxCache(0);

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.search', {
    url: '/search',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'SearchCtrl'
      }
    }
  })

  .state('tab.playlists', {
      url: '/playlists',
      views: {
        'tab-playlists': {
          templateUrl: 'templates/tab-playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })
    .state('tab.playlist-detail', {
      url: '/playlists/:playlistId',
      views: {
        'tab-playlists': {
          templateUrl: 'templates/playlist-detail.html',
          controller: 'PlaylistDetailCtrl'
        }
      }
    })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/search');

});
