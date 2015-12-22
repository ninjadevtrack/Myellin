require('firebase');

/*
    Extract some Firebase calls to this helper so that we can reduce code duplication.
*/

var DbHelper = (function () {

  var firebaseRoot;

  if (window.location.href.indexOf("myelin.io") > -1 ||
      window.location.href.indexOf("blazing-fire-4313") > -1){
    firebaseRoot = 'https://blazing-fire-4313.firebaseio.com';
  }else{
    firebaseRoot = 'https://myelin-gabe.firebaseio.com';
  }

  // Uncomment to always load production Firebase
  //firebaseRoot = 'https://blazing-fire-4313.firebaseio.com';

  var _firebase = new Firebase(firebaseRoot);

  var models = {

    getFirebase: function(){
      return _firebase;
    },

    outcome: {

      incrementPlaylistCount: function(outcome_id, increment){
        var refOutcome = _firebase.child('outcomes/' + outcome_id);


        refOutcome.child('playlist_count').transaction(function(currentValue) {
          if (!currentValue)
            currentValue = 0;

          return currentValue + increment;
        });

      }

    },

    playlists: {

      create: function(author_id, parent_outcome_id, isPrivate){
        var refPlaylists = _firebase.child('playlists');

        // Create playlist
        var newPlaylistRef = refPlaylists.push({ 
          author_id: author_id,
          description: '',
          suboutcome_count: 0,
          private: isPrivate
        });

        // Get new playlist ID
        var playlistId = newPlaylistRef.key();

        var firebasePaths = {};

        // Add playlist to outcome (update relations table)
        firebasePaths['relations/outcome_to_playlist/outcome_' + parent_outcome_id + '/playlist_' + playlistId] = {
          parent_outcome_id: parent_outcome_id,
          playlist_id: playlistId,
          upvote_count: 0
        };

        // So we can quickly lookup a playlist by user/outcome
        // We need to do this to see if a given user has already created a playlist for an outcome
        firebasePaths['relations/user_to_outcome_to_playlist/user_' + author_id +'/outcome_' + parent_outcome_id] = playlistId;

        // Update both firebase paths at same time
        // See: https://www.firebase.com/blog/2015-09-24-atomic-writes-and-more.html
        _firebase.update(firebasePaths, function(error) {
          if (error) {
            console.log("Error creating playlist:", error);
          }
        });

        // Increment the outcome's playlist_count
        models.outcome.incrementPlaylistCount(parent_outcome_id, 1);

        return playlistId;
      },

      set_editing: function(user_id, parent_outcome_id, playlist_id){

        var userEditPlaylistRef = _firebase.child('users/' + user_id + '/editing_playlist');

        userEditPlaylistRef.update({
          parent_outcome_id: parent_outcome_id,
          playlist_id: playlist_id,
          collapse: false
        });

      },

      update: function(playlist_id, data){
        var refPlaylist = _firebase.child('playlists/' + playlist_id);
        refPlaylist.update(data);
      },

      delete: function(playlist_id, parent_outcome_id, author_id){

        // Remove the playlist
        var refPlaylist = _firebase.child('playlists/' + playlist_id);
        refPlaylist.remove();

        // Remove playlist from outcome
        var refOutcomeToPlaylist = _firebase.child('relations/outcome_to_playlist/outcome_' + parent_outcome_id + '/playlist_' + playlist_id);
        refOutcomeToPlaylist.remove();

        // Remove user_to_outcome_to_playlist relation
        // So when we lookup whether user has a playlist for this outcome already it returns false
        var userOutcomePlaylistRef = _firebase.child('relations/user_to_outcome_to_playlist/user_' + author_id +'/outcome_' + parent_outcome_id);
        userOutcomePlaylistRef.remove();

        // De-increment the outcome's playlist_count
        models.outcome.incrementPlaylistCount(parent_outcome_id, -1);
      },

      viewed: function(playlist_id){
        var refPlaylist = _firebase.child('playlists/' + playlist_id);
        
        refPlaylist.child('view_count').transaction(function(currentValue) {
          if (!currentValue)
            currentValue = 0;

          return currentValue + 1;
        });
      },



      /*
      // No longer needed
      incrementSuboutcomeCount: function(playlist_id, increment){
        var refPlaylist = _firebase.child('playlists/' + playlist_id);

        refPlaylist.child('suboutcome_count').transaction(function(currentValue) {
          if (!currentValue)
            currentValue = 0;

          return currentValue + increment;
        });
      }*/
    },

    options: {
      create: function(author_id, parent_suboutcome_id, description){

        // Option ref
        var refOptions = _firebase.child('options');

        // Create Option
        var newOptionRef = refOptions.push({ 
          author_id: author_id,
          description: (description || '')
        });

        // Get Option id
        // This will return a value before Option is write succeeds
        var option_id = newOptionRef.key();

        // Add this option to suboutcome
        // TODO: Rollback add_option if above refOptions.push() fails (use error callback)
        // TODO (future): Allow creating an option without adding to suboutcome
        if (parent_suboutcome_id)
          models.suboutcomes.add_option(parent_suboutcome_id, option_id);

        return option_id;
      },

      update: function(option_id, description){

        var refOption = _firebase.child('options/' + option_id);

        refOption.update({ 
          description: description,
          editing: null
        });
      },

      delete: function(parent_suboutcome_id, option_id){

        // We don't actually delete the option, just remove from suboutcome
        models.suboutcomes.remove_option(parent_suboutcome_id, option_id);
      },

      set_editing: function(user_id, parent_suboutcome_id, option_id){

        var refEditingOption = _firebase.child('users/' + user_id + '/editing_option');

        refEditingOption.set({ 
          parent_suboutcome_id: parent_suboutcome_id,
          option_id: option_id
        });
      },

      remove_editing: function(user_id){

        _firebase.child('users/' + user_id + '/editing_option').remove();
      }
    },

    suboutcomes: {

      create: function(title, author_id, callback){

        var refSuboutcomes = _firebase.child('suboutcomes');
    
        var newRef = refSuboutcomes.push({ 
            title: title,
            author_id: author_id,
            option_count: 0
        }, 
        // Callback
        function(error){
          callback && callback(error);
        });

        // Return suboutcome id
        return newRef.key();
      },

      delete: function(parent_playlist_id, suboutcome_id){

        // Remove suboutcome from playlist
        // TODO: Move to playlists.remove_suboutcome() (since we arent actually deleting the suboutcome object)
        var refPlaylistToSuboutcome = _firebase.child('relations/playlist_to_suboutcome/playlist_' + parent_playlist_id + '/suboutcome_' + suboutcome_id);
        refPlaylistToSuboutcome.remove();
      },

      add_option: function(suboutcome_id, option_id){

        // Option relations ref
        var refSuboutcomeToOption = _firebase.child('relations/suboutcome_to_option/suboutcome_' + suboutcome_id);

        // Add Option to Suboutcome (add relation)
        refSuboutcomeToOption.child('option_' + option_id).set({
          parent_suboutcome_id: suboutcome_id,
          option_id: option_id,
          upvote_count: 0
        });

        // Increment the Suboutcome's option_count
        _firebase.child('suboutcomes/' + suboutcome_id + '/option_count').transaction(function(currentValue) {
          if (!currentValue)
            currentValue = 0;
          return currentValue + 1;
        });
      },

      remove_option: function(suboutcome_id, option_id){
        // Option relations ref
        var refSuboutcomeToOption = _firebase.child('relations/suboutcome_to_option/suboutcome_' + suboutcome_id  + '/option_' + option_id);
        refSuboutcomeToOption.remove();

        // De-increment the Suboutcome's option_count
        _firebase.child('suboutcomes/' + suboutcome_id + '/option_count').transaction(function(currentValue) {
          if (!currentValue)
            currentValue = 0;
          return currentValue - 1;
        });
      },

      choose_option: function(playlist_id, suboutcome_id, option_id){
        _firebase.child('relations' +
                      '/playlist_to_suboutcome' +
                      '/playlist_' + playlist_id + 
                      '/suboutcome_' + suboutcome_id + 
                      '/chosen_option').set(option_id);

      }
    }

  }

  return models;

}());


module.exports = DbHelper;