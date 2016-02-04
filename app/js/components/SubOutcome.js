'use strict';

var DbHelper = require('../DbHelper');

var React = require('react');

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

  contextTypes: {
    router: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired
  },

  getInitialState: function(){
    return {
      data: null,
      // Expand if it recieves the autoExpand=true prop
      // Suboutcomes that are created within the create playlist modal are expanded by default
      expanded: (this.props.autoExpand || false)
    };
  },

  // Expand if it recieves the autoExpand=true prop
  // Suboutcomes that are created within the create playlist modal are expanded by default
  componentWillReceiveProps: function(nextProps){
    if (nextProps.autoExpand != this.props.autoExpand && this.props.autoExpand == true){
      this.setState({ expanded: true });
    }
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
          DbHelper.playlists.show_editing(this.state.user.id);
        }.bind(this), 300);
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

    // Track event in Mixpanel (only on expand)
    if (!this.state.expanded){
      mixpanel.track('View Learning Step', {
        title: this.state.data.title,
        step_number: this.props.relationData.order + 1
      });

      DbHelper.playlists.viewed(this.props.relationData.parent_playlist_id);
    }
  
  },

  _handleOptionsClick: function () {

    this.context.router.push(this.context.params.outcome_slug + '/' +
      this.props.relationData.parent_playlist_id + '/' +
      this.props.relationData.suboutcome_id);

    mixpanel.track('View Alternatives', {});
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

  _handleReplaceChosenOption: function(){

    this.props.onReplaceChosenOption(this.props.relationData.suboutcome_id)
  },

  render: function () {

    if (!this.state.data)
      return false;

    var PanelHeader = (
      <div className="suboutcome-header">
        <div className="suboutcome-header-title" style={{float:'left'}}>

          {/*
          {this.props.number && 
            <span class="number" style={{ position: 'absolute', left: '-2em'}}>
              {this.props.number}.
            </span>
          }
          */}
          
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

    var versioncount = 'step';
    if (this.state.data.option_count == 1) {
      versioncount = 'steps'; 
    }else {
      versioncount = 'step';
    }

    var alternative_count = (this.state.data.option_count > 0 ? this.state.data.option_count-1 : 0);

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
              <div style={{background: '#fff', padding: '0 20px'}}>
                { this.props.relationData.chosen_option && 
                  <Option 
                    editable={this.props.editable} 
                    contentOnly={true} 
                    option_id={this.props.relationData.chosen_option}
                    onDescriptionChange={this._handleOptionDescriptionChange}
                    onReplaceChosenOption={this._handleReplaceChosenOption}
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
            <span style={{fontFamily: 'Akkurat-Bold'}}>{alternative_count}</span> competing {versioncount}<span style={{float: 'right', fontSize: '1.5em', lineHeight: '0.8em'}}><Glyphicon glyph='arrow-left'/></span>
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

  // When this component is dropped
  // Only used for event tracking currently
  endDrag: function(props, monitor) {
    // Data returned by beginDrag() above
    var droppedItem = monitor.getItem();
    // Data returned by Component this was dropped on
    var dropResult = monitor.getDropResult();

    if (dropResult) {

      mixpanel.track('Dropped Learning List Step', {});

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

