'use strict';

var React = require('react/addons');
//var ListGroupItem = require('react-bootstrap').ListGroupItem;
//var ListGroup = require('react-bootstrap').ListGroup;
var PanelGroup = require('react-bootstrap').PanelGroup;
var Panel = require('react-bootstrap').Panel;
var Router = require('react-router');

var Option = require('./Option');

var UrlEmbed = require('./UrlEmbed');
var UpvoteButton = require('./UpvoteButton');

require('firebase');
var ReactFireMixin = require('reactfire');

var SubOutcomes = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

  getInitialState: function(){
    return {
      data: [],
      activeKey: null
    };
  },

  componentWillMount: function() {
    this.bindFirebaseRefs();
  },

  bindFirebaseRefs: function(){
    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    this.refSubOutcomes = firebase.child('suboutcomes')
                            .orderByChild("parent_playlist")
                            .equalTo(this.props.parent_playlist);

    this.bindAsArray(this.refSubOutcomes, 'data');
  },

  render: function () {

    var elements = this.state.data.map(function (suboutcome, i) {

      var PanelHeader = (
        <div className="suboutcome-header">

          <div className="suboutcome-header-title">
            {suboutcome.title}
          </div>

          { false && this.state.activeKey == i &&
            <div>
              <div href="javascript:void(0)" onClick={this.loadOptions}>options</div>
              <UpvoteButton size="xsmall" label="r" 
                this_type="suboutcome"
                this_id={suboutcome.id}
                parent_id={this.props.parent_playlist} />
            </div>
          }
        </div>
      );

      return (
        <Panel header={PanelHeader} eventKey={suboutcome['.key']}>

          { suboutcome.chosen_option >= 0 && 
            <Option id={suboutcome.chosen_option} />
          }

        </Panel>
      );

    }.bind(this));

    return (
      <PanelGroup activeKey={this.state.activeKey} onSelect={this.handleSelect} accordion>
        {elements}
      </PanelGroup>
    );
  },

  loadOptions: function(){
    alert('load options');
  },

  handleSelect: function(activeKey) {
    this.setState({ activeKey });
  },


  _handleClick: function (id) {

  }
 

});

module.exports = SubOutcomes;