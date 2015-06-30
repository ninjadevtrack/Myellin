'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Badge = require('react-bootstrap').Badge;
var Router = require('react-router');


var Outcomes = React.createClass({

  mixins: [Router.Navigation, Router.State],

  render: function () {

    var outcomes = [
      {
        title: 'How to cook perfect scrabbled eggs',
        upvote: 12,
        id: 1
      },
      {
        title: 'How to build habits',
        upvote: 74,
        id: 2
      },
      {
        title: 'What are the most important habits',
        upvote: 34,
        id: 3
      }
    ];

    var elements = outcomes.map(function (outcome) {
      return <ListGroupItem onClick={this._handleClick.bind(this, outcome.id)}>{outcome.title}
        <Badge>{outcome.upvote}</Badge></ListGroupItem>
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