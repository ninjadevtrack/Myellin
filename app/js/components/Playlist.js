'use strict';

var DbHelper = require('../DbHelper');

var React = require('react/addons');
var cx = require('classnames');
var ListGroupItem = require('react-bootstrap').ListGroupItem; 
var Glyphicon = require('react-bootstrap').Glyphicon; 
var ListGroup = require('react-bootstrap').ListGroup;
var Router = require('react-router');
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var MenuItem = require('react-bootstrap').MenuItem;
var DropdownButton = require('react-bootstrap').DropdownButton;


require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

var AuthorName = require('./AuthorName');
var SubOutcomesMultiple = require('./SubOutcomesMultiple');
var UpvoteButton = require('./UpvoteButton');
var AuthMixin = require('./../mixins/AuthMixin.js');

var ranking = (<Glyphicon glyph='option-vertical' className='optionplaylist' />);

var Playlist = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin, AuthMixin],

  propTypes: {
    relationData: React.PropTypes.object.isRequired
  },

  getInitialState: function(){
    return {
      data: null,
      editable: (this.props.editable || false)
    };
  },

  componentWillMount: function() {

    this.bindFirebaseRefs();
  },

  componentDidUpdate: function(prevProps, nextState) {

    if (prevProps.relationData.playlist_id !== this.props.relationData.playlist_id)
      this.bindFirebaseRefs(true);

    // Toggle editable state if editable prop changes
    if (this.props.editable !== prevProps.editable)
      this.toggleEdit();
  },

  bindFirebaseRefs: function(rebind){

    if (rebind)
      this.unbind('data');

    this.firebase = DbHelper.getFirebase();

    this.refPlaylist = this.firebase.child('playlists/' + this.props.relationData.playlist_id);
    this.bindAsObject(this.refPlaylist, 'data');
  },

  menuOnSelect: function(event, eventKey){
    switch (eventKey){
      case 'edit':
        this.toggleEdit();
        break;
      case 'toggle_privacy':
        this.togglePrivacy();
        break;
      case 'delete':
        this.delete();
        break;
    }
  },

  toggleEdit: function(){

    var dataEditingPlaylist = {
      parent_outcome_id: this.props.relationData.parent_outcome_id,
      playlist_id: this.props.relationData.playlist_id,
      collapse: false
    };

    //console.log('dataEditingPlaylist', dataEditingPlaylist);

    this.firebase.child('users/' + this.state.user.id).update({
      editing_playlist: dataEditingPlaylist
    });

  },

  togglePrivacy: function(){
    var val = (this.state.data.private ? null : true);

    DbHelper.playlists.update(this.props.relationData.playlist_id, {
      private: val
    });
  },

  delete: function(){

    if (!this.props.relationData.playlist_id){
      alert('Cannot delete. Missing relationData.playlist_id value (value was not set for older test data). Delete manually from Firebase forge.');
    }

    var refOutcomeToPlaylist = this.firebase.child('relations/outcome_to_playlist/outcome_' + this.props.relationData.parent_outcome_id + '/playlist_' + this.props.relationData.playlist_id);

    // Remove playlist from outcome
    refOutcomeToPlaylist.remove();

    // Delete the playlist
    DbHelper.playlists.delete(this.props.relationData.playlist_id);

    // Remove user_to_outcome_to_playlist relation
    // So when we lookup whether user has a playlist for this outcome already it returns false
    var userOutcomePlaylistRef = this.firebase.child('relations/user_to_outcome_to_playlist/user_' + this.state.user.id +'/outcome_' + this.props.relationData.parent_outcome_id);
    userOutcomePlaylistRef.remove();

    // De-increment the outcome's playlist_count
    this.firebase.child('outcomes/' + this.props.relationData.parent_outcome_id + '/playlist_count').transaction(function(currentValue) {
      if (!currentValue)
        return 0;

      return currentValue - 1;
    });
  },

  addSubOutcomeSubmit: function(e){
    e.preventDefault();

    this.addSubOutcome();
  },

  addSubOutcome: function(){

    var title = React.findDOMNode(this.refs.createSuboutcome).value.trim();

    if (!title)
      return false;

    this.state.SubOutcomesMultipleRef.createThenAdd(title);
    //this.refs.SubOutcomesMultiple.refs.child.createThenAdd(title);

    // Clear input
    React.findDOMNode(this.refs.createSuboutcome).value = '';
  },

  save: function(){

    var description = React.findDOMNode(this.refs.description).value.trim();

    // Create new suboutcome if text in input
    this.addSubOutcome();

    // Call SubOutcomesMultiple component's save method
    // See storeReferenceToSubOutcomesMultiple() above for explanation
    var suboutcome_count = this.state.SubOutcomesMultipleRef.save();
    //this.refs.SubOutcomesMultiple.refs.save();
    //this.refs.SubOutcomesMultiple.refs.child.save();

    DbHelper.playlists.update(this.props.relationData.playlist_id, {
      description: description,
      suboutcome_count: suboutcome_count
    });

    this.toggleEdit();

    if (this.props.onDoneEditing)
      this.props.onDoneEditing();
  },

  cancel: function(){

    this.toggleEdit();

    if (this.props.onDoneEditing)
      this.props.onDoneEditing();

  },

  getUpvoteButtonKey: function(){
    return 'playlist_' + this.state.data['.key'] + '_outcome_' + this.props.relationData.parent_outcome_id;
  },

  getAuthorId: function(){
    if (this.state.data)
      return this.state.data.author_id;

    if (this.user)
      return this.user.id;
  },

  getDescription: function(){
    if (this.state.data)
      return this.state.data.description;
  },

  // Callback we pass to child SubOutcomesMultiple component ...
  // ... so that it can pass back a reference to itself
  // We have to do this because ReactDnd is breaking our ability to access it via this.refs
  // TODO: Remove this terrible hack as soon we can
  storeReferenceToSubOutcomesMultiple: function(reference){
    this.setState({ SubOutcomesMultipleRef : reference });
  },

  _getMenuItems: function(){

    var menuItems = [];

    if (!this.state.user)
      return [];

    // If user is author
    if (this.state.user.id === this.state.data.author_id)
      menuItems.push( <MenuItem eventKey='edit'>Edit</MenuItem> );



    // If user is author OR admin
    if (this.state.user.id === this.state.data.author_id || this.state.user.admin === true){
      //var togglePrivacyLabel = (this.state.data.private ? 'Public' : 'Private');
      menuItems.push( 
        <MenuItem eventKey='toggle_privacy'>
          Make {(this.state.data.private ? 'Public' : 'Private')}
        </MenuItem> 
      );
      menuItems.push( <MenuItem eventKey='delete'>Delete</MenuItem> );
    }

    return menuItems;
  },

  _isEmpty: function(){

    if (this.state.data.suboutcome_count === 0)
      return true;

    return false;
  },

  _isPlaylistAuthor: function(){
    if (this.state.user && this.state.user.id === this.state.data.author_id)
      return true;

    return false;
  },

  _isAllowedToView: function(){

    // If not private return true
    if (!this.state.data.private)
      return true;

    // If admin return true
    if (this.state.user && this.state.user.admin)
      return true;

    if ( this._isPlaylistAuthor() )
      return true;

    // If user in outcome.can_view array return true
    if (this.state.user && this.state.data.can_view && this.state.data.can_view[this.state.user.id])
      return true;

    // Othewise return false
    return false;
  },


  render: function () {

    if (!this.state.data)
      return false;

    // If outcome is private make sure current user can view it
    if (this._isAllowedToView() === false)
      return false;

    // Hide playlists that have zero suboutcomes (unless user is the author)
    /*
    if (this._isEmpty() === true && this._isPlaylistAuthor() === false )
      return false;
    */

    var menuItems = this._getMenuItems();

    var classes = cx('playlist-container', {
      'editing': this.state.editable
    });

    return (
      <div className={classes}>
      <div className="bottomborder">

        <div className="countdiv">
          <div className="listnumber">{this.props.number}.</div>
          <div className="count">
            {this.state.data.view_count || 0} views
          </div>
        </div>
      
        <AuthorName id={this.getAuthorId()} />

        { !this.state.editable &&
          <div className="descriptiontext">
          <div style={{paddingBottom: '1.3em', marginTop: '-1.1em'}}><p>{this.getDescription()}</p></div>
          </div>
        }
{ this.state.editable &&
<div className="steps"><div style={{marginTop: '8em'}}>DESCRIPTION:</div></div>
}
        { this.state.editable &&
          <textarea 
            ref="description" 
            rows="5" 
            className='inputdescription' 
            placeholder="In three sentences tell us about your experience related to this outcome, and who it is for. " 
            style={{width:'100%', border: '2px solid #cdcdcd', marginBottom: '2em', padding: '10px'}} 
            defaultValue={this.getDescription()} />
        }

       <div className="steps">CHAPTERS:</div>
        <SubOutcomesMultiple 
          playlist_id={this.state.data['.key']} 
          editable={this.state.editable}
          referenceCallback={this.storeReferenceToSubOutcomesMultiple}
          ref="SubOutcomesMultiple"
          key={this.props.relationData.playlist_id} />

        { this.state.editable &&
          <div>
          <div style={{top: '0', width: '100%', borderBottom: '1px solid #EEEEEE', height: '60px', position: 'fixed', zIndex: '10', backgroundColor: '#fff', left: '0'}}>
            <ButtonGroup justified bsSize='medium' style={{width: '210px', top: '12.5px', right: '10px', float: 'right'}}>
              <Button onClick={this.save} style={{float: 'right', color: '#FFF', fontFamily: 'Akkurat-Bold', backgroundColor:'#00FF9B', border: '0px solid #fff', width:'100px', height: '35px', borderRadius: '5px', lineHeight: '1.4em'}}>save</Button>
              <Button onClick={this.cancel} style={{float: 'left', color: '#4A4A4A', fontFamily: 'Akkurat-Bold', backgroundColor:'#FFF', border: '0px solid #fff', width:'100px', height: '35px', borderRadius: '5px', lineHeight: '1.4em'}}>cancel</Button>
            </ButtonGroup>
          </div>
            <form onSubmit={this.addSubOutcomeSubmit}>
              <input ref="createSuboutcome" className='inputchapter' placeholder="To add a chapter, type the chapter title here and press enter." type="text" style={{width:'100%', border: '2px solid #cdcdcd',backgroundColor: '#fff', paddingBottom: '1.1em', paddingTop: '1.1em', paddingLeft: '1.2em', marginBottom: '10em'}} />
            </form>
          </div>
        }
        
  <div>

          {/* {this.state.data['.key']} */}
        
          { !this.state.editable &&
            <div className="upvotediv">
              <div className="upvote">
                <UpvoteButton 
                  label={<Glyphicon glyph='ok-circle'/>}
                  this_type="playlist"
                  this_id={this.state.data['.key']} 
                  parent_type="outcome"
                  parent_id={this.props.relationData.parent_outcome_id}
                  key={this.getUpvoteButtonKey()} />
              </div>
              <div className="helptext">This is the most useful manual for this outcome</div>
            </div>
          }
        </div>



        { !this.state.editable && menuItems.length >= 1 &&
          <div>
            <div style={{ float: 'right'}}>
              <DropdownButton style={{margin: '0', padding: '0', color: '#000'}}  onSelect={this.menuOnSelect} bsSize='medium' title={ranking} bsStyle='link' classStyle='editbutton' pullRight noCaret>
                {menuItems}
              </DropdownButton>
            </div>


          </div>
        }

      </div>
      </div>
    );
  }
}
);

module.exports = Playlist;