'use strict';

var React = require('react/addons');
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var DropdownButton = require('react-bootstrap').DropdownButton;
var CollapsibleNav = require('react-bootstrap').CollapsibleNav;
var NavItem = require('react-bootstrap').NavItem;
var MenuItem = require('react-bootstrap').MenuItem;
var Button = require('react-bootstrap').Button;
var LoginButton = require('./LoginButton');

var icon = (
    <span class="logo">
      <a href="/">
        <img src="/images/monogram.svg" height="30" width="34" alt="text here" /></a>
    </span>
  );

var NavbarTop = React.createClass({

  render: function() {

    var brand = (this.props.section ? this.props.section.title : icon);

    return (
      <div className='navbarhidemobilemenu'>
        <Navbar fixedTop={true} fluid={true}  toggleNavKey={0} brand={brand}>{/* This is the eventKey referenced */}
          <Nav navbar left>
            <DropdownButton eventKey={1} title={<i className="s s-glyph09 s-hamburger"></i>} className='marginleft' noCaret pullLeft>
              <MenuItem eventKey='1'>Home</MenuItem>
              <MenuItem eventKey='2'>About</MenuItem>
              <MenuItem eventKey='3'>Contact</MenuItem>
              <MenuItem eventKey='4'>Filter</MenuItem>
            </DropdownButton>
          </Nav>
          <Nav navbar right>
            <div><LoginButton/></div>
          </Nav>
          <CollapsibleNav eventKey={0}>   
          </CollapsibleNav>
        </Navbar>
      </div>
    );
  }

});

module.exports = NavbarTop;

