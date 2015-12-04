'use strict';

var React = require('react/addons');

var CreateOptionModal = React.createClass({

  getDefaultProps: function(){},

  getInitialState: function(){
    return {};
  },

  render: function () {

    return (
       <div style={{ 
          position: 'fixed', 
          top: '0px', 
          cursor: '',    
          borderTop: '0px solid #000', 
          backgroundColor: '#fff',
          WebkitTransition: 'all 100ms ease',
          transition: 'all 100ms ease',
          width: '100vw', 
          height: '100vh',
          overflow: 'scroll',
          zIndex: 1900 }}>

          <div>
            {this.props.children}
          </div>
      
      </div>
    );
  }
});

module.exports = CreateOptionModal;