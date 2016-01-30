'use strict';

var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var IndexRoute    = Router.IndexRoute;

var App           = require('./App');
var HomePage      = require('./pages/HomePage');
var SearchPage    = require('./pages/SearchPage');
var MainPage      = require('./pages/MainPage');
var NotFoundPage  = require('./pages/NotFoundPage');

module.exports = (
  <Route path='/' component={App}>

    /*
     * If this route is matched, the outcomes will be half of the width
     * and sub-outcomes the second half.
     */
    <Route path=':outcome_slug' component={MainPage} />

    <Route path=':outcome_slug/:playlist_id/:suboutcome_id' component={MainPage} />

    /*
     * If none of the above routes matched, then load the MainPage component.
     * The outcomes will take the full width of the screen.
     */
    {/*<DefaultRoute handler={MainPage} />*/}
    <IndexRoute component={MainPage} />

    /*
     * Route displayed when none of the above were matched.
     */
    <Route path="*" component={NotFoundPage} />
  </Route>
);