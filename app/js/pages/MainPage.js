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

var PlaylistsMultiple = require('../components/PlaylistsMultiple');
var OptionsMultiple = require('../components/OptionsMultiple');

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

    var column_width_outcomes,
        column_width_playlists,
        column_width_options;

    var outcome_id = this.getParams().outcome_id;
    var suboutcome_id = this.getParams().suboutcome_id;

    if (outcome_id && suboutcome_id){
      column_width_outcomes = 2;
      column_width_playlists = 4;
      column_width_options = 6;
    }else
    if (outcome_id){
      column_width_outcomes = 5;
      column_width_playlists = 7;
    }else{
      column_width_outcomes = 12;
    }

    //var outcomes_column_width = this.computeOutcomesWidth();
    //var playlists_column_width = this.computePlaylistsWidth();

    return (
      <DocumentTitle title="MainPage">
        <section className="mainpage">
          <Grid fluid={true}>

            <SearchBar />
            <div id="give-me-some-space" style={{ height: '2em', width: '100%' }}> </div>

            <Col sm={column_width_outcomes}
                 md={column_width_outcomes}
                 lg={column_width_outcomes} 
                 smPush={0}
                 mdPush={0}
                 lgPush={0}>

              <Outcomes />

            </Col>

            { outcome_id &&
              <Col sm={column_width_playlists}
                   md={column_width_playlists}
                   lg={column_width_playlists} 
                   smPush={0}
                   mdPush={0}
                   lgPush={0}>

                <PlaylistsMultiple outcome_id={outcome_id} />
              </Col>
            }

            { suboutcome_id &&
              <Col sm={column_width_options}
                   md={column_width_options}
                   lg={column_width_options} 
                   smPush={0}
                   mdPush={0}
                   lgPush={0}>

                <OptionsMultiple suboutcome_id={suboutcome_id} />
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

          <RequestOutcome />
          
        </section>
      </DocumentTitle>
    );
  }

});

module.exports = MainPage;