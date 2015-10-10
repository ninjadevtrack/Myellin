require('firebase');

/*
    Extract some Firebase calls to this helper so that we can reduce code duplication.
*/

var DbHelper = (function () {

  var _firebase = new Firebase('https://myelin-gabe.firebaseio.com');

  var models = {

    options: {

      create: function(parent_suboutcome_id, user_id){

        // Option ref
        var refOptions = _firebase.child('options');
        // Option relations ref
        var refSuboutcomeToOption = _firebase.child('relations/suboutcome_to_option/suboutcome_' + parent_suboutcome_id);

        // Create Option
        var newOptionRef = refOptions.push({ 
          author_id: user_id,
          description: '',
          editing: true
        });

        // Get Option id
        // This will return a value before Option is write succeeds
        var optionId = newOptionRef.key();

        // Add Option to Suboutcome (add relation)
        refSuboutcomeToOption.child('option_' + optionId).set({
          parent_suboutcome_id: parent_suboutcome_id,
          option_id: optionId,
          upvote_count: 0
        });

        // Increment the Suboutcome's option_count
        _firebase.child('suboutcomes/' + parent_suboutcome_id + '/option_count').transaction(function(currentValue) {
          if (!currentValue)
            currentValue = 0;
          return currentValue + 1;
        });
      },

      delete: function(parent_suboutcome_id, option_id){

        // Option relations ref
        var refSuboutcomeToOption = _firebase.child('relations/suboutcome_to_option/suboutcome_' + parent_suboutcome_id  + '/option_' + option_id);
        refSuboutcomeToOption.remove();

        // De-increment the Suboutcome's option_count
        _firebase.child('suboutcomes/' + parent_suboutcome_id + '/option_count').transaction(function(currentValue) {
          if (!currentValue)
            currentValue = 0;
          return currentValue - 1;
        });

      }

    }

  }

  return models;

}());


module.exports = DbHelper;