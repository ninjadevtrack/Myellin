'use strict';

var React         = require('react/addons');
var RequestOutcome      = require('../components/RequestOutcome');
var Outcomes        = require('../components/Outcomes');
var Grid        = require('react-bootstrap').Grid;
var Col         = require('react-bootstrap').Col;
var DocumentTitle = require('react-document-title');


var MainPage = React.createClass({
  render: function() {
    return (
<DocumentTitle title="Home">
<Grid>
<Col sd={10} sdPush={1} md={8} mdPush={2}>

<Outcomes />
</Col>
</Grid>

<RequestOutcome />
      </DocumentTitle>
    );
  }

});

module.exports = MainPage;