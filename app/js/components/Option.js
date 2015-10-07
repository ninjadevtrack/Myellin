'use strict';

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

var AuthMixin = require('./../mixins/AuthMixin.js');

var ReactDnD = require('react-dnd');

var ranking = (<Glyphicon glyph='option-vertical' className='optionplaylist' />);

var Option = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin, AuthMixin],

  getInitialState: function(){
    return {
      data: null,
      editable: (this.props.editable || false)
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

  // Rebind Firebase refs if props.id changes so we fetch new data
  componentDidUpdate: function(prevProps, nextState) {
    if (this.props.id !== prevProps.id)
      this.bindFirebaseRefs(true);

    // Toggle editable state if editable prop changes
    if (this.props.editable !== prevProps.editable)
      this.toggleEdit();
  },

  bindFirebaseRefs: function(rebind){

    if (rebind)
      this.unbind('data');

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    this.firebase = new Firebase(firebaseRoot);

    this.refOption = this.firebase.child('options/' + this.props.id);
    this.bindAsObject(this.refOption, 'data');

    // Fetch playlist data so we know if current user is owner of playlist
    // ... in which case we show them "switch" in dropdown menu
    // TODO: Better way to access app state without doing another Firebase query
    this.refPlaylist = this.firebase.child('playlists/' + this.getParams().playlist_id);
    this.bindAsObject(this.refPlaylist, 'playlist');

    //this.refSuboutcome = this.firebase.child('suboutcomes/' + this.props.relationData.parent_suboutcome_id);
    //this.bindAsObject(this.refSuboutcome, 'suboutcome');     
  },

  menuOnSelect: function(event, eventKey){
    switch (eventKey){
      case 'switch':
        this.chooseOption();
        break;
      case 'edit':
        this.toggleEdit();
        break;
    }
  },

  toggleEdit: function(){

    this.setState({ editable: !this.state.editable });
  },

  getDescriptionParts: function(text){

    // Basic url regex
    var urlPattern = /(\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])/gim;

    // Split into array with url regex as serator
    // We wrap url regex in ( ) so that match also gets included in array
    var parts = text.split(urlPattern);

    // Construct an array of objects that include the type (text or url)
    // We run match on each part to check if url or not
    // There's probably a better way since seems redundant to run regex again on each part
    var partsWithType = [];
    for (var i = 0; i < parts.length; i++) { 
      var match = parts[i].match(urlPattern);
      var type = (match ? 'url' : text);
      partsWithType.push({ type: type, content: parts[i] });
    }

    //console.log('partsWithType ...');
    //console.log(partsWithType);

    return partsWithType;
  },

  chooseOption: function(){

    // Make this option the chosen_option for the parent suboutcome
    // We store this in the relations table so that a different playlist/suboutcome pair ...
    // ... can have a different chosen option
    // Note: we get the playlist_id from the url, since we don't pass this down via props ...
    // ... this is a bit hacky. Something to improve once we have a better system for accessing app state.
    this.firebase.child('relations' +
                          '/playlist_to_suboutcome' +
                          '/playlist_' + this.getParams().playlist_id + 
                          '/suboutcome_' + this.props.relationData.parent_suboutcome_id + 
                          '/chosen_option').set(this.state.data['.key']);
  },

  save: function(){

    var description = React.findDOMNode(this.refs.description).value.trim();
    this.refOption.update({ description: description });

    this.toggleEdit();
  },

  render: function () {

    if (!this.state.data)
      return false;

    //console.log('DESCRIPTION ...');
    //console.log('suboutcome',this.props.relationData.parent_suboutcome_id);
    //console.log(this.state.data);

    var descriptionParts = this.getDescriptionParts(this.state.data.description);

    var description = descriptionParts.map(function(part, i){
      if (part.type === 'url'){
        return ( <UrlEmbed url={part.content} /> );
      }else{
        return part.content;
      }
    });

    var optionContent = (
      <div>
        {description}
      </div>
    );

    if (this.props.contentOnly){
      return (
        <div>
          <AuthorName id={this.state.data.author_id} />
          {optionContent}
        </div>
      );
    }

    var menuItems = [];
    if (this.state.user && this.state.data && this.state.user.id === this.state.data.author_id)
      menuItems.push( <MenuItem eventKey='edit'>Edit</MenuItem> );
    if (this.state.user && this.state.playlist && this.state.user.id === this.state.playlist.author_id)
      menuItems.push( <MenuItem eventKey='switch'>Switch</MenuItem> );


    return this.props.connectDragSource(
      <div className="option-container">

        { !this.state.editable && menuItems.length >= 1 &&
          <div style={{ float: 'right'}}>
            <DropdownButton style={{margin: '-10px 0 -15px 0', padding: '0', color: '#000'}} onSelect={this.menuOnSelect} bsSize='large' title={ranking} bsStyle='link' classStyle='editbutton' pullRight noCaret>
              {menuItems}
            </DropdownButton>
          </div>
        }
        
        <AuthorName id={this.state.data.author_id} />

        <div className="upvote">
          <div className="count">{this.props.relationData.upvote_count}</div>

          <UpvoteButton 
            label={<Glyphicon glyph='ok-circle'/>}
            this_type="option"
            this_id={this.state.data['.key']} 
            parent_type="suboutcome"
            parent_id={this.props.relationData.parent_suboutcome_id} />
        </div>
        
        { !this.state.editable &&
          <div style={{ lineHeight: "1.2", marginBottom: '2em', textAlign: 'justify', fontFamily: "Akkurat-Light"}}>
            {optionContent}
          </div>
        }

        { this.state.editable &&
          <div>
            <textarea ref="description" rows="5" style={{width:'100%', border: '1px solid #000', padding: '0.4em'}}>
              {this.state.data.description}
            </textarea>

            <div>
              <Button onClick={this.save} style={{marginTop:'2em'}}>
                Save
              </Button>

              <Button onClick={this.toggleEdit} style={{marginTop:'2em', marginLeft: '2em'}}>
                Cancel
              </Button>
            </div>
          </div>
        }

      </div>
    );
        
  }


 

});

var DndSource = {
  // Return data that should be made accessible to other components when this component is hovering
  // The other component would access within DndTarget -> hover() -> monitor.getItem()
  beginDrag: function(props) {
    return props.relationData;
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