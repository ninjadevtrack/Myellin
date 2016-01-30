'use strict';

var DbHelper = require('../DbHelper');

var React = require('react');
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
        this.editNewPlaylist();
      }

    }.bind(this));

    mixpanel.track('Create Learning List Clicked', {});

  },

  editNewPlaylist: function(){

    // DEPRECATED: We no longer create the playlist first
    // Create the playlist
    //var playlistId = DbHelper.playlists.create(this.state.user.id, this.props.outcome_id, true);

    // Start editing playlist (null playlist_id since we don't create the playlist until saved)
    DbHelper.playlists.set_editing(this.state.user.id, this.props.outcome_id, null);
  },

  render: function () {

    if (!this.state.user)
      return false;

    return (
      <div className="createplaylistbutton">
        <Button onClick={this.create} style={{fontSize: '2.7vw', margin: '0 0 10px 0', padding: '0'}}  bsStyle='link'>
          <span style={{width: '100%'}}>+ Manual</span>
        </Button>
      </div>
    );
  }
});

module.exports = CreatePlaylisteButton;