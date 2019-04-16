import express from "express";
import { Resources } from "../../models/index";
import { Feedback } from "../../models";

const router = express.Router();

// @route GET api/resources/fetch
// @access Public
router.get("/", (req, res) => {
  Resources.find().then(resources => res.json(resources));
});

router.get("/fetchById/:id", (req, res) => {

  Resources.findById(req.params.id)
    .catch(err => res.status(404).json({ success: false }))
    .then(feedback => res.json(feedback));
});



router.post("/update/rating", (req, res) => {

  Resources.findById(req.body._id, function(err, resource) {
    console.log(resource)
   
    if (!resource){
    res.status(404).send("data is not found");
    }
    else{
      resource.rating = req.body.rating
      resource
      .save()
      .then(newAction => res.json('updated'))   
      .catch(err => console.log(err));
    }

 

 
    });
});

router.get("/fetchByName/:name", (req, res) => {
  Resources.find({

  })
    .catch(err => res.status(404).json({ success: false }))
    .then(feedback => res.json(feedback));
});

router.get("/fetchBySkill/:skill", (req, res) => {
  Resources.find({
    skill: {
      $regex: new RegExp(req.params.skill)
    }
  })
    .catch(err => res.status(404).json({ success: false }))
    .then(feedback => res.json(feedback));
});

router.get("/fetchByTag/:tags", (req, res) => {
  Resources.find({
    tags: {
      $regex: new RegExp(req.params.tags)
    }
  })
    .catch(err => res.status(404).json({ success: false }))
    .then(feedback => res.json(feedback));
});

router.get("/fetchByType/:type", (req, res) => {
  Resources.find({
    type: {
      $regex: new RegExp(req.params.type)
    }
  })
    .catch(err => res.status(404).json({ success: false }))
    .then(feedback => res.json(feedback));
});


router.get("/fetchByTag/:tag", (req, res) => {
    Resources.find({
        tag: {
            $regex: new RegExp(req.params.tag)
        }
    })
        .catch(err => res.status(404).json({ success: false }))
        .then(feedback => res.json(feedback));
});

router.get("/fetchBySource/:source", (req, res) => {
  Resources.find({
    source: {
      $regex: new RegExp(req.params.source)
    }
  })
    .catch(err => res.status(404).json({ success: false }))
    .then(feedback => res.json(feedback));
});

router.get("/fetchByFilter/:name/:skill/:source/:type", (req, res) => {
  Resources.find({
    name: {
      $regex: new RegExp(req.params.name)
    },
    skill: {
      $regex: new RegExp(req.params.skill)
    },
    source: {
      $regex: new RegExp(req.params.source)
    },
    type: {
      $regex: new RegExp(req.params.type)
    }
  })
    .catch(err => res.status(404).json({ success: false }))
    .then(resources => {
      console.log(resources);
      res.json(resources);
    });
});

//Fetch resource by id
router.get("/fetchById/:id", (req, res) => {
  Resources.find({ _id: req.params.id.toObjectId() })
    .populate()
    .catch(err => res.status(404))
    .then(resources => res.json(resources));
});

String.prototype.toObjectId = function() {
  var ObjectId = require("mongoose").Types.ObjectId;
  return new ObjectId(this.toString());
};

// @route POST api/resources/create
// @desc Create resource
// @access Public
router.post("/create", (req, res) => {

  Resources.find({'name':req.body.name}, function(err, resource) {
    
    if(resource.length === 0){
      const newResource = new Resources({
        name: req.body.name,
        skill: req.body.skill,
        type: req.body.type,
        source: req.body.source,
        link: req.body.link,
        ect: req.body.ect
      });
    
      newResource
        .save()
        .catch(err => res.status(404))
        .then(resources => res.json(resources));
    }
    else{
      res.status(403).json({
        success: false,
        message: "Resource is already Exists"
      });
    }
  });
  
});

// @route DELETE api/resources/delete/:id
// @access Public
router.delete("/delete/:id", (req, res) => {
  console.log(req.params.id)
  Resources.findById(req.params.id).deleteOne().exec(function(err, expense) {
    if(err)
     res.send(err)
    res.send('Expense successfully deleted!');
   })
});

export default router;
