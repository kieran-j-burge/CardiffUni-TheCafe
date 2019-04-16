import React, { Component } from "react";
import {  Table, Collapse, Input } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

class AssessmetDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: true,
      
    };

    this.toggleHidden = this.toggleHidden.bind(this);
    
  }
  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    });

  }

  selectAssessment(assessment, assignment) {
    this.setState({
      isHidden: !this.state.isHidden,
      displayName: assessment.name,
      loading: true
    });
    this.props.selectedAssessment(assessment, assignment);
  }

  render() {
    return (
      <div className="action-assessment box">
        <div className="actionPlan-bar" onClick={this.toggleHidden.bind(this)}>
          <FontAwesomeIcon
            icon={this.state.isHidden ? "minus" : "plus"}
            className="iconx"
          />
          <h4 className="ap-title">Step 1: Select an Assessment </h4>
          <h6 className="actionplan-validation">{this.props.isSelected ? "" : "*Select an Assessment*"}</h6>
        </div>
        <Collapse isOpen={this.state.isHidden}>
        <div className="actionPlan">
          <Table>

              <thead>
                <tr>
                  <th>Assessment Name</th>

                  <th>Module Code</th>
                  
                </tr>
              </thead>
              <tbody >
              {this.props.assignments.map(assignment => {
                return assignment.assessments.map((assessment,i) => {
                  return (
                    
                    <tr
                      onClick={e => this.selectAssessment(assessment, assignment)}
                      className="feedback-row"  key={i}
                    >
                      <td>{assessment.name}</td>
                      <td>{assignment.name}</td>
                      
                    </tr>
                     
                  );
                });
              })}
              </tbody>

              {/* {this.props.list.map((list, i) => {
                           
              
                            return (
                                <tr onClick={e => this.selectFeedback(list,i)} className="feedback-row">
                                    <td>{list.name}</td>
                                    <td>{list.positiveFeedback}</td>
                                    <td>{list.negativeFeedback}</td>
                                    <td>{list.moduleCode}</td>
                                    
                                </tr>
                            )
						})} */}
           
          </Table>
        </div>
        </Collapse>
      </div>
    );
  }
}
export default AssessmetDisplay;
