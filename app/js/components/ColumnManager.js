'use strict';

var React = require('react/addons');
var Column = require('../components/Column');

var ColumnManager = React.createClass({

  getInitialState: function(){
    return {
      hoveredColumn: null
    }
  },

  getColumnCount: function(){

    var column_count = 0;
    React.Children.forEach(this.props.children, function(child){

      if (this.childIsValidColumn(child))
        column_count++;

    }.bind(this));

    return column_count;
  },

  // Quick and dirty solution until we finalize how column widths should actually be computed
  // Returns the width that a column should be depending on column number and total number of columns 
  getColumnWidth: function(column_num, column_count){

    switch (column_count){
      case 1:
        return '100%';
      case 2:
        if (column_num === 1){
          return '40%';
        }else  if (column_num === 2){
          return '60%'
        }
      case 3:
        if (column_num === 1){
          return '26%';
        }else if (column_num === 2){
          return '34%';
        }else if (column_num === 3){
          return '40%';
        }
      case 4:
        if (column_num === 1){
          return '10%';
        }else if (column_num === 2){
          return '20%';
        }else if (column_num === 3){
          return '30%';
        }else if (column_num === 4){
          return '40%';
        }
    }
  },

  childIsValidColumn: function(child){
    return (child && child.type === Column.type);
  },

  onHoverChange: function(column_num, isHovering){
    this.setState({
      hoveredColumn: (isHovering ? column_num : null)
    });
  },

  updateColumnsWithProps: function(){

    var column_count = this.getColumnCount();

    var column_num = 1;
    var columns = React.Children.map(this.props.children, function (child) {

      if (!this.childIsValidColumn(child))
        return null;

      var column_width = this.getColumnWidth(column_num, column_count);

      var isHovered = (this.state.hoveredColumn === column_num ? true : false);

      var column = React.addons.cloneWithProps(child, {
        number: column_num,
        width: column_width,
        active: (column_num === column_count ? true : false),
        isHovered: isHovered,
        siblingIsHovered: ((this.state.hoveredColumn && isHovered === false) ? true : false), // In case this is useful for styling
        onHoverChange: this.onHoverChange
      });

      column_num++;

      return column;

    }.bind(this))

    return columns;
  },

  render: function() {

    var columns = this.updateColumnsWithProps();

    return (
      <div>
        {columns}
      </div>
    )
  }

});

module.exports = ColumnManager;