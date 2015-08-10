'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Router = require('react-router');
var Button = require('react-bootstrap').Button;

require('firebase');
var ReactFireMixin = require('reactfire');

var AuthorName = React.createClass({

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

    this.refAuthor = firebase.child('users/' + this.props.id);
    this.bindAsObject(this.refAuthor, 'data');
  },

  render: function () {
 
    var name = (this.state.data.full_name || '•••');

    return (
      <h4>
        {name}
      </h4>
    );
  }

});

module.exports = AuthorName;