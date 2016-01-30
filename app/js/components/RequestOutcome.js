'use strict';

var React = require('react');
var Button = require('react-bootstrap').Button;
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

      <section className="requestoutcome">
        <Button onClick={this.handleToggle} bsStyle='link'><h4><i className="s s-glyph04 s-outcome"></i></h4></Button>
      </section>

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