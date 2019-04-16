import React, { Component } from "react";
import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  FormText,
  Row,
  Col
} from "reactstrap";
import SkillsTimeGraph from "../../Analytics/SkillsTimeGraph";
import Plot from "react-plotly.js";
import axios from "axios";
import ReactChartkick, { PieChart } from "react-chartkick";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class DashboardGraphs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skills: [],
      skillRatings: [],

      ratingChange: [],
      date: [],
      ratingSum: [],
      skillsTimeData: [],

      graphWidth: 300,

      isHidden: true,

      graphsNeedReSizing: 1,
      currentStudent: localStorage.getItem("studentId")
    };
    this.getSkillData = this.getSkillData.bind(this);
    this.reSizeGraphs = this.reSizeGraphs.bind(this);
    this.getGraphSize = this.getGraphSize.bind(this);
  }
  componentDidMount() {
    this.getSkillData();
    this.getGraphSize();
    this.interval = setInterval(() => this.reSizeGraphs(), 1000);
  }

  getSkillData = () => {
    axios
      .get("/api/module/skills/" + this.state.currentStudent)
      .then(response => {
        let ratingChange = [];
        let date = [];
        let skill = [];
        let uniqueSkills;
        this.organiseData(response.data);
        let skillData = response.data;

        skillData.forEach(data => {
          if (data["skill"]) {
            skill.push(data.skill.name);
            uniqueSkills = [...new Set(skill)];
          }
        });

        uniqueSkills.forEach(skill => {
          ratingChange.push([]);
          date.push([]);
        });

        skillData.forEach(data => {
          if (data["skill"]) {
            ratingChange[uniqueSkills.indexOf(data.skill.name)].push(
              data.rating
            );
            date[uniqueSkills.indexOf(data.skill.name)].push(data.date);
          }
        });

        let ratingSum = ratingChange.map(change =>
          change.map((sum => variance => (sum += variance))(0))
        );

        this.setState({
          ratingChange: ratingChange,
          date: date,
          ratingSum: ratingSum
        });
        this.getSkillsVsTimeData();
      })
      .catch(error => console.log(error));
  };

  organiseData = feedback => {
    const sortedData = [];
    let obj = {};
    let skills = [];
    let skillRatings = [];

    feedback.forEach(record => {
      let added = false;
      if (record["skill"]) {
        sortedData.forEach(skill => {
          if (skill[0].skill === record.skill.name) {
            added = true;
            skill[0].rating = skill[0].rating + record.rating;
          }
        });
        if (!added) {
          obj = {
            skill: record.skill.name,
            rating: record.rating
          };
          sortedData.push([obj]);
        }
      }
    });
    sortedData.forEach(skillSummary => {
      skillSummary.forEach(summary => {
        skills.push(summary.skill);
        skillRatings.push(summary.rating);
        this.setState({
          skills: skills,
          skillRatings: skillRatings
        });
      });
    });
  };

  getSkillsVsTimeData = () => {
    let skillsTimeData = [];
    this.state.skills.forEach(skill => {
      let i = this.state.skills.indexOf(skill);
      let trace = {
        x: this.state.date[i],
        y: this.state.ratingSum[i],
        mode: "lines+points",
        name: skill
      };

      skillsTimeData.push(trace);
    });
    this.setState({
      skillsTimeData: skillsTimeData
    });
  };

  getGraphSize = () => {
    var halfScreen =
      document.getElementById("PlotlyReSize").getBoundingClientRect().width -
      100;
    this.setState({
      graphWidth: halfScreen
    });
  };

  reSizeGraphs = () => {
    if (this.state.graphsNeedReSizing == 1) {
      this.setState({
        graphsNeedReSizing: 0
      });
    }
  };

  //Calculate pie chart

  render() {
    return (
      <Row id="DashboardGraphContainer">
        <Col id="PlotlyReSize" sm={{ size: 6, order: 2 }}>
          <Plot
            layout={{
              width: this.state.graphWidth,
              title: "Skills Graph",
              responsive: true
            }}
            data={this.state.skillsTimeData}
          />
        </Col>
        <Col className="graph-split-left" sm={{ size: 6, order: 2 }}>
          <PieChart
            id="DashboardPieChart"
            data={[
              [
                "Mark Lost: " +
                  (this.props.marksLostDone + this.props.marksLostDoing) +
                  "%",
                this.props.marksLostDone + this.props.marksLostDoing
              ],
              [
                "Mark Available: " +
                  (100 -
                    (this.props.marksLostDone +
                      this.props.marksLostDoing +
                      this.props.totalScore)) +
                  "%",
                100 -
                  (this.props.marksLostDone +
                    this.props.marksLostDoing +
                    this.props.totalScore)
              ],
              [
                "Current Grade: " + this.props.totalScore + "%",
                this.props.totalScore
              ]
            ]}
            colors={["#FF7F50", "#00FFFF", "#4BB543"]}
          />
        </Col>
      </Row>
    );
  }
}

export default DashboardGraphs;
