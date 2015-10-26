'use strict';

var DbHelper = require('../DbHelper');

var React = require('react/addons');

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

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

  componentDidUpdate: function(prevProps, nextState) {
    if (this.props.id !== prevProps.id){
      this.bindFirebaseRefs(true);
    }
  },

  bindFirebaseRefs: function(rebind){

    if (rebind)
      this.unbind('data');

    var firebase = DbHelper.getFirebase();

    this.refAuthor = firebase.child('users/' + this.props.id);
    this.bindAsObject(this.refAuthor, 'data');
  },

  render: function() {

    if (this.state.data) {
      var name = this.state.data.full_name;
      if (this.state.data.title) 
        name += ', ' + this.state.data.title + '.';
    }else{
      var name = '•••';
    }
 
    return (
      <div className="author-name">
        BY {name}
      </div>
    );
  }

});

module.exports = AuthorName;