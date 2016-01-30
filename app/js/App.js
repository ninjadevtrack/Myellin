'use strict';

var React = require('react');
var RouteHandler = require('react-router').RouteHandler;

var NavbarTop = require('./components/NavBarTop');
var HomePage = require('./pages/HomePage');
var SearchPage = require('./pages/SearchPage');
var MainPage = require('./pages/MainPage');
var Footer = require('./components/Footer');

var ReactDnD = require('react-dnd');
var HTML5Backend = require('react-dnd-html5-backend');



var App = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },

  childContextTypes: {
    params: React.PropTypes.object
  },

  getChildContext() {
    return { params: this.props.params }
  },

  render: function () {
    return (
      <div>
        <NavbarTop />

        {this.props.children}

        {/*
        <RouteHandler params={this.props.params}
                      query={this.props.query}
                      //currentUser={this.state.currentUser}
                      sectionChangeHandler={this.sectionChangeHandler} />
        */}

        <Footer />
      </div>
    );
  }

});

module.exports = ReactDnD.DragDropContext(HTML5Backend)(App);