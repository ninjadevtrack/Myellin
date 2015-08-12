'use strict';

var React = require('react/addons');
var Panel = require('react-bootstrap').Panel;
var Router = require('react-router');

var Option = require('./Option');

var UrlEmbed = require('./UrlEmbed');
var UpvoteButton = require('./UpvoteButton');

require('firebase');
var ReactFireMixin = require('reactfire');

var SubOutcome = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

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

    this.refSubOutcome = firebase.child('suboutcomes/' + this.props.relationData.suboutcome_id);
    this.bindAsObject(this.refSubOutcome, 'data');
  },

  render: function () {

    if (!this.state.data)
      return false;

    var PanelHeader = (
      <div className="suboutcome-header">

        <div className="suboutcome-header-title" style={{float:'left'}}>
          {this.state.data.title}
        </div>

        { this.props.expanded && this.state.data.chosen_option >= 0 &&
          <div style={{float:'right'}}>
            <div style={{display:'inline', marginRight: '1em'}} href="javascript:void(0)" onClick={this._handleOptionsClick}>options</div>
            <UpvoteButton size="xsmall" label="r" style={{display:'inline'}}
              this_type="option"
              this_id={this.state.data.chosen_option}
              parent_type="suboutcome"
              parent_id={this.state.data.id} />
          </div>
        }

        <div className="clearfix"></div>
      </div>
    );

    // NOTE: We must pass all props to <Panel> using JSX spread attributes: {...this.props}
    // This allows parent <PanelGroup> to alter <Panel> props even though our <SubOutcome> wraps <Panel>
    return (
      <Panel {...this.props} header={PanelHeader}>

        { this.state.data.chosen_option >= 0 && 
          <Option contentOnly={true} id={this.state.data.chosen_option} />
        }

      </Panel>
    );

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

module.exports = SubOutcome;