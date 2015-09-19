'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Badge = require('react-bootstrap').Badge;
var Router = require('react-router');

require('firebase');
var ReactFireMixin = require('reactfire');

var Outcome = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

  // No need for this component to ever update currently
  // IMPORTANT: modify this if we ever want component to update based on prop/state changes 
  shouldComponentUpdate: function(nextProps, nextState){
    return false;
  },

  render: function () {

    return (
      <ListGroupItem href="javascript:void(0)" onClick={this._handleClick.bind(this, this.props.data['.key'])} key={this.props.data['.key']}>
        {this.props.data.title}
        <Badge>{this.props.data.playlist_count}</Badge>
      </ListGroupItem>
    );

  },

  _handleClick: function (id) {
    this.context.router.transitionTo('Outcomes', {outcome_id: id});
  }

});

module.exports = Outcome;