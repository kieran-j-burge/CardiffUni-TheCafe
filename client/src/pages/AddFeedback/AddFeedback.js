import React, { Component } from "react";
import { Form, FormGroup, Label, Input, Col, Button } from "reactstrap";
import Container from "../../layout/Container";
import Header from "../../layout/Header";
import Content from "../../layout/Content";
import ModuleInput from "./ModuleInput";
import AssessmentInput from "./AssessmentInput";
import SkillsInput from "./SkillsInput";
import axios from "axios";
import SuggestionBox from "./SuggestionBox";
import Tooltips from "./Tooltip";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

const synonyms = require("synonyms");
const Sentiment = require("sentiment");
const sentiment = new Sentiment();

class AddFeedback extends Component {
  constructor(props) {
    super(props);
      this.addModuleNotification = this.addModuleNotification.bind(this);
      this.addAssessmentNotification = this.addAssessmentNotification.bind(this);
      this.addSuggestionNotification = this.addSuggestionNotification.bind(this);
      this.notificationDOMRef = React.createRef();
    this.state = {
      module: "",
      assessmentName: "",
      date: "",
      comment: "",
      skill: "",
      added: null,
      skillsSynonyms: [],
      feedback: "",
      suggestedSkill: "",
      suggestedSentiment: "",
      rating: "",
      skills: [],
      grade: "",
      currentStudent: localStorage.getItem("studentId"),
      confirm: null
    };


    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }


    addModuleNotification() {
        this.notificationDOMRef.current.addNotification({
            title: "Module Information",
            message: "This information is retrieved from your sims account - if you cannot find your module please contact '12312324'",
            type: "info",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismissable: { click: true }
        });
    }

    addAssessmentNotification(){
        this.notificationDOMRef.current.addNotification({
            title: "Assessment Information",
            message: "Assessment grades can be provisional if not confirmed by the exam board. A catalouge of this information can be found at (sims)",
            type: "info",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismissable: { click: true }
        });
    }

    addSuggestionNotification() {

        this.notificationDOMRef.current.addNotification({
            title: "Suggestion Information",
            message: "After accepting a skill category suggestion, search by the suggested subset skills",
            type: "info",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismissable: { click: true }
        });

        this.notificationDOMRef.current.addNotification({
            title: "Suggestion Information",
            message: "Suggestions are based on the feedback you input, suggestions include a category/subset of relevant skills and how well you performed in them",
            type: "info",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismissable: { click: true }
        });


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
    this.getAllSkills();
  }

  uniqueHyponyms = [];
  skillSynonym = [];
  skillsArray = [];

  getSuggestedSkills = (hyponymSkill) => {
    console.log(hyponymSkill)
      axios
          .get("/api/skills/hyponym/" + hyponymSkill)
          .then(res => {

              res.data.forEach(item => {
                  this.skillsArray.push(item["name"]);
              });
              this.setState({
                  skills: res.data
              })
          })
  };

  getAllSkills = () => {
    axios
      .get("/api/skills/get")
      .then(skills => {
        skills.data.forEach(skill => {
          if (this.uniqueHyponyms.includes(skill.hyponym)) {
          } else {
            this.uniqueHyponyms.push(skill.hyponym);
          }
        });
        this.uniqueHyponyms.forEach(hyponym => {
          if (synonyms(hyponym, "n") !== undefined) {
            this.skillSynonym.push(synonyms(hyponym, "n"));
          }
          this.setState({
            skillsSynonyms: this.skillSynonym
          });
        });
      })
      .catch(err => console.log(err));
  };
  suggestedSentiment = "";
  getSuggestedSentiment = () => {
    let feedbackSentiment = sentiment.analyze(this.state.comment).score;
    console.log(feedbackSentiment);

    if (feedbackSentiment === 0) {
      this.suggestedSentiment = "No suggestion";
    }

    if (feedbackSentiment > 0) {
      this.suggestedSentiment = "It went well";
    }
    if (feedbackSentiment < 0) {
      this.suggestedSentiment = "It needs to be improved";
    }
  };

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  getSuggestions = () => {
    this.setState({
      comment: document.getElementById("comment").value
    });

    this.state.skillsSynonyms.forEach(synonyms => {
      synonyms.forEach(synonym => {
        if (this.state.comment.includes(synonym)) {
          this.setState({
            suggestedSkill: synonyms[0]
          });
          this.getSuggestedSkills(synonyms[0]);
          this.getSuggestedSentiment();
        }
      });
    });
  };

  onSubmit(e) {
    e.preventDefault();

    const newFeedback = {
      comment: this.state.comment,
      skill: this.state.skill,
      rating: this.state.rating,
      userId: this.state.currentStudent
    };

    const newGrade = {
      student_id: this.state.currentStudent,
      grade: this.state.grade
    };

    const assessment = {
      name: this.state.assessmentName,
      grade: newGrade,
      date: this.state.date,
      feedback: newFeedback
    };

    const newModule = {
      name: this.state.module,
      assessments: assessment
    };

    axios
      .post("/api/feedback/create", { newModule })
      .then(res => console.log(res))
      .catch(e => console.log(e));

    this.setState({
      confirm: true
    });
  }

  getModule = mod => {
    this.setState({
      module: mod
    });
  };

  getAssessment = name => {
    this.setState({
      assessmentName: name
    });
  };

  getSkill = skill => {
    this.setState({
      skill: skill[0]["_id"]
    });
  };

  clearSkill = skill => {
    this.setState({
      skill: skill,
      comment: "",
      suggestedSkill: "",
      rating: ""
    });
  };

  alert = () => {
    this.setState({
      added: false
    });
  };

  acceptSkillSuggestion = () => {
      document.getElementById("skillsInput").value = "Enter " + this.state.suggestedSkill + " skill";
      document.getElementById("suggestionBox").value = this.skillsArray;
      console.log(this.skillsArray)
  };

  acceptSentimentSuggestion = () => {
    if (this.suggestedSentiment === "It went well") {
        this.setState({
            rating: 1
        })
    }
    if (this.suggestedSentiment === "It needs to be improved") {
        this.setState({
            rating: -1
        })
    }

  }

  render() {
    return (
      <Container>
        <Header pageName="Input Feedback" />
        <Content>
            <ReactNotification ref={this.notificationDOMRef} />
            <Button onClick={this.addModuleNotification} color="primary">
                Module Information
            </Button>
          <div className="add-details">
            <div className="input-details">
              <Form onSubmit={this.onSubmit}>
                <ModuleInput getModule={this.getModule} />
                  <Button onClick={this.addAssessmentNotification} color="primary">
                      Assessment Information
                  </Button>
                <div className="assessment box">
                  <AssessmentInput
                    module={this.state.module}
                    getAssessment={this.getAssessment}
                    disabled={this.state.module ? false : true}
                  />

                  <FormGroup row>
                    <Label for="grade" sm={4}>
                      Assessment Grade
                    </Label>
                    <Col sm={6}>
                      <Input
                        type="number"
                        name="grade"
                        id="grade"
                        disabled={this.state.module ? false : true}
                        placeholder="Assessment Grade"
                        onChange={this.onChange}
                        value={this.state.grade}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="date" sm={4}>
                      Assessment Date
                    </Label>
                    <Col sm={6}>
                      <Input
                        disabled={this.state.module ? false : true}
                        type="date"
                        name="date"
                        id="date"
                        placeholder="Assessment Date"
                        value={this.state.date}
                        onChange={this.onChange}
                      />
                    </Col>
                  </FormGroup>
                </div>
                <div className="feedback box">
                  <FormGroup row>
                    <Label sm={10}>
                      <h3>Feedback for assessment</h3>
                    </Label>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="comment" sm={4}>
                      Comment
                    </Label>
                    <Col sm={6}>
                      <Input
                        type="textarea"
                        name="comment"
                        id="comment"
                        placeholder="Feedback Comment"
                        onChange={this.onChange}
                        disabled={
                          this.state.assessmentName && this.state.module && this.state.grade && this.state.date
                            ? false
                            : true
                        }
                        onClick={this.alert}
                        value={this.state.comment}
                      />
                        <Button className="suggestions-button"  onClick={this.getSuggestions}> Get Suggestions </Button>
                    </Col>
                  </FormGroup>
                    <Button onClick={this.addSuggestionNotification} color="primary">
                        Suggestion Information
                    </Button>
                  <SuggestionBox
                    suggestionBoxLabel={"Suggested Skill"}
                    suggestion={
                      this.state.suggestedSkill.charAt(0).toUpperCase() +
                      this.state.suggestedSkill.slice(1)
                    }
                  />
                  <FormGroup row>
                    <Col sm={4}>
                      <div className="fixer" />
                    </Col>
                    <Col sm={6}>
                      <Button className="suggestions-button" onClick={this.acceptSkillSuggestion}>
                        {" "}
                        Accept Suggestion{" "}
                      </Button>
                    </Col>
                  </FormGroup>

                  <SkillsInput
                    getSkill={this.getSkill}
                    clearSkill={this.clearSkill}
                    assessmentName={this.state.assessmentName}
                    hyponym={this.state.suggestedSkill}
                    hypSkills={this.state.skills}
                  />
                  <SuggestionBox
                    suggestionBoxLabel={"Suggested Sentiment"}
                    suggestion={this.suggestedSentiment}
                  />
                  <FormGroup row>
                    <Col sm={4}>
                      <div className="fixer" />
                    </Col>
                    <Col sm={6}>
                      <Button  className="suggestions-button" onClick={this.acceptSentimentSuggestion}>
                        {" "}
                        Accept Suggestion{" "}
                      </Button>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label for="rating" sm={4}>
                      How Did It Go
                    </Label>
                    <Col sm={6}>
                      <select
                        className="rating-dropdown"
                        id="rating"
                        name="rating"
                        value={this.state.rating}
                        onChange={this.onChange}
                        disabled={
                          this.state.comment
                            ? false
                            : true
                        }
                      >
                        <option value="select">Select an Option</option>
                        <option value={1}>It went well</option>
                        <option value={-1}>It needs to be improved</option>
                      </select>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md={4} />
                    <Col md={6}>
                      <Button
                          id={"addFeedback"}
                        block
                        disabled={
                          this.state.comment
                            ? false
                            : true
                        }
                      >
                        Add Feedback
                      </Button>
                    </Col>
                  </FormGroup>
                </div>
                <div
                  className="added"
                  style={
                    this.state.confirm ? { height: "50px" } : { height: "0px" }
                  }
                >
                  Added Succesfully
                </div>
              </Form>
            </div>
          </div>
        </Content>
      </Container>
    );
  }
}

export default AddFeedback;
