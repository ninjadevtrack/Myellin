'use strict';

var React = require('react/addons');
var Panel = require('react-bootstrap').Panel; 
var cx = require('classnames');
var Glyphicon = require('react-bootstrap').Glyphicon; 
var Router = require('react-router');
var Option = require('./Option');
var UrlEmbed = require('./UrlEmbed');
var UpvoteButton = require('./UpvoteButton');
var DragSource = require('react-dnd').DragSource;

var AuthMixin = require('./../mixins/AuthMixin.js');

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

var ReactDnD = require('react-dnd');

var DndSource = {
  beginDrag: function(props) {
    return props.relationData;
  }
};

var DndTarget = {
  hover: function(props, monitor) {
    var draggedId = monitor.getItem().suboutcome_id;

    if (monitor.getItem().suboutcome_id !== props.relationData.suboutcome_id) {
      props.onMove(monitor.getItem(), props.relationData);
    }
  }
};

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
        this.refUser = this.firebase.child('users/' + this.state.user.id);
        this.refUser.child('editing_playlist').update({ collapse: !nextProps.isDragging });
      }
    }
  },

  bindFirebaseRefs: function(){
    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    this.firebase = new Firebase(firebaseRoot);

    this.refSubOutcome = this.firebase.child('suboutcomes/' + this.props.relationData.suboutcome_id);
    this.bindAsObject(this.refSubOutcome, 'data');
  },

  onDelete: function(e){
    e.preventDefault();
    e.stopPropagation();

    this.props.onDelete(this.props.relationData);
  },

  render: function () {

    if (!this.state.data)
      return false;

    var PanelHeader = (
      <div className="suboutcome-header">
        <div className="suboutcome-header-title" style={{float:'left'}}>
          {this.state.data.title}
          {this.props.editable &&
            <span onClick={this.onDelete} style={{marginLeft: '1em', color: '#CCC', right: '15%', position: 'absolute',}}><Glyphicon glyph='remove'/></span>
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
            this_id={this.state.data.chosen_option}
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

    return this.props.connectDragSource(this.props.connectDropTarget(
      
      <div className={classes}>

        <Panel 
          header={PanelHeader}
          collapsible={true} 
          expanded={this.state.expanded}
          onSelect={this._toggleExpand}
          key={this.props.key} 
          accordion>

          { this.state.expanded && this.state.data.chosen_option &&
            <div className="optionsicondiv">
              <Glyphicon href="javascript:void(0)" onClick={this._handleOptionsClick} glyph='option-horizontal' className="options-icon"/>
              {VoteButton}
            </div>
          }

          { this.state.expanded && 
            <div style={{borderBottom: '2px solid #ECEBEC' }} >
              <div style={{marginTop: '2.5em', marginBottom: '2em', textAlign: 'justify', fontFamily: "Akkurat-Light"}} >
                { this.state.data.chosen_option && 
                  <Option contentOnly={true} id={this.state.data.chosen_option} />
                }
              </div>
            </div>
          }

        </Panel>
      </div>

    ));

  },

  _toggleExpand: function(e){
    e.preventDefault();

    this.setState({expanded: !this.state.expanded});
  },

  loadOptions: function(){
    alert('load options');
  },

  _handleOptionsClick: function () {
    this.context.router.transitionTo('Options', {
      outcome_id: this.getParams().outcome_id,
      suboutcome_id: this.props.relationData.suboutcome_id
    });
  }
 

});

var DragSourceDecorator = ReactDnD.DragSource('suboutcome', DndSource,
  function(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    };
  }
);

var DropTargetDecorator = ReactDnD.DropTarget('suboutcome', DndTarget,
  function(connect) {
    return {
      connectDropTarget: connect.dropTarget(),
      isHeld: true
    };
  }
);


//module.exports = SubOutcome;

// Export the wrapped component:
module.exports = DropTargetDecorator(DragSourceDecorator(SubOutcome));

