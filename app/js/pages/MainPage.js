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
var EditPlaylist = require('../components/EditPlaylist');
var ColumnManager = require('../components/ColumnManager');
var Column = require('../components/Column');

var MainPage = React.createClass({

  mixins: [Router.State, ReactFireMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getInitialState: function(){
    return {
      editPlaylist: null
    };
  },

  editPlaylist: function(playlist_id, outcome_id){
    console.log('playlist_id: ' + playlist_id);
    console.log('outcome_id: ' + outcome_id);

    this.setState({ editPlaylist: {
      playlist_id: playlist_id,
      outcome_id: outcome_id
    }});
  },

  render: function () {

    var outcome_id = this.getParams().outcome_id;
    var suboutcome_id = this.getParams().suboutcome_id;

    return (
      <DocumentTitle title="MainPage">
        <section className="mainpage">


            <ColumnManager>

          
              <Column>
                <SearchBar />

                <Outcomes 
                  selected_outcome_id={outcome_id} />

              </Column>
           

              { outcome_id  &&
                <Column>
                  <SearchBarPlaylist />

                  <PlaylistsMultiple 
                    outcome_id={outcome_id} 
                    selected_suboutcome_id={suboutcome_id}
                    onEditPlaylist={this.editPlaylist} />

                </Column>
              }

              { suboutcome_id &&
                <Column>
                  <SearchBarPlaylist />

                  <OptionsMultiple 
                    suboutcome_id={suboutcome_id} />

                </Column>
              }

              { this.state.editPlaylist &&
                <Column>
                  <SearchBarPlaylist />
                
                  <EditPlaylist 
                    playlist_id={this.state.editPlaylist.playlist_id} 
                    outcome_id={this.state.editPlaylist.outcome_id} />
                  
                </Column>
              }

            </ColumnManager>


    
        </section>
      </DocumentTitle>
    );
  }

});

module.exports = MainPage;