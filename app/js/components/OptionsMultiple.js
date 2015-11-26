'use strict';

var DbHelper = require('../DbHelper');

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Router = require('react-router');
var Button = require('react-bootstrap').Button;
var Glyphicon= require('react-bootstrap').Glyphicon;
var Well= require('react-bootstrap').Well;

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

var AuthMixin = require('./../mixins/AuthMixin.js');

var Option = require('./Option');

var OptionsMultiple = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin, AuthMixin],

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

    var firebase = DbHelper.getFirebase();

    // Load data for suboutcome
    this.refSubOutcome = firebase.child('suboutcomes/' + this.props.suboutcome_id);
    this.bindAsObject(this.refSubOutcome, 'suboutcome');

    // Fetch all options that are in this suboutcome
    this.refOptions = firebase.child('relations/suboutcome_to_option/suboutcome_' + this.props.suboutcome_id);
    this.bindAsArray(this.refOptions, 'data');
  },

  _handleBackClick: function (id) {
    this.context.router.transitionTo('Playlists', {
      outcome_slug: this.getParams().outcome_slug
    });
  },

  createOption: function(e) {
    e.preventDefault();

    if (!this.state.user){
      alert('You must be logged in');
      return;
    }

    var option_id = DbHelper.options.create(this.state.user.id, this.props.suboutcome_id);
    DbHelper.options.set_editing(this.state.user.id, this.props.suboutcome_id, option_id);
  },

  render: function () {

    // Sort playlists by upvote_count DESC order
    // Our Firebase query sorts by upvote_count, but in ASC order (no easy solution for that)
    var options = this.state.data.sort(function(a, b){
      return b.upvote_count - a.upvote_count;
    });

    options = options.map(function (relationData, i) {

      var editable = false;
      if (this.state.user && 
            this.state.user.editing_option && 
              this.state.user.editing_option.option_id === relationData.option_id){
        editable = true;
      }

      return (
        <div>
          <Option 
            relationData={relationData} 
            parent_playlist_id={this.props.playlist_id}
            option_id={relationData.option_id}
            editable={editable} 
            number={i+1}
            key={relationData.option_id} />
        </div>
      );
    }.bind(this));




    return (
      <div className="options-multiple">
        <div className="back-button" onClick={this._handleBackClick}>
          <Glyphicon glyph='arrow-right' className='backicon'/>
        </div>

        { this.state.suboutcome && 
          <div style={{padding: '100px 5% 100px 14%', fontFamily: 'Akkurat-Regular', color: '#fff', textAlign: 'left', width: '100%',  backgroundColor: '#7A1D58'}}>
            <div style={{fontSize:'2.2em', lineHeight: '1em', margin: '0', padding: '0'}}>{this.state.suboutcome.title}</div>
            <div style={{fontSize:'1.1em', lineHeight: '1.3em', padding: '0', display: 'inline-block'}}>
              <b>{this.state.suboutcome.option_count}</b> competing chapter alternative &nbsp;&nbsp;
            </div>
          </div>
        }

        {options}
<div className="welloptiondiv"><Well>
      <ul>
      <li><b>Can you create a better chapter for this sub-outome?</b></li>
      <li><b>Learning flow:</b> If a user did not like the original chapter for this manual, they can see alternative approaches to tackle this sub-outcome. This will enable learners to maintain their flow.</li>
      <li><b>Building blocks:</b> If the author of the manual thinks your version is better, she can easily switch to your version instead. Other authors can also choose to include your chapter in their manuals.</li>
      </ul>
</Well></div>
      </div>
    );
  }


});

module.exports = OptionsMultiple;