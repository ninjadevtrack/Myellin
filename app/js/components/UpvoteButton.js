'use strict';

var React = require('react/addons');
var Button = require('react-bootstrap').Button;

require('firebase');
var ReactFireMixin = require('reactfire');

var UpvoteButton = React.createClass({

  mixins: [ReactFireMixin],

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

    this.refUpvote = firebase.child('upvotes/' + this.props.parent_outcome + '/1');
    this.bindAsObject(this.refUpvote, 'upvote');
  },

  handleUpvote: function(e){
    e.preventDefault();

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    // Store playlist_id in votes/{parent_outcome}/{user_id}
    // Assume user_id = 1 for now
    var voteRef = firebase.child('upvotes/' + this.props.parent_outcome + '/1')

    voteRef.transaction(function(currentValue) {

      // No data yet set value to playlist_id
      if (currentValue === null)
        return this.state.data.id;
      
      // If voting again for same playlist do nothing
      if (currentValue === this.props.playlist_id){
        console.log('This user already voted for playlist_id '+ this.props.playlist_id);
        return;
      }

      // De-increment upvote_count for playlist user previously voted for
      firebase.child('playlists/' + currentValue + '/upvote_count').transaction(function(currentValue) {
        return currentValue - 1;
      });

      return this.props.playlist_id;
    
    }.bind(this), function(error, committed, snapshot) {
      if (error) {
        console.log('Transaction failed abnormally!', error);
      } else if (!committed) {
        console.log('We aborted the transaction (because vote already exists).');
      } else {

        console.log('Vote added!');

        // Increment upvote_count for this playlist
        firebase.child('playlists/' + this.props.playlist_id + '/upvote_count').transaction(function(currentValue) {
          return currentValue + 1;
        });
      }
      console.log("Vote data: ", snapshot.val());
    }.bind(this));

  },

  render: function () {

    var label = (this.props.type === 'small' ? 'r' : 'recommend');

    // If we value from Firebase (user voted for a playlist for this outcome)
    // AND the playlist is this playlist ...
    if (this.state.upvote && this.state.upvote['.value'] === this.props.playlist_id){
      var bsStyle = 'success';
    }else{
      var bsStyle = 'default';
    }

    return (
      <Button bsStyle={bsStyle} onClick={this.handleUpvote}>
        {label}
      </Button>
    );
  }

});

module.exports = UpvoteButton;