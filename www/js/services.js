angular.module('playlytics.services', [])

.factory('PlaylistsService', function(StoreService) {

  var _playlists = function(value) {
    if (value != null) {
      return StoreService.playlists(value);
    } else {
      return StoreService.playlists() || StoreService.playlists([]);
    }
  };

  var all = function() {
    return _playlists()
  };

  var remove = function(playlistId) {
    playlists = _playlists()
    playlists.splice(playlistId, 1);
    return _playlists(playlists);

  };

  var get = function(playlistId) {
    return _playlists()[parseInt(playlistId)]
  }

  var save = function(newPlaylist) {
    playlists = _playlists()
    if (isValid(newPlaylist)) {
      playlists.push(newPlaylist);
      return _playlists(playlists)
    } else {
      return false;
    }
  };

  var isValid = function(newPlaylist) {
    return isUniquePlaylistTitle(newPlaylist);
  };

  var isUniquePlaylistTitle = function(newPlaylist) {
    playlists = StoreService.playlists();
    var isUnique = true;
    angular.forEach(playlists, function(value, key) {
      if (newPlaylist.title.toLowerCase() ==  value.title.toLowerCase()) {
        alert('playlist exist with same name exists');
        isUnique = false;
        return
      }
    });
    return isUnique;
  };

  return {
    all: all,
    remove: remove,
    get: get,
    save: save
  };
})

.factory('SpotifyService', function($http) {

  SPOTIFY_URL = "https://api.spotify.com/v1/"
  search = function (query) {
    var url = SPOTIFY_URL + "search?q=" + query + "&type=track";
    delete $http.defaults.headers.common['X-Requested-With'];
    return $http.get(url);
  };

  return {
    search: search
  };
})

.factory('TrackService', function(StoreService) {

  var _playlists = function(value) {
    if (value != null) {
      return StoreService.playlists(value);
    } else {
      return StoreService.playlists() || StoreService.playlists([]);
    }
  };

  var calCoolnessFactor = function(playlist) {
    var sumOfDurationTimesPopularity = 0;
    angular.forEach(playlist.songs, function(value,key) {
      sumOfDurationTimesPopularity += (value.popularity * value.duration_ms);
    });
    var coolness = sumOfDurationTimesPopularity/playlist.totalDuration;
    if (isNaN(coolness)) {
      return 0;
    } else {
      return Math.round(coolness);
    }
  };

  var saveToPlaylist = function(newTrack, playlistIndex) {
    playlists = _playlists();
    playlist = playlists[playlistIndex]
    if (isValid(playlist, newTrack)) {
      playlist.totalDuration += newTrack.duration_ms;
      playlist.songs.push(newTrack);
      playlist.coolnessFactor = calCoolnessFactor(playlist);
      } else {
        return false;
      }
    return _playlists(playlists);
  };

  var deleteTrack = function(playlistId, trackIndex) {
    playlists = _playlists();
    currentPlaylist = playlists[playlistId]
    currentPlaylist.totalDuration -= currentPlaylist.songs[parseInt(trackIndex)].duration_ms;
    currentPlaylist.songs.splice(parseInt(trackIndex),1)
    currentPlaylist.coolnessFactor = calCoolnessFactor(currentPlaylist);
    return _playlists(playlists);
  };


  var isValid = function(playlist, newTrack) {
    return isUniqueTrack(playlist, newTrack);
  };

  var isUniqueTrack = function(playlist, newTrack) {
    var isUnique = true;
    angular.forEach(playlist.songs, function(track) {
      if (track.id ===  newTrack.id) {
        alert('Track is already part of playlist');
        isUnique = false;
        return
      }
    });
    return isUnique;
  }

  var saveReorderTrack = function(currentPlaylist) {
    var playlists = _playlists()
    angular.forEach(playlists, function(playlist, key) {
      if (playlist.title == currentPlaylist.title){
        playlists[key] = currentPlaylist;
        return _playlists(playlists);
      }
    });
  };

  return {

    deleteTrack: deleteTrack,
    saveToPlaylist: saveToPlaylist,
    saveReorderTrack: saveReorderTrack

  };

})

.factory('StoreService', function($window, $rootScope) {
  storageAccessor = function(storage, key) {
    return function(value) {
      var valJson;
      if (value != null) {
        storage.setItem(key, JSON.stringify(value));
        valJson = storage.getItem(key);
        return JSON.parse(valJson);
        // return storage.setItem(key, JSON.stringify(value));
      } else if (value === null) {
        return storage.removeItem(key);
      } else {
        valJson = storage.getItem(key);
        return (valJson != null) && JSON.parse(valJson);
      }
    };
  };

  persistentAccessor = function(key) {
    return storageAccessor($window.localStorage, key);
  };

  return {

    playlists: persistentAccessor('playlists'),

  };

});

