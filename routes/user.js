const router = require("express").Router();

const { userById } = require("../controllers/user");
const { checkAuth, isAuth, isAdmin } = require("../controllers/auth");

router.get("/secret/:userId", checkAuth, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile
  })
});



router.param("userId", userById);


module.exports = router;
