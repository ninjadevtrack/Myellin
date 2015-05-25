'use strict';

var React = require('react/addons');
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var DropdownButton = require('react-bootstrap').DropdownButton;
var CollapsibleNav = require('react-bootstrap').CollapsibleNav;
var NavItem = require('react-bootstrap').NavItem;
var MenuItem = require('react-bootstrap').MenuItem;
var Glyphicon = require('react-bootstrap').Glyphicon;

var NavbarTop = React.createClass({

  render: function() {
    return (
      <Navbar brand='Myelin' toggleNavKey={0}>
    <CollapsibleNav eventKey={2}> {/* This is the eventKey referenced */}
      <Nav navbar>
      <DropdownButton eventKey={3} title='' bsStyle="fprimary">
          <MenuItem eventKey='1'><Glyphicon glyph='lock' /></MenuItem>
          <MenuItem eventKey='2'>Twitter</MenuItem>
          <MenuItem eventKey='3'>Github</MenuItem>
          <MenuItem eventKey='4'>Google</MenuItem>
        </DropdownButton>
      </Nav>
      <Nav navbar right>
<NavItem eventKey={2} href='#'><i className="s s-glyph03"></i></NavItem>
      </Nav>
    </CollapsibleNav>
  </Navbar>
    );
  }

});

module.exports = NavbarTop;

