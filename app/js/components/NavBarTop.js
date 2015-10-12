'use strict';

var React = require('react/addons');
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var DropdownButton = require('react-bootstrap').DropdownButton;
var CollapsibleNav = require('react-bootstrap').CollapsibleNav;
var NavItem = require('react-bootstrap').NavItem;
var Col = require('react-bootstrap').Col;
var MenuItem = require('react-bootstrap').MenuItem;
var Button = require('react-bootstrap').Button;
var LoginButton = require('./LoginButton');
var Router = require('react-router');
var Input = require('react-bootstrap').Input;


var NavbarTop = React.createClass({

   mixins: [Router.Navigation],

  _handleBrandClick: function(e) {
    e.preventDefault();
    this.context.router.transitionTo('app');
  },


  render: function() {



    var icon = (
      <span className="logo">
        <a href="#" onClick={this._handleBrandClick}>
         <span className="blacknwhite"><img src="/images/monogram2.svg" height="160%" width="160%" alt="Logo" /></span>
         <span className="purple"><img src="/images/monogram.svg" height="160%" width="160%" alt="Logo" /></span>
        </a>
      </span>
    );



    return (
      <div className='navbarhidemobilemenu'>
        <Navbar fixedTop={true} fluid={true}  toggleNavKey={0} brand={icon}>{/* This is the eventKey referenced */}
          <Nav navbar left>
          <div className="compensate-for-the-nav">
            <div className="inputplaceholder">
              <Input type='text' bsSize="large" placeholder="&#32;" />
            </div>
            </div>
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

