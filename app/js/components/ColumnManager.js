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
  getColumnDiv: function(column_num, column_count){

    switch (column_count){
      case 1:
        return '1';
      case 2:
        if (column_num === 1){
          return '2';
        }else  if (column_num === 2){
          return '3'
        }
      case 3:
        if (column_num === 1){
          return '4';
        }else if (column_num === 2){
          return '5';
        }else if (column_num === 3){
          return '6';
        }
      case 4:
        if (column_num === 1){
          return '7';
        }else if (column_num === 2){
          return '8';
        }else if (column_num === 3){
          return '9';
        }else if (column_num === 4){
          return '10';
        }
    }
  },

  childIsValidColumn: function(child){
    return (child && child.type === Column);
  },

  onHoverChange: function(column_num, columnChildData, isHovering){

    var hoveredColumn = (isHovering ? column_num : null);
    var hoveredColumnData = (isHovering ? columnChildData : null)

    console.log('hovered column: '+ hoveredColumn);

    if (this.state.hoveredColumn !== hoveredColumn) {
      this.setState({ hoveredColumn: hoveredColumn });
      this.props.sectionChangeHandler(hoveredColumnData);
    }
  },

  updateColumnsWithProps: function(){

    var column_count = this.getColumnCount();

    var column_num = 1;
    var columns = React.Children.map(this.props.children, function (child) {

      if (!this.childIsValidColumn(child))
        return null;

      var column_div = this.getColumnDiv(column_num, column_count);
      var isHovered = (this.state.hoveredColumn === column_num ? true : false);
      var siblingIsHovered = ((this.state.hoveredColumn && isHovered == false) ? true : false);

      var column = React.addons.cloneWithProps(child, {
        number: column_num,
        div: column_div,
        active: (column_num === column_count ? true : false),
        isHovered: isHovered,
        siblingIsHovered: siblingIsHovered, // In case this is useful for styling
        siblingHoveredNumber: (siblingIsHovered ? this.state.hoveredColumn : null),
        onHoverChange: this.onHoverChange
      });

      column_num++;

      return column;


    }.bind(this));


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