import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class AddFeedbackShortcut extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.centerV = this.centerV.bind(this);
  }

  componentDidMount() {
    this.centerV();
  }

  centerV() {
    var elements = document.querySelectorAll(".center-v");
    Array.prototype.forEach.call(elements, function(element, index) {
      element.style.marginTop =
        "" +
        (element.parentElement.offsetHeight / 2 - element.offsetHeight / 2) +
        "px";
    });
  }

  render() {
    return (
      <a href="/feedback/add">
        <div id="AddFeedbackShortcut">
          <div id="AddFeedbackIcon">
            <div class="center-h">
              <FontAwesomeIcon icon="plus" size="2x" />
            </div>
          </div>
            <h1>Add Feedback</h1>
        </div>
      </a>
    );
  }
}

export default AddFeedbackShortcut;
