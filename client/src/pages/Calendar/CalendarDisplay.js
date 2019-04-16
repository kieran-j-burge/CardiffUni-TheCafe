import React, { Component } from "react";
import Container from "../../layout/Container";
import Header from "../../layout/Header";
import Content from "../../layout/Content";
import axios from "axios";
import { Calendar, Badge } from "antd";
import moment from "moment";
import {Link} from "react-router-dom";


class CalendarDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: true,
      actionplans: [],
      currentStudent: localStorage.getItem("studentId")
    };
  }

  componentWillMount() {
    this.setState({
      loading: true
    })
    this.getActionPlans();
    this.forceUpdate();
  }

  getActionPlans = () => {
    
    axios
      .get("/api/actionPlan/get/" + this.state.currentStudent)
      .then(res => {
        console.log(res.data);
        if(res.data.length == 0){
          this.setState({
            isEmpty:true
          });
        }
        else{
          this.setState({
            actionplans: res.data,
            loading: false
          });
        }

      })
      .catch(error => console.log(error));
  };
  // this method is being called for every cell in the calendar with a date value
  // find all the date that equals the due date in the action plan and add that as an object
  // with type and content that contain the skill name for that action plan.
  getListData = value => {
    let listData = [];

    this.state.actionplans.map(actionPlan => {
      if (
        moment(actionPlan.dueDate).format("YYYY-MM-DD") ===
        value.format("YYYY-MM-DD")
      ) {
        var day = new Date();
        var todayDate = moment(day);

        if (moment.duration(value.diff(todayDate)).format("D") > 5) {
          listData.push({
            type: "success",
            content: "Deadline for " + actionPlan.skillName
          });
        } else if (moment.duration(value.diff(todayDate)).format("D") >= 3) {
          listData.push({
            type: "warning",
            content: "Deadline for " + actionPlan.skillName
          });
        } else if (moment.duration(value.diff(todayDate)).format("D") < 3) {
          listData.push({
            type: "error",
            content: "Deadline for " + actionPlan.skillName
          });
        }
      }
    });

    return listData || [];
  };
  // this method is being called the same number as the cells in the calendar
  // then it pass it value to the method above to get the data and display them.
  dateCellRender = value => {
    const listData = this.getListData(value);

    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };
  // this method is used when the year filter is clicked, which would display all the months
  // and it would get all the action plans that has a due date in 1 month and display how many
  // action plnas is there for a month.
  getMonthData = value => {
    var list = [];
    var x = 0;
    var date = null;
    this.state.actionplans.map(actionPlan => {
      var actionDate = moment(actionPlan.dueDate);

      if (value.year() === actionDate.year()) {
        console.log("same Year");
        if (value.month() === actionDate.month()) {
          list.push(actionDate.month());
        }
      }
    });

    if (value.month() === list[0]) {
      return list.length;
    }
  };

  // this method call the method above to get values for the monthly displayed.
  monthCellRender = value => {
    const num = this.getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Action Plans</span>
      </div>
    ) : null;
  };


  
  render() {


    let data;
    if(this.state.isEmpty){
      data = 
        <div>
        <h5>There are no Action Plans, Click on the button to create Action plans</h5>
        <Link to="/actionplan" className="btn btn-primary" >  Add ActionPLan </Link>
        </div>
      
    }
    
    else if (this.state.loading) {
      data = (
        <div className="gifContainer">
          <img src={require("../ActionPlan/image/Loading2.gif")} className="loadingGif" alt="Loading" />
        </div>
      );
    } else {
      data = (
        <div>

<Calendar
              dateCellRender={this.dateCellRender}
              monthCellRender={this.monthCellRender}
            />
        </div>
      );
    }

    return (
      <Container>
        <Header pageName="Calendar" />
        <Content>
          {data}
          {/* {this.state.actionplans.length > 0 ? (

          ) : null} */}
        </Content>
      </Container>
    );
  }
}
export default CalendarDisplay;
