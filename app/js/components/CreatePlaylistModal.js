'use strict';

var React = require('react/addons');
var AuthMixin = require('./../mixins/AuthMixin.js');
var Button = require('react-bootstrap').Button; 

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

var CreatePlaylistModal = React.createClass({

mixins: [ReactFireMixin, AuthMixin],

  getDefaultProps: function(){},

  getInitialState: function(){
    return {};
  },

  render: function () {

    return (
       <div onMouseEnter={this.props.onMouseEnter} style={{ 
          position: (this.props.collapse ? 'fixed' : 'fixed'), 
          top: (this.props.collapse ? '97%' : '0px'), 
          borderTop: (this.props.collapse ? '1px solid #D2D2D2' : '0px solid #000'), 
          backgroundColor: (this.props.collapse ? '#FAFAFA' : '#fff'),
          webkitTransition: 'all 100ms ease',
          transition: 'all 100ms ease',
          width: '100vw', 
          height: '100vh',
          overflow: 'scroll',
          zIndex: 9999 }}>

          { !this.props.collapse && 
            <Button onClick={this.props.onHide} bsStyle='link' style={{position: 'fixed', right: '29%', bottom: '30px', fontSize: '1em', color: '#4A4A4A', fontFamily: 'Akkurat-Bold', zIndex: '99999 !important'}}>hide</Button>
          }
          
            { !this.props.collapse && this.props.children}

             {this.props.collapse &&
          <div style={{textAlign: 'center', fontFamily: 'Akkurat-Bold', marginTop: '-3px', padding: '0', color: '#656565', fontSize: '0.9em'}}>show</div>
}
      
      </div>
    );
  }
});

module.exports = CreatePlaylistModal;