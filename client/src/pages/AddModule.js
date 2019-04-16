import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import Container from "../layout/Container";
import Header from "../layout/Header";
import Content from "../layout/Content";

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class AddModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moduleCode: "",
      moduleName: "",
      moduleCredits: "",

      modal: false
    };
    this.onChange = this.onChange.bind(this);
    // this.onSubmit = this.onSubmit.bind(this);
    this.toggle = this.toggle.bind(this);
    this.addModule = this.addModule.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
    console.log(this.state);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  addModule() {
    const newModule = {
      moduleCode: this.state.moduleCode,
      moduleName: this.state.moduleName,
      moduleCredits: this.state.moduleCredits
    };

    axios
      .post("/api/module/add", { ...newModule })
      .then(res => {
        console.log("hello");
        this.toggle();
      })
      .catch(e => console.log(e));
    console.log("hellooo");
  }
  render() {
    return (
      <div>
        <Button onClick={this.toggle}>
          Add Module{" "}
          <FontAwesomeIcon icon="plus" size="lg" className="add-module" />
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Add Module</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="moduleCode">Module Code</Label>
                <Input
                  type="text"
                  name="moduleCode"
                  id="moduleCode"
                  placeholder="with a placeholder"
                  onChange={this.onChange}
                />
              </FormGroup>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="moduleName">Module Name</Label>
                    <Input
                      type="text"
                      name="moduleName"
                      id="moduleName"
                      placeholder="Module Name"
                      onChange={this.onChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="moduleCredits">Module Credits</Label>
                    <Input
                      type="number"
                      name="moduleCredits"
                      id="moduleCredits"
                      placeholder="Module Credits"
                      onChange={this.onChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-addModule"
              color="primary"
              onClick={this.addModule}
            >
              Add
            </Button>
            <Button onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default AddModule;
