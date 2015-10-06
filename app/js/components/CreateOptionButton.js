'use strict';

var React = require('react/addons');
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon; 

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
      parent_suboutcome_id: this.props.suboutcome_id,
      option_id: optionId,
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
    
    if (!this.state.user)
      return false;

    return (
      <div className="createoptionbutton">
        <Button onClick={this.createOption} style={{fontSize: '4em', margin: '0', padding: '0'}}  bsStyle='link'>
          <Glyphicon glyph='pencil' className='createicon' />
        </Button>
      </div>
    );
  }
});

module.exports = CreateOptionButton;