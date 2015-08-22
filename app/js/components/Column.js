'use strict';

var React = require('react/addons');
var cx = require('classnames');

var Column = React.createClass({

  onMouseOver: function(){
    this.props.onHoverChange(this.props.number, true);
  },

  onMouseOut: function(){
    this.props.onHoverChange(this.props.number, false);
  },

  render: function(){

    var style = {
      float: 'left',
      width: this.props.width
    };

    // See column.scss
    // Note: We may not want to style .column div at all and just use these classes to affect style of child elements
    var classes = cx('column', 'column-' + this.props.number, {
      'hovered': this.props.isHovered,
      // Just means it's the right-most column
      'active': this.props.active,
      // So that we can style .active column differently if another column is hovered
      // Depending on needs we could simplify by removing this and making whatever column is hovered .active
      'sibling-is-hovered': this.props.siblingIsHovered
    });

    return (
      <div className={classes} 
            style={style} 
            onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}>

        {this.props.children}

      </div>
    );
  }
});

module.exports = Column;