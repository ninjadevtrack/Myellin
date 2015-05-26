'use strict';

var React = require('react/addons');
var Button = require('react-bootstrap').Button;
var Col = require('react-bootstrap').Col;
var Modal = require('react-bootstrap').Modal;
var OverlayMixin = require('react-bootstrap').OverlayMixin;
var Form = require('react-bootstrap').Form;
var Input = require('react-bootstrap').Input;


var RequestOutcome = React.createClass({
	 mixins: [OverlayMixin],

	 getInitialState() {
    return {
      isModalOpen: false
    };
  },

  handleToggle() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },

  render: function() {
    return (
<Col xs={1} xsPush={5} sd={1} sdPush={10} md={1} mdPush={10}>
      <section className="requestoutcome center-block">
      <Button onClick={this.handleToggle} bsStyle='link'><h3><i className="s s-glyph04"></i></h3></Button>
    </section>
</Col>
    );
  },

  renderOverlay() {
    if (!this.state.isModalOpen) {
      return <span/>;
    }

    return (
      <Modal title='' onRequestHide={this.handleToggle}>
        <div className='modal-body'>
          <form>
    <Input type='text' label='' placeholder='Enter text' />
    </form>
        </div>
        <div className='modal-footer'>
          <Button onClick={this.handleToggle} bsStyle='link'><h5><i className="s s-glyph10"></i></h5></Button>
        </div>
      </Modal>
    );
  }

});

module.exports = RequestOutcome;