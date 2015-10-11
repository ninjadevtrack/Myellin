'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Router = require('react-router');
var Button = require('react-bootstrap').Button;
var Glyphicon= require('react-bootstrap').Glyphicon;

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

var Option = require('./Option');

var OptionsMultiple = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

  getInitialState: function(){
    return {
      data: [],
      suboutcome: null,
      //didCallCallback: false
    };
  },

  componentWillMount: function() {
    this.bindFirebaseRefs();
  },

  componentDidUpdate: function(prevProps, prevState) {

    if (this.props.suboutcome_id !== prevProps.suboutcome_id)
      this.bindFirebaseRefs(true);

    // Pass any data we need back up the chain
    // Currently we just need title for NavBar component
    /*
    if (this.state.suboutcome && this.state.didCallCallback === false ){
      this.setState({ didCallCallback: true }, 
        function(){
          this.props.loadedCallback({ title: this.state.suboutcome.title });
      });
    }*/

  },

  bindFirebaseRefs: function(rebind){

    if (rebind){
      this.unbind('data');
      this.unbind('suboutcome');
    }

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    // Load data for suboutcome
    this.refSubOutcome = new Firebase(firebaseRoot + '/suboutcomes/' + this.props.suboutcome_id);
    this.bindAsObject(this.refSubOutcome, 'suboutcome');

    // Fetch all options that are in this suboutcome
    this.refOptions = firebase.child('relations/suboutcome_to_option/suboutcome_' + this.props.suboutcome_id);
    this.bindAsArray(this.refOptions, 'data');
  },

  render: function () {

    // Sort playlists by upvote_count DESC order
    // Our Firebase query sorts by upvote_count, but in ASC order (no easy solution for that)
    var options = this.state.data.sort(function(a, b){
      return b.upvote_count - a.upvote_count;
    });

    options = options.map(function (relationData) {
      return (
        <div>
          <Option 
            relationData={relationData} 
            parent_playlist_id={this.props.playlist_id}
            option_id={relationData.option_id}
            key={relationData.option_id} />
        </div>
      );
    }.bind(this));

    return (
      <div className="options-multiple">
       <div className="back-button">
      <Glyphicon glyph='arrow-left' className='backicon'/></div>
      <div>
           <div style={{padding: '20px', fontSize:'1.5em', textAlign: 'center', width: '100%'}}>
           Prerequisites
          </div>
 <div style={{display: '-webkit-flex', display: 'flex', webkitFlexDirection: 'row', flexDirection: 'row', webkitFlexWrap: 'nowrap', flexWrap:'nowrap', width: '100%'}}>
<div style={{padding: '8px', fontSize:'1.2em', textAlign: 'center', borderTop: '3px solid  #FDFDFD', borderBottom: '3px solid  #FDFDFD', width: '50%'}}>
          3 alternatives
          </div>
          <div style={{padding: '8px', fontSize:'1.2em', textAlign: 'center', color: '#7A1D58', borderTop: '3px solid  #FDFDFD', borderBottom: '3px solid  #FDFDFD', borderLeft: '3px solid  #FDFDFD', width: '50%'}}>
            + <span style={{textDecoration: 'underline'}}>add an alternative</span>
          </div>
          </div>
             </div>
        {options}
      </div>
    );
  }


});

module.exports = OptionsMultiple;