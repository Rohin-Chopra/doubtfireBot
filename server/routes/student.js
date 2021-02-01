const { Router } = require("express");
const { route } = require("../app");
const { getUser, signUp } = require("./../controllers/student");

const router = new Router();

router.route("/").post(signUp);
router.route("/:id").get(getUser);

module.exports = router;
