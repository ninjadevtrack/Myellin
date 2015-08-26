'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Router = require('react-router');
var Button = require('react-bootstrap').Button;

require('firebase');
var ReactFireMixin = require('reactfire');

var Option = require('./Option');

var OptionsMultiple = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

  getInitialState: function(){
    return {
      data: [],
      suboutcome: null,
      didCallCallback: false
    };
  },

  componentWillMount: function() {
    this.bindFirebaseRefs();
  },

  componentDidUpdate: function(prevProps, prevState) {

    if (this.props.suboutcome_id !== prevProps.suboutcome_id)
      this.bindFirebaseRefs(true);

    // Pass any data we need back up the chain
    // Currently we just need title for NavBar component
    if (this.state.suboutcome && this.state.didCallCallback === false ){
      this.setState({ didCallCallback: true }, 
        function(){
          this.props.loadedCallback({ title: this.state.suboutcome.title });
      });
    } 

  },

  bindFirebaseRefs: function(rebind){

    if (rebind){
      this.unbind('data');
      this.unbind('suboutcome');
    }

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    // Load data for suboutcome
    var refSubOutcome = new Firebase(firebaseRoot + '/suboutcomes/' + this.props.suboutcome_id);
    this.bindAsObject(refSubOutcome, 'suboutcome');

    // Fetch all options that are in this suboutcome
    this.refOptions = firebase.child('relations/suboutcome_to_option/suboutcome_' + this.props.suboutcome_id);

    this.bindAsArray(this.refOptions, 'data');
  },

  render: function () {

    var options = this.state.data.map(function (relationData) {

      relationData.parent_suboutcome_id = parseInt(this.props.suboutcome_id);

      return (
        <div>
          <Option relationData={relationData} id={relationData.option_id} />
        </div>
      );
    }.bind(this));

    return (
      <div className="options-multiple">
        {options}
      </div>
    );
  }


});

module.exports = OptionsMultiple;