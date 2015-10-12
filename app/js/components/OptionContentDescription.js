'use strict';

var React = require('react/addons');
var UrlEmbed = require('./UrlEmbed');

var OptionContentDescription = React.createClass({

  _getDescriptionParts: function(text){

    // Basic url regex
    var urlPattern = /(\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])/gim;

    // Split into array with url regex as serator
    // We wrap url regex in ( ) so that match also gets included in array
    var parts = text.split(urlPattern);

    // Construct an array of objects that include the type (text or url)
    // We run match on each part to check if url or not
    // There's probably a better way since seems redundant to run regex again on each part
    var partsWithType = [];
    for (var i = 0; i < parts.length; i++) { 
      var match = parts[i].match(urlPattern);
      var type = (match ? 'url' : text);
      partsWithType.push({ type: type, content: parts[i] });
    }

    //console.log('partsWithType ...');
    //console.log(partsWithType);

    return partsWithType;
  },

  render: function () {

    var description = '';

    if (this.props.text){
      var descriptionParts = this._getDescriptionParts(this.props.text);

      description = descriptionParts.map(function(part, i){
        if (part.type === 'url'){
          return ( <UrlEmbed url={part.content} /> );
        }else{
          return part.content;
        }
      });
    }

    return (
      <div>
        {description}
      </div>
    );
        
  }

});

module.exports = OptionContentDescription;
