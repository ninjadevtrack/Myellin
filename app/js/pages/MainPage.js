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

var OutcomePlaylists = require('../components/OutcomePlaylists');
var PlaylistsMultiple = require('../components/PlaylistsMultiple');
var OptionsMultiple = require('../components/OptionsMultiple');
var ColumnManager = require('../components/ColumnManager');
var Column = require('../components/Column');

//var Modal = require('react-bootstrap').Modal; 
var Button = require('react-bootstrap').Button; 
var Playlist = require('../components/Playlist');
var CreatePlaylistButton = require('../components/CreatePlaylistButton');
var CreateOptionButton = require('../components/CreateOptionButton');
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

    // Don't show on hover if already shown
    if (this.state.user.editing_playlist.collapse === false)
      return;

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

    console.log('rakt', this.getParams());

    var outcome_id = this.getParams().outcome_id;
    var outcome_slug = this.getParams().outcome_slug;
    var suboutcome_id = this.getParams().suboutcome_id;

    /*
    if (outcome_slug){
      alert('slug: ' + outcome_slug);
    }*/

    return (
      <DocumentTitle title="MainPage">
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
        
            <ColumnManager sectionChangeHandler={this.sectionChangeHandler}>

              <Column>

                <OutcomesMultiple 
                  selected_outcome_id={outcome_id} />

              </Column>
           
              { (outcome_id || outcome_slug)  &&
                <Column>

                  <CreatePlaylistButton outcome_id={outcome_id} />
                
                  <OutcomePlaylists 
                    outcome_id={outcome_id}
                    outcome_slug={outcome_slug}
                    key={outcome_id + "_" + outcome_slug}>

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