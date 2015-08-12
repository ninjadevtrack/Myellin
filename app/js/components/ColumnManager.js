'use strict';

var React = require('react/addons');

var ColumnManager = React.createClass({

  getInitialState: function(){
    return {}
  },

  // Quick and dirty way to count number of columns.
  // We can't just do React.Children.count() because there are null children (wtf)
  getColumnCount: function(){

    var column_count = 0;
    React.Children.forEach(this.props.children, function(child){
      if (child) // Ignore null children
        column_count++;
    });

    return column_count;
  },

  // Quick and dirty solution until we finalize how column widths should actually be computed
  // Returns the width that a column should be depending on column number and total number of columns 
  getColumnWidth: function(column_num, column_count){

    switch (column_count){
      case 1:
        return 12; // 100%
      case 2:
        if (column_num === 0){
          return 5;
        }else{
          return 7
        }
      case 3:
        if (column_num === 0){
          return 2;
        }else if (column_num === 1){
          return 5;
        }else{
          return 5;
        }
    }
  },

  updateColumnsWithProps: function(){

    var column_count = this.getColumnCount();

    var columns = React.Children.map(this.props.children, function (child, i) {

      if (!child) // Ignore null children
        return false;

      var column_width = this.getColumnWidth(i, column_count);

      return React.addons.cloneWithProps(child, {
        sm: column_width,
        md: column_width,
        lg: column_width
      });

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