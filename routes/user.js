const router = require("express").Router();
const { check } = require('express-validator');

const {signup, signin, signout, checkAuth} = require("../controllers/user");

const validation = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Email must be between 3 to 32 characters")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
      min: 4,
      max: 32,
    }),
  check("password", "Password is required").not().isEmpty(),
  check("password")
      .isLength({min: 6})
      .withMessage("Password must content at least 6 characters")
      .matches(/\d/)
      .withMessage("Password must content a number")
]
router.post("/signup",validation, signup);
router.post("/signin", signin);
router.get("/signout", signout);


module.exports = router;
