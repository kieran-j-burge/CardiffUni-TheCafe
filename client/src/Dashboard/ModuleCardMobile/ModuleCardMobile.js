import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Collapse
} from "reactstrap";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const floatIconsRight = {
  float: "right"
};

const hoverStyling = {
  "background-color": "#E8E8E8",
  cursor: "pointer"
};

const clickableStyling = {
  cursor: "pointer"
};

class ModuleCardMobile extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      collapse: false,
      planHovered: false,
      skillHovered: false,
      gradeHovered: false
    };
  }

  toggle = () => this.setState({ collapse: !this.state.collapse });

  setPlanHover = () => this.setState({ planHovered: true });
  cancelPlanHover = () => this.setState({ planHovered: false });

  setSkillHover = () => this.setState({ skillHovered: true });
  cancelSkillHover = () => this.setState({ skillHovered: false });

  setGradeHover = () => this.setState({ gradeHovered: true });
  cancelGradeHover = () => this.setState({ gradeHovered: false });

  render() {
    let expandIcon;
    let collapseIcon;

    if (this.state.collapse) {
      collapseIcon = (
        <i style={floatIconsRight} className="fas fa-compress-arrows-alt" />
      );
    } else {
      expandIcon = (
        <i style={floatIconsRight} className="fas fa-expand-arrows-alt" />
      );
    }

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
    return (
      <Card>
        <CardHeader style={clickableStyling} onClick={this.toggle}>
          {this.props.ModuleName} *Module Name Here* {expandIcon}
          {collapseIcon}
        </CardHeader>
        <Collapse isOpen={this.state.collapse}>
          <CardBody>
            <CardHeader
              style={planHoveredCSS}
              onMouseOver={this.setPlanHover}
              onMouseOut={this.cancelPlanHover}
            >
              <CardTitle>
                <i className="fas fa-calendar-alt" /> Action Plan
              </CardTitle>
              <p>
                {this.props.ModuleActionSummary} Insert scheduled module goal
              </p>
            </CardHeader>

            <Link to="/skills">
              <CardBody
                style={skillHoveredCSS}
                onMouseOver={this.setSkillHover}
                onMouseOut={this.cancelSkillHover}
              >
                <CardTitle>
                  <i className="fas fa-star" /> Skills
                </CardTitle>
                <p>
                  {this.props.ModuleSkillsSummary} Insert module skills summary
                </p>
              </CardBody>
            </Link>
            <CardFooter
              style={gradeHoveredCSS}
              onMouseOver={this.setGradeHover}
              onMouseOut={this.cancelGradeHover}
            >
              <CardTitle>
                <i className="fas fa-chart-line" /> Grade
              </CardTitle>
              <p>{this.props.InsertGradeSummary} Insert module grade summary</p>
            </CardFooter>
          </CardBody>
        </Collapse>
      </Card>
    );
  }
}

export default ModuleCardMobile;

ModuleCardMobile.propTypes = {
  ModuleName: PropTypes.string,
  ModuleActionSummary: PropTypes.object,
  ModuleSkillSummary: PropTypes.object,
  ModuleGradeSummary: PropTypes.object
};

