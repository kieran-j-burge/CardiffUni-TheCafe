import React, { Component } from "react";

class DropdownSkills extends Component {
  render() {
    const regex = new RegExp(this.props.query, "gi");
    let filtered = [];

    if (this.props.query.length >= 1 && this.props.results[0] !== null) {
      filtered = this.props.results
        .filter(item => item["name"].match(regex))
        .slice(0, 5);
    }

    let options = filtered.map((choice, id) => (
      <li
        key={id}
        onClick={e => this.props.setData(choice["name"])}
        value={choice["name"]}
      >
        {choice["name"]}
      </li>
    ));

    return <ul className="dropdown-suggestions"> {options}</ul>;
  }
}

export default DropdownSkills;
