import React, { Component } from "react";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: true,
      style: { height: 0 }
    };
    // this.feedbackTable = React.createRef()
    this.toggleHidden = this.toggleHidden.bind(this);
  }

  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden,
      style: {
        height: this.state.isHidden
          ? this.feedbackTable.current.scrollHeight
          : 0
      }
    });
  }

  render() {
    console.log(this.props);
    return (
      <div className="display-feedback box">
        {this.props.list.map((data, index) => {
          return (
            <div className="module-display" key={index}>
              <h3>Module: {data.key}</h3>
              {data.assessments.map((asm, i) => {
                return (
                  <div className="assessment-display" key={i}>
                    <h4>Assessment Name: {asm.name}</h4>
                    <h5>Assessment Grade: {asm.grade}</h5>
                    <h5>Assessment Date:{asm.date}</h5>
                    {asm.feedback.map((feedback, j) => {
                      return (
                        <div className="feedback-display" key={j}>
                          <p>Feedback Comment: {feedback.comment}</p>
                          <p>Feedback Skill: {feedback.skill}</p>
                          <p>Feedback Rating: {feedback.rating}</p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      // <React.Fragment>
      //     <div className="title-bar" onClick={this.toggleHidden.bind(this)}>
      //         <h3 className="skill-title">{this.props.list[0].skill}</h3>
      //         <FontAwesomeIcon icon={this.state.isHidden ? 'plus' : 'minus'} className="icon" />
      //     </div>
      //     <div ref={this.feedbackTable} className="feedback-table" style={this.state.style}>
      //         <TableStrap >
      //             <thead>
      //                 <tr>
      //                     <th>Assessment Name</th>
      //                     <th>What Went Well</th>
      //                     <th>What Could Be Improved</th>
      //                     <th>Result</th>
      //                     <th>Module Code</th>
      //                     <th>Date</th>
      //                 </tr>
      //             </thead>
      //             {this.props.list.map((list, i) => {
      //                 return (
      //                     <tr>
      //                         <td>{list.name}</td>
      //                         <td>{list.positiveFeedback}</td>
      //                         <td>{list.negativeFeedback}</td>
      //                         <td>{list.result}</td>
      //                         <td>{list.moduleCode}</td>
      //                         <td>{list.date}</td>
      //                     </tr>
      //                 )
      //             })}
      //         </TableStrap>
      //     </div>
      // </React.Fragment>
    );
  }
}

export default Table;
