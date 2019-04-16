import React, { Component } from "react";
import { Table, Row } from "reactstrap";

class YearInfo extends Component {
  render() {
    return (
      <div id="PastYearsContainer">
        <div class="container-fluid">
          <Row>
            <h1 className="grade-title">Past Year Results</h1>
          </Row>
          <Table>
            <thead>
              <tr>
                <th />
                <th>Year</th>
                <th>Weighting</th>
                <th>Final Mark</th>
              </tr>
            </thead>
            <tbody>
              <tr class="year-info">
                <th scope="row" />
                <td>Year 1 </td>
                <td>0%</td>
                <td>65%</td>
              </tr>
              <tr class="year-info">
                <th scope="row" />
                <td>Year 2</td>
                <td>40%</td>
                <td>70%</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default YearInfo;
