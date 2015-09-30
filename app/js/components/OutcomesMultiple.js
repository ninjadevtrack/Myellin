'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Badge = require('react-bootstrap').Badge;
var Router = require('react-router');
var Outcome = require('./Outcome');

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

var OutcomesMultiple = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

  componentWillMount: function() {
    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    this.refOutcomes = new Firebase(firebaseRoot + '/outcomes');
    this.bindAsArray(this.refOutcomes, 'outcomes');
  },

  addOutcomeSubmit: function(e){
    e.preventDefault();

    this.addOutcome();
  },

  shouldComponentUpdate: function(nextProps, nextState){

    //console.log('Firebase array length ...');
    //console.log('this.state:' + this.state.outcomes.length);
    //console.log('nextState:' + nextState.outcomes.length);

    // Only update if number of outcomes changes (outcome added or deleted)
    if ( this.state.outcomes && this.state.outcomes.length !== nextState.outcomes.length ){
      return true;
    }

    return false;
  },

  // Very basic function for creating a url slug from outcome title
  // TODO: remove special characters that don't belong in urls
  createUrlSlug: function(title){

    var slug_char_limit = 80;

    return title
        .toLowerCase()
        .substring(0, slug_char_limit) // Shorten to our character limit
        .trim() // Remove leading and trailing spaces
        .replace(/ /g,'-') // Replace spaces with hyphens
        .replace(/[-]+/g, '-') // Turn multiple sequential hyphens into one
        .replace(/[^\w-]+/g,''); // Remove everything but standard characters
  },

  addOutcome: function(){

    var title = React.findDOMNode(this.refs.createOutcome).value.trim();

    if (!title)
      return false;

    var slug = this.createUrlSlug(title);

    var newRef = this.refOutcomes.push({ 
      title: title,
      slug: slug
    });
    var outcomeId = newRef.key();

    // Clear input
    React.findDOMNode(this.refs.createOutcome).value = '';
  },

  render: function () {

    var createOutcome = (
      <ListGroupItem className="create-outcome" href="javascript:void(0)" key="create">
       <form onSubmit={this.addOutcomeSubmit}>
          <input ref="createOutcome" placeholder="Add a how-to. Hit enter." type="text" style={{width:'100%'}} />
        </form>
      </ListGroupItem>
    );

    var elements = this.state.outcomes.map(function (outcome) {
      return (
        <Outcome data={outcome} key={outcome['.key']} />
      );
    }.bind(this));

    return (
      <ListGroup fill>
        {createOutcome}
        {elements}
      </ListGroup>
    );
  },

});

module.exports = OutcomesMultiple;