'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Router = require('react-router');
var Button = require('react-bootstrap').Button;

require('firebase');
var ReactFireMixin = require('reactfire');

var Playlist = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

  getInitialState: function(){
    return {
      outcome: [],
      suboutcomes: []
    };
  },

  componentWillMount: function() {
    this.bindFirebaseRefs();
  },

  componentDidUpdate: function(prevProps, nextState) {
    // If playlist id changes we need to bind new Firebase refs
    if (this.props.id !== prevProps.id){
      this.unbindFirebaseRefs();
      this.bindFirebaseRefs();
    }
  },

  bindFirebaseRefs: function(){

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';

    this.refOutcome = new Firebase(firebaseRoot + '/outcomes/' + this.props.id);

    this.refSubOutcomes = new Firebase(firebaseRoot + '/suboutcomes')
                            .orderByChild("parent_outcome")
                            .equalTo(this.props.id);

    this.bindAsObject(this.refOutcome, 'outcome');
    this.bindAsArray(this.refSubOutcomes, 'suboutcomes');
  },

  unbindFirebaseRefs: function(){
    this.unbind('outcome');
    this.unbind('suboutcomes');
  },


  render: function () {

    var suboutcomes = this.state.suboutcomes.map(function (suboutcome) {
      return (
        <ListGroupItem onClick={this._handleClick.bind(this, suboutcome.id)} key={suboutcome['.key']}>
          {suboutcome.title}
        </ListGroupItem>
      );
    }.bind(this));

    return (
      <div className="playlist-container">
        { this.state.outcome &&
          <div>
            <h4>{this.state.outcome.title}</h4>
            <p>{this.state.outcome.description}</p>
            <div className="upvote">
              <div className="count">{this.state.outcome.upvote}</div>
              <Button onClick={this.handleUpvote}>r</Button>
            </div>
          </div>
        }
        <ListGroup fill>
          {suboutcomes}
        </ListGroup>

        <Button onClick={this.handleUpvote}>Recommend</Button>
      </div>
    );
  },

  handleUpvote: function(e){
    e.preventDefault();

    // TODO: Add row to upvotes table
    // Reject if already upvote for outcome_id AND user_id
    // If it succeeds, increment vote count

    this.refOutcome.update({
      upvote: this.state.outcome.upvote + 1
    });
  },

  _handleClick: function (id) {
    //this.context.router.transitionTo('Outcomes', {outcome_id: id});
  }

});

module.exports = Playlist;