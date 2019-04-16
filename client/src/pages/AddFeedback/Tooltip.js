import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';

class Tooltips extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            tooltipOpen: false
        };
    }

    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }



    render() {
        return (
            <div>
                <i id="Tooltip" className="fas fa-info-circle"/>
                <Tooltip placement="right" isOpen={this.state.tooltipOpen} target="Tooltip" toggle={this.toggle}>
                    {this.props.tooltipComment}
                </Tooltip>
            </div>
        );
    }
}
export default Tooltips;