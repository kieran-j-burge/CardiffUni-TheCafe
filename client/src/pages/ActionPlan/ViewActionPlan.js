import React, { Component } from "react";
import Container from "../../layout/Container";
import Header from "../../layout/Header";
import Content from "../../layout/Content";
import axios from "axios";
import {Input,Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Col} from "reactstrap";
import { Table, Icon, } from 'antd';
import 'antd/dist/antd.css';
import Moment from 'react-moment';
import {Link} from "react-router-dom";
import { NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class ViewActionPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading:false,
        actionplans:[],
        modal:false,
        modalRecord:[],
        isConfirmed:null,
        deleteModal:false,
        record:null,
        currentStudent: localStorage.getItem("studentId"),

    };

    this.toggle = this.toggle.bind(this);
    this.deleteToggle = this.deleteToggle.bind(this);
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
    var x = document.getElementsByClassName("ant-table-expand-icon-th");
    x[0].innerHTML = "Resources";
    console.log(x)
    this.getActionPlans()
    this.setState({
      loading:true
    })
  }

  toggleWithRecord(record) {

    this.setState({
      modal: !this.state.modal,
      modalRecord: record
    });
  }
  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  deleteToggle() {
    this.setState({
      deleteModal: !this.state.deleteModal,
    });
  }
  deleteRecord =(record) => {
    this.setState({
      deleteModal: !this.state.deleteModal,
      modalRecord: record
    });
  }

  deleteBtnToggle(isConfirmed){
    console.log(this.state.actionplans)

    this.setState({
      deleteModal: !this.state.deleteModal,
      
    })
    if(!isConfirmed){
      console.log("out")
    }

    if(isConfirmed){

      
      axios
      .get("/api/actionPlan/delete/"+ this.state.modalRecord._id)
      .then(res => {
          console.log(res.data)
          const newActionPlan = this.state.actionplans.filter(actionplan => {
            return actionplan !== this.state.modalRecord
          });
          console.log(newActionPlan)
          this.setState({
            actionplans: newActionPlan
          })
          NotificationManager.warning('Action Plan is Deleted !', 'Deleted Successfully');
        
      
      })
      .catch(error => console.log(error));


    // force to rerender the page to update the state.
    this.forceUpdate()
    
    }
  }


  btnToggle(isConfirmed){
    
    this.setState({
      modal: !this.state.modal,
      isConfirmed: isConfirmed
    })
    if(!isConfirmed){

    }

    if(isConfirmed){
          
    let a = this.state.modalRecord;
    a.done = !a.done
      console.log("in")
      axios
      .post("/api/actionPlan/update", this.state.modalRecord)
      .then(res => {
          console.log(res.data)
          if(a.done){
            NotificationManager.info('Action Plan is Done !', 'Checked Successfully');
          }
          if(!a.done){
            NotificationManager.info('There is Always Time, Dont Rush!', 'Un-Checked Successfully');
          }
          
      
      })
      .catch(error => console.log(error));
      // record.done= !record.done
    // force to rerender the page to update the state.
    this.forceUpdate()
    
    }


  }


  getActionPlans = () => {
    
    axios
      .get("/api/actionPlan/get/"+this.state.currentStudent)
      .then(res => {
          console.log(res.data)
        if(res.data.length == 0){
          this.setState({
            isEmpty:true
          });
        }
        else{
        this.setState({
          actionplans: res.data,
          loading:false
        });
      }
      })
      .catch(error => console.log(error));


  };

  onChangeCheckbox = (record) => {

    this.toggleWithRecord(record)
  }

  openWindow = (link) => {

    window.open(link);
  }

  rateResource =(record,e,mainRecord) => {

    let obj = mainRecord.didVote.find(obj => obj.resourceId == record._id);
    let actionPlanCopy = this.state.actionplans
    
    if(obj.vote){
      console.log(actionPlanCopy)


      
      actionPlanCopy.map(actionplan =>{
        actionplan.didVote.map(element => {
          if(element.resourceId===obj.resourceId){
            element.vote = false
            obj.vote = false
            // updating record for actionplan schema
            axios
            .post("/api/actionPlan/update/resource", actionplan)
            .then(actionplan => {
              console.log(actionplan)
            })
            .catch(error => error);
          }   
          
        });
      })
      this.setState({
        actionplans:actionPlanCopy
      })
      
      // updating a record in resource schema
      record.rating = record.rating-1
      axios
      .post("/api/resources/update/rating", record)
      .then(record => {
        console.log(record)
          
          // updating record for actionplan schema
          axios
          .post("/api/actionPlan/update/resource", mainRecord)
          .then(actionplan => {
            console.log(actionplan)
            
      
          })
          .catch(error => console.log(error));
        
      })
      .catch(error => console.log(error));
      NotificationManager.warning('Unrated a Resource', 'Successfully');
    }
    else if(!obj.vote){

      let actionPlanCopy = this.state.actionplans
      actionPlanCopy.map(actionplan =>{
        actionplan.didVote.map(element => {
          if(element.resourceId===obj.resourceId){
            element.vote = true
            obj.vote = true
            axios
            .post("/api/actionPlan/update/resource", actionplan)
            .then(res => {
             
            })
            .catch(error => console.log(error));
          }       
          
        });
      })
      NotificationManager.success('Rated a Resource', 'Successfully');
      this.setState({
        actionplans:actionPlanCopy
      })

    record.rating = record.rating+1
    axios
    .post("/api/resources/update/rating", record)
    .then(res => {
        console.log(res.data)
        
        axios
        .post("/api/actionPlan/update/resource", mainRecord)
        .then(res => {

          console.log(res.data)
          console.log("aa",this.state.actionplans)
          console.log("Main",mainRecord)
        
        })
        .catch(error => console.log(error));
      
    
    })
    .catch(error => console.log(error));

    console.log(this.state.actionplans)
  }

 
    //  obj.vote = true;
    //  this.forceUpdate();
    //  console.log(this.state.actionplans)

    



  }

  getColumnInfoProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }) => (
      <div style={{ padding: 8}}>
        Estimated time to finish a resource in minutes

      </div>
    ),
    filterIcon: filtered => <Icon type="info" style={{ color: filtered ? '#1890ff' : undefined }} />,

  })

  onChangeNote = (e,record,note) => {
    console.log(e.currentTarget.value)
    record.note = e.currentTarget.value
    console.log(record)
    axios
        .post("/api/actionPlan/update/note", record)
        .then(res => {

        
        })
        .catch(error => console.log(error));
  }
  render() {

    const expandedRowRender = (record) => {

      let mainRecord = record
  
      const columns = [
        { title: 'Resource', dataIndex: 'name', key: 'name' },
        { title: 'Type', dataIndex: 'type', key: 'type' },
        { title: 'Estimated Time', dataIndex: 'ect', key: 'ect',...this.getColumnInfoProps(), },
        { title: 'Link', dataIndex: 'link', key: 'link', className:"resource-link",
        render: (link,index) => {

          return(
            // parse date from 2019-02-02T00:00:00.000Z to 2019/02/02
            <div   onClick={e=>this.openWindow(link)} ><FontAwesomeIcon   icon='book' className="icon" /></div>
  
          )
          },
        
      
      },
      { title: 'Rate', dataIndex: 'rating', key: 'rating', className:"resource-link",
      render: (rating,record,index) => {
        let obj = mainRecord.didVote.find(obj => obj.resourceId == record._id)
        console.log(obj)

        return(
          // parse date from 2019-02-02T00:00:00.000Z to 2019/02/02
          <div  onClick={e=>this.rateResource(record,e,mainRecord)}><FontAwesomeIcon icon='star'   className="icon"
           color={obj.vote? "#e6b800":"#6C6B6B" }/></div>

          //#6C6B6B
        )
        }
       }, 



        

        
      ];

      return (
        <Table
          columns={columns}
          dataSource={record.resources}
          pagination={false}
          rowKey={(record,index) => "small"+index}
        
        />
      );
  };
    const columns = [
      {
        title: 'Skill',  dataIndex: 'skillName', key: 'skillName', 
        sorter: (a, b) => a.skillName - b.skillName, 
      },

      { 
        title: 'Module', dataIndex: 'moduleCode' ,key: 'moduleCode'
      },
      {
        title: 'DueDate',  dataIndex: 'dueDate', key: 'dueDate',   

          sorter: (a, b) => new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf(),
 
        render: (dueDate, record,index) => {

          return(
            // parse date from 2019-02-02T00:00:00.000Z to 2019/02/02
            <Moment format="YYYY/MM/DD">
              {dueDate}
            </Moment>
  
          )
          },
      },
      {
        title: 'Note',  dataIndex: 'note', key: 'note',   

 
        render: (note, record,index) => {

          return(
            // parse date from 2019-02-02T00:00:00.000Z to 2019/02/02
            <FormGroup row>
            <Col md={12}>
            <Input type="textarea" name="text" id="exampleText" value={note} onChange={e=>this.onChangeNote(e,record,note)} />      
            </Col>




            </FormGroup>
           
  
          )
          },
      },
      { 
        title: 'Done', dataIndex: 'done', key: 'done', className:'style-table-cell-center',
      render: (done, record,index) => {

        return(
        <span>
          <input type="checkbox" id={"myCheck"+index}  checked={done} onChange={e=>this.onChangeCheckbox(record)}></input>
          
        </span>
        )
        },
    
    },
    {
      title: 'Delete',  key: 'Delete', className:'style-table-cell-center',  


      render: (record,index) => {

        return(
          // parse date from 2019-02-02T00:00:00.000Z to 2019/02/02
          <div onClick={e=>this.deleteRecord(record)}  ><FontAwesomeIcon icon='trash-alt' className="icon" /></div>

        )
        },
    },
    
    ];

    let data;
    if(this.state.isEmpty){
      data = 
        <div>
        <h5>There are no Action Plans, Click on the button to create Action plans</h5>
        <Link to="/actionplan" className="btn btn-primary" >  Add ActionPLan </Link>
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
                   <div className="tablexx box">
        <Table rowKey={(record,index) => "Maintable"+index}  className="components-table-demo-nested" bordered columns={columns} 
        expandedRowRender={record => expandedRowRender(record)} dataSource={this.state.actionplans}  />
        </div>
            
     
        </div>
      );
    }

    return (
      <Container>
        <Header pageName="View Action Plan" />
        <Content>
        {data}

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Confirmation for {this.state.modalRecord.moduleCode}</ModalHeader>
          <ModalBody>
            {/* {console.log(this.state.modalRecord)} */}
            <p>{this.state.modalRecord.done?"Want to Check as Not Done ?":"Want to Check as Done?"} </p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={e=>this.btnToggle(true)}>Yes</Button>
            <Button color="danger" onClick={e=>this.btnToggle(false)}>Cancel</Button>
          </ModalFooter>
        </Modal>






        <Modal isOpen={this.state.deleteModal} toggle={this.deleteToggle}>
          <ModalHeader> Confirmation </ModalHeader>
          <ModalBody>
            {/* {console.log(this.state.modalRecord)} */}
            <p> You sure to delete this record? </p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={e=>this.deleteBtnToggle(true)}>Yes</Button>
            <Button color="danger" onClick={e=>this.deleteBtnToggle(false)}>Cancel</Button>
          </ModalFooter>
        </Modal>
        </Content>
      </Container>
    );
  }
}

export default ViewActionPlan;
