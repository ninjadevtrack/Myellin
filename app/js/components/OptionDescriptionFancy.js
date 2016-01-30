'use strict';

var React = require('react');
var UrlEmbed = require('./UrlEmbed');

var OptionDescription = React.createClass({

  _getDescriptionParts: function(text){

    // This will split up some text into [before url], [url], [after url]
    //var urlAndSurroundingHtmlPattern = /(?:(<p(?:\sclass=\"\")?>(?:<b(?:\sclass=\"\")?>)?)(\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])((?:<\/b>)?<\/p>))/gim;

    /* 
      Matches an embed div (<div class="url-embed">http://google.com</div>)
      - We currently use a dumb regex that allow any text within the embed div.
      - We should switch to the urlEmbedDivPatternSmart pattern once we can ensure that the React Medium Editor ...
        validates that the embed url is correct (important: even when going back in and modifying the url text).
    */
    //var urlEmbedDivPatternSmart = /(<div\sclass=\"url-embed\"?>\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]<\/div>)/gim;
    var urlEmbedDivPatternDumb = /(<div\sclass=\"url-embed\"?>.+?<\/div>)/gim;

    // After being split into chunks, we iterate through each chunk and check (again) if it's a url
    // If its a url we set its type value so it's easier to handle this data later (we can check if any chunk is a url)
    //var urlOnlyPattern = /^(\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])$/gim;
    //var urlPattern = /(\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])/gim;
    
    var divContentsPattern = /<div\sclass=\"url-embed\"?>(.+?)<\/div>/gim;

    // Split into array with url regex as separator
    var parts = text.split(urlEmbedDivPatternDumb);
    //console.log('PARTS:', parts);

    // Construct an array of objects that include the type (text or url)
    // We run match on each part to check if url or not
    // There's probably a better way since seems redundant to run regex again on each part
    var partsWithType = [];
    for (var i = 0; i < parts.length; i++) { 

      var match = parts[i].match(urlEmbedDivPatternDumb);

      if (match){
        // Split apart <div class="url-embed">, {url}, </div>
        var urlEmbedParts = parts[i].split(divContentsPattern);
        var type = 'url';
        // Set var content equal to the url
        var content = urlEmbedParts[1];
        console.log('urlEmbedParts', urlEmbedParts);
      }else{
         var type = 'text';
         var content = parts[i];
      }

      partsWithType.push({ type: type, content: content });
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

    //console.log(d);

    return (
      <div>
         <div dangerouslySetInnerHTML={ {__html: d} } />
      </div>
    );
        
  }

});

module.exports = OptionDescription;
