'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;


var Outcomes = React.createClass({

  render: function() {
    return (

    <ListGroup fill>
      <ListGroupItem href='#'>Link 2</ListGroupItem>
      <ListGroupItem href='#'>Link 2</ListGroupItem>
      <ListGroupItem href='#'>Link 2</ListGroupItem>
      <ListGroupItem href='#'>Link 2</ListGroupItem>
      <ListGroupItem href='#'>Link 2</ListGroupItem>
      <ListGroupItem href='#'>Link 2</ListGroupItem>
      <ListGroupItem href='#'>Link 2</ListGroupItem>
      <ListGroupItem href='#'>Link 2</ListGroupItem>
      <ListGroupItem href='#'>Link 2</ListGroupItem>
      <ListGroupItem href='#'>Link 2</ListGroupItem>
    </ListGroup>

    );
  }

});

module.exports = Outcomes;