'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Router = require('react-router');
var Button = require('react-bootstrap').Button;

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

var Playlist = require('./Playlist');

var PlaylistsMultiple = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

  getInitialState: function(){
    return {
      data: [],
      outcome: null,
      didCallCallback: false
    };
  },

  componentWillMount: function() {
    this.bindFirebaseRefs();
  },

  componentDidUpdate: function(prevProps, prevState) {

    // If outcome_id or author_id changes we need to bind to new Firebase paths
    if (this.props.outcome_id !== prevProps.outcome_id || this.props.author_id !== prevProps.author_id )
      this.bindFirebaseRefs(true);

    // Pass any data we need back up the chain
    // Currently we just need title for NavBar component
    if (this.state.outcome && this.state.didCallCallback === false ){
      this.setState({ didCallCallback: true }, 
        function(){
          this.props.loadedCallback({ title: this.state.outcome.title });
      });
    } 
  },

  bindFirebaseRefs: function(rebind){

    if (rebind){
      this.unbind('data');
      this.unbind('outcome');
    }

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    // Load data for outcome
    this.refOutcome = new Firebase(firebaseRoot + '/outcomes/' + this.props.outcome_id);
    this.bindAsObject(this.refOutcome, 'outcome');

    // Fetch all playlists that are in this outcome
    if (this.props.outcome_id){
      this.refPlaylists = firebase.child('relations/outcome_to_playlist/outcome_' + this.props.outcome_id);
    // Or by author_id
    }else{
      this.refPlaylists = firebase.child('playlists')
                            .orderByChild("author_id")
                            .equalTo(parseInt(this.props.author_id));
    }

    this.bindAsArray(this.refPlaylists, 'data');
  },

  render: function () {

    // Sort playlists by upvote_count DESC order
    // Our Firebase query sorts by upvote_count, but in ASC order (no easy solution for that)
    var playlists = this.state.data.sort(function(a, b){
      return b.upvote_count - a.upvote_count;
    });

    playlists = playlists.map(function (relationData) {

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