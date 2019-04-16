import { Schema, model } from "mongoose";

const actionPlanSchema = new Schema({
    skillName: {
        type: String,

    },
    dueDate: {
        type: Date,

    },
    taskName: {
        type: String,

    },
    done: {
        type: Boolean,
        default: false

    },
    moduleCode: {
        type: String,

    },
    note: {
        type: String,

    },
    resources: [{type: Schema.Types.ObjectId, ref: 'resources'}],
    didVote: [{
        resourceId: String,
        vote: {
            type:Boolean,
            default: false,
        }

    }],
    student:{type: Schema.Types.ObjectId, ref: 'students'}
});
const ActionPlan = model("actionplan", actionPlanSchema);
export default ActionPlan;
