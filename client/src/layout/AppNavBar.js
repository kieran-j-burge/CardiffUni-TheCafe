import React, { Component } from "react";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";

import axios from "axios";
import PropTypes from "prop-types";
import {Input,Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Col } from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class AppNavbar extends Component {
  constructor(props, context) {
    super(props, context);

    this.logout.bind(this);
    this.state = {
      modal:false,
      tutorialPrev:false,
      tutorialNext:true
    };
  }

  static contextTypes = {
    router: PropTypes.object
  };
  toggle = (event) => {
    if(this.state.modal){
      var i;
      for (i = 1; i < 11; i++) {
        console.log(document.getElementsByClassName('step'+i)[0]===undefined)
        if(document.getElementsByClassName('step'+i)[0]===undefined){
          
        }
        else{
          
          document.getElementsByClassName('step'+i)[0].style.display='none'
        }
        
      }

      this.setState({
        tutorialIndex: 1,
        tutorialPrev:false,
        tutorialNext:true
      });

    }
    this.setState({
      modal: !this.state.modal,
    });
  }
  // TODO replace window.location with react-like navigation
  logout(e) {
    e.preventDefault();

    axios
      .post(`/api/student/logout`, {
        studentId: localStorage.getItem("studentId"),
        token: localStorage.getItem("loginToken")
      })
      .then(resp => {
        console.log(resp);
        localStorage.clear();
        window.location = "/login";
        this.props.checker(false)
      })
      .catch(err => {
        console.log(err);
        localStorage.clear();
        console.log(this.context);
        window.location = "/login";
      });
  }

  startTutorial = event => {
    this.setState({
      tutorialIndex:1
    })
    this.toggle()
    console.log(this.state.tutorialIndex)
    document.getElementsByClassName('step1')[0].style.display='inline'
    console.log(event.target)
    console.log("hi")
};

tutorialNext = event => {
  console.log("hello")
  this.setState({
    tutorialIndex:this.state.tutorialIndex+1,
    tutorialPrev:true
  }, () => {
    document.getElementsByClassName('step'+(this.state.tutorialIndex-1))[0].style.display='none'
    document.getElementsByClassName('step'+(this.state.tutorialIndex))[0].style.display='inline'
    if(this.state.tutorialIndex===10){
      this.setState({
        tutorialNext:false
      })
    }
  })
  
}
tutorialPrev = event => {
  console.log("hello")
  if(this.state.tutorialIndex===2){
    this.setState({
      tutorialPrev:false
    })
  }
  this.setState({
    tutorialIndex:this.state.tutorialIndex-1,
    tutorialNext:true
    
  }, () => {
    document.getElementsByClassName('step'+(this.state.tutorialIndex+1))[0].style.display='none'
    document.getElementsByClassName('step'+(this.state.tutorialIndex))[0].style.display='inline'
  })
  
}

  render() {
      console.log(this.props)
    return (
      <React.Fragment>
        {this.props.display ? (
          <div
            className="navbar"
            style={{ width: this.props.resize ? 52 : 220 }}
          >
            <Nav navbar vertical>
              <div className="logo">
                <div className="logo-text">Cafe</div>
                <FontAwesomeIcon icon="mug-hot" className="icon" />
              </div>
              <FontAwesomeIcon
                icon="bars"
                className="burger"
                onClick={this.props.toggle}
              />
              <NavItem>
                <NavLink exact={true} to="/" activeClassName="is-active">
                  <FontAwesomeIcon icon="home" className="icon" />
                  <div> Home</div>
                  <div className="step1">                 
                    <div className="tutorial-border"></div>
                    <div className="tutorial">
                    <p>Click Here: To View Home Page To check overall modules skill,action, and analytics </p>
                    </div>
                  </div>
                </NavLink>
              </NavItem>
              {/* <NavItem>
                            <NavLink to='/skills/view' activeClassName='is-active'>
                                <FontAwesomeIcon icon='edit' className="icon" />
                                    <div className="qwe">  View Skills</div>
                            </NavLink>
                        </NavItem> */}
              <NavItem>
                <NavLink to="/feedback/add" activeClassName="is-active">
                  <FontAwesomeIcon icon="plus" className="icon" />
                  <div > Input Feedback</div>
                  <div className="step2">                 
                    <div className="tutorial-border"></div>
                    <div className="tutorial">
                    <p>Click Here: To Add Assessments Feedback</p>
                    </div>
                  </div>
                </NavLink>
              </NavItem>
              {/* <NavItem>
                            <NavLink to='/gradetrack' activeClassName='is-active'>
                                <FontAwesomeIcon icon='list-ul' className="icon" />
                                    <div className="qwe"> Grade Tracker</div>
                            </NavLink>
                        </NavItem> */}
              <NavItem>
                <NavLink to="/gradecalc" activeClassName="is-active">
                  <FontAwesomeIcon icon="calculator" className="icon" />
                  <div > Grade Calculator</div>
                  <div className="step3">                 
                    <div className="tutorial-border"></div>
                    <div className="tutorial">
                    <p>Click Here: View Our Grade Calculator Feature </p>
                    </div>
                  </div>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/actionplan" activeClassName="is-active">

                  <FontAwesomeIcon icon="calendar-plus" className="icon" />
                  <div> Action Plan</div>
                  <div className="step4">                 
                    <div className="tutorial-border"></div>
                    <div className="tutorial">
                    <p>Click Here: Create Action, Note: You need to add Feedback First </p>
                    </div>
                  </div>


                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/view/actionplan" activeClassName="is-active">
                  <FontAwesomeIcon icon="map" className="icon" />
                  <div > View Action Plan</div>
                  <div className="step5">                 
                    <div className="tutorial-border"></div>
                    <div className="tutorial">
                    
                    <p>Click Here: To View a All the Action Plans That is Created</p>
                    <p>and Write notes and check their resource</p> 
                    </div>
                  </div>
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink to="/view/calendar" activeClassName="is-active">
                  <FontAwesomeIcon icon="calendar-alt" className="icon" />
                  <div> Calender</div> 
                  <div className="step6">                 
                    <div className="tutorial-border"></div>
                    <div className="tutorial">Click Here: To View a Calendar Containing All the Action Plans That is Created</div>
                  </div>
                  
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink to="/resources" activeClassName="is-active">
                  <FontAwesomeIcon icon="book" className="icon" />
                  <div > Resources</div>
                  <div className="step7">                 
                    <div className="tutorial-border"></div>
                    <div className="tutorial">Click Here: To View All the Resources We Have!</div>
                  </div>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/analytics" activeClassName="is-active">
                  <FontAwesomeIcon icon="chart-bar" className="icon" />
                  <div > Analytics</div>
                  <div className="step8">                 
                    <div className="tutorial-border"></div>
                    <div className="tutorial">Click here: To View Graphs for Your Progress</div>
                  </div>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/account" activeClassName="is-active">
                  <FontAwesomeIcon icon="user-circle" className="icon" />
                  <div > Account</div>
                  <div className="step9">                 
                    <div className="tutorial-border"></div>
                    <div className="tutorial">Click here: To Update your Account Information</div>
                  </div>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  to="#"
                  onClick={this.logout}
                  activeClassName="is-active"
                >
                  <FontAwesomeIcon icon="home" className="icon" />
                  <div> Logout</div>
                  <div className="step10">                 
                    <div className="tutorial-border"></div>
                    <div className="tutorial">Click Here: To logout</div>
                  </div>

                </NavLink>
              </NavItem>
            </Nav>
            <div className="tutorial-icon" onClick={this.startTutorial}><img src={require("./tutorial.png")} className="tutorial-icon-img" alt="Loading" /></div>

            <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-tutorial">
				{/* <ModalHeader> Confirmation </ModalHeader>
				<ModalBody>
					
					<p> You sure to delete this record? </p>
				</ModalBody> */}
				<ModalFooter className="tutorial-footer">
        {this.state.tutorialPrev ? 
          <div className="tutorial-btn " onClick={this.tutorialPrev}>
          <FontAwesomeIcon icon="backward" className="tutorial-step-icon" /> <strong> Previous</strong></div>:""}
        {this.state.tutorialNext ? 
          <div className="tutorial-btn btn-prev" onClick={this.tutorialNext}>
          <strong> Next  </strong>
          <FontAwesomeIcon icon="forward" className="tutorial-step-icon" /> 
          </div>: ""}


				</ModalFooter>
        	</Modal>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

export default AppNavbar;
