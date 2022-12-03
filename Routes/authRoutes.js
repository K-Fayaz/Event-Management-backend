const express   = require("express");
const router    = express.Router();
const controller = require("../Controller/auth.controller");

router.post("/confirm/email/",controller.confirm_email);

router.get("/get/cookie/email/confirm",controller.get_confirmation_cookie);


router.post("/user/register/",controller.register_user);

module.exports = router;
