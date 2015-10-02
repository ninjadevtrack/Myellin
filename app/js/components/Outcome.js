'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Badge = require('react-bootstrap').Badge;
var Router = require('react-router');

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

var Outcome = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

  // No need for this component to ever update currently
  // IMPORTANT: modify this if we ever want component to update based on prop/state changes 
  shouldComponentUpdate: function(nextProps, nextState){

    // Update component if outcome title or playlist_count changes
    if (nextProps.data.title != this.props.data.title || 
          nextProps.data.playlist_count != this.props.data.playlist_count) 
      return true;

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
    if (this.props.data.slug){
      this.context.router.transitionTo('PlaylistsSlug', {
        outcome_id: id,
        outcome_slug: this.props.data.slug
      });
    }else{
      this.context.router.transitionTo('Playlists', {
        outcome_id: id
      });
    }
  }

});

module.exports = Outcome;