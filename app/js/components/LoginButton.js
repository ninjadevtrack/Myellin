'use strict';

var React = require('react/addons');


var LoginButton = React.createClass({
getInitialState: function () {
        return {hover: false};
    },
    
    mouseOver: function () {
        this.setState({hover: true});
    },
    
    mouseOut: function () {
        this.setState({hover: false});
    },
    
    render: function() {
        
        return React.createElement("div", {className: "row", onMouseOver: this.mouseOver, onMouseOut: this.mouseOut, style: {margin: "10px 20px 0px 0px"}},
        [   
            React.createElement("div", {style: {display: this.state.hover ? 'inline' : 'none'}},
            React.createElement("a", {href: 'http://facebook.com'},
            React.createElement(
                "span",
                {style: {color: "#3b5998"}},
                <i className="s s-glyph05 s-lock"></i>)),
            React.createElement("a", {href: 'http://twitter.com'},
            React.createElement(
                "span",
                {style: {margin: "0px -15px 0px 0px", color: "#4099FF"}},
                <i className="s s-glyph06 s-lock"></i>))),
            React.createElement(
                "div",
                {style: {display: this.state.hover ? 'none' : 'inline'}},
                <i className="s s-glyph03 s-lock"></i>
            )
            ]
        );
    }
});

module.exports = LoginButton;