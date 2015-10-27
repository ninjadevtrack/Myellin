'use strict';

var React = require('react/addons');
var Editor = require('react-medium-editor');



var rangy = require('rangy');
require('rangy/lib/rangy-classapplier.js');
require('rangy/lib/rangy-selectionsaverestore.js');

var MediumEditor = require('react-medium-editor/node_modules/medium-editor');
rangy.init();

var classApplierModule = rangy.modules;
console.log('RANGY', classApplierModule);

var EmbedButton = MediumEditor.extensions.button.extend({
  name: 'highlighter',
  //tagNames: ['mark'], // nodeName which indicates the button should be 'active' when isAlreadyApplied() is called
  contentDefault: '<b>EMBED</b>', // default innerHTML of the button
  aria: 'Hightlight', // used as both aria-label and title attributes
  action: 'highlight', // used as the data-action attribute of the button

  init: function () {
    MediumEditor.extensions.button.prototype.init.call(this);
  },

  handleClick: function (event) {

    // The selected text
    // TODO: check if valid url
    var selection = rangy.getSelection().toString();
    //console.log('selection:' + selection);

    var urlPattern = /^(\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])$/gim;

    var match = selection.match(urlPattern);

    if (!match){
      alert('You can only embed valid urls.');
      return;
    }

    this.classApplier = rangy.createClassApplier('url-embed', {
      elementTagName: 'div',
      normalize: true
    });

    // If we want to make it a link rather than a div
    // This seems ideal, but problematic becase editing the text later wont update the href attribute
    // We'd need a way to detect whether the text change happened within an element created ...
    // ... by this extension and then update the href each time that happens.
    // Look into: https://github.com/yabwe/medium-editor/tree/master/src/js/extensions#checkstatenode
    /*
    this.classApplier = rangy.createClassApplier('url-embed', {
      elementTagName: 'a',
      elementAttributes: {
        href: selection
      },
      normalize: true
    });
    */

    this.classApplier.toggleSelection();

    // Manually call the editableInput event so the React Editor onChange callback fires and we get the new text
    this.trigger('editableInput',  {}, this.base.getFocusedElement());
  }
});




var OptionEditor = React.createClass ({

  getInitialState: function(){
    return {
      contentDuringEdit: (this.props.text || '')
    };
  },

  shouldComponentUpdate: function(){
    return true;
    //return false;
  },

  _handleChange: function(content){

    this.setState({ contentDuringEdit: content });

    // Pass updated description to parent, along with the option_id
    // This is so we can also save all changed Options when we save a playlist
    if (this.props.onChange)
      this.props.onChange(content);
  },

  render: function () {

    //var text = '<div style="width: 100%; height: 0px; position: relative; padding-bottom: 56.2493%;"><iframe src="https://www.youtube.com/embed/A3PDXmYoF5U?wmode=transparent&rel=0&autohide=1&showinfo=0&enablejsapi=1" frameborder="0" allowfullscreen style="width: 100%; height: 100%; position: absolute;"></iframe></div>';
    //text += this.props.text;

    return (
      <div> 

        <div style={{padding: '10px', marginBottom: '1em', border: '1px solid #CCC'}}>
          <u>HTML (for debugging)</u><br/>
          {this.state.contentDuringEdit}
        </div> 
       
        <Editor
          text={this.props.text}
          onChange={this._handleChange}
          options={{ 
            extensions: {
              'highlighter': new EmbedButton()
            },
            toolbar: { 
              buttons: [
                'bold',
                'unorderedlist',
                'h3',
                'anchor',
                'removeFormat',
                'quote',
                'highlighter'
              ]
            }
          }} />

      </div>
    );

  }

});


// Export the wrapped component
module.exports = OptionEditor;