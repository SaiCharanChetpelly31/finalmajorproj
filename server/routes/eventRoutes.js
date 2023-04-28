const express = require("express");
const router = express.Router();

const {
  postEvent,
  allEvents,
  particularEvent,
  deleteEvent,
  checkin,
  loadparticularEvent
} = require("../controllers/eventController");

router.route("/post/event").post(postEvent);
router.route("/getallevents").get(allEvents);
router.route("/getevent").post(particularEvent);
router.route("/loadgetevent").post(loadparticularEvent);
router.route("/deleteevent").post(deleteEvent);
router.route("/event/checkin").post(checkin);
router.route("/eve")

module.exports = router;
