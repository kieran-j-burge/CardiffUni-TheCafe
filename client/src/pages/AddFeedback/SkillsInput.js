import React, { Component } from "react";
import { FormGroup, Label, Input, Col } from "reactstrap";
import DropdownSkills from "./DropdownSkills";

import axios from "axios";

class SkillsInput extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      skill: null,
      value: "",
      skills: [],
      hypSkills: [],
      query: "",
      showList: false
    };

    this.closeRef = React.createRef();

    this.node = React.createRef();
  }

  componentDidMount() {
    this._isMounted = true;
    this.getSkills();
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener("mousedown", this.clickOut, false);
  }

  componentWillReceiveProps = props => {
    if (props.assessmentName !== this.props.assessmentName) {
      if (props.assessmentName === null) {
        this.clearSkill()
      }
    }
    if (props.hypSkills !== this.props.hypSkills) {
      this.setState({
        hypSkills: props.hypSkills
      })
    }
  }

  getSkills = () => {
    axios
      .get("/api/skills/get")
      .then(res => {
        if (this._isMounted) {
          this.setState({
            skills: res.data
          });
        }
      })
      .catch(err => console.log(err));
  };

  changeSkill = skill => {
    this.setState(
      {
        skill: skill,
        value: skill
      },
      e => {
        const found = this.state.skills.filter(
          skill => skill["name"] === this.state.skill
        );
        this.props.getSkill(found);
      }
    );
    this.setState({
      showList: false
    });
  };

  onChange = e => {
    this.setState({
      value: e.target.value,
      query: e.target.value,
      showList: true
    });
  };

  clickOut = e => {
    if (!this.node.contains(e.target)) {
      this.setState({
        query: ""
      });
    }
  };

  onClick = e => {
    if (e.target.value !== "") {
      this.setState({
        showList: true
      });
    }
  };

  clearSkill = () => {
    this.setState(
      {
        skill: null,
        value: ""
      },
      () => this.closeRef.focus()
    );
    this.props.clearSkill(null);
  };

  render() {
    let show = true;
    if (this.props.assessmentName && this.state.skill === null) {
      show = false;
    }

    return (
      <div className="skills-box">
        <FormGroup row>
          <Label for="skill" sm={4}>
            Search For Feedback Skill
          </Label>
          <Col sm={6}>
            <div className="input-box" ref={node => (this.node = node)}>
              <Input
                name="skill"
                id="skillsInput"
                innerRef={input => (this.closeRef = input)}
                placeholder="Feedback Skill"
                onChange={this.onChange}
                onClick={this.onClick}
                value={this.state.value}
                autoComplete="off"
                disabled={this.props.assessmentName ? false : true}
              />
              {this.state.skill ? (
                <div className="close" onClick={this.clearSkill} />
              ) : null}
              {this.state.showList ? (
                <DropdownSkills
                  query={this.state.query}
                  results={this.state.hypSkills.length > 0 ? this.state.hypSkills : this.state.skills}
                  setData={this.changeSkill}
                />
              ) : null}
            </div>
          </Col>
        </FormGroup>
      </div>
    );
  }
}

export default SkillsInput;
