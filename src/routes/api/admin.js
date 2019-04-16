import bcrypt from "bcrypt";
import express from "express";
import crypto from "crypto";
import { Admin } from "../../models/index";
import BCRYPT_SALT_ROUNDS from "../../config/saltRounds.js";
// import API_RESPONSES from "../../config/multilingualApiResponses";
// import schoolColleges from "../../config/schoolColleges";

const router = express.Router();

router.post("/login", (req, res) => {
  // language setup
  var lang = typeof req.query.lang === "undefined" ? "english" : req.query.lang;

  Admin.findOne({ email: req.body.email })
    .catch(err =>
      res.status(403).json({
        success: false,
        message: "incorrectUsernameOrPassword"
      })
    )
    .then(admin => {
      if (typeof admin === "undefined" || admin === null) {
        res.status(403).json({
          success: false,
          message: "incorrectUsernameOrPassword"
        });
      } else {
        // removes password from json resp
        // returning password introduces a security risk!
        let adminReturn = {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
         
        };

        bcrypt.compare(req.body.password, admin.password).then(bcryptRes => {
			
          //console.log(bcryptRes);
          // create token and set expiry
          if (bcryptRes == false) {
			  console.log("false pass")
            res.status(403).json({
              success: false,
              message: "Incorrect Username Or Password"
            });
          } else {
            //console.log(bcryptRes);
            // create token and set expiry
			res.json({
				success: true,
				message: "Correct",
				admin: adminReturn
			  });
          }
        });
      }
    });
});

router.post("/register", (req, res) => {
  // language setup
  console.log(req.body)
  console.log("hello")
  


	// password must be hashed before being stored in db
	let password_to_hash = req.body.password;
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
		// now we can write after checks have been completed
		const newAdmin = new Admin({
			name: req.body.name,
			email: req.body.email,
			password: hash,
			});
			newAdmin
			.save()
			.catch(err => {
				if(err.code === 11000){
					res.json({
						msg: "email is already used"
					})
				}

			} )
			.then(created => res.json(created));
	

});
})

export default router;
