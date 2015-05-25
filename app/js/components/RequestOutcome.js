'use strict';

var React = require('react/addons');
var Button = require('react-bootstrap').Button;

var RequestOutcome = React.createClass({

  render: function() {
    return (
      <Button bsStyle='link'>Link</Button>
    );
  }

});

module.exports = RequestOutcome;
