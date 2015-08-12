'use strict';

var React = require('react/addons');

var Button = require('react-bootstrap').Button;
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

  componentDidUpdate: function(prevProps, nextState) {
    if (this.props.id !== prevProps.id){
      this.bindFirebaseRefs(true);
    }
  },

  bindFirebaseRefs: function(rebind){

    if (rebind)
      this.unbind('data');

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

            <div style={{ marginTop:'0.5em', marginLeft:'-0.4em'}}>
              <Button bsSize="xsmall" onClick={this.chooseOption}>choose</Button>
            </div>
          
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

  chooseOption: function(){
    var firebaseRoot = 'https://myelin-gabe.firebaseio.com';
    var firebase = new Firebase(firebaseRoot);
    firebase.child('suboutcomes/' + this.props.relationData.parent_suboutcome_id + '/chosen_option').set(this.state.data.id);
  }
 

});

module.exports = Option;