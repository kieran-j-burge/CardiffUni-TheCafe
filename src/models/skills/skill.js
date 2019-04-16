import { Schema, model } from "mongoose";

const resourceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

const skillSchema = new Schema({
    name: String,
    resources: [{type: Schema.Types.ObjectId, ref: 'resources'}],
    hyponym: String


});

const Skills = model("skills", skillSchema);

export default Skills;
