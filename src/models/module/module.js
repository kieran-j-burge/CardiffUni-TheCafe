import { Schema, model } from "mongoose";

const ModuleSchema = new Schema({
    name: String,
    moduleName: String,
    assessments: [{
      name: String,
      date: Date,
      grades: [{
        student_id: String,
        grade: Number
      }],
      feedback: [{
        comment: String,
        skill: {type: Schema.Types.ObjectId, ref: 'skills'},
        rating: Number,
        userId: String
      }]
    }]
});


const Module = model("module", ModuleSchema);

export default Module;
