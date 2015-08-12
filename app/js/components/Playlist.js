'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Router = require('react-router');
var Button = require('react-bootstrap').Button;

require('firebase');
var ReactFireMixin = require('reactfire');

var AuthorName = require('./AuthorName');
var SubOutcomesMultiple = require('./SubOutcomesMultiple');
var UpvoteButton = require('./UpvoteButton');

var Playlist = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

  propTypes: {
    relationData: React.PropTypes.object.isRequired
  },

  getInitialState: function(){
    return {
      data: null
    };
  },

  componentWillMount: function() {
    this.bindFirebaseRefs();
  },

  bindFirebaseRefs: function(){

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    this.refPlaylist = firebase.child('playlists/' + this.props.relationData.playlist_id);
    this.bindAsObject(this.refPlaylist, 'data');
  },

  render: function () {

    if (!this.state.data)
      return false;

    return (
      <div className="playlist-container">
   
        <div>

          <AuthorName id={this.state.data.author_id} />

          <p>{this.state.data.description}</p>
          
          <div className="upvote">
            <div className="count">{this.props.relationData.upvote_count}</div>

            <UpvoteButton 
              label="r"
              this_type="playlist"
              this_id={this.state.data.id} 
              parent_type="outcome"
              parent_id={this.props.relationData.parent_outcome_id} />
          
          </div>
        </div>

        <SubOutcomesMultiple playlist_id={this.state.data.id} />
        
        <UpvoteButton
          this_type="playlist"
          this_id={this.state.data.id} 
          parent_type="outcome"
          parent_id={this.props.relationData.parent_outcome_id} />
        
      </div>
    );
  }

});

module.exports = Playlist;