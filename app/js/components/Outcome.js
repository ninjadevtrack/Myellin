'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Badge = require('react-bootstrap').Badge;
var Router = require('react-router');

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

var ComponentTypes = require('./ComponentTypes');

var ReactDnD = require('react-dnd');

var AuthMixin = require('./../mixins/AuthMixin.js');


var Outcome = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin, AuthMixin],

  getInitialState: function(){
    return {
      data: null
    };
  },

  componentWillMount: function() {
    this.bindFirebaseRefs();
  },


  // No need for this component to ever update currently
  // IMPORTANT: modify this if we ever want component to update based on prop/state changes 
  /*
  shouldComponentUpdate: function(nextProps, nextState){

    // Update component if outcome title or playlist_count changes
    if (nextProps.data.title != this.props.data.title || 
          nextProps.data.playlist_count != this.props.data.playlist_count) 
      return true;

    return false;
  },
  */

  bindFirebaseRefs: function(){
    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    this.firebase = new Firebase(firebaseRoot);

    //this.refOutcome = this.firebase.child('outcomes/' + this.props.data['.key']);
    this.refOutcome = this.firebase.child('outcomes/' + this.props.relationData.outcome_id);
    this.bindAsObject(this.refOutcome, 'data');
  },

  _handleClick: function (id) {
    this.context.router.transitionTo('Playlists', {
      outcome_id: id,
      outcome_slug: this.state.data.slug
    });
  },

  render: function () {

    if (!this.state.data)
      return false;

    // If an outcome is private only show if current user is in outcome.can_view
    if (this.state.data.private && 
        (!this.state.user || !this.state.data.can_view || !this.state.data.can_view[this.state.user.id]))
      return false;

    var jsx = (
      <ListGroupItem href="javascript:void(0)" onClick={this._handleClick.bind(this, this.state.data['.key'])} key={this.state.data['.key']}>
        {this.state.data.title}
        <Badge>{this.state.data.playlist_count}</Badge>
      </ListGroupItem>
    );

    // If user logged return jsx inside React DnD wrapper functions 
    // So they can re-order outcomes via drag and drop
    if (this.state.user && this.state.user.admin)
      return this.props.connectDragSource(this.props.connectDropTarget( jsx ));

    return jsx;
  },


});

var DndSource = {

  // Return data that should be made accessible to other components when this component is hovering
  // The other component would access within DndTarget -> hover() -> monitor.getItem()
  beginDrag: function(props) {
    return props.relationData;
  }
};

var DndTarget = { 

  // When a different Outcome is dragged over this Outcome
  hover: function(props, monitor, component) {
    var draggedItem = monitor.getItem();
    props.onMove(draggedItem, props.relationData);
  }

};

var DragSourceDecorator = ReactDnD.DragSource(ComponentTypes.OUTCOME, DndSource,
  function(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    };
  }
);

var DropTargetDecorator = ReactDnD.DropTarget(
  ComponentTypes.OUTCOME,
  DndTarget,
  function(connect) {
    return {
      connectDropTarget: connect.dropTarget()
    };
  }
);

module.exports = DropTargetDecorator(DragSourceDecorator(Outcome));