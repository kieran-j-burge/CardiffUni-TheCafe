import BootstrapTable from "react-bootstrap-table-next";
import React, { Component } from "react";
import axios from "axios";
import filterFactory, {
  textFilter,
  numberFilter
} from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  ColumnToggle,
  CSVExport,
  Search
} from "react-bootstrap-table2-toolkit";
import Container from "../layout/Container";
import Header from "../layout/Header";
import Content from "../layout/Content";
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import {Button, FormGroup, Input} from "reactstrap";


const { ToggleList } = ColumnToggle;
const { ExportCSVButton } = CSVExport;
const { SearchBar, ClearSearchButton } = Search;

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skillsForImprovement: [],
      sortedSkills: props.skillsAsc,
      currentStudentSchool: "",
      currentStudent: localStorage.getItem("studentId"),
        isScreenSmall: false,
      data: [],
      columns: [
        {
          dataField: "name",
          text: "Name",
          filter: textFilter(),
          hidden: false,
          sort: true
        },
        {
          dataField: "skill",
          text: "Skill",
          filter: textFilter(),
          hidden: false,
          sort: true
        },
        {
          dataField: "rating",
          text: "Rate of Recommendation (%)",
          filter: numberFilter(),
          hidden: false,
          sort: true
        },
        {
          dataField: "type",
          text: "Type",
            filter: textFilter(),
          hidden: false,
          sort: true

        },
        {
          dataField: "source",
          text: "Source",
          filter: textFilter(),
          hidden: false,
          sort: true
        },
        {
          dataField: "ect",
          text: "Estimated Completion Time",
          filter: numberFilter(),
          hidden: false,
          sort: true
        }
      ]
    };
  }

  data = [];
    hyponymSkills = [];
    tagData = [];

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
    console.log("MOUNTED!!!!!!!!!")
    this.getAllResources();
    this.resize()
      this.getOrderedStudentModules()
  }

  //todo change state for colomns to hidden to resize
    resize() {
        if (window.innerWidth <= 750) {
            this.setState({ columns: [
                    {
                        dataField: "name",
                        text: "Name",
                        filter: textFilter(),
                        hidden: false,
                        sort: true
                    },
                    {
                        dataField: "skill",
                        text: "Skill",
                        filter: textFilter(),
                        hidden: false,
                        sort: true
                    },
                    {
                        dataField: "rating",
                        text: "Rate of Recommendation (%)",
                        filter: numberFilter(),
                        hidden: true,
                        sort: true
                    },
                    {
                        dataField: "type",
                        text: "Type",
                        filter: textFilter(),
                        hidden: true,
                        sort: true

                    },
                    {
                        dataField: "source",
                        text: "Source",
                        filter: textFilter(),
                        hidden: true,
                        sort: true
                    },
                    {
                        dataField: "ect",
                        text: "Estimated Completion Time",
                        filter: numberFilter(),
                        hidden: true,
                        sort: true
                    }] },
                        () => {

                            this.forceUpdate();

                        });
        }
    }
  
    componentDidUpdate = props => {

        if (props.skillsAsc !== this.props.skillsAsc) {
            this.setState({sortedSkills: props.skillsAsc});
            this.getAllResources();
        }

    };

  getHyponymSkills = () =>{

      this.state.sortedSkills.forEach(skill=> {

          axios
              .get("/api/skills/name/" + skill)
              .then(response => {

                  response.data.forEach(data => {
                      this.getResourceSkill(data.hyponym)
                      });
              })
              .catch(error => console.log(error));
      })
  };

  getResourceSkill = (string) => {
      string = string.charAt(0).toUpperCase() + string.slice(1);
      string = string.substring(0, string.length - 1);

      axios
          .get("/api/resources/fetchBySkill/" + string)
          .then(response => {
              this.hyponymSkills.push(response.data[0].skill)
              this.hyponymSkills = [...new Set(this.hyponymSkills)]

                 this.setState ({ skillsForImprovement: this.hyponymSkills})

              this.getStudentResourceOrder();
  })
          .catch(error => console.log(error));
  };

  getStudentResourceOrder = () => {
    axios
      .get("/api/student/fetch/" + this.state.currentStudent)
      .then(response => {
        this.setState({ currentStudentSchool: response.data.school });
          let newData =  this.data.sort((a,b)=>  b.rating - a.rating )
          newData.sort((a,b)=> -(a.source === response.data.school) || b.rating - a.rating )
          newData.sort((a,b)=> (this.state.skillsForImprovement.indexOf(a.skill) - this.state.skillsForImprovement.indexOf(b.skill)))
          newData.sort((a,b)=> (this.order.indexOf(b.source) - this.order.indexOf(a.source)) )
        this.setState({ data: newData });
      })
      .catch(e => console.log(e));
  };

  getAllResources = () => {
    axios
      .get("/api/resources/")
      .then(response => {
        this.populateTableRows(response);
      })
      .catch(e => console.log(e));
  };

  getOrderedStudentModules = () => {
      axios
          .get("/api/module/moduleCodes/" + localStorage.getItem("studentId"))
          .then(response => {
              console.log(response.data)
              this.order = response.data
          })
          .catch(e => console.log(e));
  }

  populateTableRows = response => {

    for (let i = 0; i < response.data.length; i++) {
      let obj = response.data[i];
      this.data.push({
        name: obj.name,
        type: obj.type,
        source: obj.source,
        skill: obj.skill,
        link: obj.link,
        ect: obj.ect,
        rating: obj.rating,
        description: obj.description,
        tags: obj.tags
      });
    }
    this.setState({
      data:this.data
    })
    this.getHyponymSkills()
  };

  rowEvents = {
    onClick: (e, row, rowIndex) => {
      window.open(row.link);
    }
  };

  //todo set table results to search tag results
  searchByTag = () => {
      let searchTag = document.getElementById("searchByTag").value;
          searchTag = searchTag.charAt(0).toUpperCase() + searchTag.slice(1);

console.log(searchTag);
      axios
          .get("/api/resources/fetchByTag/" + searchTag)
          .then(response => {

              for (let i = 0; i < response.data.length; i++) {
                  let obj = response.data[i];
                  this.tagData.push({
                      name: obj.name,
                      type: obj.type,
                      source: obj.source,
                      skill: obj.skill,
                      link: obj.link,
                      ect: obj.ect,
                      rating: obj.rating,
                      description: obj.description,
                      tags: obj.tags
                  })
this.setState({ data: this.tagData})
              }
          }).catch(error => console.log(error));
  }

  expandRow = {
    renderer: row => (
      <div>
        <p>{` ${row.description}`}</p>
        <p>
          Tags <i className="fas fa-tags" />: {`${row.tags}`}
        </p>
      </div>
    ),
    showExpandColumn: true,
    expandByColumnOnly: true
  };

  order = [];



  startTutorial = () => {
      introJs().start()
  };

  render() {
    return (
      <Container>
          <div data-intro='This is the resources page where you can see a full collection of the resources Cardiff University offers'>
        <Header pageName="Resources" />
          </div>
        <Content>
          <div className="resources box">
            <ToolkitProvider
              keyField="name"
              data={this.state.data.map(row => row)}
              columns={this.state.columns}
              columnToggle
              exportCSV
            >
              {props => (
                <div>
                      <div data-intro='You can click these buttons to modify the columns in the table to give a customised view'>
                          <ToggleList {...props.columnToggleProps}/></div>
                  <ExportCSVButton {...props.csvProps}>Export</ExportCSVButton>
                    <Button onClick={this.startTutorial}> Take Tutorial </Button>
                    <Button onClick={this.getAllResources}> Reset Table </Button>

                    <FormGroup>
                        <Input type="text" id="searchByTag"  placeholder="Enter a subset skill" />
                        <Button onClick={this.searchByTag}> Search </Button>
                    </FormGroup>

                  <hr />
                    <div data-intro='The resources have been sorted based on your academic data'>
                      <div data-intro='Resources are sorted by your performance in modules, then your performance in skills, then resources from your school, then the rate of recommendation by your peers'>
                        <div data-intro='You can find specific resources by filling in the category search bar'>
                            <div  data-intro='You can click the "(+)" to expand to see more details about the resource'>
                  <BootstrapTable
                    {...props.baseProps}
                    filter={filterFactory()}
                    pagination={paginationFactory()}
                    expandRow={this.expandRow}
                    rowEvents={this.rowEvents}
                  />
                    </div>
                        </div></div>
                    </div>
                </div>
              )}
            </ToolkitProvider>
          </div>
        </Content>
      </Container>
    )};
}

export default Table;
