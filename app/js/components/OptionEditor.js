'use strict';

var React = require('react/addons');
var Editor = require('react-medium-editor');

var OptionEditor = React.createClass({

  getInitialState: function(){
    return {
      contentDuringEdit: (this.props.text || '')
    };
  },

  _handleChange: function(content){

    this.setState({ contentDuringEdit: content });

    // Pass updated description to parent, along with the option_id
    // This is so we can also save all changed Options when we save a playlist
    if (this.props.onChange)
      this.props.onChange(content);
  },

  render: function () {

    return (
      <div>

        {/*
        <div style={{padding: '10px', marginBottom: '1em', border: '1px solid #CCC'}}>
          <u>HTML (for debugging)</u><br/>
          {this.state.contentDuringEdit}
        </div> 
        */} 
      
        <Editor
          text={this.props.text}
          onChange={this._handleChange}
          options={{ toolbar: 
            { buttons: 
              [
                'bold',
                'unorderedlist',
                'h3',
                'anchor',
                'removeFormat',
                'quote'
              ]
            }
          }} />

      </div>
    );

  }

});


// Export the wrapped component
module.exports = OptionEditor;