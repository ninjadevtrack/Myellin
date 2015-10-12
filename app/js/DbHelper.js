require('firebase');

/*
    Extract some Firebase calls to this helper so that we can reduce code duplication.
*/

var DbHelper = (function () {

  var _firebase = new Firebase('https://myelin-gabe.firebaseio.com');

  var models = {

    options: {
      create: function(author_id, parent_suboutcome_id){

        // Option ref
        var refOptions = _firebase.child('options');

        // Create Option
        var newOptionRef = refOptions.push({ 
          author_id: author_id,
          description: '',
          editing: true
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

      delete: function(parent_suboutcome_id, option_id){

        // We don't actually delete the option, just remove from suboutcome
        models.suboutcomes.remove_option(parent_suboutcome_id, option_id);
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