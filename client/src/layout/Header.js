import React, { Component } from "react";

class Header extends Component {
  render() {
    return (
      <div className="header">
        <h1>{this.props.pageName}</h1>
        {this.props.children}
      </div>
    );
  }
}

export default Header;
