'use strict';

var DbHelper = require('../DbHelper');

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

  bindFirebaseRefs: function(){
    this.firebase = DbHelper.getFirebase();

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

  _isAllowedToView: function(){

    // If not private return true
    if (!this.state.data.private)
      return true;

    // If admin return true
    if (this.state.user && this.state.user.admin)
      return true;

    // If user in outcome.can_view array return true
    if (this.state.user && this.state.data.can_view && this.state.data.can_view[this.state.user.id])
      return true;

    // Othewise return false
    return false;
  },

  render: function () {

    if (!this.state.data)
      return false;

    // If outcome is private make sure current user can view it
    if (this._isAllowedToView() === false)
      return false;

    var jsx = (
      <ListGroupItem href="javascript:void(0)" onClick={this._handleClick.bind(this, this.state.data['.key'])} key={this.state.data['.key']}>
        <span className="number" style={{ position:'absolute', left:'-2em', opacity: '0.5' }}>
          {this.props.number}.
        </span>
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
    return {
      type: ComponentTypes.OUTCOME,
      outcome_id: props.relationData.outcome_id,
      order: props.relationData.order
    }
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