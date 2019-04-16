import { Schema, model } from "mongoose";

const FeedbackSchema = new Schema({
  name: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  },
  result: {
    type: Number,
    required: false
  },
  positiveFeedback: {
    type: String,
    require: false
  },
  negativeFeedback: {
    type: String,
    require: false
  },
  skill: {
    type: String,
    required: false
  },
  rating: {
    type: Number
  },
  assessmentId: {
    type: String
  },
  moduleCode: {
    type: String,
    required: false
  }
});

const Feedback = model("feedback", FeedbackSchema);

export default Feedback;
