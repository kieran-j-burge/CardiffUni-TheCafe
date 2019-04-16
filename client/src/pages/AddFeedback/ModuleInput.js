import React, { Component } from "react";
import {
  FormGroup,
  Label,
  Input,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Alert
} from "reactstrap";
import DropdownSuggestions from "./DropdownSuggestions";

import axios from "axios";

class ModuleInput extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      module: null,
      value: "",
      moduleNames: [],
      query: "",
      showList: false,
      modules: [],
      moduleName: "",
      addModal: false,
      taken: false,
      blank: false
    };

    this.closeRef = React.createRef();
    this.addModule = this.addModule.bind(this);
    this.node = React.createRef();
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.clickOut, false);

    this._isMounted = true;
    this.getModules();
  }

  componentWillUnmount() {
    this._isMounted = false;
    document.removeEventListener("mousedown", this.clickOut, false);
  }

  toggle() {
    this.setState(prevState => ({
      addModal: !prevState.addModal
    }));
  }

  getModules = () => {
    axios
      .get("/api/module/get/moduleNames")
      .then(res => {
        if (this._isMounted) {
          const modNames = [];
          res.data.forEach(mod => {
            modNames.push(mod["code"]);
          });
          this.setState({
            moduleNames: modNames,
            modules: res.data
          });
        }
      })
      .catch(err => console.log(err));
  };

  addModule() {
    this.setState({ taken: false });
    const mod = {
      name: this.state.value,
      moduleName: this.state.moduleName,
      assessments: []
    };
    if (this.state.modules.find(x => x.code === this.state.value)) {
      console.log("Module already exists");
      this.setState({
        taken: true
      });
      return false;
    }
    if (this.state.moduleName.length === 0 || this.state.value.length === 0) {
      this.setState({
        blank: true
      })
      return false
    }
    axios
      .post("/api/module/add", mod)
      .then(res => console.log(res))
      .catch(e => console.log(e));

    const newMod = {
      code: this.state.value,
      name: this.state.moduleName
    };
    console.log(newMod);
    this.setState(
      {
        modules: [...this.state.modules, newMod],
        moduleNames: [...this.state.moduleNames, newMod['code']],
        addModal: false,
        blank: false
      },
      () => this.changeModule(this.state.value)
    );
  }


  changeModule = moduleCode => {
    let selectedMod = this.state.modules.find(x => x.code === moduleCode);

    this.setState(
      {
        module: moduleCode,
        value: moduleCode,
        moduleName: selectedMod["name"]
      },
      e => this.props.getModule(this.state.module)
    );
    this.setState({
      showList: false
    });
  };

  onChange = e => {
    this.setState({
      value: e.target.value,
      query: e.target.value,
      showList: true,
      taken: false
    });
  };

  onChangeName = e => {
    this.setState({
      moduleName: e.target.value
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

  clearModule = () => {
    this.setState(
      {
        module: null,
        value: "",
        moduleName: ""
      },
      () => this.closeRef.focus()
    );
    this.props.getModule(null);
  };

  render() {
    return (
      <div className="module-box box">
        <Modal
          isOpen={this.state.addModal}
          toggle={this.toggle}
          className={"add-modal"}
        >
          {" "}
          <ModalHeader toggle={this.toggle}>Add Module</ModalHeader>
          <ModalBody>
            Please choose a module code and module name
            <Input
              type="text"
              name="newModCode"
              id="newModCode"
              placeholder="Module Code"
              onChange={this.onChange}
              autoComplete="off"
              value={this.state.module}
              style={{ "marginTop": "10px" }}
            />
            {this.state.taken ? (
              <Alert color="danger" style={{ "marginTop": "10px" }}>
                The module you entered already exists
              </Alert>
            ) : null}
            <Input
              type="text"
              name="newModName"
              id="newModName"
              placeholder="Module Name"
              onChange={this.onChangeName}
              autoComplete="off"
              value={this.state.moduleName}
              style={{ "marginTop": "10px" }}
            />
            {this.state.blank ? (
              <Alert color="danger" style={{ "marginTop": "10px" }}>
                Please don't leave either box blank
              </Alert>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addModule}>
              Add
            </Button>
            {""}
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <FormGroup row>
          <Label for="module" sm={4}>
            Module Code
          </Label>
          <Col sm={6}>
            <div className="input-box" ref={node => (this.node = node)}>
              <Input
                type="text"
                name="module"
                id="module"
                innerRef={input => (this.closeRef = input)}
                placeholder="Search module codes"
                onChange={this.onChange}
                onClick={this.onClick}
                value={this.state.module ? this.state.module : this.state.value}
                disabled={this.state.module ? true : false}
                autoComplete="off"
              />
              {this.state.module ? (
                <div className="close" onClick={this.clearModule} />
              ) : (
                <Button style={{ "marginLeft": "10px" }} onClick={this.toggle}>
                  New Module
                </Button>
              )}

              {this.state.showList ? (
                <DropdownSuggestions
                  query={this.state.query}
                  results={this.state.moduleNames}
                  setData={this.changeModule}
                />
              ) : null}
            </div>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="moduleName" sm={4}>
            Module Name
          </Label>
          <Col sm={6}>
            <div className="input-box">
              <Input
                type="text"
                name="moduleName"
                id="moduleName"
                placeholder="Module Name"
                value={this.state.moduleName}
                disabled={true}
                autoComplete="off"
              />
            </div>
          </Col>
        </FormGroup>
      </div>
    );
  }
}

export default ModuleInput;
