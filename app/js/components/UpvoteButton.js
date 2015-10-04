'use strict';

var React = require('react/addons');
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

var AuthMixin = require('./../mixins/AuthMixin.js');

var UpvoteButton = React.createClass({

  mixins: [ReactFireMixin, AuthMixin],

  getDefaultProps: function(){
    return {
      this_type: 'playlist', // playlist or option
      this_id: null,
      parent_type: 'outcome', // outcome or suboutcome
      parent_id: null,
      size: 'medium',
      //label: [<Glyphicon glyph='ok-circle'/>]
    };
  },

  getInitialState: function(){
    return {
      upvote: null
    };
  },

  componentDidUpdate: function(prevProps, prevState) {

    this.bindFirebaseRefs();
  },

  componentDidMount: function() {

    this.bindFirebaseRefs();
  },

  bindFirebaseRefs: function(){

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    // Return if not logged in
    if (!this.state.user){
      this.unbindUpvote();
      return;
    }

    // Returns the path of the upvote data
    // Path depends on whether we are upvoting a playlist or suboutcome
    this.newRefUpvote = firebase.child('upvotes'
                                      + '/' + this.props.this_type 
                                      + '/' + this.state.user.id 
                                      + '/' + this.props.parent_type + '_' + this.props.parent_id);

    // Cancel if current ref path is same as new ref path
    // So we don't accidently create endless loops by triggering ...
    // bindFirebaseRefs() -> rerender -> bindFirebaseRefs() -> rerender -> etc
    if (this.refUpvote && this.refUpvote.toString() === this.newRefUpvote.toString()){
      return;
    }

    this.unbindUpvote();

    this.refUpvote = this.newRefUpvote;
    this.bindAsObject(this.refUpvote, 'upvote');
  },

  // Unbind this.state.upvote from Firebase path
  // This must be called prior to binding to a new Firebase path
  // This should also be called when we want to set this.state.upvote to null (such as when logging out)
  unbindUpvote: function(){
    try {
      this.unbind('upvote');
    }catch(e){}

    this.refUpvote = null;
  },

  // Returns the Firebase path to the upvote_count
  // Path depends on whether we are upvoting a playlist or option
  getUpvoteCountPath: function(the_id){
    var path = 'relations'
                + '/' + this.props.parent_type + '_to_' + this.props.this_type
                + '/' + this.props.parent_type + '_' + this.props.parent_id
                + '/' + this.props.this_type + '_' + the_id
                + '/upvote_count';

    return path;
  },

  handleUpvote: function(e){
    e.preventDefault();

    if (!this.state.user){
      alert('You must login to upvote.');
      return;
    }

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    var newUpvoteData = {};
    newUpvoteData[ this.props.this_type + '_id' ] = this.props.this_id;
    newUpvoteData['timestamp'] = Firebase.ServerValue.TIMESTAMP;

    this.refUpvote.once('value', function(dataSnapshot) {

      var currentUpvote = dataSnapshot.val();
      var upvoteCountPathNew = this.getUpvoteCountPath(this.props.this_id);

      // If voting for same thing again then remove vote
      if (currentUpvote && currentUpvote[ this.props.this_type + '_id' ] === this.props.this_id){

        // Update vote
        this.refUpvote.set(null);
        // De-increment vote count
        firebase.child( upvoteCountPathNew ).transaction(function(currentValue) {
          return currentValue - 1;
        });

        return;
      }

      // Update vote
      this.refUpvote.set(newUpvoteData);
      // Increment vote count
      firebase.child( upvoteCountPathNew ).transaction(function(currentValue) {
        return currentValue + 1;
      });

      // De-increment vote count for thing user previously voted for
      // We do this here rather than callback because we won't know previous value in callback
      if (currentUpvote) {
        var upvoteCountPathPrevious = this.getUpvoteCountPath( currentUpvote[this.props.this_type + '_id'] );
        firebase.child( upvoteCountPathPrevious ).transaction(function(currentValue) {
          return currentValue - 1;
        });
      }
      
    }.bind(this));

  },


  render: function () {

    // If we have value from Firebase (user voted for something for this parent_id)
    // AND the value equals this_id, then vote button should show success state ...
    if (this.state.upvote && this.state.upvote[ this.props.this_type + '_id' ] === this.props.this_id){
      var bsStyle = 'success';
      var label =[<Glyphicon glyph='ok-sign'/>];
    }else{
      var bsStyle = 'link';
      var label =[<Glyphicon glyph='ok-circle'/>];
    }

    return (
      <Button bsSize={this.props.size} bsStyle={bsStyle} onClick={this.handleUpvote}>
        {label}
      </Button>
    );
  }
});

module.exports = UpvoteButton;