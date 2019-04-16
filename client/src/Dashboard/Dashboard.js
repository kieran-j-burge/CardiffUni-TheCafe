import React, { Component } from "react";
import ModuleCard from "./ModuleCard/ModuleCard";
import { Container, Row, Col } from "reactstrap";
import ModuleCardMobile from "./ModuleCardMobile/ModuleCardMobile";
import Header from "../layout/Header";
import Content from "../layout/Content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddFeedbackShortcut from "./AddFeedbackShortcut/AddFeedbackShortcut";
import DashboardGraphs from "./DashboardGraphs/DashboardGraphs";
import DashboardProgressBar from "./DashboardProgressBar/DashboardProgressBar";
import ModuleOverviews from "./ModuleOverviews/ModuleOverviews";

import firstImg from "../1st.png";

import axios from "axios";
import PropTypes from "prop-types";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStudent: localStorage.getItem("studentId"),
      modDoneScore: 0,
      marksLostDone: 0,
      totalScore: 0
    };

    this.getGradeData = this.getGradeData.bind(this);
    this.getModDoingScore = this.getModDoingScore.bind(this);
    this.isLoggedIn.bind(this);
  }

  static contextTypes = {
    router: PropTypes.object
  };

  isLoggedIn() {
    let loginToken = localStorage.getItem("loginToken");
    if (typeof loginToken !== "undefined" && loginToken !== null) {
      let studentId = localStorage.getItem("studentId");
      return axios.get(`/api/student/validate/${studentId}/${loginToken}`);
    } else {
      return new Promise((resolve, reject) => {
        reject();
      });
    }
  }

  componentWillMount() {
    this.isLoggedIn()
      .then()
      .catch(err => {
        console.log(err);
        window.location.href = "/login";
      });
    this.getGradeData();
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));

    this.resize();
  }

  resize() {
    let isModuleCompiled = window.innerWidth <= 575;
    if (isModuleCompiled !== this.state.compileModules) {
      this.setState({ compileModules: isModuleCompiled });
    }
  }

  getGradeData() {
    var totalScore = 0;
    var marksLost = 0;
    var marksAvailable = 0;
    var contributionLeft = 0;
    var percentageGained = 0;

    axios
      .get(
        "/api/simsModule/get-student-modules-done/" + this.state.currentStudent
      )
      .then(res => {
        console.log(res.data);
        var self = this;
        res.data.forEach(function(mod) {
          var modScore = 0;
          mod.assignments.forEach(function(assignment) {
            modScore = modScore + assignment.score * (assignment.weight / 100);
          });
          percentageGained = percentageGained + (modScore * mod.weight) / 100;
          totalScore = totalScore + (modScore * mod.weight) / 100;
          marksLost = marksLost + (100 - modScore) * (mod.weight / 100);
        });

        this.setState(
          {
            modDoneScore: totalScore,
            marksLostDone: marksLost
          },
          () => {
            this.getModDoingScore();
          }
        );
      })
      .catch(error => console.log(error));
  }

  getModDoingScore() {
    var totalScore = 0;
    var marksLost = 0;
    var marksAvailable = 0;
    var contributionLeft = 0;
    var percentageGained = 0;
    axios
      .get(
        "/api/simsModule/get-student-modules-doing/" + this.state.currentStudent
      )
      .then(res => {
        res.data.forEach(function(mod) {
          console.log(mod);
          var modScore = 0;
          mod.assignments.forEach(function(assignment) {
            if (assignment.score == "awaiting") {
            } else {
              modScore =
                modScore + assignment.score * (assignment.weight / 100);
              marksLost = marksLost + (100 - modScore) * (mod.weight / 100);
            }
          });
          percentageGained = percentageGained + (modScore * mod.weight) / 100;
          totalScore = totalScore + (modScore * mod.weight) / 100;
        });
        this.setState(
          {
            totalScore: totalScore + this.state.modDoneScore,
            marksLostDoing: marksLost
          },
          () => {}
        );
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <Container>
        <Header pageName="Dashboard" />
        <Content>
          <Row id="ProgressBarContainer">
            <Col sm={{ size: 10, order: 2 }}>
              <DashboardProgressBar totalScore={this.state.totalScore} />
            </Col>
            <Col sm={{ size: 2, order: 2 }}>
              <img className="center-img-v" id="gradeImg" src={firstImg} />
            </Col>
          </Row>
          <AddFeedbackShortcut />

          <DashboardGraphs
            marksLostDoing={this.state.marksLostDoing}
            marksLostDone={this.state.marksLostDone}
            totalScore={this.state.totalScore}
          />

          <ModuleOverviews />
        </Content>
      </Container>
    );
  }
}

export default Dashboard;
