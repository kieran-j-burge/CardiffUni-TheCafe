import React, { Component } from "react";
import { Button, Card, CardTitle, CardText, Col, Form, FormGroup, Input, Label } from "reactstrap";
import axios from "axios";

import Container from "../layout/Container";
import schools from "../config/schools";

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      college: "",
      school: "",
      desiredGrade: "",
      newPassword: "",
      confirmPassword: "",
      language: "english",
      dropdownOpenByDefault: false,
      collegeDropdownState: false,
      schoolDropdownState: false,
      desiredGradeDropdownState: false,
      passwordUppercase: false,
      passwordLowercase: false,
      passwordNumeric: false,
      passwordSymbols: false,
      passwordLongEnough: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.goToLogin = this.goToLogin.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  validateForm() {
    return this.state.email.length > 0
      && this.state.newPassword.length > 0
      && this.state.confirmPassword.length > 0
      && this.state.newPassword === this.state.confirmPassword
      && this.state.school !== ""
      && this.state.desiredGrade !== ""
      && this.state.language !== "";
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value,
    });

    if (event.target.id === "newPassword") {
      this.setState({
        passwordLongEnough: event.target.value.length >= 10,
        passwordUppercase:  event.target.value.match("[A-Z]") !== null,
        passwordLowercase:  event.target.value.match("[a-z]") !== null,
        passwordNumeric:    event.target.value.match("[0-9]") !== null,
        passwordSymbols:    event.target.value.match(/[-!£$%^&*()_+|~=#`{}\[\]:";'<>?,.\/]/) !== null
      })
    }
  };

  resize() { }

  handleSubmit = event => {
    event.preventDefault();

    // left in for debugging purposes
    //console.log(this.state.username);
    //console.log(this.state.password);

    axios.post("/api/student/register", this.state)
      .then(resp => {
        this.props.history.push("/login");
      })
      .catch(err => alert(err.response.data.message || "unable to complete registration process, try again later"));
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

  goToLogin(e) {
    e.preventDefault();
    console.log("VVVV");
    window.location.href = "/login";
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
      <Container className="cafe-register">
        <Form className="cafe-register form" onSubmit={this.handleSubmit} style={ { float: "left" } }>
          <br></br>
          <Col>
            <h2 style={{float: "left"}}>Register</h2>
            <Button type={"button"} onClick={this.goToLogin} style={{float: "right"}}>Go Back To Login</Button>
          </Col>
          <br></br>
          <br></br>
          <br></br>
          <Col>
            <FormGroup className="cafe-register form-group name">
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
            <FormGroup className="cafe-register form-group email">
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
            <FormGroup className="cafe-register form-group language">
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
            <FormGroup className="cafe-register form-group school">
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
            <FormGroup className="cafe-register form-group desired-grade">
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
            <FormGroup className="cafe-register form-group new-password">
              <Label>Password</Label>
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
            <FormGroup className="cafe-register form-group confirm-password">
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
            <Card className="cafe-register card new-password">
              <CardTitle><b>Password Rules</b></CardTitle>
              <CardText>
                  <div style={this.state.passwordLongEnough ? { backgroundColor: "#399633" } : { backgroundColor: "#f44242" }}><b style={{ color: "white" }}>Must contain at least 10 characters.</b></div>
                  <div style={this.state.passwordUppercase  ? { backgroundColor: "#399633" } : { backgroundColor: "#f44242" }}><b style={{ color: "white" }}>Must contain at least 1 UPPERCASE character.</b></div>
                  <div style={this.state.passwordLowercase  ? { backgroundColor: "#399633" } : { backgroundColor: "#f44242" }}><b style={{ color: "white" }}>Must contain at least 1 lowercase character.</b></div>
                  <div style={this.state.passwordNumeric    ? { backgroundColor: "#399633" } : { backgroundColor: "#f44242" }}><b style={{ color: "white" }}>Must contain at least 1 numeric digit (0 - 9).</b></div>
                  <div style={this.state.passwordSymbols    ? { backgroundColor: "#399633" } : { backgroundColor: "#f44242" }}><b style={{ color: "white" }}>Must contain at least 1 symbol (! % # + _ ?).</b></div>
                  <div style={this.state.newPassword.length >= 10 && this.state.newPassword === this.state.confirmPassword ? { backgroundColor: "#399633" } : { backgroundColor: "#f44242" }}><b style={{ color: "white" }}>'Password' and 'Confirm Password' must be the same.</b></div>
              </CardText>
            </Card>
          </Col>
          <br></br>
          <Col>
            <Button block type="submit" disabled={!this.validateForm()}>Register</Button>
          </Col>
          <Col>
            <br></br>
          </Col>
        </Form>
      </Container>
    );
  }
}

export default Register;
