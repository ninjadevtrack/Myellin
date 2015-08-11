'use strict';

var React = require('react/addons');
var Button = require('react-bootstrap').Button;

require('firebase');
var ReactFireMixin = require('reactfire');

var UpvoteButton = React.createClass({

  mixins: [ReactFireMixin],

  getDefaultProps: function(){
    return {
      this_type: 'playlist', // playlist or suboutcome
      this_id: null,
      parent_id: null, // parent_id will belong to outcome or playlist
      size: 'default',
      label: 'recommend'
    };
  },

  getInitialState: function(){
    return {
      upvote: null
    };
  },

  componentWillMount: function() {
    this.bindFirebaseRefs();
  },

  bindFirebaseRefs: function(){

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    // We store playlist_id in votes/playlist/{parent_outcome}/{user_id}
    // Or suboutcome_id in votes/suboutcome/{parent_playlist}/{user_id}
    // Assume user_id = 1 for now
    this.refUpvote = firebase.child('upvotes/' + this.props.this_type + '/' + this.props.parent_id + '/1');

    this.bindAsObject(this.refUpvote, 'upvote');
  },

  handleUpvote: function(e){
    e.preventDefault();

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    this.refUpvote.transaction(function(currentValue) {

      // No data yet set value to this_id
      if (currentValue === null)
        return this.props.this_id;
      
      // If voting again for same thing do nothing
      if (currentValue === this.props.this_id){
        console.log('This user already voted for ' + this.props.this_type + ' with id: ' + this.props.this_id);
        return;
      }

      // De-increment upvote_count for thing user previously voted for
      firebase.child( this.props.this_type + 's/' + currentValue + '/upvote_count').transaction(function(currentValue) {
        return currentValue - 1;
      });

      return this.props.this_id;
    
    }.bind(this), function(error, committed, snapshot) {
      if (error) {
        console.log('Transaction failed abnormally!', error);
      } else if (!committed) {
        console.log('We aborted the transaction (because vote already exists).');
      } else {

        console.log('Vote added!');

        // Increment upvote_count for this
        firebase.child( this.props.this_type + 's/' + this.props.this_id + '/upvote_count').transaction(function(currentValue) {
          return currentValue + 1;
        });
      }
      console.log("Vote data: ", snapshot.val());
    }.bind(this));

  },

  render: function () {

    // If we have value from Firebase (user voted for something for this parent_id)
    // AND the value equals this_id, then vote button should show success state ...
    if (this.state.upvote && this.state.upvote['.value'] === this.props.this_id){
      var bsStyle = 'success';
    }else{
      var bsStyle = 'default';
    }

    return (
      <Button bsSize={this.props.size} bsStyle={bsStyle} onClick={this.handleUpvote}>
        {this.props.label}
      </Button>
    );
  }

});

module.exports = UpvoteButton;