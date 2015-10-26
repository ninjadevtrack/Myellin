'use strict';

var DbHelper = require('../DbHelper');

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Badge = require('react-bootstrap').Badge;
var Router = require('react-router');
var Outcome = require('./Outcome');
var AuthMixin = require('./../mixins/AuthMixin.js');

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

var OutcomesMultiple = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin, AuthMixin],

  componentWillMount: function() {
    this.firebase = DbHelper.getFirebase();
    this.refOutcomes = this.firebase.child('relations/section_to_outcome/home');
    
    this.bindAsArray(this.refOutcomes, 'data');
  },


  addOutcomeSubmit: function(e){
    e.preventDefault();

    this.addOutcome();
  },

  shouldComponentUpdate: function(nextProps, nextState){

    return true;

    //console.log('Firebase array length ...');
    //console.log('this.state:' + this.state.data.length);
    //console.log('nextState:' + nextState.data.length);

    // Always update for now, since we want to update if any outcomes data changes
    // TODO: Use immutable-js to do a deep check on data changes (if we hit performance problems)
    /*
    // Only update if number of outcomes changes (outcome added or deleted)
    if ( this.state.data && this.state.data.length !== nextState.data.length ){
      return true;
    }

    return false;
    */
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

  addOutcome: function(order){

     // Add to end if no order number set
    if (!order && order !== 0)
      order = this.state.data.length;

    var title = React.findDOMNode(this.refs.createOutcome).value.trim();

    if (!title)
      return false;

    var slug = this.createUrlSlug(title);

    // Create outcome in Firebase
    var newRef = this.firebase.child('outcomes').push({ 
      title: title,
      slug: slug,
      playlist_count: 0
    });

    var outcomeId = newRef.key();

    this.refOutcomes.child('outcome_' + outcomeId).update({
      parent_section: 'home',
      outcome_id: outcomeId,
      order: order
    });

    // Clear input
    React.findDOMNode(this.refs.createOutcome).value = '';
  },


  // When dragging an outcome this will be passed two objects
  // one: the object being dragged
  // two: the object being hover over
  // We swap their order values and then re-setstate
  handleMove: function (one, two) {

    // Ignore if dragging over self (dragged item is over original position)
    if (one.outcome_id === two.outcome_id)
      return false

    // Get suboutcomes (clone state.data)
    var outcomes = this.state.data.slice(0);

    // Find both suboutcomes in data
    var outcome_1 = outcomes.filter(function(c){return c.outcome_id === one.outcome_id})[0];
    var outcome_2 = outcomes.filter(function(c){return c.outcome_id === two.outcome_id})[0];

    // Swap order
    var outcome_1_order = outcome_1.order;
    outcome_1.order = outcome_2.order;
    outcome_2.order = outcome_1_order;

    this.setState({ data: outcomes },function(){
      this.saveOrder();
    }.bind(this));

  },

  // Save the order to Firebase
  saveOrder: function(outcomes){

    var outcomes = this.state.data.slice(0);

    for (var i = 0; i < outcomes.length; i++) { 

      var refSectionToOutcome = this.refOutcomes.child('outcome_' + outcomes[i].outcome_id);

      refSectionToOutcome.update({
        order: i
      });
    }
  },

  _handleBrandClick: function(e) {
    e.preventDefault();
    this.context.router.transitionTo('app');
  },

  render: function () {

    // Re-sort by order
    var outcomes = this.state.data.sort(function(a, b){
      return a.order - b.order;
    });

    if (this.state.user && this.state.user.admin){
      var createOutcome = (
        <ListGroupItem className="create-outcome" href="javascript:void(0)" key="create">
         <form onSubmit={this.addOutcomeSubmit}>
            <input ref="createOutcome" placeholder="Add a how-to. Hit enter." type="text" style={{width:'100%'}} />
          </form>
        </ListGroupItem>
      );
    }else{
      var createOutcome = null;
    }

    var elements = outcomes.map(function (relationData) {

      // NOT NEEDED once we clear out Firebase data
      // We now include "parent_section" value when writing to Firebase
      relationData.parent_section = 'home';

      return (
        <Outcome 
          relationData={relationData}
          onMove={this.handleMove}
          key={relationData.outcome_id} />
      );
    }.bind(this));

    return (
      <ListGroup fill>
      <div className="headermobile">
      <div className="logomobile"><img src="/images/monogram2.svg" height="70vmin" width="70vmin" alt="Logo" /></div>
      <div className="slogan">the starting point for learners</div>
      </div>
      <div className="mobile">
      <div style={{background: '#FEFEFE', paddingTop: '20px', paddingBottom: '5px'}}>
      <span style={{paddingLeft: '15px', fontSize: '1.1em', color: '#000', lineHeight: '0.1em'}}>how to</span><span style={{float: 'right', paddingRight: '20px', fontSize: '1.1em', color: '#222',}}>learning lists</span>
      </div>
      </div>
        {createOutcome}
        {elements}
      </ListGroup>
    );
  },

});



module.exports = OutcomesMultiple;