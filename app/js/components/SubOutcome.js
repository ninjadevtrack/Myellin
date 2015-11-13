'use strict';

var DbHelper = require('../DbHelper');

var React = require('react/addons');
var Panel = require('react-bootstrap').Panel; 
var cx = require('classnames');
var Glyphicon = require('react-bootstrap').Glyphicon; 
var Router = require('react-router');
var Option = require('./Option');

var UrlEmbed = require('./UrlEmbed');
var UpvoteButton = require('./UpvoteButton');
var DragSource = require('react-dnd').DragSource;
var AuthorName = require('./AuthorName');
var Button = require('react-bootstrap').Button;

var OptionEditor = require('./OptionEditor');

var ComponentTypes = require('./ComponentTypes');

var AuthMixin = require('./../mixins/AuthMixin.js');

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

var ReactDnD = require('react-dnd');


var SubOutcome = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin, AuthMixin],

  getInitialState: function(){
    return {
      data: null,
      expanded: false
    };
  },

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

  bindFirebaseRefs: function(){
    this.firebase = DbHelper.getFirebase();

    this.refSubOutcome = this.firebase.child('suboutcomes/' + this.props.relationData.suboutcome_id);
    this.bindAsObject(this.refSubOutcome, 'data');
  },

  onDelete: function(e){
    e.preventDefault();
    e.stopPropagation();

    this.props.onDelete(this.props.relationData.suboutcome_id);
  },

  _toggleExpand: function(e){
    e.preventDefault();

    this.setState({expanded: !this.state.expanded});
  },

  _handleOptionsClick: function () {
    this.context.router.transitionTo('Options', {
      outcome_slug: this.getParams().outcome_slug,
      playlist_id: this.props.relationData.parent_playlist_id,
      suboutcome_id: this.props.relationData.suboutcome_id
    });
  },

  // If new option was created ... 
  // Pass suboutcome_id and new option text to callback
  // This is passed to OptionEditor in the case that we are in ...
  // ... edit playlist view and don't yet have an Option chosen
  _handleNewOptionDescription: function(description){
    if (!this.props.onOptionDescriptionChange)
      return false;

    this.props.onOptionDescriptionChange({
      suboutcome_id: this.props.relationData.suboutcome_id,
      option_id: null,
      description: description
    });
  },

  _handleOptionDescriptionChange: function(option){
    if (!this.props.onOptionDescriptionChange)
      return false;

    option.suboutcome_id = this.props.relationData.suboutcome_id;
    this.props.onOptionDescriptionChange(option);
  },

  render: function () {

    if (!this.state.data)
      return false;

    var PanelHeader = (
      <div className="suboutcome-header">
        <div className="suboutcome-header-title" style={{float:'left'}}>
          {/* {this.props.relationData.order} - */}
          {this.state.data.title}
          {this.props.editable &&
            <span onClick={this.onDelete} style={{ color: '#CCC', right: '-30px', position: 'absolute'}}>

              <Glyphicon glyph='remove'/>
            </span>
          }
        </div>
        <div className="clearfix"></div>
      </div>
    );

    var VoteButton = (
      <div className="suboutcome-body">
        <div>
          <UpvoteButton size="small" label={<Glyphicon glyph='ok-circle'/>} className="smallvoteicon"
            this_type="option"
            this_id={this.props.relationData.chosen_option}
            parent_type="suboutcome"
            parent_id={this.state.data['.key']} />
        </div>
      </div>
    );

    var containerClassNames = 'suboutcome-container';
    if (this.props.optionsShown)
      containerClassNames += ' options-shown';

    var classes = cx('suboutcome-container', {
      'options-shown': this.props.optionsShown,
      'is-dragging': this.props.isDragging // Injected by React Dnd
    });

    var jsx = (
      
      <div className={classes}>

        <Panel 
          header={PanelHeader}
          collapsible={true} 
          expanded={this.state.expanded}
          onSelect={this._toggleExpand}
          key={this.props.key} 
          accordion
          ref="Panel">

          {/* 
            Render child components when expanded ... 
            OR if in edit playlist mode, even if not expanded (so we never lost option text changes) 
            TODO: Once we have a better method for keeping track of local state changes ... 
            ... then remove "|| this.props.editable" below. 
          */}
          { (this.state.expanded || this.props.editable) && 
              <div style={{background: '#fff'}}>
                { this.props.relationData.chosen_option && 
                  <Option 
                    editable={this.props.editable} 
                    contentOnly={true} 
                    option_id={this.props.relationData.chosen_option}
                    onDescriptionChange={this._handleOptionDescriptionChange}
                    ref="option" />
                }

                { !this.props.relationData.chosen_option && this.props.editable &&
                  <OptionEditor 
                    onChange={this._handleNewOptionDescription} />
                }

                { !this.props.relationData.chosen_option && !this.props.editable &&
                  <div style={{textAlign:'center', color: '#CCC'}}>No content yet</div>
                }
            </div>
          }

          { !this.props.editable &&    
            <Button href="javascript:void(0)" onClick={this._handleOptionsClick} bsStyle='link' className="options-button">
              alternatives to this learning step ({this.state.data.option_count - 1})
            </Button>
          }

        </Panel>
      </div>

    );

    if (this.state.user){
      return this.props.connectDragSource(this.props.connectDropTarget( jsx ));
    }else{
      return jsx;
    }


  }

});

var DndSource = {

  // Return data that should be made accessible to other components when this component is hovering
  // The other component would access within DndTarget -> hover() -> monitor.getItem()
  beginDrag: function(props) {
    return {
      type: ComponentTypes.SUBOUTCOME,
      suboutcome_id: props.relationData.suboutcome_id,
      parent_playlist_id: props.relationData.parent_playlist_id,
      chosen_option: (props.relationData.chosen_option || null),
      order: props.relationData.order
    }
  },

  // NOT USED YET
  // When this component is dropped
  endDrag: function(props, monitor) {
    // Data returned by beginDrag() above
    var droppedItem = monitor.getItem();
    // Data returned by Component this was dropped on
    var dropResult = monitor.getDropResult();

    if (dropResult) {
        console.log("You dropped suboutcome_id " + droppedItem.suboutcome_id + 
                      " into playlist_id "+ dropResult.playlist_id + "!");
    }
  }
};

var DndTarget = { 

  // When a different SubOutcome is dragged over this SubOutcome
  hover: function(props, monitor, component) {
    var draggedItem = monitor.getItem();
    props.onMove(draggedItem, props.relationData);
  }

};

var DragSourceDecorator = ReactDnD.DragSource(ComponentTypes.SUBOUTCOME, DndSource,
  function(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    };
  }
);

var DropTargetDecorator = ReactDnD.DropTarget(
  // Return array of types this Drop Target accepts
  function(props){

    // Allow SUBOUTCOME and OPTION types
    return [ComponentTypes.SUBOUTCOME, ComponentTypes.OPTION]; 
  },
  DndTarget,
  function(connect) {
    return {
      connectDropTarget: connect.dropTarget()
    };
  }
);

// Export the wrapped component
module.exports = DropTargetDecorator(DragSourceDecorator(SubOutcome));

