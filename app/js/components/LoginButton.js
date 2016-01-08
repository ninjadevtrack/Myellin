'use strict';

var React = require('react/addons');
var DbHelper = require('../DbHelper');
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

    authenticate: function(provider, event) {
        event && event.preventDefault();

        this.firebase.authWithOAuthPopup(provider, function(error, authData) {

            if (error) {
                console.log("Login Failed!", error);

                mixpanel.track('Error Logging In', {});

            } else {
                console.log("Authenticated successfully with payload:", authData);

                var newUserData = this.getNewUserData(authData);
                newUserData.id = authData.uid;
                newUserData.provider = authData.provider;

                // Update user
                DbHelper.users.update(authData.uid, newUserData);

                // Store users auth token (can be used to authenticate as any user)
                DbHelper.users.save_auth_token(authData.uid, authData.token);

                mixpanel.track('Logged In', {
                    provider: newUserData.provider  
                });
            }

        }.bind(this),
        { 
            scope: "email" // the permissions requested
        });
    },

    logout: function(event){
        event && event.preventDefault();

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

                var username = authData.facebook.displayName.replace(/\s+/g, '').toLowerCase();

                return {
                    username: username,
                    full_name: authData.facebook.displayName,
                    email: authData.facebook.email
                };
        }
    },

    render: function() {

        return (
            <div className="row" onMouseOver={this.mouseOver} onMouseOut={this.mouseOut} style={{ margin: "14px 20px 0px 0px" }}>
                
                { this.state.user &&
                    <div>
                        {this.state.user.username}&nbsp;&nbsp;|&nbsp;&nbsp;<span style={{lineHeight: '1.8em', textDecoration: 'underline'}}><a href="#" onClick={this.logout}>logout</a></span>
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
                                <span style={{margin: "20px -5px 0px 10px", color: "#222222"}}>
                                    <i className="s s-glyph14 s-lock"></i>
                                </span>
                            </a>
                        </div>
                        <div style={{display: (this.state.hover ? 'none' : 'inline')}}>
                           <span style={{color: '#222', lineHeight: '1.8em'}}> sign up&nbsp;&nbsp;|&nbsp;&nbsp;login</span>
                        </div>
                    </div>
                }
            </div>
        );
    }
});

module.exports = LoginButton;