import express from "express";
import { Module } from "../../models/index";
import { rejects } from "assert";

const router = express.Router();

// get all modules from database getting@ api/module/get
router.get("/get", (req, res) => {
  Module.find()
    .populate({
      path: "assessments.feedback.skill",
      populate: {
        path: "resources",
        model: "resources"
      }
    })
    //   .populate("assessments.feedback.skill")
    //   .populate({
    //     path: 'assessments.feedback.skill.resources',
    //     model: 'resources'
    // })

    .sort({ date: -1 })
    .then(module => res.json(module));
});

// Get all the module names
router.get("/get/moduleNames", (req, res) => {
  Module.find()
    .catch(e => console.log(e))
    .then(names => {
      let data = [];

      names.forEach(result => {
        const module = {
          code: result["name"],
          name: result["moduleName"]
        };
        data.push(module);
      });
      res.json(data);
    });
});

// Get all the assessment names
router.post("/get/assessmentNames", (req, res) => {
  Module.findOne({ name: req.body.name })
    .catch(e => console.log(e))
    .then(mod => {
      let assessmentNames = [];

      mod.assessments.forEach(bongo => {
        assessmentNames.push(bongo.name);
      });
      res.json(assessmentNames);
    });
});

// Get all the grades for a studnet in an assessment
router.get("/get/modByModByStudent/:modCode/:studentId", (req, res) => {
  Module.find({
    name: req.params.modCode,
    "assessments.grades.student_id": req.params.studentId,
    "assessments.feedback.userId": req.params.studentId
  })
    .populate()
    .catch(err => res.status(404))
    .then(modules => {
      res.json(modules);
    });
});

// Add a new assessment
router.post("/add/assessment", (req, res) => {
  const bungus = req.body;
  return new Promise((resolve, reject) => {
    Module.findOne({ name: bungus.module }, (err, found) => {
      if (!found) {
        reject(new Error(`Module ${bungus.module} does not exist`));
      } else {
        return found;
      }
    })
      .then(found => {
        const newAssessment = {
          name: bungus.assessmentName,
          feedback: [{}]
        };
        found.assessments.push(newAssessment);
        found.save();
      })
      .catch(e => console.log(e));
  });
});

// get a module by the name of the module
router.get("/fetch/:name", (req, res) => {
  console.log(".....");
  Module.find({ name: req.params.name })
    .catch(err => res.status(404).json({ success: false }))
    .then(module => res.json(module));
});

// adding module to the database posting @ api/module/get
router.post("/add", (req, res) => {
  let mod = req.body;

  const newMod = new Module({
    name: mod.name,
    assessments: mod.assessments
  });

  // Check if module name exists, if not then create the module
  Module.countDocuments({ name: mod.name }, function(err, count) {
    if (count === 0) {
      newMod
        .save()
        .catch(err => console.log(err))
        .then(newMod => res.json(newMod));
    }
  });
});

// @route GET api/feedback/userSkills
// @desc Get all feedback with user id
// @access Public
router.post("/get/skills/user", (req, res) => {
  const userId = req.body.userId;
  Module.find({ "assessments.feedback.userId": userId })
    .populate("assessments.feedback.skill")
    .catch(err => console.log(err))
    .then(data => {
      let feedbacks = [];

      // loop through and get all the feedaback and add them to to feedback lists
      data.forEach(item => {
        item.assessments.forEach(assessment => {
          assessment.feedback.forEach(feedback => {
            if (feedback["skill"] !== "undefined") {
              feedbacks.push(feedback);
            }
          });
        });
      });
      res.json(feedbacks);
    });
});

router.get("/test/:userid", (req, res) => {
  let x = [];
  Module.find()
    .populate({
      path: "assessments.feedback.skill",
      populate: {
        path: "resources",
        model: "resources"
      }
    })
    .catch(err => console.log(err))
    .then(data => {
      let userModules = [];
      data.forEach(modules => {
        modules["assessments"].forEach(assessment => {
          assessment["grades"].forEach(grades => {
            if (grades["student_id"] === req.params.userid) {
              if (userModules.indexOf(modules) < 0) {
                userModules.push(modules);
              }
            }
          })
        })
      })
      res.json(userModules)
    })
})

  router.get("/moduleCodes/:userid", (req, res) => {
      let x = []
      Module.find().populate({
          path: 'assessments.feedback.skill',
          populate: {
              path: 'resources',
              model: 'resources'
          }})
          .catch(err => console.log(err))
          .then(data => {
              let userModules = []
              data.forEach((modules) => {
                  modules['assessments'].forEach(assessment => {
                      assessment['grades'].forEach(grades => {
                          if (grades['student_id'] === req.params.userid) {
                              if(userModules.indexOf(modules) < 0){
                                  userModules.push(modules.name)
                              }

                          }
                      })
                  })
              })
              res.json(userModules)
          })
  })

router.get("/skills/:userId", (req, res) => {
  Module.find({ "assessments.feedback.userId": req.params.userId })
    .populate("assessments.feedback.skill")
    .catch(err => console.log(err))
    .then(data => {
      let feedbacks = [];

      // loop through and get all the feedaback and add them to to feedback lists
      data.forEach(item => {
        item.assessments.forEach(assessment => {
          assessment.feedback.forEach(feedback => {
            if (feedback["skill"] !== "undefined") {
              feedbacks.push(feedback);
            }
          });
        });
      });
      res.json(feedbacks);
    });
});

export default router;
