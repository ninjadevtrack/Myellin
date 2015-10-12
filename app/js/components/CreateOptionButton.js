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

    DbHelper.options.create(this.state.user.id, this.props.suboutcome_id);
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