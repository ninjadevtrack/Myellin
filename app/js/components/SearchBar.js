'use strict';

var React = require('react/addons');
var Col = require('react-bootstrap').Col;
var Input = require('react-bootstrap').Input;
var Form = require('react-bootstrap').Form;
var Row = require('react-bootstrap').Row;



var SearchBar = React.createClass({

  render: function() {
    return (	
<div className="compensate-for-the-nav">
<Row>
<Col xs={2} xsPush={5} sm={2} smPush={5} md={2} mdPush={5} lg={2} lgPush={5}>
<div className="inputplaceholder">
<Input type='text' bsSize="large" placeholder="&#32;" />
</div>
</Col>
<Col xs={2} xsPush={7} sm={2} smPush={7}  md={2} mdPush={7} lg={2} lgPush={7} >

 <form><Input type='select' placeholder='Latest First'>
      <option value='select'>LATEST FIRST</option>
      <option value='other'>TRENDING</option>
    </Input></form>
     
</Col>
</Row>
 </div>

    );
  }

});

module.exports = SearchBar;