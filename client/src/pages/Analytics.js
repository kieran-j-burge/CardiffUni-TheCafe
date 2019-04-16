import React, { Component } from "react";
import Container from "../layout/Container";
import Header from "../layout/Header";
import Content from "../layout/Content";
import ReactChartkick, { LineChart, ColumnChart } from "react-chartkick";
import Highcharts from "highcharts";
import axios from "axios";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";

ReactChartkick.addAdapter(Highcharts);

class Analytics extends Component {
  static jsfiddleUrl = "https://jsfiddle.net/alidingling/6ebcxbx4/";

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
  }

  render() {
    const data = [
      { name: "Module1", data: { "1st": 0, "2nd": 100, "3rd": 45 } }
    ];

    const data2 = [
      {
        subject: "Math",
        A: 70
      },
      {
        subject: "English",
        A: 86
      },
      {
        subject: "Geography",
        A: 99
      },
      {
        subject: "Physics",
        A: 85
      },
      {
        subject: "History",
        A: 65
      }
    ];

    const series = [
      {
        name: "Moudle1",
        data: { "1st-Semester": 50, "2nd-Semester": 70 }
      },
      {
        name: "Moudle2",
        data: { "1st-Semester": 56, "2nd-Semester": 40 }
      },
      {
        name: "Moudle3",
        data: { "1st-Semester": 77, "2nd-Semester": 54 }
      }
    ];

    return (
      <Container>
        <Header pageName="Analytics" />
        <Content>
          <RadarChart
            cx={300}
            cy={250}
            outerRadius={150}
            width={500}
            height={500}
            data={data2}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar
              name="Mike"
              dataKey="A"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </RadarChart>
          <LineChart
            stacked={true}
            messages={{ empty: "No data" }}
            data={data}
            xtitle="Date"
            ytitle="Grades"
            discrete={false}
            curve={false}
            legend="bottom"
            library={{ backgroundColor: "#343a40" }}
            dataset={{ borderWidth: 10 }}
            download={true}
          />
          <br />
          <ColumnChart discrete={true} data={series} library={{}} />
        </Content>
      </Container>
    );
  }
}

export default Analytics;
