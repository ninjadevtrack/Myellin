'use strict';

var React = require('react/addons');
var Router = require('react-router');
var RequestOutcome = require('../components/RequestOutcome');
var OutcomesMultiple = require('../components/OutcomesMultiple');
var SearchBar = require('../components/SearchBar');
var SearchBarPlaylist = require('../components/SearchBarPlaylist');
var Grid = require('react-bootstrap').Grid;
var DocumentTitle = require('react-document-title');

//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

var PlaylistsMultiple = require('../components/PlaylistsMultiple');
var OptionsMultiple = require('../components/OptionsMultiple');
var ColumnManager = require('../components/ColumnManager');
var Column = require('../components/Column');

//var Modal = require('react-bootstrap').Modal; 
var Button = require('react-bootstrap').Button; 
var Playlist = require('../components/Playlist');
var CreatePlaylistButton = require('../components/CreatePlaylistButton');
var CreatePlaylistModal = require('../components/CreatePlaylistModal');
var AuthMixin = require('../mixins/AuthMixin');


var MainPage = React.createClass({

  mixins: [Router.State, ReactFireMixin, AuthMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getInitialState: function(){
    return {};
  },

  sectionChangeHandler: function(data){

    this.props.sectionChangeHandler(data);
  },

  showEditingPlaylist: function(){
    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    this.firebase = new Firebase(firebaseRoot);
    this.refUser = this.firebase.child('users/' + this.state.user.id);
    this.refUser.child('editing_playlist').update({ collapse: false });
  },

  hideEditingPlaylist: function(){
    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    this.firebase = new Firebase(firebaseRoot);
    this.refUser = this.firebase.child('users/' + this.state.user.id);
    this.refUser.child('editing_playlist').update({ collapse: true });
  },

  onDoneEditingPlaylist: function(){
    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    this.firebase = new Firebase(firebaseRoot);
    this.refUser = this.firebase.child('users/' + this.state.user.id);
    this.refUser.child('editing_playlist').remove();
  },

  render: function () {

    var outcome_id = this.getParams().outcome_id;
    var suboutcome_id = this.getParams().suboutcome_id;

    return (
      <DocumentTitle title="MainPage">
        <section className="mainpage">

            { this.state.user && this.state.user.editing_playlist && 
              <CreatePlaylistModal 
                collapse={this.state.user.editing_playlist.collapse}
                onHide={this.hideEditingPlaylist}
                onMouseOver={this.showEditingPlaylist}>

                 <Playlist 
                    relationData={this.state.user.editing_playlist} 
                    editable={true}
                    onDoneEditing={this.onDoneEditingPlaylist} />

              </CreatePlaylistModal>
            }
        
            <ColumnManager sectionChangeHandler={this.sectionChangeHandler}>

              <Column>

                <OutcomesMultiple 
                  selected_outcome_id={outcome_id} />

              </Column>
           
              { outcome_id  &&
                <Column>

                  <CreatePlaylistButton outcome_id={outcome_id} />
               
                  <PlaylistsMultiple 
                    outcome_id={outcome_id} 
                    selected_suboutcome_id={suboutcome_id}
                    onEditPlaylist={this.editPlaylist}
                    key={outcome_id} />

                </Column>
              }

              { suboutcome_id &&
                <Column>

                  <OptionsMultiple 
                    suboutcome_id={suboutcome_id}
                    key={suboutcome_id} />

                </Column>
              }

            </ColumnManager>

        </section>
      </DocumentTitle>
    );
  }

});

module.exports = MainPage;