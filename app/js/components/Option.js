'use strict';

var React = require('react/addons');

var UrlEmbed = require('./UrlEmbed');
var UpvoteButton = require('./UpvoteButton');

require('firebase');
var ReactFireMixin = require('reactfire');

var Option = React.createClass({

  mixins: [ReactFireMixin],

  getInitialState: function(){
    return {
      data: {}
    };
  },

  componentWillMount: function() {
    this.bindFirebaseRefs();
  },

  bindFirebaseRefs: function(){
    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    this.refOptions = firebase.child('options/' + this.props.id);

    this.bindAsObject(this.refOptions, 'data');
  },

  render: function () {

    console.log('STATE!');
    console.log(this.state.data);

    return (
      <div>
        {this.state.data.description}
        {this.state.data.url && 
          <UrlEmbed url={this.state.data.url} />
        }
      </div>
    );
  },


  _handleClick: function (id) {

  }
 

});

module.exports = Option;