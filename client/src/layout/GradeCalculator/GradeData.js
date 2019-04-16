import React, { Component } from "react";
import { PieChart } from "react-chartkick";

import { Progress, Table } from "reactstrap";

class GradeData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMark: this.props.currentMark,
      desiredGrade: this.props.desiredGrade,
      gradeBoundary: this.props.gradeBoundary,
      gradeFormat: this.props.gradeFormat,
      marksAvailable: this.props.marksAvailable,
      marksLost: this.props.marksLost,
      avPercentNeeded: this.props.avPercentNeeded
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentMark: nextProps.currentMark,
      desiredGrade: nextProps.desiredGrade,
      gradeBoundary: nextProps.gradeBoundary,
      gradeFormat: nextProps.gradeFormat,
      marksAvailable: nextProps.marksAvailable,
      marksLost: nextProps.marksLost,
      avPercentNeeded: nextProps.avPercentNeeded
    });
  }

  render() {
    const currentMark = parseInt(this.state.currentMark);

    return (
      <div className="grade-data">
        <h1 className="grade-title">Progress to {this.state.gradeFormat}</h1>
        <Progress
          className="progress-lg"
          value={(this.state.currentMark / this.state.gradeBoundary) * 100}
        >
          {(this.state.currentMark / this.state.gradeBoundary) * 100}%
        </Progress>
        <div id="PieChartContainer">
          <PieChart
            data={[
              [
                "Mark Lost: " + this.state.marksLost + "%",
                this.state.marksLost
              ],
              [
                "Mark Available: " + this.state.marksAvailable + "%",
                this.state.marksAvailable
              ],
              [
                "Current Grade: " + this.state.currentMark + "%",
                this.state.currentMark
              ]
            ]}
            colors={["#FF7F50", "#00FFFF", "#4BB543"]}
            width={"500px"}
          />
        </div>
        <div id="GradeStatistics">
          <h1 className="grade-title">Grade Statistics</h1>
          <Table>
            <tbody>
              <tr>
                <td className="grade-data-title">Current mark this year</td>
                <td className="grade-data">{this.state.currentMark}%</td>
              </tr>
              <tr>
                <td className="grade-data-title">Marks lost this year</td>
                <td className="grade-data">{this.state.marksLost}%</td>
              </tr>
              <tr>
                <td className="grade-data-title">
                  Marks still available to get this year
                </td>
                <td className="grade-data">{this.state.marksAvailable}%</td>
              </tr>
              <tr>
                <td className="grade-data-title">
                  What you need to average in each assigment
                </td>
                <td className="grade-data">{this.state.avPercentNeeded}%</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default GradeData;
