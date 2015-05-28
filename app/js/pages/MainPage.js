'use strict';

var React         = require('react/addons');
var RequestOutcome      = require('../components/RequestOutcome');
var Outcomes        = require('../components/Outcomes');
var SearchBar        = require('../components/SearchBar');
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
<SearchBar />
<Col sm={10} smPush={1} md={10} mdPush={1} lg={10} lgPush={1}>
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