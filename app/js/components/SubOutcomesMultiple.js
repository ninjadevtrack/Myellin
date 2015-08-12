'use strict';

var React = require('react/addons');
var Router = require('react-router');
var PanelGroup = require('react-bootstrap').PanelGroup;

require('firebase');
var ReactFireMixin = require('reactfire');

var SubOutcome = require('./SubOutcome');

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

  bindFirebaseRefs: function(rebind){

    if (rebind)
      this.unbind('data');

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    // Fetch all suboutcomes that are in this playlist
    this.refSubOutcomes = firebase.child('relations/playlist_to_suboutcome/playlist_' + this.props.playlist_id);
    this.bindAsArray(this.refSubOutcomes, 'data');
  },

  handleSelect: function(activeKey) {
    this.setState({ activeKey });
  },

  render: function () {

    

    // Setup SubOutcome components
    // Note: eventKey prop is required by <PanelGroup> to control which panel is expanded ...
    // ... <PanelGroup> will pass props to <SubOutcome> which are then forwarded to <Panel> via {...this.props}
    var subOutcomes = this.state.data.map(function (relationData) {

      console.log(this.getParams().suboutcome_id + ' / ' + relationData.suboutcome_id);

      var optionsExpanded = ((this.getParams().suboutcome_id == relationData.suboutcome_id) ? true : false);

      relationData.parent_playlist_id = parseInt(this.props.playlist_id);
      return (
        <SubOutcome optionsExpanded={optionsExpanded} eventKey={relationData.suboutcome_id} relationData={relationData} key={relationData.suboutcome_id}/>
      );
    }.bind(this));

    return (
      <PanelGroup activeKey={this.state.activeKey} onSelect={this.handleSelect} accordion>
        {subOutcomes}
      </PanelGroup>
    );
  }


});

module.exports = SubOutcomesMultiple;