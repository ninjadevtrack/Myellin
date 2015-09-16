'use strict';

require('firebase');
var ReactFireMixin = require('reactfire');

var AuthMixin = {

  getInitialState: function () {
    return { user: null };
  },

  componentWillMount: function() {

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    this.firebase = new Firebase(firebaseRoot);

    this.firebase.onAuth(function(authData){

      if (!authData){
        //console.log("User is logged out");
        this.setState({ user: null });
        return;
      }

      if (this.refUser)
        this.unbind('user');

      this.refUser = this.firebase.child('users/' + authData.uid);
      this.bindAsObject(this.refUser, 'user');

      //console.log("User " + authData.uid + " is logged in with " + authData.provider);

    }.bind(this));

  },

};

module.exports = AuthMixin;