const Attendance = require("../models/Attendance");
const Class = require("../models/Class");
const Exam = require("../models/Exam");
const { body, validationResult } = require("express-validator");

exports.create_exam = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage("Exam name should be between 1-25 characters")
    .isAlphanumeric()
    .withMessage("Exam name should only contain alphannumeric characters")
    .escape(),
  body("date", "Invalid date").toDate(),
  body("time")
    .trim()
    .custom((time) => {
      if (time != "FN" && time != "AN") {
        throw new Error("Exam time should either be 'FN' or 'AN'");
      }
    })
    .escape(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0] });
      }

      if (
        !req.params.class_id ||
        !mongoose.Types.ObjectId.isValid(req.params.class_id)
      ) {
        return res
          .status(400)
          .json({ error: "Class ID is either missing or of invalid type" });
      }

      const class_ = await Class.findById(req.params.class_id);
      if (!class_) {
        return res.status(404).json({ error: "Class not found" });
      }

      const exam = new Exam({
        name: req.params.name,
        date: req.params.date,
        time: req.params.time,
        class: class_.id,
      });

      await exam.save();
      return res
        .status(200)
        .json({ success: "Exam created successfully", exam_id: exam.id });
    } catch (err) {
      return next(err);
    }
  },
];

exports.get_exam_list = async (req, res, next) => {
  try {
    const exam_list = await Exam.find().populate("class", "name current_sem");
    return res.status(200).json({ exam_list });
  } catch (err) {
    return next(err);
  }
};

exports.get_exam_info = async (req, res, next) => {
  try {
    if (
      !req.params.exam_id ||
      !mongoose.Types.ObjectId.isValid(req.params.exam_id)
    ) {
      return res
        .status(400)
        .json({ error: "Exam ID is either missing or of invalid type" });
    }

    const exam = await Exam.findById(req.params.exam_id);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const attendance_list = await Attendance.find({ exam: exam.id })
      .populate("time_formatted")
      .populate("student", "f_name l_name rollno");

    return res.status(200).json({ exam, attendance_list });
  } catch (err) {
    return next(err);
  }
};
