import React from "react";
import { Table } from "reactstrap";
import PropTypes from "prop-types";

const SkillsSummary = props => {
  const summaryTable = (
    <Table>
      <tr>
        <th scope="row">
          Top Skill <i className="fas fa-fire-alt" />
        </th>
        <td>{props.bestSkill}</td>
        <td>{props.bestSkillRating}</td>
      </tr>
      <tr>
        <th scope="row">
          Skill for Improvement <i className="fas fa-wrench" />
        </th>
        <td>{props.worstSkill}</td>
        <td>{props.worstSkillRating}</td>
      </tr>
    </Table>
  );
  return <div>{summaryTable}</div>;
};

export default SkillsSummary;

SkillsSummary.propTypes = {
  borderless: PropTypes.bool,
  responsive: PropTypes.bool
};
