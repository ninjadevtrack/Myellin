'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem; 
var Glyphicon = require('react-bootstrap').Glyphicon; 
var ListGroup = require('react-bootstrap').ListGroup;
var Router = require('react-router');
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var MenuItem = require('react-bootstrap').MenuItem;
var DropdownButton = require('react-bootstrap').DropdownButton;

require('firebase');
var ReactFireMixin = require('reactfire');

var AuthorName = require('./AuthorName');
var SubOutcomesMultiple = require('./SubOutcomesMultiple');
var UpvoteButton = require('./UpvoteButton');

var ranking = (<Glyphicon glyph='option-vertical' className='optionplaylist' />);


var Playlist = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

  propTypes: {
    relationData: React.PropTypes.object.isRequired
  },

  getInitialState: function(){
    return {
      data: null
    };
  },

  componentWillMount: function() {
    this.bindFirebaseRefs();
  },

  bindFirebaseRefs: function(){

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    this.refPlaylist = firebase.child('playlists/' + this.props.relationData.playlist_id);
    this.bindAsObject(this.refPlaylist, 'data');
  },

  render: function () {

    if (!this.state.data)
      return false;

    return (
      <div className="playlist-container">
       <div>
        <div style={{ float: 'right'}}>
 <DropdownButton style={{margin: '-10px 0 -15px 0', padding: '0', color: '#000'}}  bsSize='large' title={ranking} bsStyle='link' classStyle='editbutton' pullRight noCaret>
        <MenuItem eventKey='1'>Edit</MenuItem>
        <MenuItem eventKey='2'>Delete</MenuItem>
         <MenuItem eventKey='3'>Report Spam</MenuItem>
      </DropdownButton>
      </div>
          <AuthorName id={this.state.data.author_id} />

          <p>{this.state.data.description}</p>
          
          <div className="upvote">
            <div className="count">{this.props.relationData.upvote_count}</div>
           
            <UpvoteButton 
              label={<Glyphicon glyph='ok-circle'/>}
              this_type="playlist"
              this_id={this.state.data.id} 
              parent_type="outcome"
              parent_id={this.props.relationData.parent_outcome_id} />
          
          </div>
        </div>
        <div className="suboutcome-border">
        <SubOutcomesMultiple playlist_id={this.state.data.id} />
        </div>
      </div>
    );
  }

});

module.exports = Playlist;