import express from "express";
import { Feedback } from "../../models/index";
import { Module } from "../../models/index";

const router = express.Router();

// @route GET api/feedback/fetch
// @desc Get all feedback
// @access Public
router.get("/fetch-all", (req, res) => {
  Feedback.find()
    .sort({ date: -1 })
    .then(feedback => res.json(feedback));
});

// @route GET api/feedback/fetch/:id
// @desc Get feedback using id as key
// @access Public
router.get("/fetch/:id", (req, res) => {
  Feedback.findById(req.params.id)
    .catch(err => res.status(404).json({ success: false }))
    .then(feedback => res.json(feedback));
});

router.get("/studentData/:studentId", (req, res) => {
  Feedback.find({ studentId: req.params.studentId })
    .catch(err => res.status(404).json({ success: false }))
    .then(feedback => res.json(feedback));
});

// @route POST api/feedback/create
// @desc Create feedback
// @access Public
router.post("/create", (req, res) => {
const {newModule} = req.body
  return new Promise((resolve, reject) => {
    Module.findOne({name: newModule.name}, (e, found) => {
        if (!found) {
            reject(new Error(`Module ${newModule.name} does not exist`))
        } else {
            return found
        }
    }).then(found => { 
       let assessment  = null
       for (let idx in found.assessments) {
           if ( found.assessments[idx].name === newModule.assessments.name) {
            assessment = idx
            break
           }
       }
        if (!assessment) {
            reject(new Error(`Assessment ${newModule.assessments.name} does not exist`))
        } else {
            found.assessments[assessment].feedback.push({...newModule.assessments.feedback})
            if (!found.assessments[assessment].grades.some(e => e.student_id === newModule.assessments.grade.student_id)) {
              found.assessments[assessment].grades.push({...newModule.assessments.grade})
            }
        }
        found.save()
      }).catch(e => console.log(e))
   });
  /*
  const newFeedback = new Feedback({
    name: req.body.name,
    positiveFeedback: req.body.positiveFeedback,
    negativeFeedback: req.body.negativeFeedback,
    result: req.body.result,
    skill: req.body.skill,
    moduleCode: req.body.moduleCode
  });

  console.log("shitter");
  console.log(newFeedback);
  newFeedback
    .save()
    .catch(err => res.status(404))
    .then(feedback => res.json(feedback));
    */
});

// @route DELETE api/feedback/delete/:id
// @desc Delete feedback
// @access Public
router.delete("/delete/:id", (req, res) => {
  Feedback.findById(req.params.id)
    .catch(err => res.status(404).json({ success: false }))
    .then(feedback =>
      feedback.remove().then(() => res.json({ success: true }))
    );
});





export default router;
