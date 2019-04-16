import React, { Component } from "react";
import Container from "../layout/Container";
import Header from "../layout/Header";
import Content from "../layout/Content";
import { Button } from "reactstrap";

import axios from "axios";

import YearInfo from "../layout/GradeCalculator/YearInfo";
import CurrentYearInfo from "../layout/GradeCalculator/CurrentYearInfo";
import CompletedModules from "../layout/GradeCalculator/CompletedModules";
import CurrentModules from "../layout/GradeCalculator/CurrentModules";
import FutureModules from "../layout/GradeCalculator/FutureModules";
import GradeData from "../layout/GradeCalculator/GradeData";

class GradeCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMark: null,
      desiredGrade: null,
      gradeBoundary: null,
      gradeFormat: null,
      marksAvailable: null,
      marksLost: null,
      avPercentNeeded: null,
      modulesDone: null,
      modulesDoing: null,
      needsUpdate: 0,
      currentStudent: localStorage.getItem("studentId")
    };
    this.calculateGrade = this.calculateGrade.bind(this);
    this.updateGradeData = this.updateGradeData.bind(this);
  }

  isLoggedIn() {
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

  getStudentGrade = () => {
    axios
      .get("/api/student/fetch/" + this.state.currentStudent)
      .then(res => {
        this.setState({
          desiredGrade: res.data.desiredGrade
        });
      })
      .catch(error => console.log(error));
  };

  getModulesDone = () => {
    axios
      .get(
        "/api/simsModule/get-student-modules-done/" + this.state.currentStudent
      )
      .then(res => {
        this.setState({
          modulesDone: res.data,
          needsUpdate: 1
        });
      })
      .catch(error => console.log(error));
  };

  getModulesDoing = () => {
    axios
      .get(
        "/api/simsModule/get-student-modules-doing/" + this.state.currentStudent
      )
      .then(res => {
        this.setState({
          modulesDoing: res.data,
          needsUpdate: 1
        });
      })
      .catch(error => console.log(error));
  };

  checkForUpdate = () => {
    if (this.state.needsUpdate == 1) {
      this.updateGradeData();
      this.setState({
        needsUpdate: 0
      });
    }
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

  componentDidMount() {
    this.getModulesDone();
    this.getModulesDoing();
    this.interval = setInterval(() => this.checkForUpdate(), 1);
  }

  componentWillMount() {
    this.isLoggedIn()
      .then()
      .catch(err => {
        console.log(err);
        window.location.href = "/login";
      });
    this.getStudentGrade();
  }

  updateGradeData() {
    var gradeData = this.calculateGrade();
    var grade = this.state.desiredGrade;
    var gradeBoundary = 0;
    var gradeFormat = null;
    switch (grade) {
      case "FIRST":
        gradeBoundary = 70;
        gradeFormat = "1st";
        break;
      case "TWO_ONE":
        gradeBoundary = 60;
        gradeFormat = "2:1";
        break;
      case "TWO_TWO":
        gradeBoundary = 50;
        gradeFormat = "2:2";
        break;
      case "THIRD":
        gradeBoundary = 40;
        gradeFormat = "3rd";
        break;
      default:
      // code block
    }

    var avPercentNeeded = ((gradeBoundary - gradeData[3]) / gradeData[4]) * 100;

    this.setState({
      currentMark: gradeData[0],
      marksAvailable: gradeData[1],
      marksLost: gradeData[2],
      gradeBoundary: gradeBoundary,
      gradeFormat: gradeFormat,
      avPercentNeeded: avPercentNeeded
    });
  }

  calculateGrade() {
    var totalScore = 0;
    var marksLost = 0;
    var marksAvailable = 0;
    var contributionLeft = 0;
    var percentageGained = 0;
    // CALCULATE COMPLETED MODULES
    var completedModules = document.getElementsByClassName(
      "completed-module-container"
    );

    for (var y = 0; y < completedModules.length; y++) {
      var score = completedModules[y].childNodes[3].innerHTML.replace("%", "");
      var weight = completedModules[y].childNodes[2].innerHTML.replace("%", "");
      percentageGained = percentageGained + (score * weight) / 100;
      totalScore = totalScore + score * (weight / 100);
      marksLost = marksLost + (100 - score) * (weight / 100);
    }
    // END OF CALCULATE COMPLETED MODULES
    // CALCULATE CURRENT MODULES
    var currentModules = document.getElementsByClassName(
      "current-module-container"
    );
    for (var i = 0; i < currentModules.length; i++) {
      var moduleTable = currentModules[i];
      var modWeight = moduleTable.childNodes[0].childNodes[0].childNodes[1].innerHTML.replace(
        "%",
        ""
      );
      var assignmentRows = moduleTable.childNodes[1].childNodes;
      var examScores = 0;
      var examScoresLost = 0;
      var examScoresAvailable = 0;
      for (y = 0; y < assignmentRows.length; y++) {
        var asWeight = assignmentRows[y].childNodes[1].innerHTML.replace(
          "%",
          ""
        );
        var asScore = assignmentRows[
          y
        ].childNodes[2].childNodes[0].value.replace("%", "");
        if (asScore === "") {
          asScore = 0;
          examScoresAvailable = examScoresAvailable + (100 * asWeight) / 100;
          contributionLeft = contributionLeft + (asWeight * modWeight) / 100;
        } else {
          percentageGained =
            percentageGained + (((asWeight * modWeight) / 100) * asScore) / 100;
          examScores = examScores + (asScore * asWeight) / 100;
          examScoresLost = examScoresLost + ((100 - asScore) * asWeight) / 100;
        }
      }
      totalScore = totalScore + examScores * (modWeight / 100);
      marksLost = marksLost + examScoresLost * (modWeight / 100);
      marksAvailable = marksAvailable + examScoresAvailable * (modWeight / 100);
    }
    // END OF CALCULATE CURRENT MODULES
    return [
      totalScore,
      marksAvailable,
      marksLost,
      percentageGained,
      contributionLeft
    ];
  }

  render() {
    return (
      <Container>
        <Header pageName="Grade Calculator" />
        <Content>
          <div className="calc">
            <div className="box">
              <GradeData
                currentMark={this.state.currentMark}
                desiredGrade={this.state.desiredGrade}
                gradeBoundary={this.state.gradeBoundary}
                gradeFormat={this.state.gradeFormat}
                marksAvailable={this.state.marksAvailable}
                marksLost={this.state.marksLost}
                avPercentNeeded={this.state.avPercentNeeded}
              />
            </div>
            <div className="box">
              <YearInfo />
            </div>
            <div className="box">
              <CurrentYearInfo />
              <CompletedModules modules={this.state.modulesDone} />
            </div>
            <div className="box">
              <CurrentModules modules={this.state.modulesDoing} />
              <FutureModules />
              <Button onClick={this.updateGradeData}>Calculate</Button>
            </div>
          </div>
        </Content>
      </Container>
    );
  }
}

export default GradeCalculator;
