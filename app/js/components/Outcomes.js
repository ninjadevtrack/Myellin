'use strict';

var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
var Badge = require('react-bootstrap').Badge;


var Outcomes = React.createClass({

  render: function() {
    return (
    <ListGroup fill>
      <ListGroupItem href='#'>How to cook perfect scrabbled eggs <Badge>12</Badge></ListGroupItem>
      <ListGroupItem href='#'>How to build habits <Badge>13</Badge></ListGroupItem>
      <ListGroupItem href='#'>What are the most important habits <Badge>34</Badge></ListGroupItem>
      <ListGroupItem href='#'>How do I learn to speak a foreign language in the shortest amount of time <Badge>42</Badge></ListGroupItem>
      <ListGroupItem href='#'>What is the most effevtive way to loose weight <Badge>74</Badge></ListGroupItem>
      <ListGroupItem href='#'>What is success? <Badge>223</Badge></ListGroupItem>
      <ListGroupItem href='#'>How du I learn to build a simple web app?<Badge>63</Badge></ListGroupItem>
      <ListGroupItem href='#'>What are the best programming languages to learn?<Badge>75</Badge></ListGroupItem>
      <ListGroupItem href='#'>How can I improve my eye for design? <Badge>77</Badge></ListGroupItem>
      <ListGroupItem href='#'>Why is meditation important? <Badge>35</Badge></ListGroupItem>
      <ListGroupItem href='#'>How do I become a morning person? <Badge>74</Badge></ListGroupItem>
      <ListGroupItem href='#'>Which food habits do I need to build to have a healthy and long life? <Badge>22</Badge></ListGroupItem>
      <ListGroupItem href='#'>What is the best productivity approach, and tools? <Badge>2</Badge></ListGroupItem>
      <ListGroupItem href='#'>How can I learn faster? <Badge>12</Badge></ListGroupItem>
      <ListGroupItem href='#'>Wnat are the core things I need to understand when starting a high growth tech company? <Badge>29</Badge></ListGroupItem>
      <ListGroupItem href='#'>How do I learn to build a simple react, and firebase app? <Badge>45</Badge></ListGroupItem>
      <ListGroupItem href='#'>What are the best way to find gigs as a marketing consultant?<Badge>33</Badge></ListGroupItem>
      <ListGroupItem href='#'>What are the best places in the world to work remotely? <Badge>8</Badge></ListGroupItem>
      <ListGroupItem href='#'>Where should I incoperate my tech company, and where should I base it? <Badge>4</Badge></ListGroupItem>
      <ListGroupItem href='#'>How do I build a growth mindset? <Badge>345</Badge></ListGroupItem>
    </ListGroup>
    );
  }

});

module.exports = Outcomes;