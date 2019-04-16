import React, { Component } from "react";
import { Table as TableStrap } from "reactstrap";
import { PieChart } from "react-chartkick";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skillWidth: "80%",
      ratingWidth: "20%"
    };
  }

  getTop3 = data => {
    const piechartData = [];

    let top3 = data.slice(0, 3);
    top3.forEach(element => {
      let points = [];
      points.push(element.skill);
      points.push(Math.abs(element.rating));
      piechartData.push(points);
    });

    return piechartData;
  };

  render() {
    return (
      <div className="skill-display">
        <div className="skills box">
          <h2 className="skill-title"> Your Top Skills</h2>
          <div className="skill-graph">
            {this.props.plus.length >= 3 ? (
              <PieChart data={this.getTop3(this.props.plus)} width={"500px"} />
            ) : (
              <h4 className="add-more">Add more feedback to see chart</h4>
            )}
          </div>
          <div className="skill-table">
            <TableStrap>
              <thead>
                <tr>
                  <th style={{ width: this.state.skillWidth }}>Skill</th>
                  <th style={{ width: this.state.ratingWidth }}>Rating</th>
                </tr>
              </thead>
              {this.props.plus.map((list, i) => {
                return (
                  <tbody key={i}>
                    <tr>
                      <td>{list.skill}</td>
                      <td>{list.rating}</td>
                    </tr>
                  </tbody>
                );
              }).slice(0, 3)}
            </TableStrap>
          </div>
        </div>
        <div className="skills box">
          <h2 className="skill-title">Skills To Be Improved</h2>
          <div className="skill-graph">
            {this.props.minus.length >= 3 ? (
              <PieChart data={this.getTop3(this.props.minus)} width={"500px"} />
            ) : (
              <h4 className="add-more">Add more feedback to see chart</h4>
            )}
          </div>
          <div className="skill-table">
            <TableStrap>
              <thead>
                <tr>
                  <th style={{ width: this.state.skillWidth }}>Skill</th>
                  <th style={{ width: this.state.ratingWidth }}>Rating</th>
                </tr>
              </thead>
              {this.props.minus.map((list, i) => {
                return (
                  <tbody key={i}>
                    <tr>
                      <td>{list.skill}</td>
                      <td>{list.rating}</td>
                    </tr>
                  </tbody>
                );
              }).slice(0, 3)}
            </TableStrap>
          </div>
        </div>
      </div>
    );
  }
}

export default Table;
