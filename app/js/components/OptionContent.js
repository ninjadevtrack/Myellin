'use strict';

var React = require('react/addons');

var Button = require('react-bootstrap').Button; 
var Glyphicon= require('react-bootstrap').Glyphicon;
var Router = require('react-router');
var OptionDescription = require('./OptionDescription');
var UpvoteButton = require('./UpvoteButton');
var AuthorName = require('./AuthorName');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var MenuItem = require('react-bootstrap').MenuItem;
var DropdownButton = require('react-bootstrap').DropdownButton;

require('firebase');
//var ReactFireMixin = require('reactfire');
var ReactFireMixin = require('../../../submodules/reactfire/src/reactfire.js');
var AuthMixin = require('./../mixins/AuthMixin.js');

var OptionContent = React.createClass({

  mixins: [Router.Navigation, Router.State, ReactFireMixin, AuthMixin],

  _getMenuItems: function(){

    var menuItems = [];

    if (this.state.user && this.props.data && this.state.user.id === this.props.data.author_id){
      menuItems.push( <MenuItem eventKey='edit'>Edit</MenuItem> );
      menuItems.push( <MenuItem eventKey='delete'>Delete</MenuItem> );
    }

    if (this.state.user && this.props.playlist && this.state.user.id === this.props.playlist.author_id)
      menuItems.push( <MenuItem eventKey='switch'>Switch</MenuItem> );

    return menuItems;
  },

  _save: function(){

    if (!this.refs.description)
      return false;

    var description = React.findDOMNode(this.refs.description).value.trim();
    this.props.onSave(description);
  },

  _cancel: function(){

    this.props.onCancel();
  },


  render: function () {

    var menuItems = this._getMenuItems();

    var ranking = (<Glyphicon glyph='option-vertical' className='optionplaylist' />);

    var editable = false;
    // If author AND (editing OR forceEdit)
    // We use forceEdit prop when in edit playlist modal (should always be editable if you are author)
    if ((this.state.user && this.state.user.id === this.props.data.author_id) &&
          (this.props.editable || this.props.data.editing)){
      editable = true;
    }

    /** DISPLAY INLINE under Suboutcome **/
    if (this.props.contentOnly){
      return (
        <div>


          <AuthorName id={this.props.data.author_id} />
          
          { !editable &&
            <div>
              <OptionDescription text={this.props.data.description} />
            </div>
          }

          { editable &&
            <div>
              <textarea ref="description" rows="5" style={{width:'100%', border: '1px solid #000', padding: '0.4em'}}>
                {this.props.data.description}
              </textarea>
            </div>
          }

        </div>
      );
    }

    /** DISPLAY in Options column **/
    return (

      <div className="option-container">

        { !editable && menuItems.length >= 1 &&
          <div style={{ float: 'right'}}>
            <DropdownButton style={{margin: '-10px 0 -15px 0', padding: '0', color: '#000'}} onSelect={this.props.onMenuSelect} bsSize='large' title={ranking} bsStyle='link' classStyle='editbutton' pullRight noCaret>
              {menuItems}
            </DropdownButton>
          </div>
        }
        
        <AuthorName id={this.props.data.author_id} />

        <div className="upvote">
          <div className="count">{this.props.relationData.upvote_count}</div>

          <UpvoteButton 
            label={<Glyphicon glyph='ok-circle'/>}
            this_type="option"
            this_id={this.props.data['.key']} 
            parent_type="suboutcome"
            parent_id={this.props.relationData.parent_suboutcome_id} />
        </div>
        
        { !editable &&
          <div style={{ lineHeight: "1.2", marginBottom: '2em', textAlign: 'justify', fontFamily: "Akkurat-Light"}}>
            <OptionDescription text={this.props.data.description} />
          </div>
        }

        { editable &&
          <div>
            <textarea ref="description"
              rows="5" 
              style={{width:'100%', border: '1px solid #000', padding: '0.4em'}}
              defaultValue={this.props.data.description} />
                     
            <div>
              <Button onClick={this._save} style={{marginTop:'2em'}}>
                Save
              </Button>

              <Button onClick={this._cancel} style={{marginTop:'2em', marginLeft: '2em'}}>
                Cancel
              </Button>
            </div>
          </div>
        }

      </div>
    );
        
  }

});

module.exports = OptionContent;
