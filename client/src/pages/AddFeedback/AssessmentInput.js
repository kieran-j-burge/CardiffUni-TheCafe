import React, { Component } from "react";
import {
  FormGroup,
  Label,
  Input,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Alert
} from "reactstrap";
import DropdownSuggestions from "./DropdownSuggestions";

import axios from "axios";

class AssessmentInput extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      assessmentName: null,
      value: "",
      assessmentList: [],
      query: "",
      showList: false,
      addModal: false,
      error: false,
      blank: false
    };

    this.closeRef = React.createRef();
    this.node = React.createRef();
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.clickOut, false);
    this._isMounted = true;
    this.getAssessments();
  }

  componentWillUnmount() {
    this._isMounted = false;
    document.removeEventListener("mousedown", this.clickOut, false);
  }

  componentWillReceiveProps = props => {
    if (props.module !== this.props.module) {
      if (props.module === null) {
        this.clearAssessment();
      }
    }
  };

  toggle() {
    this.setState(prevState => ({
      addModal: !prevState.addModal
    }));
  }

  getAssessments = () => {
    if (this.props.module && this.state.assessmentList.length === 0) {
      const fred = {
        name: this.props.module
      };
      axios
        .post("/api/module/get/assessmentNames", fred)
        .then(res => {
          if (this._isMounted) {
            console.log(res.data);
            this.setState({
              assessmentList: res.data
            });
          }
        })

        .catch(err => console.log(err));
    }
  };

  addAssessment = () => {
    const saver = {
      module: this.props.module,
      assessmentName: this.state.value
    };

    if (this.state.assessmentList.includes(this.state.value)) {
      console.log("Assessment already exists");
      this.setState({
        error: true
      });
      return false;
    }
    if (this.state.value.length === 0) {
      this.setState({
        blank: true
      });
      return false;
    }
    axios
      .post("/api/module/add/assessment", saver)
      .then(res => res.json())
      .catch(e => {
        console.log(e);
      });
    this.setState(
      {
        assessmentList: [...this.state.assessmentList, this.state.value],
        addModal: false,
        blank: false
      },
      () => this.changeAssessment(this.state.value)
    );
  };

  changeAssessment = assessmentName => {
    console.log(assessmentName);
    this.setState(
      {
        assessmentName: assessmentName,
        value: assessmentName
      },
      e => this.props.getAssessment(this.state.assessmentName)
    );
    this.setState({
      showList: false
    });
  };

  onChange = e => {
    this.setState({
      value: e.target.value,
      query: e.target.value,
      showList: true,
      error: false
    });
  };

  clickOut = e => {
    if (!this.node.contains(e.target)) {
      this.setState({
        query: ""
      });
    }
  };

  onClick = e => {
    this.getAssessments();
    if (e.target.value !== "") {
      this.setState({
        showList: true
      });
    }
  };

  clearAssessment = () => {
    console.log("hello ");
    this.setState(
      {
        assessmentName: null,
        value: ""
      },
      () => this.closeRef.focus()
    );
    this.props.getAssessment(null);
  };

  render() {
    let show = true;
    if (this.props.module && this.state.assessmentName === null) {
      show = false;
    }

    return (
      <div className="assessment-input">
        <Modal
          isOpen={this.state.addModal}
          toggle={this.toggle}
          className={"add-modal"}
        >
          {" "}
          <ModalHeader toggle={this.toggle}>Add Assessment</ModalHeader>
          <ModalBody>
            Please input an assessment name
            <Input
              type="text"
              name="newAssesment"
              id="newAssesment"
              placeholder="Assessment Name"
              onChange={this.onChange}
              autoComplete="off"
              value={this.state.value}
              style={{ marginTop: "10px" }}
            />
            {this.state.error ? (
              <Alert color="danger" style={{ marginTop: "10px" }}>
                The assessment you have entered already exists
              </Alert>
            ) : null}
            {this.state.blank ? (
              <Alert color="danger" style={{ marginTop: "10px" }}>
                Please put a valid assessment name
              </Alert>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addAssessment}>
              Add
            </Button>
            {""}
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <FormGroup row>
          <Label for="assessmentName" sm={4}>
            Assessment Name
          </Label>
          <Col sm={6}>
            <div className="input-box" ref={node => (this.node = node)}>
              <Input
                type="text"
                name="assessmentName"
                id="assessmentName"
                innerRef={input => (this.closeRef = input)}
                placeholder="Search Existing Assessments"
                onChange={this.onChange}
                onClick={this.onClick}
                value={this.state.value}
                autoComplete="off"
                className="tester"
                disabled={show ? true : false}
              />
              {this.state.assessmentName ? (
                <div className="close" onClick={this.clearAssessment} />
              ) : (
                <Button
                  disabled={show ? true : false}
                  style={{ marginLeft: "10px" }}
                  onClick={this.toggle}
                >
                  New Assessment
                </Button>
              )}
              {this.state.showList ? (
                <DropdownSuggestions
                  query={this.state.query}
                  results={this.state.assessmentList}
                  setData={this.changeAssessment}
                  addNew={this.addAssessment}
                />
              ) : null}
            </div>
          </Col>
        </FormGroup>
      </div>
    );
  }
}

export default AssessmentInput;
