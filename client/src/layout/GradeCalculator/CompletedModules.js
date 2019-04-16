import React, { Component } from "react";
import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  FormText,
  Row,
  Col
} from "reactstrap";

import ModuleDoneRow from "./ModuleDoneRow";

class CompletedModules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completedModules: [
        {
          _id: "5c912d4b4b0c34e6e56f6fa8",
          name: "Emerging Tech",
          student_id: "5c8044280370e63460983073",
          weight: 15,
          taken: "yes",
          assignments: [
            {
              _id: "5c912d4b4b0c34e6e56f6faa",
              name: "Portfolio",
              weight: 50,
              score: "?"
            },
            {
              _id: "5c912d4b4b0c34e6e56f6fa9",
              name: "Timed Assessment",
              weight: 50,
              score: "?"
            }
          ],
          __v: 0
        }
      ]
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.modules != null) {
      var moduleListStr = "[]";
      var moduleList = JSON.parse(moduleListStr);
      nextProps.modules.forEach(function(module) {
        var assignments = module["assignments"];
        var score = 0;
        assignments.forEach(function(assignment) {
          score = score + (assignment["weight"] / 100) * assignment["score"];
        });
        moduleList.push({
          name: module.name,
          weighting: module.weight,
          score: score
        });
      });

      this.setState({
        completedModules: moduleList
      });
    }
  }

  render() {
    const moduleList = this.state.completedModules;

    const completedModulesMap = moduleList.map(module => {
      return (
        <tr class="completed-module-container">
          <th scope="row" />
          <td className="mod-name">{module.name}</td>
          <td className="mod-weight">{module.weighting}</td>
          <td className="mod-score">{module.score}</td>
        </tr>
      );
    });

    return (
      <div id="CompletedModulesContainer">
        <div class="container-fluid">
          <Row>
            <h1 className="grade-title">Completed Modules</h1>
          </Row>

          <Table>
            <thead>
              <tr>
                <th />
                <th>Module Name</th>
                <th>Weighting</th>
                <th>Final Mark</th>
              </tr>
            </thead>
            <tbody>{completedModulesMap}</tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default CompletedModules;
