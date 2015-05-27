'use strict';

var React         = require('react/addons');
var RequestOutcome      = require('../components/RequestOutcome');
var Outcomes        = require('../components/Outcomes');
var Grid        = require('react-bootstrap').Grid;
var Col         = require('react-bootstrap').Col;
var DocumentTitle = require('react-document-title');


var MainPage = React.createClass({
  
 propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
<DocumentTitle title="MainPage">
<section className="mainpage">
<Grid>
<Col sd={10} sdPush={1} md={10} mdPush={1} ld={10} ldPush={1}>

<Outcomes />
</Col>
</Grid>

<RequestOutcome />
</section>
      </DocumentTitle>
    );
  }

});

module.exports = MainPage;