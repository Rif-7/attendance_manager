const Student = require("../modles/Student");
const Class = require("../models/Class");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

exports.create_student = [
  body("f_name")
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage("Firstname should be between 1-25 characters")
    .isAlpha()
    .withMessage("Firstname should only contain alphabters")
    .escape(),
  body("l_name")
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage("Firstname should be between 1-25 characters")
    .isAlpha()
    .withMessage("Firstname should only contain alphabters")
    .escape(),
  body("rollno")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Roll number is required"),
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

      const roll_already_exists = await Student.find({
        rollno: req.params.rollno,
      });
      if (roll_already_exists) {
        return res
          .status(409)
          .json({ error: "Student with this roll number already exists" });
      }

      const student = new Student({
        f_name: req.params.f_name,
        l_name: req.params.l_name,
        class: class_.id,
        rollno: req.params.rollno,
      });
      await student.save();

      return res.status(200).json({ success: "Student created successfully" });
    } catch (err) {
      return next(err);
    }
  },
];

exports.get_student_list = async (req, res, next) => {
  try {
    const student_list = await Student()
      .find()
      .populate("class", "name current_sem");
    return res.status(200).json({ student_list });
  } catch (err) {
    return next(err);
  }
};

exports.update_student = [
  body("f_name")
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage("Firstname should be between 1-25 characters")
    .isAlpha()
    .withMessage("Firstname should only contain alphabters")
    .escape(),
  body("l_name")
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage("Firstname should be between 1-25 characters")
    .isAlpha()
    .withMessage("Firstname should only contain alphabters")
    .escape(),
  body("rollno")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Roll number is required"),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0] });
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

      student.f_name = req.params.f_name;
      student.l_name = req.params.l_name;
      student.rollno = req.params.rollno;
      student.class = class_.id;
      await student.save();

      return res.status(200).json({ success: "Student updated successfully" });
    } catch (err) {
      return next(err);
    }
  },
];
