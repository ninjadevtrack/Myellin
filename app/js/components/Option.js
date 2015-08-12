'use strict';

var React = require('react/addons');

var UrlEmbed = require('./UrlEmbed');
var UpvoteButton = require('./UpvoteButton');
var AuthorName = require('./AuthorName');

require('firebase');
var ReactFireMixin = require('reactfire');

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

  bindFirebaseRefs: function(){
    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);

    this.refOptions = firebase.child('options/' + this.props.id);

    this.bindAsObject(this.refOptions, 'data');
  },

  render: function () {

    if (!this.state.data)
      return false;

    if (this.props.full){
      return (
        <div className="option-container">
          <AuthorName id={this.state.data.author_id} />

          <div className="upvote">
            <div className="count">{this.props.relationData.upvote_count}</div>

            <UpvoteButton 
              label="r"
              this_type="option"
              this_id={this.state.data.id} 
              parent_type="suboutcome"
              parent_id={this.props.relationData.parent_suboutcome_id} />
          
          </div>

          {this.state.data.description}
          {this.state.data.url && 
            <UrlEmbed url={this.state.data.url} />
          }
        </div>
      );
    }

    return (
      <div>
        {this.state.data.description}
        {this.state.data.url && 
          <UrlEmbed url={this.state.data.url} />
        }
      </div>
    );
  },


  _handleClick: function (id) {

  }
 

});

module.exports = Option;