import React, { Component } from "react";
import ModuleCard from "../ModuleCard/ModuleCard";
import { Container, Row, Col } from "reactstrap";
import ModuleCardMobile from "../ModuleCardMobile/ModuleCardMobile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModuleTemplate from "../ModuleTemplate/ModuleTemplate";
import axios from "axios";

class ModuleOverviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStudent: localStorage.getItem("studentId"),
      moduleCodes: [],
      moduleData: [],
      moduleCardsUpdated: 0
    };
    this.getBestSkillForModule = this.getSkillsForModule.bind(this);
    this.getGradesForModule = this.getGradesForModule.bind(this);
    this.getActionPlans = this.getActionPlans.bind(this);
    this.getModuleCodes = this.getModuleCodes.bind(this);
    this.getModuleData = this.getModuleData.bind(this);
    this.getResources = this.getResources.bind(this);
  }

  componentWillMount() {
    this.getModuleCodes();
  }

  componentDidMount() {}

  componentDidUpdate() {}

  getModuleCodes() {
    var moduleCodes = [];
    axios
      .get("/api/actionPlan/get/" + this.state.currentStudent)
      .then(res => {
        res.data.forEach(function(actionPlan) {
          moduleCodes.indexOf(actionPlan.moduleCode) === -1
            ? moduleCodes.push(actionPlan.moduleCode)
            : console.log("Duplicate module code");
        });
        this.setState({ moduleCodes: moduleCodes }, () => {
          this.getModuleData();
        });
      })
      .catch(error => console.log(error));
  }

  getModuleData() {
    var moduleListJSONStr = "[]";
    var moduleListJSON = JSON.parse(moduleListJSONStr);
    var self = this;
    this.state.moduleCodes.forEach(function(code) {
      var actionPlansJSON = self.getActionPlans(code);
      var skillsJSON = self.getSkillsForModule(code);
      var assessmentJSON = self.getGradesForModule(code);

      //Add to JSON
      moduleListJSON.push({
        name: code,
        actionPlan: actionPlansJSON,
        skills: skillsJSON,
        assessments: assessmentJSON
      });
    });
    this.setState({ moduleData: moduleListJSON });
  }

  getActionPlans(code) {
    var actionPlanJSONStr = "[]";
    var actionPlanJSON = JSON.parse(actionPlanJSONStr);
    axios
      .get("/api/actionPlan/get/" + this.state.currentStudent + "/" + code)
      .then(res => {
        var self = this;
        res.data.forEach(function(actionPlan) {
          var resourcesJSON = self.getResources(actionPlan.resources);
          console.log("ACTION PLAN");
          console.log(actionPlan);
          actionPlanJSON.push({
            name: actionPlan.skillName,
            date: actionPlan.dueDate,
            note: actionPlan.note,
            resources: resourcesJSON
          });
        });
      })
      .catch(error => console.log(error));

    return actionPlanJSON;
  }

  getResources(ids) {
    var resourcesJSONStr = "[]";
    var resourcesJSON = JSON.parse(resourcesJSONStr);

    ids.forEach(function(id) {
      axios
        .get("/api/resources/fetchById/" + id)
        .then(res => {
          console.log("");
          resourcesJSON.push({
            name: res.data.name,
            link: res.data.link,
            skill: res.data.skill
          });
        })
        .catch(error => console.log(error));
    });

    return resourcesJSON;
  }

  getSkillsForModule(code) {
    var skillsJSON = JSON.parse("[]");

    var goodSkillsJSONStr = "[]";
    var goodSkillsJSON = JSON.parse(goodSkillsJSONStr);

    var badSkillsJSONStr = "[]";
    var badSkillsJSON = JSON.parse(badSkillsJSONStr);

    axios
      .get(
        "/api/module/get/modByModByStudent/" +
          code +
          "/" +
          this.state.currentStudent
      )
      .then(res => {
        var self = this;
        res.data[0].assessments.forEach(function(assessment) {
          var score = null;
          assessment.feedback.forEach(function(feedback) {
            if (
              feedback.userId == self.state.currentStudent &&
              feedback.rating == 1
            ) {
              goodSkillsJSON.push({
                name: feedback.comment,
                score: feedback.rating
              });
            } else if (
              feedback.userId == self.state.currentStudent &&
              feedback.rating == -1
            ) {
              badSkillsJSON.push({
                name: feedback.comment,
                score: feedback.rating
              });
            }
          });
        });
      })
      .catch(error => console.log(error));

    skillsJSON.push({
      good: goodSkillsJSON,
      bad: badSkillsJSON
    });

    return skillsJSON;
  }

  getWorstSkillForModule(code) {
    var worstSkillJSONStr = "[]";
    var worstSkillJSON = JSON.parse(worstSkillJSONStr);

    worstSkillJSON.push({
      name: "creativity",
      score: 3
    });

    return worstSkillJSON;
  }

  getGradesForModule(code) {
    var assessmentJSONStr = "[]";
    var assessmentJSON = JSON.parse(assessmentJSONStr);
    axios
      .get(
        "/api/module/get/modByModByStudent/" +
          code +
          "/" +
          this.state.currentStudent
      )
      .then(res => {
        var self = this;
        res.data[0].assessments.forEach(function(assessment) {
          var score = null;
          assessment.grades.forEach(function(grades) {
            if (grades.student_id == self.state.currentStudent) {
              assessmentJSON.push({
                name: assessment.name,
                score: grades.grade
              });
            } else {
            }
          });
        });
      })
      .catch(error => console.log(error));

    return assessmentJSON;
  }

  render() {
    const moduleData = this.state.moduleData;
    const moduleDataMap = moduleData.map(module => {
      return (
        <Col sm={{ size: 4 }}>
          <ModuleCard
            moduleName={module.name}
            actionPlans={module.actionPlan}
            skills={module.skills}
            assessments={module.assessments}
          />
        </Col>
      );
    });
    return <Row id="DashboardModules">{moduleDataMap}</Row>;
  }
}

export default ModuleOverviews;
