import express from "express";
import { Assessment } from "../../models/index";

const router = express.Router();

router.get("/", (req, res) => {
  Assessment.find()
    .sort({ date: -1 })
    .then(assessment => res.json(assessment));
});

router.get("/:moduleCode", (req, res) => {
    Assessment.find({ moduleCode: req.params.moduleCode })
        .catch(err => res.status(404).json({ success: false }))
        .then(assessment => res.json(assessment));
});

export default router;
