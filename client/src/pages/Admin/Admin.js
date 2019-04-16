import React, { Component } from "react";
import { Redirect } from 'react-router';
import axios from "axios";
import { Form, FormGroup, Label, Input, Col, Button } from "reactstrap";
import Container from "../../layout/Container";
import Header from "../../layout/Header";
import Content from "../../layout/Content";
import { NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';


class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceName:null,
      resourceType:null,
      resourceSkill:null,
      resourceLink:null,
      resourceSource:null,
      resourceEstimation:null,
      

    };

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount(){
    if(localStorage.getItem("adminName")===null){
      console.log("in")
      ;

    }
    if(localStorage.getItem("adminFirstTime")==="x"){
      NotificationManager.success( localStorage.getItem("adminName"), 'Welcome');
    }
    localStorage.setItem("adminFirstTime", "y");

  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  onSubmit(e) {
    console.log(e)
    e.preventDefault();
    const newResource = {
      name: this.state.resourceName,
      type: this.state.resourceType,
      skill: this.state.resourceSkill,
      link: this.state.resourceLink,
      source: this.state.resourceSource,
      ect: this.state.resourceEstimation,
    };
    axios
    .post("/api/resources/create", newResource)
    .then(res => {
      NotificationManager.success('Created Resource !', 'Successfully');
      console.log(res.data)
      const resource = res.data
      axios
      .post("/api/skills/add/skill/",resource)
      .then(res => {
        console.log(res.data)
      })
      .catch(err =>{
        
      })
      this.setState({
        resourceName:"",
        resourceType:"",
        resourceSkill:"",
        resourceLink:"",
        resourceSource:"",
        resourceEstimation:"",

      })
    
    })
    .catch(err => {
      console.log(err)
      NotificationManager.error(err.response.data.message, 'Error')
  });

  }
  render() {
    
    return (
      localStorage.getItem("adminName") ? 
        <Container>
        <Header pageName="Admin Page" />
        <Content>



              <Form onSubmit={this.onSubmit}>

                  <FormGroup row>
                    <Label for="ResourceName"  sm={2}>
                      <h6>Resource Name</h6>
                    </Label>
                    <Col sm={6}>
                      <Input
                        type="text"
                        name="resourceName"
                        id="name"
                        
                        placeholder="Resource Name"
                        onChange={this.onChange}
                        value={this.state.resourceName}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label for="ResourceType"  sm={2}>
                      <h6>Resource Type</h6>
                    </Label>
                    <Col sm={4}>
                      <Input
                        type="text"
                        name="resourceType"
                        id="type"
                        
                        placeholder="Resource Type"
                        onChange={this.onChange}
                        value={this.state.resourceType}
                      />
                    </Col>

                    <Label for="ResourceSkill" className="labe-admin" sm={2}>
                      <h6>Resource Skill</h6>
                    </Label>
                    <Col sm={4}>
                      <Input
                        type="text"
                        name="resourceSkill"
                        id="skill"
                        
                        placeholder="Resource Skill"
                        onChange={this.onChange}
                        value={this.state.resourceSkill}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label for="ResourceSource"  sm={2}>
                      <h6>Resource Source</h6>
                    </Label>
                    <Col sm={6}>
                      <Input
                        type="text"
                        name="resourceSource"
                        id="source"
                        
                        placeholder="Resource Source"
                        onChange={this.onChange}
                        value={this.state.resourceSource}
                      />
                    </Col>


                  </FormGroup>


                  <FormGroup row>

                    <Label for="ResourceLink"  sm={2}>
                      <h6>Resource Link</h6>
                    </Label>
                    <Col sm={6}>
                      <Input
                        type="text"
                        name="resourceLink"
                        id="link"
                        
                        placeholder="Resource Link"
                        onChange={this.onChange}
                        value={this.state.resourceLink}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                  <Label for="ResourceEstimation"  sm={2}>
                      <h6>Estimated to Finish</h6>
                    </Label>
                    <Col sm={2}>
                      <Input
                        type="number"
                        name="resourceEstimation"
                        id="estimate"
                        
                        placeholder="Estimation"
                        onChange={this.onChange}
                        value={this.state.resourceEstimation}
                      />
                    </Col>
                    </FormGroup>
                    <FormGroup row>
                    <Col md={4} />
                    <Col md={6}>
                      <Button
                        block
                        disabled={
                          this.state.resourceEstimation && this.state.resourceLink && 
                          this.state.resourceName && this.state.resourceSkill &&
                          this.state.resourceSource && this.state.resourceType
                            ? false
                            : true
                        }
                      >
                        Add Resource
                      </Button>
                    </Col>
                  </FormGroup>
                  
        
              </Form>

        </Content>
      </Container> : <Redirect push to="/admin/login" /> 
    );
  }
}

export default Admin;
