'use strict';

var React  = require('react');
var ReactDOM  = require('react-dom');
var Router = require('react-router').Router;
var browserHistory = require('react-router').browserHistory;

var routes = require('./Routes');

if ( process.env.NODE_ENV !== 'production' ) {
  // Enable React devtools
  window.React = React;
}

//Router.run(routes, Router.HistoryLocation, function(Handler, state) {

	// Track as pageview in Google Analytics
	/*
	ga('send', {
	  hitType: 'pageview',
	  page: state.path
	});
	*/

	/*<Handler params={state.params} query={state.query} />*/

  	ReactDOM.render(
  		<Router history={browserHistory} routes={routes} />, 
  		document.getElementById('app')
  	);
//});