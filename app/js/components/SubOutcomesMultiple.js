'use strict';

var React = require('react/addons');
var Router = require('react-router');
var PanelGroup = require('react-bootstrap').PanelGroup;
var SubOutcome = require('./SubOutcome');
var AuthMixin = require('./../mixins/AuthMixin.js');

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

var ReactDnD = require('react-dnd');
var HTML5Backend = require('react-dnd/modules/backends/HTML5');

var ComponentTypes = require('./ComponentTypes');

var SubOutcomesMultiple = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin, AuthMixin],

  getInitialState: function(){
    return {
      activeKey: null
    };
  },

  componentWillMount: function() {

    this.bindFirebaseRefs();

    this._passBackReferenceToSelf();
  },

  _passBackReferenceToSelf: function(){

    this.props.referenceCallback(this);
  },

  componentDidUpdate: function(prevProps, prevState) {

    console.log('this.props.isOver: ' + this.props.isOver);

    if (this.props.playlist_id !== prevProps.playlist_id)
      this.bindFirebaseRefs(true);
  },

  bindFirebaseRefs: function(rebind){

    if (rebind){
      this.unbind('data');
    }

    this.firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    this.firebase = new Firebase(this.firebaseRoot);

    // Fetch all suboutcomes that are in this playlist
    this.refSubOutcomes = this.firebase.child('relations/playlist_to_suboutcome/playlist_' + this.props.playlist_id);
    this.bindAsArray(this.refSubOutcomes, 'data');
  },

  handleSelect: function(activeKey) {

    this.setState({ activeKey });
  },

  // Triggered when a SubOutcome or Option is dragged over this (SubOutcomesMultiple)
  handleDragOver: function(draggedItem){

    var parent_playlist_id = draggedItem.parent_playlist_id;
    var suboutcome_id = (draggedItem.type === ComponentTypes.OPTION ? 
                              draggedItem.parent_suboutcome_id : // If dragging an Option
                                draggedItem.suboutcome_id); // If dragging a Suboutcome
    
    var chosen_option = (draggedItem.type === ComponentTypes.OPTION ?
                              draggedItem.option_id : // If dragging an Option (it should be chosen_option)
                                  (draggedItem.chosen_option || null)); // If dragging a Suboutcome (use existing chosen_option)

    // Do nothing if not in editable mode
    if (!this.props.editable)
      return false;

    // Do nothing is suboutcome is aleady present in this.state.data
    if (this._doesContainSuboutcome(suboutcome_id))
      return false;

    // Do nothing if dragging SubOutcome over its own playlist
    // We don't need to add it to the playlist 
    // EDIT: We don't need this because handles above by this._doesContainSuboutcome();
    /*if (this.props.playlist_id === parent_playlist_id)
        return false; */


    var newSuboutcome = {
      suboutcome_id: suboutcome_id,
      parent_playlist_id: parent_playlist_id,
      chosen_option, chosen_option,
      order: this.state.data.length
    };

    // Add newSuboutcome to end of this.state.data
    // The second it's added the handleMove() (see below) will take over
    var suboutcomes = this.state.data.slice(0);
    suboutcomes.push(newSuboutcome);
    this.setState({ data: suboutcomes });

  },

  // When dragging a suboutcome this will be passed two objects
  // one: the object being dragged
  // two: the object being hover over
  // We swap their order values and then re-setstate
  handleMove: function (draggedItem, hoveredItem) {

    var dragged_suboutcome_id = (draggedItem.type === ComponentTypes.OPTION ? 
                                  draggedItem.parent_suboutcome_id : // If dragging an Option
                                    draggedItem.suboutcome_id); // If dragging a Suboutcome

    // Ignore if dragging over self (dragged item is over original position)
    if (dragged_suboutcome_id === hoveredItem.suboutcome_id)
      return false

    // Do nothing if not editable
    if (!this.props.editable)
      return false;

    // Get suboutcomes (clone state.data)
    var suboutcomes = this.state.data.slice(0);

    // Find both suboutcomes in data
    var suboutcome_1 = suboutcomes.filter(function(c){return c.suboutcome_id === dragged_suboutcome_id})[0];
    var suboutcome_2 = suboutcomes.filter(function(c){return c.suboutcome_id === hoveredItem.suboutcome_id})[0];

    // handleDragOver() (see above) should have added this suboutcome to data object
    // So this shouldnt happen ...
    if (!suboutcome_1)
      return false;
    
    // Swap order
    var suboutcome_1_order = suboutcome_1.order;
    suboutcome_1.order = suboutcome_2.order;
    suboutcome_2.order = suboutcome_1_order;

    this.setState({ data: suboutcomes });
  },

    // Checks if suboutcome_id already in suboutcomes (this.state.data)
  _doesContainSuboutcome: function(suboutcome_id){

    for (var i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].suboutcome_id === suboutcome_id) {
          return true;
      }
    }
    
    return false;
  },


  // Add a suboutcome to this playlist
  add: function(id, order){

    // Add to end if no order number set
    if (!order && order !== 0)
      order = this.state.data.length;

    this.refSubOutcomes.child('suboutcome_' + id).set({
      parent_playlist_id: this.props.playlist_id,
      suboutcome_id: id,
      order: order
    });
  },

  // Create a new suboutcome
  create: function(title){  
    var refSuboutcomes = this.firebase.child('suboutcomes');
    var newRef = refSuboutcomes.push({ 
      title: title,
      option_count: 0
    });
    
    var id = newRef.key();
    return id;
  },

  createThenAdd: function(title){
    var id = this.create(title);
    this.add(id);
  },

  delete: function(relationData){

    var refSuboutcome = this.firebase.child('suboutcomes/' + relationData.suboutcome_id);
    var refPlaylistToSuboutcome = this.firebase.child('relations/playlist_to_suboutcome/playlist_' + this.props.playlist_id + '/suboutcome_' + relationData.suboutcome_id);

    // Remove suboutcome from playlist
    refPlaylistToSuboutcome.remove();

    // Delete the suboutcome
    //refSuboutcome.remove();
  },

  // This iterates through suboutcomes (this.state.data) and saves their order to Firebase
  // This will also add any suboutcomes that aren't in the playlist (firebase) yet ... 
  // ... such as ones dragged in from another playlist
  save: function(){

    var suboutcomes = this.state.data.slice(0);

    for (var i = 0; i < suboutcomes.length; i++) { 

      var refPlaylistToSuboutcome = this.firebase.child('relations/playlist_to_suboutcome/playlist_' + this.props.playlist_id + '/suboutcome_' + suboutcomes[i].suboutcome_id);

      refPlaylistToSuboutcome.update({
        parent_playlist_id: this.props.playlist_id,
        suboutcome_id: suboutcomes[i].suboutcome_id, // In case it's not in the playlist (firebase) yet
        chosen_option: (suboutcomes[i].chosen_option || null), // Copy over chosen_option
        order: i
      });
    }
  },

  render: function () {

    // We can read whether something is being dragged over if we want to change style
    //var over = (this.props.isOver ? 'OVER' : 'NOT OVER');

    // Re-sort by order
    var subOutcomes = this.state.data.sort(function(a, b){
      return a.order - b.order;
    });

    // Setup SubOutcome components
    // Note: eventKey prop is required by <PanelGroup> to control which panel is expanded ...
    // ... <PanelGroup> will pass props to <SubOutcome> which are then forwarded to <Panel> via {...this.props}
    subOutcomes = subOutcomes.map(function (relationData) {

      var optionsShown = ((this.getParams().suboutcome_id == relationData.suboutcome_id) ? true : false);

      // NOT NEEDED once we clear out Firebase data
      // We now include "parent_playlist_id" value when writing to Firebase
      relationData.parent_playlist_id = this.props.playlist_id;

      return (
        <SubOutcome 
          optionsShown={optionsShown}
          eventKey={relationData.suboutcome_id}
          relationData={relationData}
          editable={this.props.editable}
          onMove={this.handleMove}
          onDelete={this.delete}
          key={relationData.suboutcome_id} />
   
      );
    }.bind(this));

    // Apply special style when the a SubOutcome is being dragged ...
    // ... and it can be dropped on this SubOutcomeMultuple component
    // See first parameter of DropTargetDecorator below which determines props.canDrop
    var style = {};
    if (this.props.canDrop){
      style = {
        border: '3px solid red',
        minHeight: '4em'
      }
    }

    return this.props.connectDropTarget(
      <div style={style}>
        <PanelGroup activeKey={this.state.activeKey} onSelect={this.handleSelect} accordion>
          {subOutcomes}
        </PanelGroup>
      </div>
    );
  }


});

var DndTarget = {

  // Return data that should be made accessible to other components that are dropped on this component
  // The other component would access within DndSource -> endDrag() -> monitor.getDropResult()
  drop: function(props) {
    return { playlist_id: props.playlist_id };
  },

  // Handle when a SubOutcome is dragged over this SubOutcomesMultiple
  hover: function(props, monitor, component) {

    var draggedItem = monitor.getItem();

    component.handleDragOver(draggedItem);
  }

};

var DropTargetDecorator = ReactDnD.DropTarget(
  // Return array of types this Drop Target accepts
  function(props){

    // If not editable return empty array
    if (!props.editable)
      return [];

    // Allow SUBOUTCOME and OPTION types
    return [ComponentTypes.SUBOUTCOME, ComponentTypes.OPTION]; 
  },
  DndTarget,
  function(connect, monitor) {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop()
    };
  }
);


module.exports = DropTargetDecorator(SubOutcomesMultiple);
