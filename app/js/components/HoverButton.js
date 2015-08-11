'use strict';

var React = require('react/addons');

var HoverButton = React.createClass({
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
        
        return React.createElement("div", {className: "row", onMouseOver: this.mouseOver, onMouseOut: this.mouseOut, style: {border: "0px solid black"}},
        [
            React.createElement(
                "span",
                {style: {visibility: this.state.hover ? 'visible' : 'hidden', color: "#3b5998"}},
                <i className="s s-glyph05 s-lock"></i>
            ),
            React.createElement(
                "span",
                {style: {visibility: this.state.hover ? 'visible' : 'hidden', margin: "0px -15px 0px 0px", color: "#4099FF"}},
                <i className="s s-glyph06 s-lock"></i>
            ),
            React.createElement(
                "div",
                {style: {display: this.state.hover ? 'none' : 'inline'}},
                <i className="s s-glyph03 s-lock"></i>
            )
            ]
        );
    }
});

module.exports = HoverButton;