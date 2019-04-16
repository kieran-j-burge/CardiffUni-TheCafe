import React, { Component } from "react";
import { Table as TableStrap, Collapse, Input } from "reactstrap";
import { Table } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

class ResourceDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skillDisplay: null,
      actionPlan: {},
      resources: [],
      resourceList: [],
      isHidden: true,
      x:false

    };
  }

  clearResources(i){
      console.log(i)
      var x = document.getElementsByClassName("number"+i)
      if(x[0] != null && this.props.isNew){
        document.getElementsByClassName("number"+i)[0].style.backgroundColor="white"
        x[0].firstChild.getElementsByClassName("check-icon")[0].style.display = "none"
      }
 
  }
  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    });
  }
  selectResource = (e, resource, index) => {
    console.log(this.props.isNew)

   
    let resourceCopy = this.state.resourceList;
    if(this.props.isNew){
      console.log("in")
      resourceCopy = []
    }
    if (resourceCopy.indexOf(resource) > -1) {
      e.currentTarget.getElementsByClassName("check-icon")[0].style.display =
        "none";
      e.currentTarget.style.backgroundColor = "white";
      resourceCopy.splice(resourceCopy.indexOf(resource), 1);
    } else {
      e.currentTarget.style.backgroundColor = "#ccc";
      e.currentTarget.getElementsByClassName("check-icon")[0].style.display =
        "inline";
      resourceCopy.push(resource);
      // e.currentTarget.className.= 'block'
    }

    this.setState({
      resourceList: resourceCopy
    });

    this.props.selectedResource(resourceCopy);
  };

  render() {
    return (
      <div className="action-resources box">
        <div className="actionPlan-bar" onClick={this.props.toggleResources}>
          <FontAwesomeIcon
            icon={this.props.displayResources ? "minus" : "plus"}
            className="iconx"
          />
          <h4 className="ap-title">Step 3: Select Resources </h4>
					<h6 className="actionplan-validation">{this.props.isSelected ? "" : "*Select Resources*"}</h6>
        </div>
				{this.props.resources.length>0 ? <Collapse isOpen={this.props.displayResources}>
          <div className="actionPlan">
            <TableStrap>
              <thead>
                <tr>
                  <th>
                    <FontAwesomeIcon icon="check-circle" className="xx" />
                  </th>
                  <th>Resource Name</th>
                  <th>Resource Type</th>
                  <th>Resource Rating</th>
                  <th>Estimated Time To Finish</th>
                </tr>
              </thead>

              <thead>
                {this.props.resources.map((resource, i) => {
                 
                  return (
                    
                    <tr
                      onClick={e => this.selectResource(e, resource, i)}
                      className={"feedback-row"+ " number"+i}
                      key={i} 
                    >
                      <td className="icon">
                        <FontAwesomeIcon
                          icon="check-circle"
                          className="check-icon"
                          style={{ display: "none" }}
                          
                        />
                         
                      </td>
                      <td>{resource.name}</td>
                      <td>{resource.type}</td>
                      <td>{resource.rating}</td>
                      <td>{resource.ect}</td>
                      {this.clearResources(i)}
                    </tr>
                    
                  );

                })}
              </thead>
            </TableStrap>
          </div>
        </Collapse> :""}
        
      </div>
    );
  }
}

export default ResourceDisplay;
