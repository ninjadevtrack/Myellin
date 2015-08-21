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


var CreatePlaylist = React.createClass({

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

    //this.refPlaylist = firebase.child('playlists/' + this.props.relationData.playlist_id);
    //this.bindAsObject(this.refPlaylist, 'data');
  },

  render: function () {

    return (
      <div className="create-playlist-container">
        Create a playlist for "How to cook perfect scrambled eggs" outcome. 
      </div>
    );
  }

});

module.exports = CreatePlaylist;