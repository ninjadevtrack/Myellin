'use strict';

var React = require('react/addons');
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var DropdownButton = require('react-bootstrap').DropdownButton;
var CollapsibleNav = require('react-bootstrap').CollapsibleNav;
var NavItem = require('react-bootstrap').NavItem;
var MenuItem = require('react-bootstrap').MenuItem;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Button = require('react-bootstrap').Button;
var Affix = require('react-bootstrap').Affix;


var NavbarTop = React.createClass({

  render: function() {
    return (
      <Affix>
      <Navbar brand='Myelin' toggleNavKey={0}>
    <CollapsibleNav eventKey={2}> {/* This is the eventKey referenced */}
      <Nav navbar left>
      <DropdownButton eventKey={3} title={<i className="s hamburger s-glyph01"></i>} noCaret>
          <MenuItem eventKey='1'>Home</MenuItem>
          <MenuItem eventKey='2'>About</MenuItem>
          <MenuItem eventKey='3'>Contact</MenuItem>
          <MenuItem eventKey='4'>Filter</MenuItem>
        </DropdownButton>
      </Nav>
      <Nav navbar right>
<NavItem eventKey={2} href='#'><i className="s hamburger s-glyph03"></i></NavItem>
      </Nav>
    </CollapsibleNav>
  </Navbar>
  </Affix>
    );
  }

});

module.exports = NavbarTop;

