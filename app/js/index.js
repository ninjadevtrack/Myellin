'use strict';

var React  = require('react/addons');
var Router = require('react-router');

var routes = require('./Routes');

if ( process.env.NODE_ENV !== 'production' ) {
  // Enable React devtools
  window.React = React;
}

Router.run(routes, Router.HistoryLocation, function(Handler, state) {

	//console.log(state.path);

	// Track as pageview in Google Analytics
	ga('send', {
	  hitType: 'pageview',
	  page: state.path
	});

  	React.render(<Handler params={state.params} query={state.query} />, document.getElementById('app'));
});