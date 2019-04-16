import React, { Component } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  CardTitle,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { Spring } from "react-spring/renderprops";
import PropTypes from "prop-types";
import ModuleCardMobile from "../ModuleCardMobile/ModuleCardMobile";
import { Link } from "react-router-dom";
import SkillsSummary from "../SkillsSummary/SkillsSummary";
import ActionPlanTemplate from "./ActionPlanTemplate";

const hoverStyling = {
  "background-color": "#E8E8E8",
  cursor: "pointer"
};

class ModuleCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardHovered: false,
      planHovered: false,
      skillHovered: false,
      gradeHovered: false,
      skillsModal: false,
      moduleName: null,
      name: "test"
    };

    this.toggleSkillsModal = this.toggleSkillsModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      moduleName: nextProps
    });
  }

  toggleSkillsModal = () => {
    this.setState(prevState => ({
      skillsModal: !prevState.skillsModal
    }));
  };

  setCardHover = () => this.setState({ cardHovered: true });
  cancelCardHover = () => this.setState({ cardHovered: false });

  setPlanHover = () => this.setState({ planHovered: true });
  cancelPlanHover = () => this.setState({ planHovered: false });

  setSkillHover = () => this.setState({ skillHovered: true });
  cancelSkillHover = () => this.setState({ skillHovered: false });

  setGradeHover = () => this.setState({ gradeHovered: true });
  cancelGradeHover = () => this.setState({ gradeHovered: false });

  render() {
    let planHoveredCSS;
    if (this.state.planHovered) {
      planHoveredCSS = hoverStyling;
    }

    let skillHoveredCSS;
    if (this.state.skillHovered) {
      skillHoveredCSS = hoverStyling;
    }

    let gradeHoveredCSS;
    if (this.state.gradeHovered) {
      gradeHoveredCSS = hoverStyling;
    }

    //rendering data
    const actionPlanData = this.props.actionPlans;
    const actionPlanMap = actionPlanData.map(actionPlan => {
      console.log("ACTION PLAN");
      console.log(actionPlan);
      if (typeof actionPlan !== "undefined") {
        return (
          <ActionPlanTemplate
            skill={actionPlan.name}
            date={actionPlan.date}
            note={actionPlan.note}
            resources={actionPlan.resources}
          />
        );
      }
    });

    const goodSkillsData = this.props.skills[0].good;
    const goodSkillsDataMap = goodSkillsData.map(good => {
      return (
        <div>
          {good.name}: +{good.score}
        </div>
      );
    });

    const badSkillsData = this.props.skills[0].bad;
    const badSkillsDataMap = badSkillsData.map(bad => {
      return (
        <div>
          {bad.name}: {bad.score}
        </div>
      );
    });

    const gradeData = this.props.assessments;
    const gradeDataMap = gradeData.map(grade => {
      return (
        <div>
          {grade.name}: {grade.score}
        </div>
      );
    });

    return (
      <div>
        <Spring
          from={{ opacity: 0 }}
          to={{
            opacity: 1,
            transform: `scale(${this.state.cardHovered ? 1.03 : 1})`
          }}
        >
          {props => (
            <div
              style={props}
              onMouseOver={this.setCardHover}
              onMouseOut={this.cancelCardHover}
            >
              <Card>
                <CardHeader>
                  {" "}
                  <h3>{this.props.moduleName}</h3>
                </CardHeader>
                <CardBody>
                  <CardHeader
                    style={planHoveredCSS}
                    onMouseOver={this.setPlanHover}
                    onMouseOut={this.cancelPlanHover}
                  >
                    <CardTitle>
                      <i className="fas fa-calendar-alt" /> Action Plans
                    </CardTitle>
                    <div>{actionPlanMap}</div>
                  </CardHeader>

                  <CardBody
                    style={skillHoveredCSS}
                    onMouseOver={this.setSkillHover}
                    onMouseOut={this.cancelSkillHover}
                    onClick={this.toggleSkillsModal}
                  >
                    <CardTitle>
                      <i className="fas fa-star" /> Skills
                    </CardTitle>
                    <h5>
                      Top Skill <i className="fas fa-fire-alt" />{" "}
                    </h5>
                    <p>{goodSkillsDataMap}</p>
                    <h5>
                      Skill for Improvement <i className="fas fa-wrench" />
                    </h5>
                    <p>{badSkillsDataMap}</p>
                  </CardBody>

                  <CardFooter
                    style={gradeHoveredCSS}
                    onMouseOver={this.setGradeHover}
                    onMouseOut={this.cancelGradeHover}
                  >
                    <CardTitle>
                      <i className="fas fa-chart-line" /> Grade
                    </CardTitle>
                    <p>{gradeDataMap}</p>
                  </CardFooter>
                </CardBody>
              </Card>
            </div>
          )}
        </Spring>
      </div>
    );
  }
}

export default ModuleCard;

ModuleCardMobile.propTypes = {
  ModuleName: PropTypes.string,
  ModuleActionSummary: PropTypes.object,
  ModuleSkillSummary: PropTypes.object,
  ModuleGradeSummary: PropTypes.object
};
