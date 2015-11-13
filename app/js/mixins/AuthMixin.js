'use strict';

var DbHelper = require('../DbHelper');

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

var AuthMixin = {

  getInitialState: function () {
    return { user: null };
  },

  componentWillMount: function() {
    this.firebase = DbHelper.getFirebase();
    this.firebase.onAuth(this.onAuthChange);
  },

  onAuthChange: function(authData){

    //console.log('onAuthChange ...');

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