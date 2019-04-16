import React, { Component } from "react";
import { Button, Col, Form, FormGroup, Input, Label } from "reactstrap";
import Switch from "react-toggle-switch";
import axios from "axios";

import Container from "../layout/Container";
import Header from "../layout/Header";
import Content from "../layout/Content";
import schools from "../config/schools";

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      name: "",
      email: "",
      school: "",
      desiredGrade: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      language: "",
      token: "",
      dropdownOpenByDefault: false,
      collegeDropdownState: false,
      schoolDropdownState: false,
      desiredGradeDropdownState: false
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    let token = localStorage.getItem("loginToken");

    if (token !== null) {
      let studentId = localStorage.getItem("studentId");

      axios.get(`/api/student/validate/${studentId}/${token}`)
        .then(resp => {
          this.setState({ "id"          : studentId });
          this.setState({ "token"       : token });
          this.setState({ "name"        : resp.data.student.name });
          this.setState({ "email"       : resp.data.student.email });
          this.setState({ "school"      : resp.data.student.school });
          this.setState({ "desiredGrade": resp.data.student.desiredGrade });
          this.setState({ "language"    : resp.data.student.language });
        })
        .catch(err => {
          window.location.href = "/login";
        });
    } else {
      window.location.href = "/login";
    }
  }

  componentDidMount() {
  }

  validateForm() {
    return this.state.email.length > 0
      && this.state.oldPassword.length > 0
      && this.state.school !== ""
      && this.state.desiredGrade !== ""
      && this.state.language !== "";
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    // left in for debugging purposes
    //console.log(this.state.username);
    //console.log(this.state.password);

    axios.post(`/api/student/update-account`, this.state)
      .then(resp => {
        this.props.history.push("/dashboard");
      })
      .catch(err => alert(err.response.data.message));
  };

  toggleDropdown() {
    this.setState(prevState => ({
      dropdownOpenByDefault: !prevState.dropdownOpenByDefault
    }));
  }

  toggleSchoolDropdown() {
    this.setState(prevState => ({
      schoolDropdownState: !prevState.schoolDropdownState
    }));
  }

  toggleDesiredGradeDropdown() {
    this.setState(prevState => ({
      desiredGradeDropdownState: !prevState.desiredGradeDropdownState
    }));
  }

  render() {
    var schoolsList = schools.map((name) => {
      return ( <option value={name}>{name}</option> );
    });

    var grades = {
      "": "Select Grade",
      "FIRST"  : "1st",
      "TWO_ONE": "2:1",
      "TWO_TWO": "2:2",
      "THIRD"  : "3rd",
    };

    var gradesList = Object.keys(grades).map((key) => {
      return ( <option value={key}>{grades[key]}</option> );
    });

    return (
      <Container className="cafe-account-options">
        <Form className="cafe-account-options form" onSubmit={this.handleSubmit} style={ { float: "left" } }>
          <br></br>
          <Col>
            <h2>Your Account</h2>
          </Col>
          <br></br>
          <Col>
            <FormGroup className="cafe-account-options form-group name">
              <Label>Your Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="John Cena"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup className="cafe-account-options form-group email">
              <Label>University Email</Label>
              <Input
                type="text"
                name="email"
                id="email"
                placeholder="Your uni email address..."
                value={this.state.email}
                onChange={this.handleChange}
              />
            </FormGroup>
          </Col>
          <br></br>
          <Col>
            <FormGroup className="cafe-account-options form-group language">
              <Label>Select Language</Label>
              <select
                name="language"
                id="language"
                value={this.state.language}
                isOpen={this.state.dropdownOpenByDefault}
                toggle={this.toggleDropdown}
                onChange={this.handleChange}
              >
                <option value="english">English</option>
                <option value="welsh">Cymraeg</option>
                <option value="french">Français</option>
                <option value="spanish">Español</option>
                <option value="german">Deutsche</option>
                <option value="russian">pусский</option>
              </select>
            </FormGroup>
          </Col>
          <br></br>
          <Col>
            <FormGroup className="cafe-account-options form-group school">
              <Label>Select School</Label>
              <select
                name="school"
                id="school"
                value={this.state.school}
                isOpen={this.state.schoolDropdownState}
                toggle={this.toggleSchoolDropdown}
                onChange={this.handleChange}
              >
                {schoolsList}
              </select>
            </FormGroup>
          </Col>
          <br></br>
          <Col>
            <FormGroup className="cafe-account-options form-group desired-grade">
              <Label>Select Desired Grade</Label>
              <select
                name="desiredGrade"
                id="desiredGrade"
                value={this.state.desiredGrade}
                isOpen={this.state.schoolDropdownState}
                toggle={this.toggleSchoolDropdown}
                onChange={this.handleChange}
              >
                {gradesList}
              </select>
            </FormGroup>
          </Col>
          <br></br>
          <Col>
            <FormGroup className="cafe-account-options form-group old-password">
              <Label>Old Password</Label>
              <Input
                type="password"
                name="oldPassword"
                id="oldPassword"
                placeholder="********"
                value={this.state.oldPassword}
                onChange={this.handleChange}
              />
            </FormGroup>
          </Col>
          <br></br>
          <Col>
            <FormGroup className="cafe-account-options form-group new-password">
              <Label>New Password</Label>
              <Input
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="********"
                value={this.state.newPassword}
                onChange={this.handleChange}
              />
            </FormGroup>
          </Col>
          <br></br>
          <Col>
            <FormGroup className="cafe-account-options form-group confirm-password">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="********"
                value={this.state.confirmPassword}
                onChange={this.handleChange}
              />
            </FormGroup>
          </Col>
          <br></br>
          <Col>
            <Button block type="submit" disabled={!this.validateForm()}>Update Account</Button>
          </Col>
          <Col>
            <br></br>
          </Col>
        </Form>
      </Container>
    );
  }
}

export default Account;
