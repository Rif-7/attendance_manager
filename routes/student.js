const express = require("express");
const router = express.Router();
const student_controller = require("../controllers/studentController");

router.post("/", student_controller.create_student);
router.get("/", student_controller.get_student_list);
router.put("/:student_id", student_controller.update_student);
router.get("/:student_id", student_controller.get_student_info);
router.post("/:student_id", student_controller.set_fingerprint_id);
router.get("/rollno/:rollno", student_controller.get_student_by_rollno);

module.exports = router;
