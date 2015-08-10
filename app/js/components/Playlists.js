'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Router = require('react-router');
var Button = require('react-bootstrap').Button;

require('firebase');
var ReactFireMixin = require('reactfire');

var Playlist = require('./Playlist');

var Playlists = React.createClass({

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
    // If outcome_id changes we need to bind new Firebase refs
    if (this.props.outcome_id !== prevProps.outcome_id){
      this.bindFirebaseRefs(true);
    }
  },

  bindFirebaseRefs: function(rebind){

    if (rebind)
      this.unbind('data');

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    this.refPlaylists = firebase.child('playlists')
                            .orderByChild("parent_outcome")
                            .equalTo(parseInt(this.props.outcome_id));

    this.bindAsArray(this.refPlaylists, 'data');
  },

  render: function () {

    var playlists = this.state.data.map(function (playlist) {
      return (
        <Playlist id={playlist.id} key={playlist['.key']}/>
      );
    }.bind(this));

    return (
      <div className="playlists">
        {playlists}
      </div>
    );
  }


});

module.exports = Playlists;