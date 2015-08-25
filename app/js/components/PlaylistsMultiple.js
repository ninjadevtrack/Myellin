'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Router = require('react-router');
var Button = require('react-bootstrap').Button;

require('firebase');
var ReactFireMixin = require('reactfire');

var Playlist = require('./Playlist');
var EditPlaylist = require('../components/EditPlaylist');

var PlaylistsMultiple = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

  getInitialState: function(){
    return {
      playlists: []
    };
  },

  componentWillMount: function() {
    this.bindFirebaseRefs();
  },

  componentDidUpdate: function(prevProps, nextState) {
    // If outcome_id or author_id changes we need to bind to new Firebase paths
    if (this.props.outcome_id !== prevProps.outcome_id ||
              this.props.author_id !== prevProps.author_id ){
      this.bindFirebaseRefs(true);
    }
  },

  bindFirebaseRefs: function(rebind){

    if (rebind)
      this.unbind('data');

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    // Fetch all playlists that are in this outcome
    if (this.props.outcome_id){
      this.refPlaylists = firebase.child('relations/outcome_to_playlist/outcome_' + this.props.outcome_id);

      // TODO: Set priority equal to vote count so they get sorted correctly

    // Or by author_id
    }else{
      this.refPlaylists = firebase.child('playlists')
                              .orderByChild("author_id")
                              .equalTo(parseInt(this.props.author_id));
    }

    this.bindAsArray(this.refPlaylists, 'data');
  },

  render: function () {

    var playlists = this.state.data.map(function (relationData) {

      relationData.parent_outcome_id = parseInt(this.props.outcome_id);

      return (
        <Playlist 
          relationData={relationData}
          key={relationData.playlist_id}/>
      );

    }.bind(this));

    return (
      <div className="playlists-multiple">
        {playlists}
      </div>
    );
  }


});

module.exports = PlaylistsMultiple;