'use strict';

var React = require('react/addons');
var AuthMixin = require('./../mixins/AuthMixin.js');

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

var LoginButton = React.createClass({

    mixins: [ReactFireMixin, AuthMixin],

    getInitialState: function () {
        return {
            hover: false
        };
    },

    mouseOver: function () {
        this.setState({hover: true});
    },
    
    mouseOut: function () {
        this.setState({hover: false});
    },

    authenticate: function(provider) {

        this.firebase.authWithOAuthPopup(provider, function(error, authData) {

            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);

                var newUserData = this.getNewUserData(authData);
                newUserData.id = authData.uid;
                newUserData.provider = authData.provider;

                this.firebase.child("users").child(authData.uid).update(newUserData);
            }

        }.bind(this));
    },

    logout: function(){
        this.firebase.unauth();
    },

    getNewUserData: function(authData){
        switch(authData.provider) {
            case 'password':
                return authData.password.email.replace(/@.*/, '');
            case 'twitter':
                return {
                    username: authData.twitter.username,
                    full_name: authData.twitter.displayName,
                };
            case 'facebook':
                return {
                    username: authData.facebook.username,
                    full_name: authData.facebook.displayName,
                };
        }
    },

    render: function() {

        return (
            <div className="row" onMouseOver={this.mouseOver} onMouseOut={this.mouseOut} style={{ margin: "10px 20px 0px 0px" }}>
                
                { this.state.user &&
                    <div>
                        {this.state.user.username} (<a href="#" onClick={this.logout}>logout</a>)
                    </div>
                }

                { !this.state.user &&
                    <div>
                        <div style={{ display: (this.state.hover ? 'inline' : 'none') }}>
                            <a href="#" onClick={this.authenticate.bind(this,'twitter')}>
                                <span style={{color: "#222222"}}>
                                    <i className="s s-glyph02 s-lock"></i>
                                </span>
                            </a>
                            <a href="#" onClick={this.authenticate.bind(this,'facebook')}>
                                <span style={{margin: "0px -15px 0px 0px", color: "#222222"}}>
                                    <i className="s s-glyph14 s-lock"></i>
                                </span>
                            </a>
                        </div>
                        <div style={{display: (this.state.hover ? 'none' : 'inline')}}>
                            <i className="s s-glyph01 s-lock"></i>
                        </div>
                    </div>
                }
            </div>
        );
    }
});

module.exports = LoginButton;