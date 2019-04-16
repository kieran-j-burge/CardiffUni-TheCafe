import React, { Component } from "react";
import PropTypes from "prop-types";

import Container from "../layout/Container";
import Header from "../layout/Header";
import Content from "../layout/Content";

import axios from "axios";

class Home extends Component {
  constructor(props) {
    super(props);

    this.isLoggedIn.bind(this);
  }

  static contextTypes = {
    router: PropTypes.object
  };

  isLoggedIn() {
    console.log("hello");
    let loginToken = localStorage.getItem("loginToken");
    let studentId = localStorage.getItem("studentId");

    if (typeof loginToken !== "undefined" && loginToken !== null) {
      return axios.get(`/api/student/validate/${studentId}/${loginToken}`);
    } else {
      return new Promise((resolve, reject) => {
        reject();
      });
    }
  }

  componentWillMount() {
    this.isLoggedIn()
      .then(resp => console.log("is logged in"))
      .catch(err => {
        console.log(err);
        localStorage.clear();
        this.context.router.history.push("/login");
      });
  }

  render() {
    return (
      <Container>
        <Header pageName="Home" />
        <FontAwesomeIcon icon="mug-hot" className="icon" />

        <Content />
      </Container>
    );
  }
}

export default Home;
