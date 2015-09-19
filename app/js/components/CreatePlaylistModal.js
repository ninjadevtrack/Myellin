'use strict';

var React = require('react/addons');
var AuthMixin = require('./../mixins/AuthMixin.js');
var Button = require('react-bootstrap').Button; 

require('firebase');
var ReactFireMixin = require('reactfire');

var CreatePlaylistModal = React.createClass({

mixins: [ReactFireMixin, AuthMixin],

  getDefaultProps: function(){},

  getInitialState: function(){
    return {};
  },

  render: function () {

    return (
       <div onMouseOver={this.props.onMouseOver} style={{ 
          position: 'fixed', 
          top: (this.props.collapse ? '90%' : '8em'), 
          backgroundColor: '#fff', 
          width: '70%', 
          marginLeft: '15%',
          border: '1px solid #000',
          zIndex: 9999 }}>

          { !this.props.collapse && 
            <Button onClick={this.props.onHide}>Hide</Button>
          }

          {this.props.children}
      
      </div>
    );
  }
});

module.exports = CreatePlaylistModal;