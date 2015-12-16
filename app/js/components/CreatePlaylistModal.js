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
       <div onClick={this.props.onMouseEnter} style={{ 
          position: (this.props.collapse ? 'fixed' : 'fixed'), 
          top: (this.props.collapse ? '93%' : '0px'), 
          cursor: (this.props.collapse ? 'n-resize' : ''),    
          borderTop: (this.props.collapse ? '1px solid #D2D2D2' : '0px solid #000'), 
          backgroundColor: (this.props.collapse ? '#FAFAFA' : '#fff'),
          WebkitTransition: 'all 100ms ease',
          transition: 'all 100ms ease',
          width: '100vw', 
          height: '100vh',
          overflow: 'scroll',
          zIndex: 1900 }}>

          { !this.props.collapse && 
            <Button onClick={this.props.onHide} bsStyle='link' style={{position: 'fixed', left: '45%', top: '6px', fontSize: '1.2em', color: '#4A4A4A', fontFamily: 'Akkurat-Bold', textDecoration: 'underline', zIndex: '99999 !important', cursor: 's-resize'}}>drag & drop</Button>
          }

          { this.props.collapse &&
            <div style={{textAlign: 'center', color: '#656565', fontSize: '1em', border: '2px dashed #cdcdcd', borderRadius: '5px', width: '30%', padding: '6px 0',margin: '4px 35%'}}>drag & drop anyone's chapter here</div>
          }
          
          <div style={{ display: (this.props.collapse ? 'none' : 'inherit') }}>
            {this.props.children}
          </div>
      
      </div>
    );
  }
});

module.exports = CreatePlaylistModal;