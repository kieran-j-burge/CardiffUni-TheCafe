import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink} from "react-router-dom"
import { Nav, Dropdown } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Navbar extends Component {
  render() {
    return (
            <div className="navbar">
                <div className="logo">
                    Cafe
                    <FontAwesomeIcon icon='mug-hot' className="icon" />
                </div>
                <ul>
                    <li>
                        <NavLink to='/home'>
                            <FontAwesomeIcon icon='home' className="icon" />
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/feedback/view'>
                            <FontAwesomeIcon icon='edit' className="icon" />
                            View Feedback
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/feedback/add'>
                            <FontAwesomeIcon icon='plus' className="icon" />
                            Add Feedback
                        </NavLink>
                    </li>
                    {/* <li>
                        <NavLink to='/gradetrack'>
                            <FontAwesomeIcon icon='list-ul' className="icon" />
                            Grade Tracker
                        </NavLink>
                    </li> */}
                    <li>
                        <NavLink to='/gradecalc'>
                            <FontAwesomeIcon icon='calculator' className="icon" />
                            Grade Calculator
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/actionplan'>
                            <FontAwesomeIcon icon='map' className="icon" />
                            Action Plan
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/resources'>
                            <FontAwesomeIcon icon='book' className="icon" />
                            Resources
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/analytics'>
                            <FontAwesomeIcon icon='chart-bar' className="icon" />
                            Analytics
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/account'>
                            <FontAwesomeIcon icon='user-circle' className="icon" />
                            Account
                        </NavLink>
                    </li>
                </ul>

                
            </div>
        
    );
  }
}

export default Navbar;