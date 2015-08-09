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
var Playlist = require('../components/Playlist');


var MainPage = React.createClass({

  mixins: [Router.State, ReactFireMixin],

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

    var column_width = this.computeOutcomesWidth();

    return (
      <DocumentTitle title="MainPage">
        <section className="mainpage">
          <Grid fluid={true}>

            <SearchBar />
            <div id="give-me-some-space" style={{ height: '2em', width: '100%' }}> </div>

            <Col sm={column_width}
                 md={column_width}
                 lg={column_width} 
                 smPush={0}
                 mdPush={0}
                 lgPush={0}>

              <Outcomes />

            </Col>

            { outcome_id &&
              <Col sm={column_width}
                   md={column_width}
                   lg={column_width} 
                   smPush={0}
                   mdPush={0}
                   lgPush={0}>

                <Playlist id={outcome_id}/>
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