'use strict';

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

var AuthMixin = {

  getInitialState: function () {
    return { user: null };
  },

  componentWillMount: function() {

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    this.firebase = new Firebase(firebaseRoot);

    this.firebase.onAuth(this.onAuthChange);

  },

  onAuthChange: function(authData){

    console.log('onAuthChange ...');

    if (!authData){ // Handle logout
      try{
        this.unbind('user');
      }catch(e){}

      return;
    }

    this.refUser = this.firebase.child('users/' + authData.uid);
    this.bindAsObject(this.refUser, 'user');
  }

};

module.exports = AuthMixin;