'use strict';

var DbHelper = require('../DbHelper');

var React = require('react/addons');

var Button = require('react-bootstrap').Button; 
var Glyphicon= require('react-bootstrap').Glyphicon;
var Router = require('react-router');
var UrlEmbed = require('./UrlEmbed');
var UpvoteButton = require('./UpvoteButton');
var AuthorName = require('./AuthorName');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var MenuItem = require('react-bootstrap').MenuItem;
var DropdownButton = require('react-bootstrap').DropdownButton;

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');
var ComponentTypes = require('./ComponentTypes');
var OptionContent = require('./OptionContent');
var AuthMixin = require('./../mixins/AuthMixin.js');
var ReactDnD = require('react-dnd');

var ranking = (<Glyphicon glyph='option-vertical' className='optionplaylist' />);

var Option = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin, AuthMixin],

  getInitialState: function(){
    return {
      data: null,
      playlist: null,
      //editable: (this.props.editable || false)
    };
  },

  /*
  shouldComponentUpdate: function(nextProps, nextState){
    if ( (!this.state.data && nextState.data) || // Got data 
          (this.state.data && this.state.data.description !== nextState.data.description)){ // Description changed

      return true;
    }

    return false;
  },
  */

  componentWillMount: function() {

      this.bindFirebaseRefs();
  },

  componentWillUpdate: function(nextProps, nextState) {

    // If isDragging prop (injected by reactDnD) changes ...
    if (this.props.isDragging !== nextProps.isDragging){
      console.log('is dragging: ' + nextProps.isDragging);

      // If we're editing a playlist, toggle show/collapse on drag/drop, by updating in Firebase
      // It's a bit rediculous to write to the DB to toggle but this is the easiest way currently ...
      // ... since we don't yet have a good way for these components to talk to eachother
      if (this.state.user.editing_playlist){
        setTimeout(function(){
          this.refUser = this.firebase.child('users/' + this.state.user.id);
          //this.refUser.child('editing_playlist').update({ collapse: !nextProps.isDragging });
          this.refUser.child('editing_playlist').update({ collapse: false });
        }.bind(this, nextProps), 300);
      }
    }
  },

  // Rebind Firebase refs if props.option_id changes so we fetch new data
  componentDidUpdate: function(prevProps, nextState) {
    if (this.props.option_id !== prevProps.option_id)
      this.bindFirebaseRefs(true);

    // Toggle editable state if editable prop changes
    // No longer needed (we update option.editing in firebase instead)
    /*
    if (this.props.editable !== prevProps.editable)
      this.toggleEdit(); */
  },

  unbindRef: function(firebaseRef, bindVar){
    try {
      this.unbind(bindVar);
    }catch(e){}

    delete this[firebaseRef];
  },

  bindFirebaseRefs: function(rebind){

    if (rebind){
      this.unbindRef('refOption', 'data');
      this.unbindRef('refPlaylist', 'playlist');
    }

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    this.firebase = new Firebase(firebaseRoot);

    this.refOption = this.firebase.child('options/' + this.props.option_id);
    this.bindAsObject(this.refOption, 'data');

    // Fetch playlist data so we know if current user is owner of playlist
    // ... in which case we show them "switch" in dropdown menu
    // TODO: Better way to access app state without doing another Firebase query
    this.refPlaylist = this.firebase.child('playlists/' + this.getParams().playlist_id);
    this.bindAsObject(this.refPlaylist, 'playlist');

    //this.refSuboutcome = this.firebase.child('suboutcomes/' + this.props.relationData.parent_suboutcome_id);
    //this.bindAsObject(this.refSuboutcome, 'suboutcome');     
  },

  menuSelect: function(event, eventKey){
    switch (eventKey){
      case 'switch':
        this.chooseOption();
        break;
      case 'edit':
        this.toggleEdit();
        break;
      case 'delete':
        this.delete();
        break;
    }
  },

  toggleEdit: function(){

    if (this.props.editable){
      DbHelper.options.remove_editing(this.state.user.id);
    }else{
      DbHelper.options.set_editing(this.state.user.id, this.props.relationData.parent_suboutcome_id, this.props.option_id);
    }


  },

  delete: function(){
   
    var option_id = this.props.option_id
    var parent_suboutcome_id = this.props.relationData.parent_suboutcome_id;

    DbHelper.options.delete(parent_suboutcome_id, this.props.option_id);

    // TODO: Should probably remove this from chosen_option field (of playlist_to_suboutcome table) ...
    // ... if it is the chosen_option. Should we allow that if they are not the owner of the subutcome? ...
    // ... It would be weird to have a chosen_option that doesn't exist in the alternatives column though..
    // ... Figure out the security rules needed for this action.
  },


  chooseOption: function(){
    DbHelper.suboutcomes.choose_option(this.getParams().playlist_id, 
                                          this.props.relationData.parent_suboutcome_id,
                                            this.state.data['.key']);
  },

  save: function(description){

    DbHelper.options.update(this.props.option_id, description);

    this.toggleEdit();
  },

  _handleDescriptionChange: function(updatedDescription){
    if (this.props.onDescriptionChange){

      // Pass updated description to parent, along with the option_id
      // This is so we can also save all changed Options when we save a playlist
      this.props.onDescriptionChange({
        option_id: this.state.data['.key'],
        description: updatedDescription
      })
    }
  },

  render: function () {

    if (!this.state.data)
      return false;

    return this.props.connectDragSource(
      <div>

        <OptionContent 
          relationData={this.props.relationData}
          data={this.state.data}
          playlist={this.state.playlist}
          editable={this.props.editable}
          contentOnly={this.props.contentOnly}
          onSave={this.save}
          onCancel={this.toggleEdit} 
          onMenuSelect={this.menuSelect}
          onDescriptionChange={this._handleDescriptionChange}
          ref="optionContent" 
          key={this.state.data['.key']} />

      </div>
    );

  }

});

var DndSource = {
  // Return data that should be made accessible to other components when this component is hovering
  // The other component would access within DndTarget -> hover() -> monitor.getItem()
  beginDrag: function(props) {
    return {
      type: ComponentTypes.OPTION,
      option_id: props.relationData.option_id,
      parent_suboutcome_id: props.relationData.parent_suboutcome_id,
      // We pass "parent_playlist_id" as prop because we cant use this.getParams().playlist_id within DndSource
      // TODO: Stop using this.getParams().playlist_id and use props.parent_playlist_id instead if we keep it this way
      parent_playlist_id: props.parent_playlist_id
    }
  }
};

var DragSourceDecorator = ReactDnD.DragSource(ComponentTypes.OPTION, DndSource,
  function(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    };
  }
);

// Export the wrapped component
module.exports = DragSourceDecorator(Option);