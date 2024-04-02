const express = require("express");
const router = express.Router();
const class_controller = require("../controllers/classController");

router.post("/", class_controller.create_class);
router.get("/", class_controller.get_class_list);
router.get("/:class_id", class_controller.get_class_info);
router.put("/:class_id", class_controller.update_class);

module.exports = router;
