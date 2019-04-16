import { Schema, model } from "mongoose";

const SimsModulesSchema = new Schema({
  name: String,
  code: String,
  student_id: String,
  weight: Number,
  taken: String,
  score: Number,
  assignments: [
    {
      name: String,
      weight: Number,
      score: String
    }
  ]
});

// const SimsModulesSchema = new Schema({
//   name: String,
//   student_id: String,
//   weight: Number,
//   taken: String,
//   assignments: [
//     {
//       name: String,
//       weight: Number,
//       score: String
//     }
//   ]
// });

const SimsModules = model("simsModules", SimsModulesSchema);

export default SimsModules;
