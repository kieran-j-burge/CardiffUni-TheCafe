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

class CurrentModules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentModules: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.modules != null) {
      this.setState({
        currentModules: nextProps.modules
      });
    }
  }

  render() {
    const moduleList = this.state.currentModules;

    var moduleListMap;
    if (moduleList != null) {
      moduleListMap = moduleList.map(module => {
        module.assignments.forEach(function(assigment) {
          if (assigment.score == "awaiting") {
            assigment.score = <Input />;
          } else {
          }
        });
        return (
          <Table className="current-module-container">
            <thead>
              <tr>
                <th class="current-module-title">{module.name}</th>
                <th>{module.weight}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {module.assignments.map(assigment => (
                <tr class="current-assignment-container">
                  <td className="mod-name">{assigment.name}</td>
                  <td className="mod-weight">{assigment.weight}</td>
                  <td className="mod-score">{assigment.score}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        );
      });
    }

    return (
      <div id="CurrentModulesContainer">
        <div class="container-fluid">
          <Row>
            <h1 className="grade-title">Current Modules</h1>
          </Row>

          {moduleListMap}
        </div>
      </div>
    );
  }
}

export default CurrentModules;
