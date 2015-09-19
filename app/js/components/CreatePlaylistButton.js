'use strict';

var React = require('react/addons');
var Button = require('react-bootstrap').Button;

require('firebase');
var ReactFireMixin = require('reactfire');
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
    this.refOutcomeToPlaylist = this.firebase.child('relations/outcome_to_playlist/outcome_' + this.props.outcome_id);

    var newPlaylistRef = this.refPlaylists.push({ 
      author_id: this.state.user.id
    });

    var playlistId = newPlaylistRef.key();

    this.refOutcomeToPlaylist.child('playlist_' + playlistId).set({ 
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
  },

  render: function () {
    return (
      <Button onClick={this.createPlaylist}>
        Create Playlist
      </Button>
    );
  }
});

module.exports = CreatePlaylisteButton;