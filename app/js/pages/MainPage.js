'use strict';

var React = require('react/addons');
var Router = require('react-router');
var RequestOutcome = require('../components/RequestOutcome');
var Outcomes = require('../components/Outcomes');
var SearchBar = require('../components/SearchBar');
var SearchBarPlaylist = require('../components/SearchBarPlaylist');
var Grid = require('react-bootstrap').Grid;
//var Col = require('react-bootstrap').Col;
var DocumentTitle = require('react-document-title');

var ReactFireMixin = require('reactfire');
var PlaylistsMultiple = require('../components/PlaylistsMultiple');
var OptionsMultiple = require('../components/OptionsMultiple');
var CreatePlaylist = require('../components/CreatePlaylist');
var ColumnManager = require('../components/ColumnManager');
var Column = require('../components/Column');

var MainPage = React.createClass({

  mixins: [Router.State, ReactFireMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getInitialState: function(){
    return {

    };
  },

  render: function () {

    var outcome_id = this.getParams().outcome_id;
    var suboutcome_id = this.getParams().suboutcome_id;
    var create = this.getParams().create;

    return (
      <DocumentTitle title="MainPage">
        <section className="mainpage">

          <Grid fluid={true}>

            <ColumnManager>

              { !create && 
                <Column>
                  <SearchBar />
                  <Outcomes selected_outcome_id={outcome_id} />
                </Column>
              }

              { outcome_id  &&
                <Column>
                  <SearchBarPlaylist />
                  <PlaylistsMultiple outcome_id={outcome_id} selected_suboutcome_id={suboutcome_id} />
                </Column>
              }

              { suboutcome_id &&
                <Column>
                  <SearchBarPlaylist />
                  <OptionsMultiple suboutcome_id={suboutcome_id} />
                </Column>
              }

              { create &&
                <Column>
                  <br/><br/><br/>
                  <CreatePlaylist outcome_id={outcome_id} />
                </Column>
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