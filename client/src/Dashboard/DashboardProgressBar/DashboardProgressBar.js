import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Progress } from "reactstrap";
import axios from "axios";

class DashboardProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStudent: localStorage.getItem("studentId"),
      desiredGrade: null,
      gradeBoundary: null,
      gradeFormat: null,
      totalScore: this.props.progress
    };
  }

  componentWillMount() {
    this.getStudentGrade();
  }

  getStudentGrade = () => {
    axios
      .get("/api/student/fetch/" + this.state.currentStudent)
      .then(res => {
        var grade = res.data.desiredGrade;
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
        this.setState({
          desiredGrade: res.data.desiredGrade,
          gradeBoundary: gradeBoundary,
          gradeFormat: gradeFormat
        });
      })
      .catch(error => console.log(error));
  };

  render() {
    return (
      <Progress
        className="progress-lg"
        value={(this.props.totalScore / this.state.gradeBoundary) * 100}
      >
        {(this.props.totalScore / this.state.gradeBoundary) * 100} towards a{" "}
        {this.state.gradeFormat}
      </Progress>
    );
  }
}

export default DashboardProgressBar;
