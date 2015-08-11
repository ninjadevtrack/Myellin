'use strict';

var React = require('react/addons');
var Router = require('react-router');
var RequestOutcome = require('../components/RequestOutcome');
var Outcomes = require('../components/Outcomes');
var SearchBar = require('../components/SearchBar');
var Grid = require('react-bootstrap').Grid;
var Col = require('react-bootstrap').Col;
var DocumentTitle = require('react-document-title');

var ReactFireMixin = require('reactfire');
var Playlists = require('../components/Playlists');

var MainPage = React.createClass({

  mixins: [Router.State, ReactFireMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  computeOutcomesWidth: function() {
    return this.getParams().outcome_id ? 5 : 12;
  },

  computePlaylistsWidth: function() {
    return this.getParams().outcome_id ? 7 : 0;
  },

  render: function () {

    var outcome_id = this.getParams().outcome_id;

    var outcomes_column_width = this.computeOutcomesWidth();
    var playlists_column_width = this.computePlaylistsWidth();

    return (
      <DocumentTitle title="MainPage">
        <section className="mainpage">
          <Grid fluid={false}>

            <Col sm={outcomes_column_width}
                 md={outcomes_column_width}
                 lg={outcomes_column_width} 
                 smPush={0}
                 mdPush={0}
                 lgPush={0}>
          <SearchBar />
              <Outcomes />
              <RequestOutcome />
            </Col>

            { outcome_id &&
              <Col sm={playlists_column_width}
                   md={playlists_column_width}
                   lg={playlists_column_width} 
                   smPush={0}
                   mdPush={0}
                   lgPush={0}>
                <SearchBar />

                <Playlists outcome_id={outcome_id} />
                <RequestOutcome />

              </Col>
            }

            {/*
            <Col sm={10} smPush={0} md={this.computeOutcomesWidth()} mdPush={0} lg={10} lgPush={1}>
              <Outcomes />
            </Col>
            <Col sm={10} smPush={0} md={this.computeSubOutcomesWidth()} mdPush={0} lg={10} lgPush={1}>
              Display the list of sub-outcomes for the outcome with id {outcome_id}
            </Col>
            */}

          </Grid>
          
        </section>
      </DocumentTitle>
    );
  }

});

module.exports = MainPage;