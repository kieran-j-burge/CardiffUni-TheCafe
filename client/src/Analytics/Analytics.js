import React from "react";
import axios from "axios";

import SkillsRatingGraph from "./SkillsRatingGraph";
import SkillsTimeGraph from "./SkillsTimeGraph";
import Container from "../layout/Container";
import Header from "../layout/Header";
import Content from "../layout/Content";
import Skills from "../pages/skills/skills";
import { SizePerPageDropdownStandalone } from "react-bootstrap-table2-paginator";

class Analytics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data,
      xAxis: props.xAxis,
      yAxis: props.yAxis
    };
  }

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
    console.log("DATA");
    console.log(this.state.data);
  }

  render() {
    return (
      <Container>
        <Header pageName="Analytics" />
        <Content>
          <div className="analytics">
            <Skills />

            <div className="box">
              <SkillsRatingGraph
                xAxis={this.props.xAxis}
                yAxis={this.props.yAxis}
              />
              <div>
                <SkillsTimeGraph data={this.props.data} />

                <SkillsRatingGraph
                  xAxis={this.props.skillName}
                  yAxis={this.props.latestRatingChange}
                />
              </div>
            </div>
          </div>
        </Content>
      </Container>
    );
  }
}
/*
const Analytics = props => {
  return (


    <Container>
      <Header pageName="Analytics" />
      <Content>
        <div className="analytics">
        <Skills />
          <div className="box">
            <SkillsTimeGraph data={props.data} />
          </div>
          <div className="box">
            <SkillsRatingGraph xAxis={props.xAxis} yAxis={props.yAxis} />
                <div>
      <SkillsTimeGraph
        data={props.data}
      />

        <SkillsRatingGraph xAxis={props.skillName} yAxis={props.latestRatingChange} />
    </div>

          </div>
        </div>
      </Content>
    </Container>

  );
};
*/

export default Analytics;
