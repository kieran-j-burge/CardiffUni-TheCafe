import React from "react";
import Plot from "react-plotly.js";

const SkillsRatingGraphs = props => {
  let xAxisSkills = props.xAxis;
  let yAxisSkillsRating = props.yAxis;

  return (
    <div>
      <Plot
        data={[{ type: "bar", x: xAxisSkills, y: yAxisSkillsRating }]}
        // layout={{ width: 400, height: 400, title: "A Fancy Plot" }}
      />
    </div>
  );
};

export default SkillsRatingGraphs;
