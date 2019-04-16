import express from "express";
import { Skills } from "../../models/index";
import { rejects } from "assert";

const router = express.Router();

// get all skills from database getting@ api/skills/get
router.get("/get", (req, res) => {
  Skills.find()
    .populate({
      path: "resources",
      model: "resources"
    })
    .then(skills => res.json(skills));
});

router.get("/hyponym/:hyponym", (req, res) => {
  Skills.find({ hyponym: req.params.hyponym }).then(skills => res.json(skills));
});

router.get("/name/:name", (req, res) => {
  Skills.find({ name: req.params.name }).then(skills => res.json(skills));
});

router.post("/add/skill", (req, res) => {
  Skills.find({ name: req.body.skill }, function(err, skill) {
    console.log(skill[0]);

    if (skill.length === 0) {
      const newSkill = new Skills({
        name: req.body.skill,
        resources: req.body._id
      });
      console.log(newSkill);
      newSkill
        .save()
        .then(newAction => res.json("updated"))
        .catch(err => console.log(err));
    } else {
      console.log(skill[0].resources);

      // commented if resources has the same name use this if condition
      // if(resource=req.body._id){
      //     console.log("similar")
      // }
      // else{

      skill[0].resources.push(req.body._id);
      skill[0]
        .save()
        .then(newAction => res.json("updated"))
        .catch(err => console.log(err));
      // }
    }
  });
});

router.post("/update/skill", (req, res) => {
  Skills.find({ name: req.body.skill }, function(err, skill) {
    if (skill.length === 0) {
      const newSkill = new Skills({
        name: req.body.skill,
        resources: req.body._id
      });
      console.log("1", newSkill);
      newSkill
        .save()
        .then(newAction => res.json("updated"))
        .catch(err => console.log(err));
    } else {
      console.log("2", skill[0].resources);

      skill[0].resources.map((resource, index) => {
        // commented if resources has the same name use this if condition
        console.log("RESOURCE", resource);
        if (resource.toString() == req.body._id.toString()) {
          skill[0].resources.splice(index, 1);
          console.log("heaaeae", skill[0].resources);
        } else {
          console.log(resource.toString(), "vss", req.body._id.toString());
        }
      });
      skill[0]
        .save()
        .then(newAction => res.json("updated"))
        .catch(err => console.log(err));
    }
  });
});
export default router;
