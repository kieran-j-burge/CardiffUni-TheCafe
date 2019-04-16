import bcrypt from "bcrypt";
import express from "express";
import crypto from "crypto";
import { Student } from "../../models/index";
import BCRYPT_SALT_ROUNDS from "../../config/saltRounds.js";
import API_RESPONSES from "../../config/multilingualApiResponses";
import schoolColleges from "../../config/schoolColleges";

const router = express.Router();

router.get("/getAll", (req, res) => {
  Student.find()
    .catch(err => res.status(404).json({ success: false }))
    .then(student => res.json(student.length));
});

router.get("/:studentId", (req, res) => {
  Student.findById(req.params.id)
    .catch(err => res.status(404).json({ success: false }))
    .then(student => res.json(student));
});
// sandbox route for debugging purposes

router.get("/fetch/:id", (req, res) => {
  Student.findById(req.params.id)
    .catch(err => res.status(404).json({ success: false }))
    .then(student => {
      res.json(student);
    });
});

router.get("/:id", (req, res) => {
  Student.find({ _id: req.params.id })
    .catch(err => res.status(404).json({ success: false }))
    .then(student => res.json(student));
});

router.post("/login", (req, res) => {
  // language setup
  var lang = typeof req.query.lang === "undefined" ? "english" : req.query.lang;

  Student.findOne({ email: req.body.email })
    .catch(err =>
      res.status(403).json({
        success: false,
        message: API_RESPONSES.incorrectUsernameOrPassword[lang]
      })
    )
    .then(student => {
      if (typeof student === "undefined" || student === null) {
        res.status(403).json({
          success: false,
          message: API_RESPONSES.incorrectUsernameOrPassword[lang]
        });
      } else {
        // removes password from json resp
        // returning password introduces a security risk!
        let studentToReturn = {
          _id: student._id,
          name: student.name,
          email: student.email,
          college: student.college,
          school: student.school,
          desiredGrade: student.desiredGrade,
          actionPlans: student.actionPlans
        };

        bcrypt.compare(req.body.password, student.password).then(bcryptRes => {
          //console.log(bcryptRes);
          // create token and set expiry
          if (bcryptRes == false) {
            res.status(403).json({
              success: false,
              message: API_RESPONSES.incorrectUsernameOrPassword[lang]
            });
          } else {
            //console.log(bcryptRes);
            // create token and set expiry
            let tokenString = crypto.randomBytes(32).toString("hex");

            let token = {
              token: tokenString
            };

            Student.updateOne(
              { _id: student._id },
              { $push: { loginTokens: token } }
            )
              .catch(err =>
                res.status(500).json({
                  success: false,
                  message: API_RESPONSES.incorrectUsernameOrPassword[lang]
                })
              )
              .then(updateResp =>
                res.json({
                  success: true,
                  message: API_RESPONSES.loginSuccessful[lang],
                  student: studentToReturn,
                  token: tokenString
                })
              )
              .catch(err =>
                res.status(500).json({
                  success: false,
                  message: API_RESPONSES.incorrectUsernameOrPassword[lang]
                })
              );
          }
        });
      }
    });
});

router.post("/register", (req, res) => {
  // language setup
  var lang = typeof req.query.lang === "undefined" ? "english" : req.query.lang;

  // must check if user already exists in collection
  Student.findOne({ email: req.body.email })
    .catch(err =>
      res.status(500).json({
        success: false,
        message: "findone fail"
      })
    )
    .then(studentRes => {
      if (typeof studentRes !== "undefined" && studentRes !== null) {
        res.status(400).json({
          success: false,
          message: API_RESPONSES.registrationUserExists[lang]
        });
      } else {
        // password must be hashed before being stored in db
        let password_to_hash = req.body.newPassword;
        bcrypt
          .hash(password_to_hash, BCRYPT_SALT_ROUNDS)
          .catch(err =>
            res.status(500).json({
              success: false,
              message: "hash fail"
            })
          )
          .then(hash => {
            req.body.password = hash;
            req.body.college = schoolColleges[req.body.school];

            // now we can write after checks have been completed
            Student.create(req.body)
              .catch(err =>
                res.status(500).json({
                  success: false,
                  message: "create fail",
                  error: err
                })
              )
              .then(student =>
                res.json({
                  success: true,
                  message: API_RESPONSES.registrationSuccess[lang]
                })
              );
          });
      }
    });
});

router.get("/validate/:id/:token", (req, res) => {
  // language setup
  var lang = typeof req.query.lang === "undefined" ? "english" : req.query.lang;

  Student.findById(req.params.id)
    .catch(err =>
      res.status(403).json({
        success: false,
        message: API_RESPONSES.validateFail[lang]
      })
    )
    .then(student => {
      if (student !== null) {
        //&& student.loginTokens.indexOf(req.params.token) >= 0) {
        let potentialLoginToken = student.loginTokens.find(t => {
          return t.token === req.params.token;
        });

        if (
          typeof potentialLoginToken === "undefined" ||
          potentialLoginToken.expires < new Date(Date.now())
        ) {
          res.status(403).json({
            success: false,
            message: API_RESPONSES.validateFail[lang]
          });
        } else {
          // removes password from json resp
          // returning password introduces a security risk!
          let studentToReturn = {
            _id: student._id,
            name: student.name,
            email: student.email,
            college: student.college,
            school: student.school,
            desiredGrade: student.desiredGrade,
            actionPlans: student.actionPlans
          };

          res.json({
            success: true,
            message: API_RESPONSES.validateSuccess[lang],
            student: studentToReturn
          });
        }
      } else {
        res.status(403).json({
          success: false,
          message: API_RESPONSES.validateFail[lang]
        });
      }
    });
});

router.post("/logout", (req, res) => {
  // language setup
  var lang = typeof req.query.lang === "undefined" ? "english" : req.query.lang;

  let query = {
    loginTokens: {
      $pull: req.body.token
    }
  };

  Student.findByIdAndUpdate(req.body.studentId, query)
    .then(result =>
      res.status(200).json({
        success: true,
        message: "logout successful"
      })
    )
    .catch(err =>
      res.status(500).json({
        success: false,
        message: err
      })
    );
});

router.post("/update-account", (req, res) => {
    // language setup
    var lang = (typeof req.query.lang === "undefined") ? "english" : req.query.lang;

    if (req.body.email.endsWith("@cardiff.ac.uk")) {
        Student.findById(req.body.id)
            .then(student => {
                // there's no point pretending...
                if (student != null) {
                    let potentialToken = student.loginTokens.find((t) => {
                        return t.token === req.body.token && t.expires > Date.now();
                    });

                    // no point if token doesn't match criteria
                    if (potentialToken == null) {
                        res.status(403).json({
                            success: false,
                            message: API_RESPONSES.validateFail[lang]
                        });
                    } else {
                        bcrypt.compare(req.body.oldPassword, student.password)
                            .then(bcryptRes => {
                                if (bcryptRes == false) {
                                    res.status(403).json({
                                        success: false,
                                        message: API_RESPONSES.validateFail[lang]
                                    });
                                } else if (req.body.newPassword !== req.body.confirmPassword) {
                                    res.status(403).json({
                                        success: false,
                                        message: "new password and confirm password do not match!"
                                    });
                                } else {
                                    let newStudentData = {
                                        name: req.body.name,
                                        email: req.body.email,
                                        language: req.body.language,
                                        school: req.body.school,
                                        desiredGrade: req.body.desiredGrade,
                                    };

                                    if (req.body.newPassword.length > 0) {
                                        newStudentData["password"] = bcrypt.hashSync(req.body.newPassword, BCRYPT_SALT_ROUNDS);
                                    }

                                    console.log(newStudentData);

                                    let updateQuery = {
                                        $set: newStudentData
                                    }

                                    // replace student data
                                    Student.findByIdAndUpdate(student._id, updateQuery)
                                        .then(mongooseRes => res.status(200).json({
                                            success: true,
                                            message: "account information was updated"
                                        }))
                                        .catch(err => res.status(500).json({
                                            success: false,
                                            message: "An error occurred, please try again later",
                                            error: err
                                        }));
                                }
                            });
                    }
                } else {
                    res.status(400).json({
                        success: false,
                        message: "student doesn't exist"
                    });
                }
            })
            .catch(err => res.status(500).json({
                success: false,
                message: "An error occurred, please try again later."
            }));
    } else {
        res.status(400).json({
            success: false,
            message: "new email address is not a cardiff university email address"
        });
    }
});

export default router;
