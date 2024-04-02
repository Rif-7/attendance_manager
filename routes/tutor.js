const express = require("express");
const router = express.Router();
const tutor_controller = require("../controllers/tutorController");

router.post("/", tutor_controller.create_tutor);
router.get("/", tutor_controller.get_tutor_list);
router.put("/:tutor_id", tutor_controller.update_tutor);
router.get("/:tutor_id", tutor_controller.get_tutor_info);

module.exports = router;
