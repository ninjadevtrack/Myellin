'use strict';

var react = require('react');
var React = require('react/addons');
var Col = require('react-bootstrap').Col;
var Input = require('react-bootstrap').Input;
var Row = require('react-bootstrap').Row;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;
var Glyphicon = require('react-bootstrap').Glyphicon;

var menuStyle = {
  float: 'right',
};



var ranking = (<Glyphicon glyph='sort-by-attributes' className='optiongray-playlist' />);

var SearchBar = React.createClass({

  render: function() {
    return (
      <div className="compensate-for-the-nav-playlist">
          <Row className='nomargin-playlist'>
          <Col xs={8} xsPush={2} sm={8} smPush={2} md={8} mdPush={2} lg={8} lgPush={2}>
            <div className="inputplaceholder-playlist">
              <Input type='text' bsSize="large" placeholder="&#32;" />
            </div>
          </Col>
<div style={menuStyle}>
 <ButtonToolbar>
      <DropdownButton bsSize='large' title={ranking} bsStyle='link' className='nomargin' pullRight noCaret>
        <MenuItem eventKey='1'>Latest First</MenuItem>
        <MenuItem eventKey='3'>Trending</MenuItem>
      </DropdownButton>
    </ButtonToolbar>
      </div>
      </Row>
      </div>
    );
  }

});



module.exports = SearchBar;