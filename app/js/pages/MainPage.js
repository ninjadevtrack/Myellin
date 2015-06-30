'use strict';

var React = require('react/addons');
var Router = require('react-router');
var RequestOutcome = require('../components/RequestOutcome');
var Outcomes = require('../components/Outcomes');
var SearchBar = require('../components/SearchBar');
var Grid = require('react-bootstrap').Grid;
var Col = require('react-bootstrap').Col;
var DocumentTitle = require('react-document-title');


var MainPage = React.createClass({

  mixins: [Router.State],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  computeOutcomesWidth: function() {
    return this.getParams().outcome_id ? 6 : 12;
  },

  computeSubOutcomesWidth: function() {
    return this.getParams().outcome_id ? 6 : 0;
  },

  render: function () {
    var outcome_id = this.getParams().outcome_id;
    return (
      <DocumentTitle title="MainPage">
        <section className="mainpage">
          <Grid>
            <SearchBar />
            <Col sm={10} smPush={0} md={this.computeOutcomesWidth()} mdPush={0} lg={10} lgPush={1}>
              <Outcomes />
            </Col>
            <Col sm={10} smPush={0} md={this.computeSubOutcomesWidth()} mdPush={0} lg={10} lgPush={1}>
              Display the list of sub-outcomes for the outcome with id {outcome_id}
            </Col>
          </Grid>
          <RequestOutcome />
        </section>
      </DocumentTitle>
    );
  }

});

module.exports = MainPage;