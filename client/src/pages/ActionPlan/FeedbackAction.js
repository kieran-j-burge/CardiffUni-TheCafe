import React, { Component } from "react";
import { Table as TableStrap, Collapse, Input } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Table } from "reactstrap";
import AssessmentDisplay from "./AssessmentDisplay";

class FeedbackAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skillDisplay: null,
      actionPlan: {},
      resources: {}
    };
  }

  selectSkill = skill => {
    this.setState({
      skillDisplay: skill.name
    });
    console.log(skill);
    this.props.selectedSkill(skill);
  };

  render() {
    return (
      <div className="action-skill box">
        <div className="actionPlan-bar" onClick={this.props.toggleNew}>
          <FontAwesomeIcon
            icon={this.props.displaySkill ? "minus" : "plus"}
            className="iconx"
          />
          <h4 className="ap-title">Step 2: Select a Skill </h4>
          <h6 className="actionplan-validation">{this.props.isSelected ? "" : "*Select a Skill*"}</h6>
        </div>
        <Collapse isOpen={this.props.displaySkill}>
          <div className="actionPlan">
            <TableStrap>
              <thead>
                <tr>
                  <th>Skills</th>
                  <th>Feeback Rating</th>
                  <th>Feedback Comment</th>
                  
                </tr>
              </thead>

              <thead>
                {this.props.list.map((feedback, i) => {
                  if (i != 0) {
                    return (
                      <tr
                        onClick={e => this.selectSkill(feedback.skill)}
                        className="feedback-row"
                        key={i}
                      >
                        <td>{feedback.skill.name}</td>
                        <td>{feedback.rating>0 ? 'Positive':'Negative'}</td>
                        <td>{feedback.comment}</td>
                        
                        
                      </tr>
                    );
                  }
                })}
              </thead>
            </TableStrap>
          </div>
        </Collapse>
      </div>
    );
  }
}

export default FeedbackAction;
