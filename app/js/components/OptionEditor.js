'use strict';

var React = require('react');
var Editor = require('react-medium-editor');

var rangy = require('rangy');
require('rangy/lib/rangy-classapplier.js');
require('rangy/lib/rangy-selectionsaverestore.js');

var MediumEditor = require('react-medium-editor/node_modules/medium-editor');
rangy.init();

var EmbedButton = MediumEditor.extensions.button.extend({
  name: 'embed',
  //tagNames: ['mark'], // nodeName which indicates the button should be 'active' when isAlreadyApplied() is called
  contentDefault: '<b>EMBED</b>', // default innerHTML of the button
  aria: 'Embed a URL', // used as both aria-label and title attributes
  action: 'embed', // used as the data-action attribute of the button

  init: function () {
    MediumEditor.extensions.button.prototype.init.call(this);
  },

  handleClick: function (event) {

    // The selected text
    var selection = rangy.getSelection().toString();
    //console.log('selection:' + selection);

    // Make sure selection was a url
    // TODO: We need to somehow check everytime they edit the text (after it's an embed) if it's still a valid url
    var urlOnlyPattern = /^(\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])$/gim;
    var match = selection.match(urlOnlyPattern);

    if (!match){
      alert('You must select a valid url that you\'d like to embed (starting with http://)');
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
          options={{ 
            extensions: {
              'embed': new EmbedButton()
            },
            toolbar: { 
              buttons: [
                'bold',
                'unorderedlist',
                'h3',
                'anchor',
                'removeFormat',
                'quote',
                'embed'
              ]
            }
          }} />

      </div>
    );

  }

});


module.exports = OptionEditor;