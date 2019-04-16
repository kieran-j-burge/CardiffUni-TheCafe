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

class ActionPlanTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    //rendering data
    console.log(this.props.resources);
    const resources = this.props.resources;
    const resourcesMap = resources.map(res => {
      console.log(res);
      return (
        <h3>
          <a class="no-link-style" href={res.link}>
            {res.name}
          </a>
        </h3>
      );
    });
    return (
      <div class="action-plan-container">
        <h3>
          {this.props.skill} - {this.props.date}{" "}
        </h3>
        <h5>**Note: {this.props.note}</h5>
        <h5>
          <u>Resources</u>
        </h5>
        {resourcesMap}
      </div>
    );
  }
}

export default ActionPlanTemplate;
