'use strict';

var React = require('react/addons');

var Button = require('react-bootstrap').Button; 
var Glyphicon= require('react-bootstrap').Glyphicon;
var UrlEmbed = require('./UrlEmbed');
var UpvoteButton = require('./UpvoteButton');
var AuthorName = require('./AuthorName');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var MenuItem = require('react-bootstrap').MenuItem;
var DropdownButton = require('react-bootstrap').DropdownButton;

require('firebase');
var ReactFireMixin = require('reactfire');

var ranking = (<Glyphicon glyph='option-vertical' className='optionplaylist' />);

var Option = React.createClass({

  mixins: [ReactFireMixin],

  getInitialState: function(){
    return {
      data: null
    };
  },

  componentWillMount: function() {
    this.bindFirebaseRefs();
  },

  // Rebind Firebase refs if props.id changes so we fetch new data
  componentDidUpdate: function(prevProps, nextState) {
    if (this.props.id !== prevProps.id)
      this.bindFirebaseRefs(true);
  },

  bindFirebaseRefs: function(rebind){

    if (rebind)
      this.unbind('data');

    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    this.refOptions = firebase.child('options/' + this.props.id);
    this.bindAsObject(this.refOptions, 'data');
  },

  getDescriptionParts: function(text){

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

    console.log('partsWithType ...');
    console.log(partsWithType);

    return partsWithType;
  },

  render: function () {

    if (!this.state.data)
      return false;

    var descriptionParts = this.getDescriptionParts(this.state.data.description);

    var description = descriptionParts.map(function(part, i){
      if (part.type === 'url'){
        return ( <UrlEmbed url={part.content} /> );
      }else{
        return part.content;
      }
    });

    var optionContent = (
      <div>
        {description}

        {/* Remove url field in the future and only parse out of description */}
        {this.state.data.url && 
          <UrlEmbed url={this.state.data.url} />
        }
      </div>
    );

    if (this.props.contentOnly)
      return optionContent;

    return (
      <div className="option-container">
        <div style={{ float: 'right'}}>
          <DropdownButton style={{margin: '-10px 0 -15px 0', padding: '0', color: '#000'}}  bsSize='large' title={ranking} bsStyle='link' classStyle='editbutton' pullRight noCaret>
            <MenuItem eventKey='1' onClick={this.chooseOption}>Switch</MenuItem>
          </DropdownButton>
        </div>
        
        <AuthorName id={this.state.data.author_id} />

        <div className="upvote">
          <div className="count">{this.props.relationData.upvote_count}</div>

          <UpvoteButton 
            label={<Glyphicon glyph='ok-circle'/>}
            this_type="option"
            this_id={this.state.data.id} 
            parent_type="suboutcome"
            parent_id={this.props.relationData.parent_suboutcome_id} />
        </div>
        
        <div style={{ lineHeight: "1.2", marginBottom: '2em', textAlign: 'justify', fontFamily: "Akkurat-Light"}}>
          {optionContent}
        </div>
      </div>
    );
        
  },

  chooseOption: function(){
    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);
    firebase.child('suboutcomes' +
                      '/' + this.props.relationData.parent_suboutcome_id + 
                      '/chosen_option').set(this.state.data.id);
  }
 

});

module.exports = Option;