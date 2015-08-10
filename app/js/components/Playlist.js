'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Router = require('react-router');
var Button = require('react-bootstrap').Button;

require('firebase');
var ReactFireMixin = require('reactfire');

var AuthorName = require('./AuthorName');
var SubOutcomes = require('./SubOutcomes');
var UpvoteButton = require('./UpvoteButton');

var Playlist = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

  getInitialState: function(){
    return {
      data: {}
    };
  },

  componentWillMount: function() {
    this.bindFirebaseRefs();
  },

  bindFirebaseRefs: function(){

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    this.refPlaylist = firebase.child('playlists/' + this.props.id);
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
            <div className="count">{this.state.data.upvote_count}</div>

            <UpvoteButton 
              type="small" 
              playlist_id={this.state.data.id} 
              parent_outcome={this.state.data.parent_outcome} 
              handleUpvote={this.handleUpvote} />
          
          </div>
        </div>

        <SubOutcomes parent_playlist={this.props.id} />

        <UpvoteButton
          type="large" 
          playlist_id={this.state.data.id} 
          parent_outcome={this.state.data.parent_outcome} 
          handleUpvote={this.handleUpvote} />
        
      </div>
    );
  },

  handleUpvote: function(e){
    e.preventDefault();

    if (!this.state.data){
      console.log('Can\'t vote, playlist data not loaded yet');
      return false;
    }

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    // Store playlist_id in votes/{parent_outcome}/{user_id}
    // Assume user_id = 1 for now
    var voteRef = firebase.child('upvotes/' + this.state.data.parent_outcome + '/1')

    voteRef.transaction(function(currentValue) {

      // No data yet set value to playlist_id
      if (currentValue === null)
        return this.state.data.id;
      
      // If voting again for same playlist do nothing
      if (currentValue === this.state.data.id){
        console.log('This user already voted for playlist_id '+ this.state.data.id);
        return;
      }

      // De-increment upvote_count for playlist user previously voted for
      firebase.child('playlists/' + currentValue + '/upvote_count').transaction(function(currentValue) {
        return currentValue - 1;
      });

      return this.state.data.id;
    
    }.bind(this), function(error, committed, snapshot) {
      if (error) {
        console.log('Transaction failed abnormally!', error);
      } else if (!committed) {
        console.log('We aborted the transaction (because vote already exists).');
      } else {

        console.log('Vote added!');

        // Increment upvote_count for this playlist
        this.refPlaylist.child('upvote_count').transaction(function(currentValue) {
          return currentValue + 1;
        });
      }
      console.log("Vote data: ", snapshot.val());
    }.bind(this));

  },

  _handleClick: function (id) {
    //this.context.router.transitionTo('Outcomes', {outcome_id: id});
  }

});

module.exports = Playlist;