angular.module('playlytics.controllers', [])

.controller('SearchCtrl', function($scope, $state, $ionicModal,$ionicSlideBoxDelegate, PlaylistsService, SpotifyService, TrackService) {
  $ionicModal.fromTemplateUrl('playlists-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.tracks = {};

  $scope.playlists = PlaylistsService.all();

  $scope.searchTrack = function (query){
    if (query.length > 2){
      SpotifyService.search(query).success(function(data) {
        $scope.tracks = data.tracks.items;
      });
    } else {
      $scope.tracks = {};
    }
  };

  $scope.openPlaylistsModal = function(track) {
    $scope.tracks.newTrack = track;
    $scope.modal.show();
  }

  $scope.closeModal = function() {
     $scope.modal.hide();
  };

  $scope.addTrackToPlaylist = function(playlistIndex) {
    newTrack = $scope.tracks.newTrack
    TrackService.saveToPlaylist(newTrack, playlistIndex)
    $scope.isSavedToPlaylist = true;
    $scope.modal.hide();
  };

  $scope.createNewPlaylist = function() {
    $scope.modal.hide();
    $state.go('tab.playlists')
  };

})

.controller('PlaylistsCtrl', function($scope, PlaylistsService) {
  $scope.data = {}
  $scope.data.playlists = PlaylistsService.all();

  $scope.addPlaylist = function(playlist){
    if (!playlist) { return; }

    var newPlaylist = {
        title: playlist.newPlaylist.trim(),
        tags: [],
        songs: [],
        totalDuration: 0,
        coolnessFactor: 0
      };

    playlists = PlaylistsService.save(newPlaylist);

    if (playlists){
      $scope.data.playlists = null;
      $scope.data.playlists = playlists;
      $scope.data.newPlaylist = null;
    }
  };

  $scope.addTags = function(playlistIndex) {
    $scope.data.playlists[playlistIndex].tags.push($scope.tags)
    // playlists = PlaylistsService.save($scope.data.playlists);
    // $scope.data.playlists = playlists;
  };

  $scope.removeTag = function(playlist) {
    alert('remove tags')
  };

  $scope.remove = function(playlistId) {
    playlists = PlaylistsService.remove(playlistId);
    $scope.data.playlists = playlists;
  }
})

.controller('PlaylistDetailCtrl', function($scope, $stateParams, PlaylistsService, TrackService) {
  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true
  $scope.playlist = PlaylistsService.get($stateParams.playlistId);

  $scope.reorderItem = function(track, fromIndex, toIndex) {

    $scope.playlist.songs.splice(fromIndex, 1);
    $scope.playlist.songs.splice(toIndex,0,track);
    TrackService.saveReorderTrack($scope.playlist);
  };

  $scope.deleteTrack = function(index){
    playlistId = $stateParams.playlistId;
    TrackService.deleteTrack(playlistId, index);
    $scope.playlist = PlaylistsService.get($stateParams.playlistId);
  };
})

