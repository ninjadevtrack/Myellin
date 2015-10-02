'use strict';

var React = require('react/addons');
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon; 

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

var AuthMixin = require('./../mixins/AuthMixin.js');

var CreatePlaylisteButton = React.createClass({

  mixins: [ReactFireMixin, AuthMixin],

  getDefaultProps: function(){},

  getInitialState: function(){
    return {};
  },

  createPlaylist: function(e){
    e.preventDefault();

    if (!this.state.user){
      alert('You must be logged in');
      return;
    }

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    this.firebase = new Firebase(firebaseRoot);
    this.refPlaylists = this.firebase.child('playlists');

    // Create playlist
    var newPlaylistRef = this.refPlaylists.push({ 
      author_id: this.state.user.id
    });

    // Get new playlist ID
    var playlistId = newPlaylistRef.key();

    // Object that holds Firebase paths we want to update at same time
    var playlistDataForFirebase = {};

    // Populate object ...
    // Add playlist to outcome (update relations table)
    playlistDataForFirebase['relations/outcome_to_playlist/outcome_' + this.props.outcome_id + '/playlist_' + playlistId] = {
      parent_outcome_id: this.props.outcome_id,
      playlist_id: playlistId,
      upvote_count: 0
    };

    // Populate object ..
    // Add playlist to user's "editing_playlist" object so that edit playlist modal is displayed
    playlistDataForFirebase['users/' + this.state.user.id + '/editing_playlist'] = {
      parent_outcome_id: this.props.outcome_id,
      playlist_id: playlistId,
      collapse: false
    };

      // Populate object ..
    // Add playlist to user's "editing_playlist" object so that edit playlist modal is displayed
    playlistDataForFirebase['users/' + this.state.user.id + '/editing_playlist'] = {
      parent_outcome_id: this.props.outcome_id,
      playlist_id: playlistId,
      collapse: false
    };

    // Update both firebase paths at same time
    // See: https://www.firebase.com/blog/2015-09-24-atomic-writes-and-more.html
    this.firebase.update(playlistDataForFirebase, function(error) {
      if (error) {
        console.log("Error creating playlist:", error);
      }
    });

    // Increment the outcome's playlist_count
    this.firebase.child('outcomes/' + this.props.outcome_id + '/playlist_count').transaction(function(currentValue) {
      if (!currentValue)
        currentValue = 0;

      return currentValue + 1;
    });

    /*
    this.refOutcomeToPlaylist.child('playlist_' + playlistId).({
      parent_outcome_id: this.props.outcome_id,
      playlist_id: playlistId,
      upvote_count: 0
    });

    this.refUser = this.firebase.child('users/' + this.state.user.id).update({
      editing_playlist: {
        parent_outcome_id: this.props.outcome_id,
        playlist_id: playlistId,
        collapse: false
      }
    });
    */

  },

  render: function () {

    return (
      <div className="createplaylistbutton">
        <Button onClick={this.createPlaylist} style={{fontSize: '6em', margin: '0', padding: '0'}}  bsStyle='link'>
          <Glyphicon glyph='pencil' className='createicon' />
        </Button>
      </div>
    );
  }
});

module.exports = CreatePlaylisteButton;