'use strict';

var React = require('react/addons');
var UrlEmbed = require('./UrlEmbed');

var OptionDescription = React.createClass({

  _getDescriptionParts: function(text){

    var p_open = '<p(\sclass=\"\")?>';
    var p_close = '</p>';

    // This will split up some text into [before url], [url], [after url]
    //var urlAndSurroundingHtmlPattern = /(?:(<p(?:\sclass=\"\")?>(?:<b(?:\sclass=\"\")?>)?)(\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])((?:<\/b>)?<\/p>))/gim;

    // This will split up some text into [before url], [url], [after url]
    var urlAndSurroundingHtmlPattern = /(?:<div\sclass=\"url-embed\"?>(\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])<\/div>)/gim;

    // After being split into chunks, we iterate through each chunk and check (again) if it's a url
    // If its a url we set its type value so it's easier to handle this data later (we can check if any chunk is a url)
    var urlPattern = /^(\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])$/gim;

    // Basic url regex on newlines for readability
    /*
    var urlPattern = /(?:
                        <p(?:\sclass=\"\")?>
                          (?:<b(?:\sclass=\"\")?>)?
                            (\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])
                          (?:<\/b>)?
                        <\/p>
                      )
                      /gim;
    */

    // Split into array with url regex as serator
    // We wrap url regex in ( ) so that match also gets included in array
    var parts = text.split(urlAndSurroundingHtmlPattern);

    console.log('PARTS:', parts);

    // Construct an array of objects that include the type (text or url)
    // We run match on each part to check if url or not
    // There's probably a better way since seems redundant to run regex again on each part
    var partsWithType = [];
    for (var i = 0; i < parts.length; i++) { 
      var match = parts[i].match(urlPattern);
      var type = (match ? 'url' : text);
      partsWithType.push({ type: type, content: parts[i] });
    }

    return partsWithType;
  },

  _convertEmbedUrls: function(){

    // Basic url regex
    var urlPattern = /(\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])/gim;

  },

  render: function () {

    var description = '';
    if (this.props.text){
      var descriptionParts = this._getDescriptionParts(this.props.text);

      description = descriptionParts.map(function(part, i){
        if (part.type === 'url'){
          return ( <UrlEmbed url={part.content} /> );
        }else{
          return(
            <div dangerouslySetInnerHTML={ {__html: part.content} } />
          );
          return part.content;
        }
      });
    }

    var d = React.renderToString(
      <div> 
        {description} 
      </div>
    );

    console.log(d);

    return (
      <div>
         <div dangerouslySetInnerHTML={ {__html: d} } />
      </div>
    );
        
  }

});

module.exports = OptionDescription;
