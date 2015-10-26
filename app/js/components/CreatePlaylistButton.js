'use strict';

var DbHelper = require('../DbHelper');

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

  create: function(e){
    e.preventDefault();

    if (!this.state.user){
      alert('You must be logged in');
      return;
    }

    this.firebase = DbHelper.getFirebase();
    this.userOutcomePlaylistRef = this.firebase.child('relations/user_to_outcome_to_playlist/user_' + this.state.user.id +'/outcome_' + this.props.outcome_id);

    this.userOutcomePlaylistRef.once('value', function(snap) {
      var playlist_id = snap.val();

      if (playlist_id){ // We already have a playlist in this outcome
        // Start editing it
        this.firebase.child('users/' + this.state.user.id).update({
          editing_playlist: {
            parent_outcome_id: this.props.outcome_id,
            playlist_id: playlist_id,
            collapse: false
          }
        });
      }else{
        this.createPlaylist();
      }

    }.bind(this));

  },

  createPlaylist: function(){

    this.refPlaylists = this.firebase.child('playlists');

    // Create playlist
    var newPlaylistRef = this.refPlaylists.push({ 
      author_id: this.state.user.id,
      description: ''
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

    // So we can quickly lookup a playlist by user/outcome
    // We need to do this to see if a given user has already created a playlist for an outcome
    playlistDataForFirebase['relations/user_to_outcome_to_playlist/user_' + this.state.user.id +'/outcome_' + this.props.outcome_id] = playlistId;

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

    if (!this.state.user)
      return false;

    return (
      <div className="createplaylistbutton">
        <Button onClick={this.create} style={{fontSize: '2.5em', margin: '0', padding: '0'}}  bsStyle='link'>
          <span style={{width: '100%', textDecoration: 'underline'}}>new list</span>
        </Button>
      </div>
    );
  }
});

module.exports = CreatePlaylisteButton;