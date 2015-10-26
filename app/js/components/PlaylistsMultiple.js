'use strict';

var DbHelper = require('../DbHelper');

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
      data: []
    };
  },

  componentWillMount: function() {

    setTimeout(function(){
      this.bindFirebaseRefs();
    }.bind(this), 50);

  },

  shouldComponentUpdate: function(){
    //console.log('componentShouldUpdate', this.state);
    return true;
  },

  componentWillUpdate: function(nextProps, nextState) {

    //this.bindFirebaseRefs(nextState);

    // Pass any data we need back up the chain
    // Currently we just need title for NavBar component

  },

  unbindRef: function(firebaseRef, bindVar){
    try {
      this.unbind(bindVar);
    }catch(e){}

    delete this[firebaseRef];
  },

  _isset: function(variable){
    if (typeof variable !== 'undefined'){
      return true;
    }else{
      return false;
    }
  },


  bindFirebaseRefs: function(nextState){

    this.firebase = DbHelper.getFirebase();

    this.newRefPlaylists = this.firebase.child('relations/outcome_to_playlist/outcome_' + this.props.outcome_id);

    if (!this.refPlaylists || this.refPlaylists.toString() !== this.newRefPlaylists.toString()){ 
      this.unbindRef('refPlaylists', 'data');
      this.refPlaylists = this.newRefPlaylists;
      this.bindAsArray(this.refPlaylists, 'data');
    }

    /*
    else{ // Or by author_id
      this.refPlaylists = this.firebase.child('playlists')
                            .orderByChild("author_id")
                            .equalTo(parseInt(this.props.author_id));
    }*/
  
  },

  render: function () {

    // Sort playlists by upvote_count DESC order
    // Our Firebase query sorts by upvote_count, but in ASC order (no easy solution for that)
    var playlists = this.state.data.sort(function(a, b){
      return b.upvote_count - a.upvote_count;
    });

    playlists = playlists.map(function (relationData, i) {

      relationData.parent_outcome_id = this.props.outcome_id;

      return (
        <Playlist 
          relationData={relationData}
          number={i+1}
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