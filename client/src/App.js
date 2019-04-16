import React, { Component } from "react";
import Navbar from "./layout/AppNavBar";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import axios from "axios";
import AddFeedback from "./pages/AddFeedback/AddFeedback";
import ActionPlan from "./pages/ActionPlan/ActionPlan";
import ViewActionPlan from "./pages/ActionPlan/ViewActionPlan";
import Admin from "./pages/Admin/Admin";
import AdminLogin from "./pages/Admin/AdminLogin";
import Calendar from "./pages/Calendar/CalendarDisplay";
import GradeTracker from "./pages/GradeTracker";
import GradeCalculator from "./pages/GradeCalculator";
import Resources from "./Resources/Table";
import Analytics from "./Analytics/Analytics";
import Graphs from "./pages/Analytics";
import Account from "./pages/Account";
import Dashboard from "./Dashboard/Dashboard";
import SkillsOverview from "./SkillsOverview/SkillsOverview";
import Login from "./Login/Login";
import Register from "./pages/Register";
// import Skills from "./pages/skills/skills";
import Feedback from "./pages/Feedback/Feedback";
import EditResources from "./pages/Admin/EditResources";
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skills: [],
      skillRatings: [],
        modules: [],
      ratingChange: [],
        latestRatingChange: [],
        latestRatingChangeDate: [],
      date: [],
      ratingSum: [],
      skillsTimeData: [],

      sortedSkills: [],

      isHidden: true,
      currentStudent: localStorage.getItem("studentId"),
      display: localStorage.getItem("loginToken") !== null
    };

    this.checkNav = this.checkNav.bind(this);
    this.toggle = this.toggle.bind(this);
    window.addEventListener("resize", this.checkNav);
  }

  componentDidMount() {
    this.checkNav();
    this.getSkillData();
    this.getModules();
  }

  // redirect(nextState, replacePathFunc, pathToReplace) {
  //   this.getCurrentStudentFeedback();
  //   this.getCurrentStudentGrades();
  // }

  // ...................................................
  // This is the code for rendering the skills graph which shows the summary of skills and their ratings

  getModules = () => {
      axios
          .get("/api/module/get")
          .then(response => {

            this.setState({modules: response.data});
              console.log(this.state.modules);
              this.getModuleData()
          })
          .catch(error => console.log(error));
  };

  getModuleData = () => {
      let moduleFeedback = [];
      let modules;

      this.state.modules.forEach(module => {
          module.assessments.map(assessment =>{
              assessment.feedback.map(feedback =>{
                  moduleFeedback.push({"name":module.name, "feedbackComment":feedback.comment})
              })
          })

      });
      console.log(moduleFeedback)
    };



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

      this.getLatestRatingChange()


    let skillRatings = {};
    this.state.skills.forEach(
      (key, i) => (skillRatings[key] = this.state.skillRatings[i])
    );

    let sortedSkills = Object.keys(skillRatings).sort((a, b) => {
      return skillRatings[a] - skillRatings[b];
    });
    this.setState({
      sortedSkills: sortedSkills
    });

  };



  getLatestRatingChange = () => {
      let latestRatingChange = [];
      let latestRatingChangeDate = [];
      let latestSkillsDate =[]
    this.state.ratingChange.forEach(change =>{
        latestRatingChange.push(change.slice(-1)[0])
    })
      this.state.date.forEach(day => {
        latestRatingChangeDate.push(day.slice(-1)[0])
      })

      this.state.skills.forEach(skill => {
          latestSkillsDate.push(skill + " " + latestRatingChangeDate[this.state.skills.indexOf(skill)])
      })

      this.setState({
          latestRatingChange: latestRatingChange,
          latestRatingChangeDate: latestSkillsDate
      })
  }

  // ...................................................

  static redirect(nextState, replacePathFunc, pathToReplace) {
    replacePathFunc({
      pathname: pathToReplace,
      state: {
        nextPathname: nextState.location.pathname
      }
    });
  }

  checkNav(e) {
    if (window.innerWidth > 1000 && this.state.isHidden) {
      this.setState({
        isHidden: false
      });
    }
    if (window.innerWidth < 1000) {
      this.setState({
        isHidden: true
      });
    }
  }

  toggle() {
    this.setState({
      isHidden: !this.state.isHidden
    });
  }

  displayNav = value => {
    this.setState({
      display: value
    })
  };

  render() {
    return (
      <Router>
      
        <div className="app">
        <NotificationContainer/>
          <div className="overlay" />
          <Route
              path="/admin/page"
              component={Admin}
              onEnter={this.auth}
            />
            <Route
              path="/admin/edit/resources"
              component={EditResources}
              onEnter={this.auth}
            />
            <div className="admin">
                      <Route
              path="/admin/login"
              component={AdminLogin}
              onEnter={this.auth}
            />
            </div>
          <Navbar
            resize={this.state.isHidden}
            toggle={this.toggle}
            display={this.state.display}
            checker={this.displayNav}
          />
          <div className={"main" + (this.state.isHidden ? " shrink" : " ")}>
            <Route
              exact
              path="/register"
              component={Register}
              onEnter={this.isLoggedIn}
            />
            <Route
              exact
              path="/login"
              render={props => <Login {...props} checker={this.displayNav} />}
            />
            <Route
              exact
              path="/"
              render={props => (
                <Dashboard
                  {...props}
                  bestSkill={this.state.highestRatedSkill}
                  bestSkillRating={this.state.highestSkillRating}
                  data={this.state.skillsTimeData}
                />
              )}
            />
            <Route
              path="/feedback/view"
              component={Feedback}
              onEnter={this.auth}
            />
            {/* <Route path="/skills/view" component={Skills} /> */}
            <Route
              path="/feedback/add"
              component={AddFeedback}
              onEnter={this.auth}
            />
            <Route
              path="/actionplan"
              component={ActionPlan}
              onEnter={this.auth}
            />
            <Route
              path="/view/actionplan"
              component={ViewActionPlan}
              onEnter={this.auth}
            />
            <Route
              path="/view/calendar"
              component={Calendar}
              onEnter={this.auth}
            />



            <Route
              path="/gradetrack"
              component={GradeTracker}
              onEnter={this.auth}
            />
            <Route
              path="/gradecalc"
              component={GradeCalculator}
              onEnter={this.auth}
            />
            <Route
              path="/resources"
              onEnter={this.auth}
              render={props => (
                <Resources {...props} skillsAsc={this.state.sortedSkills} />
              )}
            />
            <Route exact path="/account" component={Account} />
            <Route
              path="/analytics"
              render={props => (
                <Analytics
                  {...props}
                  xAxis={this.state.skills}
                  yAxis={this.state.skillRatings}
                  data={this.state.skillsTimeData}
                  skillName={this.state.latestRatingChangeDate}
                  latestRatingChange={this.state.latestRatingChange}
                />
              )}
            />
          </div>
        </div>
      </Router>
    );
  }
}
