import express from "express";
import { SimsModules, Feedback } from "../../models/index";

const router = express.Router();

// get all student modules from the database
router.get("/get-student-modules-done/:id", (req, res) => {
  SimsModules.find({ taken: "yes", student_id: req.params.id })
    .catch(err => res.status(404))
    .then(simsModules => res.json(simsModules));
});

router.get("/get-student-modules-doing/:id", (req, res) => {
  SimsModules.find({ taken: "no", student_id: req.params.id })
    .catch(err => res.status(404))
    .then(simsModules => res.json(simsModules));
});

router.get("/:studentId", (req, res) => {
  SimsModules.find({ student_id: req.params.studentId })
    .catch(err => res.status(404))
    .then(simsModules => res.json(simsModules));
});

router.post("/add", (req, res) => {
  const simsModules = new SimsModules({
    name: req.body.name,
    student_id: req.body.student_id,
    weight: req.body.weight,
    taken: req.body.taken,
    assignments: req.body.assignments
  });

  simsModules
    .save()
    .catch(err => res.status(404))
    .then(simsModules => res.json(simsModules));
});

export default router;
