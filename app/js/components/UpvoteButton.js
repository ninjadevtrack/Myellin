'use strict';

var React = require('react/addons');
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

require('firebase');
var ReactFireMixin = require('reactfire');

var UpvoteButton = React.createClass({

  mixins: [ReactFireMixin],

  getDefaultProps: function(){
    return {
      this_type: 'playlist', // playlist or option
      this_id: null,
      parent_type: 'outcome', // outcome or suboutcome
      parent_id: null,
      size: 'medium',
      label: [<Glyphicon glyph='ok-circle'/>]
    };
  },

  getInitialState: function(){
    return {
      upvote: null
    };
  },

  componentWillMount: function() {
    this.bindFirebaseRefs();
  },

  bindFirebaseRefs: function(){

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    // Returns the path of the upvote data
    // Path depends on whether we are upvoting a playlist or suboutcome
    // Assume user_id = 1 for now
    this.refUpvote = firebase.child('upvotes'
                                      + '/' + this.props.this_type 
                                      + '/user_1'
                                      + '/' + this.props.parent_type + '_' + this.props.parent_id);
   
    this.bindAsObject(this.refUpvote, 'upvote');
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

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    var newUpvoteData = {};
    newUpvoteData[ this.props.this_type + '_id' ] = this.props.this_id;
    newUpvoteData['timestamp'] = Firebase.ServerValue.TIMESTAMP;

    this.refUpvote.transaction(function(currentUpvote) {

      // No data yet set value to this_id
      if (currentUpvote === null)
        return newUpvoteData;
      
      // If voting for same thing again do nothing
      if (currentUpvote[ this.props.this_type + '_id' ] === this.props.this_id){
        console.log('This user already voted for ' + this.props.this_type + ' with id: ' + this.props.this_id);
        return;
      }

      // Get the Firebase path to the upvote_count
      // Path depends on whether we are upvoting a playlist or option
      var upvoteCountPath = this.getUpvoteCountPath( currentUpvote[this.props.this_type + '_id'] );

      // De-increment upvote_count for thing user previously voted for
      firebase.child(upvoteCountPath).transaction(function(currentValue) {
        return currentValue - 1;
      });

      return newUpvoteData;
    
    }.bind(this), function(error, committed, snapshot) {
      if (error) {
        console.log('Transaction failed abnormally!', error);
      } else if (!committed) {
        console.log('We aborted the transaction (because vote already exists).');
      } else {

        console.log('Vote added!');

        firebase.child( this.getUpvoteCountPath(this.props.this_id) ).transaction(function(currentValue) {
          return currentValue + 1;
        });
      }
      console.log("Vote data: ", snapshot.val());
    }.bind(this));

  },

  render: function () {

    // If we have value from Firebase (user voted for something for this parent_id)
    // AND the value equals this_id, then vote button should show success state ...
    if (this.state.upvote && this.state.upvote[ this.props.this_type + '_id' ] === this.props.this_id){
      var bsStyle = 'success';
      this.props.label =[<Glyphicon glyph='ok-sign'/>];
    }else{
      var bsStyle = 'link';
      this.props.label =[<Glyphicon glyph='ok-circle'/>];
    }

    return (
      <Button bsSize={this.props.size} bsStyle={bsStyle} onClick={this.handleUpvote}>
        {this.props.label}
      </Button>
    );
  }
});

module.exports = UpvoteButton;