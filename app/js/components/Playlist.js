'use strict';

var React = require('react/addons');
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
var ReactFireMixin = require('reactfire');

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

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    this.refPlaylist = firebase.child('playlists/' + this.props.relationData.playlist_id);
    this.bindAsObject(this.refPlaylist, 'data');
  },

  menuOnSelect: function(event, eventKey){
    switch (eventKey){
      case 'edit':
        this.toggleEdit();
        break;
    }
  },

  toggleEdit: function(){

    this.setState({ editable: !this.state.editable });
  },

  addSubOutcomeSubmit: function(e){
    e.preventDefault();

    this.addSubOutcome();
  },

  addSubOutcome: function(){

    var title = React.findDOMNode(this.refs.createSuboutcome).value.trim();

    if (!title)
      return false;

    this.refs.SubOutcomesMultiple.refs.child.createThenAdd(title);

    // Clear input
    React.findDOMNode(this.refs.createSuboutcome).value = '';
  },

  save: function(){

    var description = React.findDOMNode(this.refs.description).value.trim();
    this.refPlaylist.update({ description: description });

    // Create new suboutcome if text in input
    this.addSubOutcome();

    // Call SubOutcomesMultiple component's saveOrder method
    // We must use SubOutcomesMultiple.refs.child to access because it's wrapped by React DnD
    this.refs.SubOutcomesMultiple.refs.child.save();

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

  render: function () {

    if (!this.state.data)
      return false;

    return (
      <div className="playlist-container">
        <div>
          { !this.state.editable &&
            <div style={{ float: 'right'}}>
              <DropdownButton style={{margin: '-10px 0 -15px 0', padding: '0', color: '#000'}}  onSelect={this.menuOnSelect} bsSize='large' title={ranking} bsStyle='link' classStyle='editbutton' pullRight noCaret>
                <MenuItem eventKey='edit'>Edit</MenuItem>
                <MenuItem eventKey='delete'>Delete</MenuItem>
                <MenuItem eventKey='report'>Report Spam</MenuItem>
              </DropdownButton>
            </div>
          }

          
          <AuthorName id={this.getAuthorId()} />

          { !this.state.editable &&
            <p>{this.getDescription()}</p>
          }

          { this.state.editable &&
            <textarea ref="description" rows="5" style={{width:'100%', borderBottom: '0px solid #FBFBFB', borderTop: '0px solid #FBFBFB', marginBottom: '1em', textAlign: 'justify', fontFamily: 'Akkurat-Light'}}>
              {this.getDescription()}
            </textarea>
          }
       
          <div className="upvote">
            <div className="count">{this.props.relationData.upvote_count}</div>
           
            <UpvoteButton 
              label={<Glyphicon glyph='ok-circle'/>}
              this_type="playlist"
              this_id={this.state.data['.key']} 
              parent_type="outcome"
              parent_id={this.props.relationData.parent_outcome_id}
              key={this.getUpvoteButtonKey()} />
          
          </div>
          
        </div>

        <SubOutcomesMultiple 
          playlist_id={this.state.data['.key']} 
          editable={this.state.editable}
          ref="SubOutcomesMultiple"
          key={this.props.relationData.playlist_id} />

        { this.state.editable &&
          <div>
            <form onSubmit={this.addSubOutcomeSubmit}>
              <input ref="createSuboutcome" placeholder="Add a sub outcome. Hit enter." type="text" style={{width:'100%', borderBottom: '1px solid #FBFBFB', paddingBottom: '0.7em', paddingTop: '0.5em', marginTop: '-4em'}} />
            </form>
      
            <ButtonGroup justified bsSize='medium' style={{marginTop: '3em', marginBottom: '-0.5em',}}>
              <Button onClick={this.save}>SAVE</Button>
              <Button onClick={this.cancel} style={{borderLeft: 0}}>CANCEL</Button>
            </ButtonGroup>
          </div>
        }

        <div className="playlist-bottom-border"></div>

      </div>
    );
  }

});

module.exports = Playlist;