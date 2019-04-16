import React, { Component } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  CardTitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import PropTypes from "prop-types";

const hoverStyling = {
  "background-color": "#E8E8E8",
  cursor: "pointer"
};

class ModuleTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardHovered: false,
      planHovered: false,
      skillHovered: false,
      gradeHovered: false,
      skillsModal: false,
      moduleName: null,
      name: "test"
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log("props: " + nextProps);
    this.setState({
      moduleName: nextProps
    });
  }

  render() {
    return (
      <div class="module-container">
        <div class="mod-title-container">
          <CardTitle>
            <h1>{this.props.moduleName}</h1>
          </CardTitle>
        </div>
        <div class="mod-main-container">
          <div class="mod-action-container">
            <h1>{this.props.moduleName}</h1>
          </div>
          <div class="mod-grade-container">
            <h1>{this.props.moduleName}</h1>
          </div>
          <div class="mod-skill-container">
            <h1>{this.props.moduleName}</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default ModuleTemplate;
