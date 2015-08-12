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
      data: []
    };
  },

  componentWillMount: function() {
    this.bindFirebaseRefs();
  },

  componentDidUpdate: function(prevProps, nextState) {
    // If outcome_id or author_id changes we need to bind to new Firebase paths
    if (this.props.suboutcome_id !== prevProps.suboutcome_id){
      this.bindFirebaseRefs(true);
    }
  },

  bindFirebaseRefs: function(rebind){

    if (rebind)
      this.unbind('data');

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    // Fetch all options that are in this suboutcome
    this.refOptions = firebase.child('relations/suboutcome_to_option/suboutcome_' + this.props.suboutcome_id);

    this.bindAsArray(this.refOptions, 'data');
  },

  render: function () {

    var options = this.state.data.map(function (relationData) {

      relationData.parent_suboutcome_id = parseInt(this.props.suboutcome_id);

      return (
        <div>
          <Option full="true" relationData={relationData} id={relationData.option_id} />
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