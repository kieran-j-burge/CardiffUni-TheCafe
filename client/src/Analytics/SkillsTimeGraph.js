import React from "react";
import Plot from "react-plotly.js";

const SkillsTimeGraph = props => {

  return <Plot data={props.data} />;
};

export default SkillsTimeGraph;
