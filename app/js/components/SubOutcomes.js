'use strict';

var React = require('react/addons');
//var ListGroupItem = require('react-bootstrap').ListGroupItem;
//var ListGroup = require('react-bootstrap').ListGroup;
var PanelGroup = require('react-bootstrap').PanelGroup;
var Panel = require('react-bootstrap').Panel;
var Router = require('react-router');

var UrlEmbed = require('./UrlEmbed');

require('firebase');
var ReactFireMixin = require('reactfire');

var SubOutcomes = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

  getInitialState: function(){
    return {
      data: [],
      activeKey: 1
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

    var elements = this.state.data.map(function (suboutcome) {
      return (
        <Panel header={suboutcome.title} eventKey={suboutcome['.key']}>
          {suboutcome.description}
          {suboutcome.url && 
            <UrlEmbed url={suboutcome.url} />
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

  handleSelect: function(activeKey) {
    this.setState({ activeKey });
  },


  _handleClick: function (id) {

  }
 

});

module.exports = SubOutcomes;