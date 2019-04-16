import { Schema, model } from "mongoose";

import actionPlanSchema from "../actionPlan/index";

// 604800000 - milliseconds in one week
const loginTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true
    },
    expires: {
      type: Date,
      required: true,
      default: new Date(Date.now() + 604800000)
    }
  },
  {
    _id: false
  }
);

const studentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  college: {
    type: String,
    required: true
  },
  school: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  desiredGrade: {
    type: String,
    required: true
  },
  modules: {
    type: Map
  },
  actionPlans: [{type: Schema.Types.ObjectId, ref: 'actionplan'}],
  loginTokens: [
    {
      type: loginTokenSchema
    }
  ]
});

const Student = model("students", studentSchema);

export default Student;
