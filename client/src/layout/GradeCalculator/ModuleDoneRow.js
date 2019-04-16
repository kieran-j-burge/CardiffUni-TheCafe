import React, { Component } from "react";

class ModuleDoneRow extends Component {
  render() {
    return (
      <div class="module-row module-row-done">
        <div class="col-md-6 col-sm-12 float-left">
          <h3 class="label">Module Name</h3>
          <input
            type="text"
            class="form-control module-name"
            placeholder="Module Name"
          />
        </div>
        <div class="col-md-2 col-sm-12 float-left">
          <h3 class="label">Module Score</h3>
          <input
            type="text"
            class="form-control module-score"
            placeholder="00.0%"
          />
        </div>
        <div class="col-md-2 col-sm-12 float-left">
          <h3 class="label">Module Weighting</h3>
          <input class="form-control mod-done-weighting" placeholder="00.0%" />
        </div>
        <div class="col-md-2 col-sm-12 float-left">
          <h3 class="label">Remove?</h3>
          <button type="button" class="btn btn-danger remove-module">
            Remove
          </button>
        </div>
      </div>
    );
  }
}

export default ModuleDoneRow;
