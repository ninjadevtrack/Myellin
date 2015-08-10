'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Router = require('react-router');
var Button = require('react-bootstrap').Button;

require('firebase');
var ReactFireMixin = require('reactfire');

var UpvoteButton = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

  getInitialState: function(){
    return {
      upvote: null
    };
  },

  componentWillMount: function() {
    this.bindFirebaseRefs();
  },

  bindFirebaseRefs: function(){

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    this.refUpvote = firebase.child('upvotes/' + this.props.parent_outcome + '/1');
    this.bindAsObject(this.refUpvote, 'upvote');
  },

  render: function () {

    var bsStyle = 'default';
 
    var label = (this.props.type === 'small' ? 'r' : 'recommend');

    if (this.state.upvote && this.state.upvote['.value'] === this.props.playlist_id){
      bsStyle = 'success';
    }

    return (
      <Button bsStyle={bsStyle} onClick={this.props.handleUpvote}>
        {label}
      </Button>
    );
  }

});

module.exports = UpvoteButton;