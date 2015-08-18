'use strict';

var React = require('react/addons');

require('firebase');
var ReactFireMixin = require('reactfire');

var UrlEmbed = React.createClass({

  getDefaultProps: function() {
    return {
      iframelyKey: '4dcff1ef2f24f1790e6a3f4aa73016e8'
    };
  },

  render: function () {

    var url = encodeURIComponent(this.props.url);

    var iframeSrc = '//cdn.iframe.ly/api/iframe?url=' + url + '&key=' + this.props.iframelyKey + '&summary=true';
 
    return (
      <div>
        
        <div className="urlembed-container">
          <div className="urlembed-inner">
            <iframe src={iframeSrc}
                    frameborder="0" 
                    allowfullscreen>
            </iframe>
          </div>
        </div>

      </div>
    );
  }

});

module.exports = UrlEmbed;