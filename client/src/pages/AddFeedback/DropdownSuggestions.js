import React, { Component } from "react";

class DropdownSuggestions extends Component {
  render() {
    const regex = new RegExp(this.props.query, "gi");
    let filtered = [];

    if (this.props.query.length >= 1 && this.props.results[0] !== null) {
      filtered = this.props.results
        .filter(item => item.match(regex))
        .slice(0, 5);
    }

    let options = filtered.map((choice, id) => (
      <li key={id} onClick={e => this.props.setData(choice)} value={choice}>
        {choice}
      </li>
    ));

    if (this.props.query.length > 0 && options.length === 0) {
      return (
        null
      );
    } else {
      return <ul className="dropdown-suggestions"> {options}</ul>;
    }
  }
}

export default DropdownSuggestions;
