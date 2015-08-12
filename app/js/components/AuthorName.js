'use strict';

var React = require('react/addons');

require('firebase');
var ReactFireMixin = require('reactfire');

var AuthorName = React.createClass({

  mixins: [ReactFireMixin],

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

    this.refAuthor = firebase.child('users/' + this.props.id);
    this.bindAsObject(this.refAuthor, 'data');
  },

  render: function() {

    if (this.state.data) {
      var name = this.state.data.full_name + ' | ' + this.state.data.title;
    }else{
      var name = '•••';
    }
 
    return (
      <div className="author-name">
        {name}
      </div>
    );
  }

});

module.exports = AuthorName;