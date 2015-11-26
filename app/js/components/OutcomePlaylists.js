'use strict';

var DbHelper = require('../DbHelper');

var React = require('react/addons');
var Router = require('react-router');
var Glyphicon= require('react-bootstrap').Glyphicon;
var Well= require('react-bootstrap').Well;


require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');


var OutcomePlaylists = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin],

  getInitialState: function(){
    return {
      outcome: null
    };
  },


_handleBrandClick: function(e) {
    e.preventDefault();
    this.context.router.transitionTo('app');
  },

  componentWillMount: function() {

    // If I don't wrap this in a setTimout then there are issues with ...
    // ... componentWillUpdate firing when browsing to a different outcome.
    // Looks like it might be a bug with reactFire. If the outcome data is cached then we are basically ...
    // ... calling setState from within componentWillMount which won't cause componentWillUpdate to fire.
    setTimeout(function(){
      this.bindFirebaseRefs();
    }.bind(this), 50);

  },

  componentWillUpdate: function(nextProps, nextState) {

    // If we now have outcome data pass the title back up the chain
    // So we can populate the navbar
    /*
    if (!this.state.outcome && nextState.outcome){
      var outcome = this._getOutcome(nextState.outcome);

      if (outcome)
        this.props.loadedCallback({ title: outcome.title }); 
    }
    */
    
  },

  unbindRef: function(firebaseRef, bindVar){
    try {
      this.unbind(bindVar);
    }catch(e){}

    delete this[firebaseRef];
  },

  _getOutcome: function(outcome){

    if (!outcome)
      return null;

    // First see if outcome is nested within a parent object (fetched by it's slug)
    for (var key in outcome) {
      if (outcome.hasOwnProperty(key) && outcome[key] !== null && typeof outcome[key] === 'object') {
        var realOutcome = outcome[key];
        // Return outcome along with .key value
        realOutcome['.key'] = key;
        return realOutcome;
      }
    }

    return outcome;
  },

  bindFirebaseRefs: function(nextState){

    this.firebase = DbHelper.getFirebase();

    // Get the outcome data
    // Fetch by outcome_id OR slug
    if (this.props.outcome_id){ 
      this.newRefOutcome = this.firebase.child('outcomes/' + this.props.outcome_id);
    }else{
      this.newRefOutcome = this.firebase.child('outcomes')
          .orderByChild('slug')
          .equalTo(this.props.outcome_slug)
          .limitToFirst(1);
    }

    // Bind/re-bind if this.refOutcome not set or firebase path changed
    if (!this.refOutcome){
  
      // Don' think this is necessary since component is always being unmounted (which removed ref)
      // This would be necessary if OutcomePlaylists component didnt have a key prop (wouldn't get unmounted)
      this.unbindRef('refOutcome', 'outcome');

      this.refOutcome = this.newRefOutcome;
      this.bindAsObject(this.refOutcome, 'outcome');
    }
    
  },



  render: function () {

    var outcome = this._getOutcome(this.state.outcome);
 
    // If props.outcome_id passed inthen we can render child components right away
    if (this.props.outcome_id){ 
      var outcome_id = this.props.outcome_id;
    // Otherwise we get the outcome_id from outcome data when it's returned by Firebase
    }else if (outcome){
      var outcome_id = outcome['.key'];
    }else{
      var outcome_id = null;
    }

    // Pass outcome_id prop to child PlaylistMultiple component
    if (outcome_id){
      var children = React.Children.map(this.props.children, function (child) {

        // Not needed currently
        //if (!child) // Skip null children (such as {if xxxx && } wrapper)
          //return false;

        return React.addons.cloneWithProps(child, {
          outcome_id: outcome_id
        });
      }.bind(this));
      var manualcount = 'manual';
if (outcome.playlist_count == 1){
 manualcount = 'manual';
} else {
  manualcount = 'manuals';
}

    }
    return (
      <div>
        { outcome && 
           <div className='learninglistheader'>
           <div className="back-button" onClick={this._handleBrandClick}>
          <Glyphicon glyph='arrow-left' className='backicon'/>
          </div>
           <div className='learninglistheaderstyle'>
           <div className='howto'>{outcome.title}</div>
            <div className='learninglist'><span style={{fontFamily: 'Akkurat-Bold'}}>{outcome.playlist_count}</span> competing {manualcount} for this outcome</div>
          </div>
          </div>
        }

        { outcome_id && 
          <div>

            {children}

          </div>
        }
      <div className="welldiv"><Well>
      <ul>
      <li><b>Myelin</b> is a community for Autodidacts. Think Github meets Medium. Together we systematically make it easier to achieve outcomes.</li>
      <li><b>What?</b> We deconstruct outcomes, indicate the most important steps to achive them, and then curate the best resources to accomplish them.</li>
      <li><b>Rapid content creation:</b> You can, a) drag and drop anyone's chapter to your own manual, b) reuse anyone's chapter stucture, and c) embed almost any online content into your manual.</li>
      </ul>
</Well></div>
      <div className="footerplaylist"><br></br><a href='http://myelin.io/how-to-use-myelin'>About</a>  |  <a href='http://twitter.com/myelinio'>Twitter</a></div>
      </div>
    );

  }


});

module.exports = OutcomePlaylists;