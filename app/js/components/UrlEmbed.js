'use strict';

var React = require('react/addons');

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');

var UrlEmbed = React.createClass({

  getDefaultProps: function() {
    return {
      iframelyKey: '99f65a69d6b29b0a6f87cb',
      service: 'iframely'
    };
  },

  shouldComponentUpdate: function(nextProps, nextState){
    return false;
  },

  render: function () {

    var url = encodeURIComponent(this.props.url);

    var iframeSrc = '//cdn.iframe.ly/api/iframe?url=' + url + '&key=' + this.props.iframelyKey;
 
    return (
      <div>
        
        <div className="urlembed-container">
          <div className="urlembed-inner">

            { this.props.service === 'iframely' &&
              <iframe src={iframeSrc}
                      frameborder="0" 
                      allowfullscreen>
              </iframe>
            }

            { this.props.service === 'embedly' &&
              <div>
                <a class="embedly-card" href="http://www.seriouseats.com/2014/10/how-to-crack-eggs-like-a-badass.html">How to Crack Eggs Like a Badass</a>
                <script async src="//cdn.embedly.com/widgets/platform.js" charset="UTF-8"></script>
              </div>
            }

          </div>
        </div>

      </div>
    );
  }

});

module.exports = UrlEmbed;