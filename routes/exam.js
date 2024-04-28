const express = require("express");
const router = express.Router();
const exam_controller = require("../controllers/examController");

router.post("/", exam_controller.create_exam);
router.get("/", exam_controller.get_exam_list);
router.get("/today", exam_controller.get_todays_exams);
router.get("/:exam_id", exam_controller.get_exam_info);
router.get("/:exam_id/attendance", exam_controller.get_attendance_list);
router.post(
  "/:exam_id/attendance/:student_id",
  exam_controller.mark_attendance
);
router.delete(
  "/:exam_id/attendance/:student_id",
  exam_controller.unmark_attendance
);

router.post(
  "/fingerprint/:exam/:fingerprint_id",
  exam_controller.mark_fingerprint_attendance
);

module.exports = router;
