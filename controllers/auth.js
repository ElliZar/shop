const User = require("../models/User");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken'); // to generate signed jsonwebtoken
const expressJwt = require("express-jwt"); //  for auth check

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  };
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    };
    // user.salt = undefined;
    // user.hashed_password = undefined;
    return res.status(200).json({ user });
  })
};

exports.signin = (req, res) => {
  // find the user based on Email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "User with that email does not exist"
      });
    }
    // if user is found make sure that email and password matches
    // create auth method in user model
    if (!user.authenticate(password)) {
      return res.status(401).json({
        err: "Password don't match"
      });
    };
    // generate a signed token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // persist the token as "t" in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 })
    // return response with user and token to frontend client
    const { _id, name, email, role } = user;
    return res.status(200).json({
      token,
      user: {
        _id,
        name,
        email,
        role
      }
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ msg: "Signout success" });
};

exports.checkAuth = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id
  if (!user) {
    return res.status(401).json({ err: "Access denied" })
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      err: "Admin resourse. Access denied"
    })
  }
  next();
}
