import React, { Component } from "react";
import { FormGroup, Label, Input, Col } from "reactstrap";

class SuggestionBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="suggestionBox">
        <FormGroup row>
          <Label for="suggestionBox" sm={4}>
            {this.props.suggestionBoxLabel}
          </Label>
          <Col sm={6}>
            <div>
              <Input
                  type="textarea"
                placeholder={this.props.suggestion}
                id="suggestionBox"
                disabled={true}
              />
            </div>
          </Col>
        </FormGroup>
      </div>
    );
  }
}

export default SuggestionBox;
