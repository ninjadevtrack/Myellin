'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Badge = require('react-bootstrap').Badge;
var Router = require('react-router');

require('firebase');
var ReactFireMixin = require('reactfire');

var Outcomes = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

  componentWillMount: function() {
    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var refOutcomes = new Firebase(firebaseRoot + '/outcomes');
    this.bindAsArray(refOutcomes, 'outcomes');
  },

  render: function () {

    var elements = this.state.outcomes.map(function (outcome) {
      return (
        <ListGroupItem href="javascript:void(0)" onClick={this._handleClick.bind(this, outcome.id)} key={outcome['.key']}>
          {outcome.title}
          <Badge>{outcome.playlist_count}</Badge>
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
    this.context.router.transitionTo('Outcomes', {outcome_id: id});
  }

});

module.exports = Outcomes;