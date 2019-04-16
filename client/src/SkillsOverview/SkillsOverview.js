import React, { Component } from "react";
import Container from "../layout/Container";
import Header from "../layout/Header";
import Content from "../layout/Content";
import Dropdown from "./Dropdown/Dropdown";
import {Col, Row} from "reactstrap";

class SkillsOverview extends Component {
  render() {
    return (
      <Container>
        <Header pageName="Skills" />
        <Content>
          <Row>
            <Col>
              <Dropdown dropdownTitle={"Filter By Skill"} />
            </Col>
            <Col>
              <Dropdown dropdownTitle={"Filter By Module"} />
            </Col>
          </Row>
        </Content>
      </Container>
    );
  }
}

export default SkillsOverview;
