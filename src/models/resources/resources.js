import { Schema, model } from "mongoose";

const ResourcesSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: false
  },
  source: {
    type: String,
    required: false
  },
  skill: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  ect: {
    type: Number,
    required: false
  },
  rating: {
    type: Number,
    required: false
  },
  description: {
    type: String,
    required: false
  }
});

const Resources = model("resources", ResourcesSchema);

export default Resources;
