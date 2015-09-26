'use strict';

var React = require('react/addons');
var Button = require('react-bootstrap').Button;

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

var AuthMixin = require('./../mixins/AuthMixin.js');

var CreateOptionButton = React.createClass({

  mixins: [ReactFireMixin, AuthMixin],

  getDefaultProps: function(){},

  getInitialState: function(){
    return {};
  },

  createOption: function(e){
    e.preventDefault();

    if (!this.state.user){
      alert('You must be logged in');
      return;
    }

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    this.firebase = new Firebase(firebaseRoot);
    this.refOptions = this.firebase.child('options');
    this.refSuboutcomeToOption = this.firebase.child('relations/suboutcome_to_option/suboutcome_' + this.props.suboutcome_id);

    var newOptionRef = this.refOptions.push({ 
      author_id: this.state.user.id,
      description: 'testing... testing...'
    });

    var optionId = newOptionRef.key();

    this.refSuboutcomeToOption.child('option_' + optionId).set({
      option_id: optionId,
      parent_suboutcome_id: this.props.suboutcome_id,
      upvote_count: 0
    });

    /*
    this.refUser = this.firebase.child('users/' + this.state.user.id).update({
      editing_playlist: {
        parent_outcome_id: this.props.outcome_id,
        playlist_id: playlistId,
        collapse: false
      }
    });
    */
  },

  render: function () {
    return (
      <Button onClick={this.createOption}>
        Create Option
      </Button>
    );
  }
});

module.exports = CreateOptionButton;