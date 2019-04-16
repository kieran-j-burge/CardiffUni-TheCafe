import React, { Component } from "react";
import { Button, Col, Form, FormGroup, Input, Label } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import universitylogo from "../../universitylogo.jpg";
import Container from "../../layout/Container";
import Header from "../../layout/Header";
import Content from "../../layout/Content";
import { NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class AdminLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
        email: "",
        password: ""
    };
  }
  handleChange = event => {
    this.setState({
        [event.target.id]: event.target.value
    });
};

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
}

handleSubmit = event => {
    event.preventDefault();

 
    console.log(this.state.email);
    console.log(this.state.password);

    axios.post("/api/admin/login", this.state)
        .then(resp => {
     
            console.log(resp)
            localStorage.setItem("adminId", resp.data.admin._id);
            localStorage.setItem("adminName", resp.data.admin.name);
            localStorage.setItem("adminFirstTime", "x");

            
            this.props.history.push("/admin/page");
            

        })
        .catch(err => {
            console.log(err.response.data.message);
            NotificationManager.error(err.response.data.message, 'Error');
            this.setState({
                password: ""
            });

        });
};


  render() {
    return (
        <Container className="container">
        <Header pageName="Login" />
        <Content>
            
        
                <Form className="admin-login form" onSubmit={this.handleSubmit} >

                    <Col>
                        <FormGroup className="admin-login">
                            <Label>University Email</Label>
                            <Input
                                type="text"
                                name="email"
                                id="email"
                                placeholder="Your uni email address..."
                                value={this.state.email}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </Col>
                    <br></br>
                    <Col>
                        <FormGroup className="admin-login">
                            <Label>Password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="********"
                                value={this.state.password}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </Col>
                    <br></br>
                    <Col>
                        <Button block type="submit" disabled={!this.validateForm()} >Login</Button>
                    </Col>
                    <Col className="login-img">
                        <br></br>
                        <img className="App-logo" src={universitylogo} alt="Cardiff University Logo" />
                    </Col>
                    
                </Form>
           

        </Content>
      </Container>
    );
  }
}

export default AdminLogin;
