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

        return (
            <div className="row" onMouseOver={this.mouseOver} onMouseOut={this.mouseOut} style={{ margin: "10px 20px 0px 0px" }}>
                <div style={{ display: (this.state.hover ? 'inline' : 'none') }}>
                    <a href="http://twitter.com">
                        <span style={{color: "#222222"}}>
                            <i className="s s-glyph02 s-lock"></i>
                        </span>
                    </a>
                    <a href="http://facebook.com">
                        <span style={{margin: "0px -15px 0px 0px", color: "#222222"}}>
                            <i className="s s-glyph14 s-lock"></i>
                        </span>
                    </a>
                </div>
                <div style={{display: (this.state.hover ? 'none' : 'inline')}}>
                    <i className="s s-glyph01 s-lock"></i>
                </div>
            </div>
        );
    }
});

module.exports = LoginButton;