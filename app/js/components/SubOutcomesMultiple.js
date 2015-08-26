'use strict';

var React = require('react/addons');
var Router = require('react-router');
var PanelGroup = require('react-bootstrap').PanelGroup;
var SubOutcome = require('./SubOutcome');

require('firebase');
var ReactFireMixin = require('reactfire');

var ReactDnD = require('react-dnd');
var HTML5Backend = require('react-dnd/modules/backends/HTML5');

var SubOutcomesMultiple = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

  getInitialState: function(){
    return {
      suboutcomes: [],
      activeKey: null
    };
  },

  componentWillMount: function() {
    this.bindFirebaseRefs();
  },

  componentDidUpdate: function(prevProps, prevState) {
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
    //var refSubOutcomes = this.firebase.child('relations/playlist_to_suboutcome/playlist_' + this.props.playlist_id).orderByChild('order');
    this.refSubOutcomes = this.firebase.child('relations/playlist_to_suboutcome/playlist_' + this.props.playlist_id);
    this.refSubOutcomesQuery = this.refSubOutcomes.orderByChild('order');
    this.bindAsArray(this.refSubOutcomesQuery, 'data');
  },

  handleSelect: function(activeKey) {
    this.setState({ activeKey });
  },

  // When dragging a suboutcome this will be passed two objects
  // one: the object being dragged
  // two: the object being hover over
  // We swap their order values and then re-setstate
  handleMove: function (one, two) {

    // Don't allow sorting if no editable prop
    // They will still be able to drag and drop into another playlist that is editable 
    if (!this.props.editable)
      return false;

    // Get suboutcomes (clone state.data)
    var suboutcomes = this.state.data.slice(0);

    // Find both suboutcomes in data
    var suboutcome_1 = suboutcomes.filter(function(c){return c.suboutcome_id === one.suboutcome_id})[0];
    var suboutcome_2 = suboutcomes.filter(function(c){return c.suboutcome_id === two.suboutcome_id})[0];

    // If suboutcome_1 not found that means we are dragging it from a different list
    // Add it to the suboutcomes array
    if (!suboutcome_1){
      suboutcome_1 = one;
      // Make order number 1 higher than last item
      suboutcome_1.order = suboutcomes[suboutcomes.length-1].order + 1;
      suboutcomes.splice(0, 0, one);

      this.add(suboutcome_1.suboutcome_id, suboutcome_1.order);
    }
    
    // Swap order
    var suboutcome_1_order = suboutcome_1.order;
    suboutcome_1.order = suboutcome_2.order;
    suboutcome_2.order = suboutcome_1_order;

    // Re-sort by order
    suboutcomes.sort(function(a, b){
      return a.order - b.order;
    });

    this.setState({
      data: suboutcomes
    });
  },

  // Add a suboutcome to this playlist
  add: function(id, order){

    // Add to end if no order number set
    if (!order && order !== 0)
      order = this.state.data.length;

    this.refSubOutcomes.child('suboutcome_' + id).set({
      suboutcome_id: id,
      order: order
    });
  },

  // Create a new suboutcome
  create: function(title){  
    var refSuboutcomes = this.firebase.child('suboutcomes');
    var newRef = refSuboutcomes.push({ title: title });
    var id = newRef.key();
    return id;
  },

  createThenAdd: function(title){
    var id = this.create(title);
    this.add(id);
  },

  save: function(){

    var suboutcomes = this.state.data.slice(0);

    for (var i = 0; i < suboutcomes.length; i++) { 

      /*

      TODO: iterate through suboutcomes
        - Create new ones
        - Add existing (from other playlist) to relations table
        - Update order
        - If 3 need to be created, each one in this.state.data after created
            - Once the total number that need to be created are created (keep track of count)
              then call the next save function (create, add, then saveOrder)
      */

      var refPlaylistToSuboutcome = this.firebase.child('relations/playlist_to_suboutcome/playlist_' + this.props.playlist_id + '/suboutcome_' + suboutcomes[i].suboutcome_id);

      refPlaylistToSuboutcome.update({
        order: i
      });
    }
  },

  render: function () {

    // Setup SubOutcome components
    // Note: eventKey prop is required by <PanelGroup> to control which panel is expanded ...
    // ... <PanelGroup> will pass props to <SubOutcome> which are then forwarded to <Panel> via {...this.props}
    var subOutcomes = this.state.data.map(function (relationData) {

      var optionsShown = ((this.getParams().suboutcome_id == relationData.suboutcome_id) ? true : false);

      relationData.parent_playlist_id = parseInt(this.props.playlist_id);

      return (
        <SubOutcome 
          optionsShown={optionsShown}
          eventKey={relationData.suboutcome_id}
          relationData={relationData}
          editable={this.props.editable}
          onMove={this.handleMove}
          onDelete={this.props.onDelete}
          key={relationData.suboutcome_id} />
      );
    }.bind(this));

    return (
      <PanelGroup activeKey={this.state.activeKey} onSelect={this.handleSelect} accordion>
        {subOutcomes}
      </PanelGroup>
    );
  }


});

//module.exports = SubOutcomesMultiple;
module.exports = ReactDnD.DragDropContext(HTML5Backend)(SubOutcomesMultiple);
