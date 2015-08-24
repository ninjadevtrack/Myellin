'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem; 
var Glyphicon = require('react-bootstrap').Glyphicon; 
var ListGroup = require('react-bootstrap').ListGroup;
var Router = require('react-router');
var Button = require('react-bootstrap').Button;

require('firebase');
var ReactFireMixin = require('reactfire');

var AuthorName = require('./AuthorName');
var SubOutcomesMultiple = require('./SubOutcomesMultiple');

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

  componentDidUpdate: function(prevProps, nextState) {
    if (this.props.playlist_id !== prevProps.playlist_id){
      console.log('BIND EDIT PLAYLIST');
      this.bindFirebaseRefs(true);
    }
  },

  bindFirebaseRefs: function(rebind){

    if (rebind)
      this.unbind('data');

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    this.refPlaylist = firebase.child('playlists/' + this.props.playlist_id).orderByChild('order');
    this.bindAsObject(this.refPlaylist, 'data');
  },

  addItem: function(e){
    e.preventDefault();

    var title = React.findDOMNode(this.refs.createSuboutcome).value.trim();

    this.refs.SubOutcomesMultiple.refs.child.add(title);

    // Clear input
    React.findDOMNode(this.refs.createSuboutcome).value = '';
  },

  deleteItem: function(relationData){

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);
    var refSuboutcome = firebase.child('suboutcomes/' + relationData.suboutcome_id);
    var refPlaylistToSuboutcome = firebase.child('relations/playlist_to_suboutcome/playlist_' + this.props.playlist_id + '/suboutcome_' + relationData.suboutcome_id);

    // Remove suboutcome from playlist
    refPlaylistToSuboutcome.remove();

    // Delete the suboutcome
    refSuboutcome.remove();
  },

  save: function(){

    // Call SubOutcomesMultiple component's saveOrder method
    // We must use SubOutcomesMultiple.refs.child to access because it's wrapped by React DnD
    this.refs.SubOutcomesMultiple.refs.child.save();

    this.close();
  },

  close: function(){

    this.props.onClose();
  },

  render: function () {

    if (!this.state.data)
      return false;

    return (
      <div className="playlist-container" style={{position: 'fixed'}}>
        <div>

          <AuthorName id={this.state.data.author_id} />

          <textarea rows="5" style={{width:'100%', border: '1px solid #000', padding: '0.4em'}}>
            {this.state.data.description}
          </textarea>
          
        </div>

        <SubOutcomesMultiple 
          sortable={true}
          playlist_id={this.state.data.id}
          onDelete={this.deleteItem}
          ref="SubOutcomesMultiple" />

        <form onSubmit={this.addItem}>
          <input ref="createSuboutcome" placeholder="Add suboutcome" type="text" style={{width:'100%', border: '1px solid #000', padding: '0.4em'}} />
        </form>
       
        <Button onClick={this.save} style={{marginTop:'2em'}}>
          Save
        </Button>

        <Button onClick={this.close} style={{marginTop:'2em', marginLeft: '2em'}}>
          Cancel
        </Button>

      </div>
    );
  }

});

module.exports = CreatePlaylist;