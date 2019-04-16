import { Schema, model } from "mongoose";

const AssessmentSchema = new Schema({
  moduleCode: {
    type: String
  },
  name: {
    type: String,
    default: Date.now
  },
  weighting: {
    type: Number,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Assessment = model("assessment", AssessmentSchema);

export default Assessment;
