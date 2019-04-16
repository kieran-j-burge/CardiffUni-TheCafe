import express from "express";
import { ActionPlan } from "../../models/index";
import { rejects } from "assert";
import { Types } from "mongoose";

const router = express.Router();

// get all actionplan from database getting@ api/module/get
router.get("/get/:studentId", (req, res) => {
  ActionPlan.find({ student: req.params.studentId })
    .populate("resources")
    .sort({ date: -1 })
    .then(actionplan => res.json(actionplan));
});

router.get("/getAll", (req, res) => {
  ActionPlan.find()

    .sort({ date: -1 })
    .then(actionplan => res.json(actionplan));
});

router.post("/update", (req, res) => {
  ActionPlan.findById(req.body._id, function(err, actionplan) {
    console.log(actionplan);

    if (!actionplan) {
      res.status(404).send("data is not found");
    } else {
      actionplan.done = req.body.done;
      actionplan
        .save()
        .then(newAction => res.json("updated"))
        .catch(err => console.log(err));
    }
  });
});

router.post("/update/resource", (req, res) => {
  ActionPlan.findById(req.body._id, function(err, actionplan) {
    console.log(actionplan);

    if (!actionplan) {
      res.status(404).send("data is not found");
    } else {
      actionplan.didVote = req.body.didVote;
      actionplan
        .save()
        .then(newAction => res.json("updated"))
        .catch(err => console.log(err));
    }
  });
});

router.post("/update/note", (req, res) => {
  ActionPlan.findById(req.body._id, function(err, actionplan) {
    console.log(actionplan);

    if (!actionplan) {
      res.status(404).send("data is not found");
    } else {
      actionplan.note = req.body.note;
      actionplan
        .save()
        .then(newAction => res.json("updated"))
        .catch(err => console.log(err));
    }
  });
});

router.get("/delete/:id", (req, res) => {
  console.log(req.params.id);

  ActionPlan.find({ _id: req.params.id })
    .deleteOne()
    .exec(function(err, expense) {
      if (err) res.send(err);
      res.send("Expense successfully deleted!");
    });
});

router.post("/add", (req, res) => {
  let mod = req.body;
  console.log(mod.moduleCode);
  const newAction = new ActionPlan({
    skillName: mod.skillName,
    dueDate: mod.dueDate,
    moduleCode: mod.moduleCode,
    resources: mod.resources,
    didVote: mod.didVote,
    student: mod.student,
    note: mod.note
  });
  newAction
    .save()
    .catch(err => console.log(err))
    .then(newAction => res.json(newAction));
  // console.log(newAction)
  // // Check if module name exists, if not then create the module
  // ActionPlan.countDocuments({ skillName: mod.skillName }, function(err, count) {
  //   console.log(count)
  //   if (count === 0) {
  // 	newAction
  //       .save()
  //       .catch(err => console.log(err))
  //       .then(newAction => res.json(newAction));
  //   }
  // });
});

// get all action plans with student id @ api/module/get
router.get("/get/:studentId", (req, res) => {
  ActionPlan.find({ student: req.params.studentId.toObjectId() })
    .populate()
    .catch(err => res.status(404))
    .then(actionplans => res.json(actionplans));
});

String.prototype.toObjectId = function() {
  var ObjectId = require("mongoose").Types.ObjectId;
  return new ObjectId(this.toString());
};

// get all action plans with student id @ api/module/get
router.get("/get/:studentId/:modCode", (req, res) => {
  ActionPlan.find({
    student: req.params.studentId.toObjectId(),
    moduleCode: req.params.modCode
  })
    .populate()
    .catch(err => res.status(404))
    .then(actionplans => res.json(actionplans));
});

export default router;
