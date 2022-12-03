const express     = require("express");
const controller  = require("../Controller/event.controller");

const router  = express.Router();


router.get("/get/events",controller.get_events);


router.post("/post/events",controller.post_event);

module.exports = router;
