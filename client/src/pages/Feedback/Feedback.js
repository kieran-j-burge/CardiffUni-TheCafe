import React, { Component } from "react";
import Container from "../../layout/Container";
import Header from "../../layout/Header";
import Content from "../../layout/Content";
import axios from "axios";
import Table from "./Table";

const compare = (a, b) => {
  if (a.length > b.length) {
    return -1;
  } else {
    return 1;
  }
};

class Feedback extends Component {
  state = {
    groupedFeedback: []
  };

  componentDidMount() {
    // this.getFeedback();
    // this.getSkills();
  }


  getSkills = () => {
    axios
      .get("/api/skills/get")
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
  };

  getFeedback = () => {
    axios
      .get("/api/feedback/fetch-all")
      .then(res => {
        this.setState({
          groupedFeedback: this.makeObject(res.data)
        });
      })
      .catch(error => console.log(error));
  };

  makeObject(list) {
    const sortedCategories = [];
    const arr = [];
    list.forEach(obj => {
      let added = false;
      sortedCategories.forEach(skill => {
        if (skill[0].skill === obj.skill) {
          added = true;
          skill.push(obj);
        }
      });
      if (!added) {
        sortedCategories.push([obj]);
      }
    });
    sortedCategories.sort(compare);
    return sortedCategories;
    // loop through the list
    // for each item check if the item key exists in the object
    // if it does then add the item into the array for the object key
    // else create a new key wiht the item skill and add it in there
  }

  render() {
    return (
      <Container>
        <Header pageName="Feedback" />
        <Content>
          <div className="feedback-div">
            {this.state.groupedFeedback.map((data, index) => {
              return (
                <div className="feedback-cat box">
                  <Table list={data} />
                </div>
              );
            })}
          </div>
        </Content>
      </Container>
    );
  }
}

export default Feedback;
