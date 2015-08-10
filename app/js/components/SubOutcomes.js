'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Router = require('react-router');

require('firebase');
var ReactFireMixin = require('reactfire');

var SubOutcomes = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

  getInitialState: function(){
    return {
      data: []
    };
  },

  componentWillMount: function() {
    this.bindFirebaseRefs();
  },

  bindFirebaseRefs: function(){
    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    this.refSubOutcomes = firebase.child('suboutcomes')
                            .orderByChild("parent_playlist")
                            .equalTo(this.props.parent_playlist);

    this.bindAsArray(this.refSubOutcomes, 'data');
  },

  render: function () {

    var elements = this.state.data.map(function (suboutcome) {
      return (
        <ListGroupItem href="javascript:void(0)" onClick={this._handleClick.bind(this, suboutcome.id)} key={suboutcome['.key']}>
          {suboutcome.title}
        </ListGroupItem>
      );
    }.bind(this));

    return (
      <ListGroup fill>
        {elements}
      </ListGroup>
    );
  },


  _handleClick: function (id) {

  }
 

});

module.exports = SubOutcomes;