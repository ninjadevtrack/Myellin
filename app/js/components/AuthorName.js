'use strict';

var React = require('react/addons');

require('firebase');
var ReactFireMixin = require('reactfire');

var AuthorName = React.createClass({

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

    this.refAuthor = firebase.child('users/' + this.props.id);
    this.bindAsObject(this.refAuthor, 'data');
  },

  render: function () {

    console.log('AUTHOR!');
    console.log('users/' + this.props.id);
    console.log(this.state.data);

    if (this.state.data.full_name) {
      var name = this.state.data.full_name + ' | ' + this.state.data.title;
    }else{
      var name = '•••';
    }
 
    return (
      <h4>
        {name}
      </h4>
    );
  }

});

module.exports = AuthorName;