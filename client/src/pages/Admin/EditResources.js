import React, { Component } from "react";
import {Input,Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import universitylogo from "../../universitylogo.jpg";
import Container from "../../layout/Container";
import Header from "../../layout/Header";
import Content from "../../layout/Content";
import { NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Table, Badge, Menu, Dropdown, Icon, } from 'antd';
import 'antd/dist/antd.css';
import { Redirect } from 'react-router';


class EditResources extends Component {
  constructor(props) {
    super(props);
    this.state = {
		loading:false,
		resources:[],
		modal:false,
		modalRecord: null

	};

}
toggle = (event) => {
    this.setState({
      modal: !this.state.modal,
    });
  }
  componentDidMount(){
	this.setState({
		loading:true
	})
	
	this.getResources()
	
  }
  getResources = () => {
    
    axios
      .get("/api/resources/")
      .then(res => {
        console.log(res.data)
		this.setState({
		resources: res.data,
		loading:false
		});
      
      })
      .catch(error => console.log(error));

  };
  deleteRecord = record => event => {
    this.setState({
		modal: !this.state.modal,
		modalRecord: record
	  });
  }


  deleteBtnToggle = (isConfirmed) => event => {
    
    this.setState({
      modal: !this.state.modal,

    })
    if(!isConfirmed){
		console.log("NOTSconfirmed")
    }

	if(isConfirmed){
		console.log("confirmed")
      
		axios
		.delete("/api/resources/delete/"+ this.state.modalRecord._id)
		.then(res => {
			console.log(res.data)
			const newResources = this.state.resources.filter(resource => {
			  return resource !== this.state.modalRecord
			});
			
			this.setState({
			  resources: newResources
			})
			axios
			.post("/api/skills/update/skill",this.state.modalRecord)
			.then(res =>
				console.log(res.data))
			.catch(err=>console.log("error"))	
			NotificationManager.warning('Resource is Deleted !', 'Deleted Successfully');
		  
		
		})
		.catch(error => console.log(error));
  
  
	  // force to rerender the page to update the state.
	  this.forceUpdate()
	  
	  }
    
    }


  
  render() {

	const columns = [
		{
			title: 'Name',  dataIndex: 'name', key: 'name', 
		},

		{ 
			title: 'Tyoe', dataIndex: 'type' ,key: 'type'
		},
		{
			title: 'Source',  dataIndex: 'source', key: 'source',   

		},
		{
			title: 'Skill',  dataIndex: 'skill', key: 'skill',   
		},
		{
			title: 'Link',  dataIndex: 'link', key: 'link',   
		},
		{
			title: 'Estimation',  dataIndex: 'ect', key: 'ect',   
		},
		{
			title: 'Rating',  dataIndex: 'rating', key: 'rating',   
		},
	  	{
			title: 'Delete',  key: 'Delete', className:'style-table-cell-center',  
  
			render: (record,index) => {
	
				return(
					
					<div onClick={this.deleteRecord(record)}  ><FontAwesomeIcon icon='trash-alt' className="icon" /></div>
		
				)
			},
		},
	  
	  ];
    return (
			localStorage.getItem("adminName") ? 
        <Container className="container">
        <Header pageName="Review Resources" />
        <Content>
			
           
			<Table rowKey={(record,index) => "Maintable"+index}  className="components-table-demo-nested" bordered columns={columns} 
        	dataSource={this.state.resources}  />


			<Modal isOpen={this.state.modal} toggle={this.toggle}>
				<ModalHeader> Confirmation </ModalHeader>
				<ModalBody>
					
					<p> You sure to delete this record? </p>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={this.deleteBtnToggle(true)}>Yes</Button>
					<Button color="danger" onClick={this.deleteBtnToggle(false)}>Cancel</Button>
				</ModalFooter>
        	</Modal>

        </Content>
      </Container> : <Redirect push to="/admin/login" /> 
    );
  }
}

export default EditResources;
