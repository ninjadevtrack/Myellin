'use strict';

var React         = require('react/addons');
var Router        = require('react-router');
var Route         = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute  = Router.DefaultRoute;

var App           = require('./App');
var HomePage      = require('./pages/HomePage');
var SearchPage    = require('./pages/SearchPage');
var MainPage    = require('./pages/MainPage');
var NotFoundPage  = require('./pages/NotFoundPage');

module.exports = (
  <Route name='app' path='/' handler={App}>

    /*
     * If this route is matched, the outcomes will be half of the width
     * and sub-outcomes the second half.
     */
    <Route name='Outcomes' path='mainpage/:outcome_id' handler={MainPage} />

    <Route name='Options' path='mainpage/:outcome_id/:suboutcome_id' handler={MainPage} />

    <Route name='EditPlaylist' path='mainpage/:outcome_id/:suboutcome_id/:edit_playlist_id' handler={MainPage} />

    /*
     * If none of the above routes matched, then load the MainPage component.
     * The outcomes will take the full width of the screen.
     */
    <DefaultRoute handler={MainPage} />

    /*
     * Route displayed when none of the above were matched.
     */
    <NotFoundRoute handler={NotFoundPage} />
  </Route>
);