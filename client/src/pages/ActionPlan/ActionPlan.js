import React, { Component } from "react";
import Container from "../../layout/Container";
import Header from "../../layout/Header";
import Content from "../../layout/Content";
import axios from "axios";
import Feedback from "./FeedbackAction";
import AssessmentDisplay from "./AssessmentDisplay";
import ResourceDisplay from "./ResourceDisplay";
import { Collapse, Button, Label, Input, Col, FormGroup } from "reactstrap";
import { throws } from "assert";
import AddFeedback from "../AddFeedback/AddFeedback";
import { BrowserRouter, Link, Redirect, Route } from "react-router-dom";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class ActionPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedbackList: [],
      assessment: {},
      assignments: [],
      resourcesList: [],
      skill:{},
      selectedResourcesList:[],
      selectedAssignment:null,
      actionPlan: null,
      isNew:false,
      loading: false,
      displayResources: false,
      isResourcesSelected: true,
      isAssessmentSelected: true,
      isSkillSelected: true,
      isDateSelected: null,
      dueDate:null,
      isNewResource:true,
      actionplans:[],
      currentStudent: localStorage.getItem("studentId"),
    };

    // this.toggleHidden = this.toggleHidden.bind(this);
    this.toggleNew = this.toggleNew.bind(this);
    this.toggleResources = this.toggleResources.bind(this);
  }

  isLoggedIn() {
    let loginToken = localStorage.getItem("loginToken");
    if (typeof loginToken !== "undefined" && loginToken !== null) {
      let studentId = localStorage.getItem("studentId");
      return axios.get(`/api/student/validate/${studentId}/${loginToken}`);
    } else {
      return new Promise((resolve, reject) => {
        reject();
      });
    }
  }

  componentWillMount() {
    this.isLoggedIn()
      .then()
      .catch(err => {
        console.log(err);
        window.location.href = "/login";
      });
  }

  componentDidMount() {

    this.getAssignments();
    this.getActionPlans()
    this.setState({
      loading:true
    })
  }

  getActionPlans = () => {
    
    axios
      .get("/api/actionPlan/get/"+this.state.currentStudent)
      .then(res => {
          console.log(res.data)
      
        this.setState({
          actionplans: res.data,
        });
 
      })
      .catch(error => console.log(error));

      console.log(this.state.actionplans)
  };
  toggleNew() {
    this.setState({
      displaySkill: !this.state.displaySkill
    });
  }
  toggleResources() {
    this.setState({
      displayResources: !this.state.displayResources
    });
  }

  selectedAssessment = (assessment,assignment) => {
    this.setState({
      assessment: assessment,
      feedbackList: assessment.feedback,
      selectedAssignment: assignment,
      displaySkill: true,
      isNewSkill: true ,
      skill:{},
      isAssessmentSelected: true,
      resourcesList:[],
      selectedResourcesList: [],
      isNewResource:true,
    });
    

  };

  selectedSkill = skill => {
    this.setState({
      skill: skill,
      displaySkill: false,
      isNewSkill: false,
      displayResources: true,
      resourcesList: [],
      isSkillSelected: true,
      selectedResourcesList: [],
      isNewResource:true,
    });

    this.setState({

      resourcesList: skill.resources,

    });

    
  };


  selectedResource = resources => {
    this.setState({
      selectedResourcesList: resources,
      isResourcesSelected: true,
      isNewResource:false,
      
    });
    console.log(resources)
    
  };
  getAssignments = () => {
    console.log(this.state.currentStudent)
    axios
      .get("/api/module/test/"+this.state.currentStudent)
      .then(res => {
        console.log(res)
        if(res.data.length == 0){
          this.setState({
            isEmpty:true,
            loading:false
          });
        }
        else{
        this.setState({
          assignments: res.data,
          loading:false
        });
      }
      })
      .catch(error => {
        console.log(error)
        this.setState({
     
          loading:false
        });
        
      });
  };
      
   isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

dateOnChange = (e) => {
  var today = new Date();
  var month = 0
  if(today.getMonth()+1 <10){
    month = "0"+(today.getMonth()+1)
  }
  else{
    month = today.getMonth()+1
  }
  var date = today.getFullYear() + '-' + month + '-' + today.getDate();
  console.log(e.target.valeu > date)
  if(e.target.value > date){
    this.setState({
      dueDate:e.target.value,
      isDateSelected: null
    })
  }
  else{
    this.setState({

      isDateSelected: "*Invalid Date*"
    })
  }


}


createNotification = (type) => {
  console.log("xxx")

  return () => {
    console.log("in")
    switch (type) {
      
      case 'info':
        NotificationManager.info('Info message');
        break;
      case 'success':
      console.log("hellooo")
        NotificationManager.success('Success message', 'Title here');
        break;
      case 'warning':
        NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
        break;
      case 'error':
        NotificationManager.error('Error message', 'Click me!', 5000, () => {
          alert('callback');
        });
        break;
    }
  };
};

  addNew() {
    
    console.log(this.state.selectedAssignment)
    if(!this.isEmpty(this.state.assessment) && !this.isEmpty(this.state.skill)&& this.state.selectedResourcesList.length > 0 
    && this.state.dueDate !==null && this.state.dueDate !== "*Invalid Date*" ){
      console.log("adding it")
      const resourceID = []
      const vote =[]
      
      this.state.selectedResourcesList.map(resource => {
        let rVote = null
        // check if a resource was recommended by the student before
        this.state.actionplans.map(action =>{
          action.didVote.map(vote =>{

            if(resource._id===vote.resourceId && vote.vote){
              console.log("inn")
              rVote = {"resourceId":resource._id,"vote":true}
   
            }

          })
        })
        if(rVote === null){
          rVote = {"resourceId":resource._id,"vote":false}      
          
        }
        vote.push(rVote)
        resourceID.push(resource._id)
      })
      console.log(resourceID)
      const actionPlan = {
        skillName:this.state.skill.name,
        dueDate:this.state.dueDate,
        moduleCode: this.state.selectedAssignment.name,
        resources:resourceID,
        didVote:vote,
        student:this.state.currentStudent,
        note:null
      }
      console.log(actionPlan)
      axios
        .post("/api/actionPlan/add", { ...actionPlan })
        .then(res => {
          NotificationManager.success('Action Plan was added Successfully!', 'Created');
          console.log(res)
          var x = document.getElementById("exampleDate");
          x.value=null
        
          this.setState({
            skill:{},
            assessment: [],
            resourcesList:[],
            selectedResourcesList: [],
            feedbackList: [],
            displayResources:false,
            dueDate:null




          })
          this.getAssignments();
        
        
        })
        .catch(e => console.log("didnt add it"));
    }

    else{

      if(this.state.dueDate === null){
        NotificationManager.warning('Select a Date', 'Missing DueDate');
        this.setState({
          isDateSelected: "*Select a Date*",
        })
      }

      if(this.isEmpty(this.state.assessment)){
        NotificationManager.warning('Select Assessment', 'Missing Assessment');
        this.setState({
          isAssessmentSelected: false,
        })
        console.log("select assessment")
      }
      if (this.isEmpty(this.state.skill)){
        NotificationManager.warning('Select Skills', 'Missing Skill');
        this.setState({
          isSkillSelected: false,
        })
        console.log("select skills")
      }
      if (this.state.selectedResourcesList.length === 0){
        NotificationManager.warning('Select Resources', 'Missing Resources');
        this.setState({
          isResourcesSelected: false,
        })
        console.log("select resources")
      }
    }


  }

  redirectToTarget = () => {
    window.location.hash = "#/feedback/add";
   
  }
  render() {
    let data;
    if(this.state.isEmpty){
      data = 
        <div>
        <h5>There are no feedbacks created! Click on add feedback to create a feedback</h5>
        <Link to="/feedback/add" className="btn btn-primary" >  Add Feedback </Link>
        </div>
      
    }
    
    else if (this.state.loading) {
      data = (
        <div className="gifContainer">
          <img src={require("./image/Loading2.gif")} className="loadingGif" alt="Loading" />
        </div>
      );
    } else {
      data = (
        <div>
            <AssessmentDisplay
              key={"assessment"}
              assignments={this.state.assignments}
              selectedAssessment={this.selectedAssessment}
              isSelected={this.state.isAssessmentSelected}
            />
         
            <Feedback
              list={this.state.feedbackList} selectedSkill={this.selectedSkill} displaySkill={this.state.displaySkill} 
              toggleNew={this.toggleNew} isNewSkill={this.state.isNewSkill} isSelected={this.state.isSkillSelected}
            />
    

            
            <ResourceDisplay skill={this.state.skill} resources={this.state.resourcesList} selectedResource={this.selectedResource} selectedResourcesList={this.state.selectedResourcesList}
            displayResources={this.state.displayResources} toggleResources={this.toggleResources} isSelected={this.state.isResourcesSelected} isNew={this.state.isNewResource}/>
          
            <h4>Due Date:</h4>
            <Input
              className="dateinput"
              type="date"
              name="date"
              id="exampleDate"
              placeholder="date placeholder"
              onChange={(e) => this.dateOnChange(e)}
            />
            <h6 className="actionplan-validation">{this.state.isDateSelected}</h6>
            
            <FormGroup row>
            {this.isEmpty(this.state.assessment) ? "": 
            
            <Col sm={6}>
           
            <div className="actionplan-view">
            <h4>Action Plan OverView</h4>
            <h6>{this.isEmpty(this.state.assessment) ? "": "Assessment: "+this.state.assessment.name }</h6>

            <h6>{this.isEmpty(this.state.skill) ? "" : "Skill: "+this.state.skill.name }</h6>
      
            <h6>{this.state.selectedResourcesList.length === 0 ? "":"Resources:"}</h6>
            {this.state.selectedResourcesList.map((resource,index)=>{
           
              return(
                <h6 key={index}>
                  {index+1}-{resource.name}
                </h6> 
                
              )
            })}

              <h6>{this.state.dueDate === null ? "":"DueDate: "+this.state.dueDate}</h6>
            
          </div>
          </Col>

          }
                    <Col sm={6} className="btn-create-action">
           <Button className='btn' onClick={e => this.addNew() }>Create Action Plan</Button>
          
          </Col>
          </FormGroup>
        </div>
      );
    }

    return (
      <Container>
        <Header pageName="Action Plan" />
        <Content>
          <div>

            {data}

          
          </div>
        </Content>
      </Container>
    );
  }
}

export default ActionPlan;
