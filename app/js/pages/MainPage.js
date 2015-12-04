'use strict';

var DbHelper = require('../DbHelper');

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

var OutcomePlaylists = require('../components/OutcomePlaylists');
var PlaylistsMultiple = require('../components/PlaylistsMultiple');
var OptionsMultiple = require('../components/OptionsMultiple');
var ColumnManager = require('../components/ColumnManager');
var Column = require('../components/Column');

//var Modal = require('react-bootstrap').Modal; 
var Button = require('react-bootstrap').Button; 
var Playlist = require('../components/Playlist');
var Option = require('../components/Option');
var CreatePlaylistButton = require('../components/CreatePlaylistButton');
var CreateOptionButton = require('../components/CreateOptionButton');
var CreatePlaylistModal = require('../components/CreatePlaylistModal');
var CreateOptionModal = require('../components/CreateOptionModal');
var AuthMixin = require('../mixins/AuthMixin');


var MainPage = React.createClass({

  mixins: [Router.State, ReactFireMixin, AuthMixin],

  propTypes: {
    //currentUser: React.PropTypes.object.isRequired
  },

  getInitialState: function(){
    return {};
  },

  sectionChangeHandler: function(data){

    this.props.sectionChangeHandler(data);
  },

  showEditingPlaylist: function(){

    // Don't show on hover if already shown
    if (this.state.user.editing_playlist.collapse === false)
      return;

    this.firebase = DbHelper.getFirebase();
    this.refUser = this.firebase.child('users/' + this.state.user.id);
    this.refUser.child('editing_playlist').update({ collapse: false });
  },

  hideEditingPlaylist: function(){
    this.firebase = DbHelper.getFirebase();
    this.refUser = this.firebase.child('users/' + this.state.user.id);
    this.refUser.child('editing_playlist').update({ collapse: true });
  },

  onDoneEditingPlaylist: function(){
    this.firebase = DbHelper.getFirebase();
    this.refUser = this.firebase.child('users/' + this.state.user.id);
    this.refUser.child('editing_playlist').remove();
  },

  render: function () {

    var outcome_id = this.getParams().outcome_id;
    var outcome_slug = this.getParams().outcome_slug;
    var playlist_id = this.getParams().playlist_id;
    var suboutcome_id = this.getParams().suboutcome_id;

    return (
      <DocumentTitle title="Myelin">
        <section className="mainpage">

            { this.state.user && this.state.user.editing_playlist && 
              <CreatePlaylistModal 
                collapse={this.state.user.editing_playlist.collapse}
                onHide={this.hideEditingPlaylist}
                onMouseEnter={this.showEditingPlaylist}>

                 <Playlist 
                    relationData={this.state.user.editing_playlist} 
                    editable={true}
                    onDoneEditing={this.onDoneEditingPlaylist} />

              </CreatePlaylistModal>
            }

            { this.state.user && this.state.user.editing_option && 
              <CreateOptionModal>

                <Option 
                  relationData={this.state.user.editing_option} 
                  option_id={this.state.user.editing_option.option_id}
                  editable={true} />

              </CreateOptionModal>
            }
        
            <ColumnManager sectionChangeHandler={this.sectionChangeHandler}>

              <Column>

                <OutcomesMultiple 
                  selected_outcome_id={outcome_id} />

              </Column>
           
              { (outcome_id || outcome_slug)  &&
                <Column>

                  <OutcomePlaylists 
                    outcome_id={outcome_id}
                    outcome_slug={outcome_slug}
                    key={outcome_id + "_" + outcome_slug}>

                    <CreatePlaylistButton />

                    {/* Parent OutcomePlaylists component will fetch and then pass in outcome_id prop */}
                    <PlaylistsMultiple 
                      selected_suboutcome_id={suboutcome_id}
                      onEditPlaylist={this.editPlaylist} />
                   
                  </OutcomePlaylists>

                </Column>
              }

              { suboutcome_id &&
                <Column>

                  <CreateOptionButton suboutcome_id={suboutcome_id} />

                  <OptionsMultiple
                    playlist_id={playlist_id}
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