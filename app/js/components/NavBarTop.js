'use strict';

var React = require('react');

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

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  _handleBrandClick: function(e) {
    e.preventDefault();
    this.context.router.push('/')
  },

  _handleSubmit: function(e){
    e.preventDefault();

    var search_term = this.refs.search_input.getValue();

    mixpanel.track('Search', {
      search_term: search_term
    });

    this.refs.search_input.getInputDOMNode().value = '';
  },

  render: function() {



    var icon = (
      <span className="logo">
        <a href="#" onClick={this._handleBrandClick}>
         <span className="blacknwhite"><img src="/images/monogram2.svg" height="37,65px" width="44,06px" alt="Logo" /></span>
         <span className="purple"><img src="/images/monogram.svg" height="37,65px" width="44,06px" alt="Logo" /></span>
        </a>
      </span>
    );



    return (
      <div className='navbarhidemobilemenu'>
        <Navbar fixedTop={true} fluid={true}>{/* This is the eventKey referenced */}
          <Nav navbar pullLeft>
            <div className="compensate-for-the-nav">
              <div className="inputplaceholder">
                <form onSubmit={ this._handleSubmit }>
                  <Input type='text' ref="search_input" bsSize="large" placeholder="&#32;" />
                </form>
              </div>
            </div>
          </Nav>

          <Navbar.Brand>
            {icon}
          </Navbar.Brand>

          <Nav navbar pullRight>
            <div><LoginButton/></div>
          </Nav>
        </Navbar>
      </div>
    );
  }

});

module.exports = NavbarTop;

