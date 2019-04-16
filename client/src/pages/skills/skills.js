import React, { Component } from "react";
import Container from "../../layout/Container";
import Header from "../../layout/Header";
import Content from "../../layout/Content";
import axios from "axios";
import Table from "./Table";

const comparePos = (a, b) => {
  if (a.rating > b.rating) {
    return -1;
  } else {
    return 1;
  }
};

const compareNeg = (a, b) => {
  if (a.rating > b.rating) {
    return 1;
  } else {
    return -1;
  }
};

class skills extends Component {
  state = {
    feedback: [],
    positiveSkills: [],
    negativeSkills: [],
    currentStudent: localStorage.getItem("studentId")
  };

  componentDidMount() {
    this.getSkills();
  }

  getSkills = () => {
    let userId = this.state.currentStudent;
    axios
      .post("/api/module/get/skills/user", { userId })
      .then(res => {
        this.setState({
          feedback: this.organiseData(res.data)
        });
      })
      .catch(err => console.log(err));
  };

  organiseData = feedback => {
    const sortedData = [];
    let obj = {};

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
    this.splitData(sortedData);
  };

  splitData = data => {
    let plus = [];
    let minus = [];

    data.forEach(skill => {
      if (skill[0].rating >= 0) {
        plus.push(skill[0]);
      } else {
        minus.push(skill[0]);
      }
    });

    this.setState({
      positiveSkills: plus.sort(comparePos),
      negativeSkills: minus.sort(compareNeg)
    });
  };

  render() {
    return (
      <div className="skills-div">
        <Table
          plus={this.state.positiveSkills}
          minus={this.state.negativeSkills}
        />
      </div>
    );
  }
}

export default skills;
