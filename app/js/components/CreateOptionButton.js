'use strict';

var DbHelper = require('../DbHelper');

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

    var option_id = DbHelper.options.create(this.state.user.id, this.props.suboutcome_id);
    
    DbHelper.options.set_editing(this.state.user.id, this.props.suboutcome_id, option_id);
  },

  render: function () {
    
    if (!this.state.user)
      return false;

    return (
      <div className="createoptionbutton">
        <Button onClick={this.createOption} style={{fontSize: '1.5em', margin: '0 100px', padding: '0', textAlign: 'center'}}  bsStyle='link'>
          + Alternative
        </Button>
      </div>
    );
  }
});

module.exports = CreateOptionButton;