const Attendance = require("../models/Attendance");
const Class = require("../models/Class");
const Exam = require("../models/Exam");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const Student = require("../models/Student");

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
      if (time !== "FN" && time !== "AN") {
        throw new Error("Exam time should either be 'FN' or 'AN'");
      }
      return true;
    })
    .escape(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json({ error: errors.array()[0] });
      }
      if (
        !req.body.class_id ||
        !mongoose.Types.ObjectId.isValid(req.body.class_id)
      ) {
        return res
          .status(400)
          .json({ error: "Class ID is either missing or of invalid type" });
      }

      const class_ = await Class.findById(req.body.class_id);
      if (!class_) {
        return res.status(404).json({ error: "Class not found" });
      }

      const exam = new Exam({
        name: req.body.name,
        date: req.body.date,
        time: req.body.time,
        class: class_.id,
      });
      await exam.save();
      return res
        .status(200)
        .json({ success: "Exam created successfully", exam_id: exam.id });
    } catch (err) {
      console.log(err);
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

exports.mark_attendance = async (req, res, next) => {
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

    if (
      !req.params.student_id ||
      !mongoose.Types.ObjectId.isValid(req.params.student_id)
    ) {
      return res
        .status(400)
        .json({ error: "Student ID is either missing or of invalid type" });
    }

    const student = await Student.findById(req.params.student_id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (student.class != exam.class) {
      return res
        .status(409)
        .json({ error: "The student does not have this exam" });
    }

    const attendance = new Attendance({
      exam: exam.id,
      student: student.id,
    });

    await attendance.save();
    return res.status(200).json({ success: "Attendance marked successfully" });
  } catch (err) {
    return next(err);
  }
};

exports.unmark_attendance = async (req, res, next) => {
  try {
    if (
      !req.params.attendance_id ||
      !mongoose.Types.ObjectId.isValid(req.params.exam_id)
    ) {
      return res
        .status(400)
        .json({ error: "Attendance ID is either missing or of invalid type" });
    }

    await Attendance.findByIdAndDelete(req.params.attendance_id);
    return res.status(200).json({ success: "Attendance removed successfully" });
  } catch (err) {
    return next(err);
  }
};

exports.get_attendance_list = async (req, res, next) => {
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

    const attendance_list = await Attendance.find({
      exam: req.params.exam_id,
    }).populate("student", "f_name l_name rollno");

    const attended_ids = attendance_list.map((student) => student.student._id);
    const absentee_list = await Student.find({
      _id: { $nin: attended_ids },
      class: exam.class,
    });

    return res.status(200).json({ attendance_list, absentee_list });
  } catch (err) {
    return next(err);
  }
};
