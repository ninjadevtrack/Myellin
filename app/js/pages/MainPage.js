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
var ColumnManager = require('../components/ColumnManager');

var MainPage = React.createClass({

  mixins: [Router.State, ReactFireMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  render: function () {

    var outcome_id = this.getParams().outcome_id;
    var suboutcome_id = this.getParams().suboutcome_id;

    return (
      <DocumentTitle title="MainPage">
        <section className="mainpage">
          <Grid fluid={true}>

            <SearchBar />
            <div id="give-me-some-space" style={{ height: '2em', width: '100%' }}> </div>

            <ColumnManager>

              <Col>
                <Outcomes selected_outcome_id={outcome_id} />
              </Col>

              { outcome_id &&
                <Col>
                  <PlaylistsMultiple outcome_id={outcome_id} selected_suboutcome_id={suboutcome_id} />
                </Col>
              }

              { suboutcome_id &&
                <Col>
                  <OptionsMultiple suboutcome_id={suboutcome_id} />
                </Col>
              }

            </ColumnManager>

          </Grid>

          <RequestOutcome />
          
        </section>
      </DocumentTitle>
    );
  }

});

module.exports = MainPage;