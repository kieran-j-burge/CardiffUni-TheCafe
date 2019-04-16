import React, { Component } from "react";
import {
  Row,
} from "reactstrap";

class CurrentYearInfo extends Component {
  render() {
    return (
      <div id="CurrentYearInfoContainer">
        <div class="container-fluid">
          <Row>
            <h1 className="grade-title-year">Year 3</h1>
          </Row>
        </div>
      </div>
    );
  }
}

export default CurrentYearInfo;
