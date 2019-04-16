import React, { Component } from "react";
import { Button, Container, Col, Form, FormGroup, Input, Label } from "reactstrap";
import PropTypes from "prop-types";
import axios from "axios";

import universitylogo from "../universitylogo.jpg";

Container.propTypes = {
    fluid: PropTypes.bool
};

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            usingMobileDevice: false,
            email: "",
            password: ""
        };
    }

    static contextTypes = {
        router: PropTypes.object
    }

    componentWillMount() {
        this.isLoggedIn()
            .then(resp => this.context.router.history.push("/"))
            .catch(err => {
                console.log("is not logged in");
                localStorage.clear();
            });
    }

    isLoggedIn() {
        let loginToken = localStorage.getItem("loginToken");
        let studentId = localStorage.getItem("studentId");

        if (typeof loginToken !== "undefined" && loginToken !== null) {
            return axios.get(`/api/student/validate/${studentId}/${loginToken}`);
        } else {
            return new Promise((resolve, reject) => {
                reject("No token.");
            });
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    openPopupbox(message) {
        // TODO replace alert function with react style popup system
        alert(message);
    }

    handleSubmit = event => {
        event.preventDefault();

        // left in for debugging purposes
        //console.log(this.state.username);
        //console.log(this.state.password);

        axios.post("/api/student/login", this.state)
            .then(resp => {
                localStorage.setItem("studentId", resp.data.student._id);
                localStorage.setItem("loginToken", resp.data.token);
                this.props.history.push("/");
                this.props.checker(true)
            })
            .catch(err => {
                console.log(err);
                this.openPopupbox(err.response.data.message || "unable to complete login, please try again later");
                this.props.checker(false)
            });
    };

    resize() {
        let isOnMobileDevice = window.innerWidth <= 600;

        if (isOnMobileDevice !== this.state.usingMobileDevice) {
            this.setState({ usingMobileDevice: isOnMobileDevice });
        }

        // debugging
        console.log(isOnMobileDevice);
    }

    render() {
        console.log(this.props)
        return (
            <Container className="cafe-login">
                <Form className="cafe-login form" onSubmit={this.handleSubmit} style={ { float: "left" } }>
                    <br></br>
                    <Col>
                        <h2>Login</h2>
                    </Col>
                    <Col>
                        <FormGroup className="cafe-login form-group username">
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
                        <FormGroup className="cafe-login form-group password">
                            <Label>Password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="********"
                                value={this.state.password}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </Col>
                    <br></br>
                    <Col>
                        <Button block type="submit" disabled={!this.validateForm()}>Login</Button>
                    </Col>
                    <Col>
                        <br></br>
                        <img className="App-logo" src={universitylogo} alt="Cardiff University Logo" />
                    </Col>
                    <br></br>
                    <Col>
                        <p>Don't have an account? <a href="/register">Sign up here!</a></p>
                    </Col>
                </Form>
            </Container>
        );
    }
}
