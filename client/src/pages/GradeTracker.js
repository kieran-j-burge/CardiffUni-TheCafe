import React, { Component } from "react";
import Container from "../layout/Container";
import Header from "../layout/Header";
import Content from "../layout/Content";

class GradeTracker extends Component {
  render() {
    return (
      <Container>
        <Header pageName="Grade Tracker" />
        <Content />
      </Container>
    );
  }
}

export default GradeTracker;
