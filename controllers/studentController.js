const Student = require("../models/Student");
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

      const roll_already_exists = await Student.findOne({
        rollno: req.body.rollno,
      });
      if (roll_already_exists) {
        return res
          .status(409)
          .json({ error: "Student with this roll number already exists" });
      }

      const student = new Student({
        f_name: req.body.f_name,
        l_name: req.body.l_name,
        class: class_.id,
        rollno: req.body.rollno,
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
    const student_list = await Student.find().populate(
      "class",
      "name current_sem"
    );
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

      student.f_name = req.body.f_name;
      student.l_name = req.body.l_name;
      student.rollno = req.body.rollno;
      student.class = class_.id;
      await student.save();

      return res.status(200).json({ success: "Student updated successfully" });
    } catch (err) {
      return next(err);
    }
  },
];

exports.get_student_info = async (req, res, next) => {
  try {
    if (
      !req.params.student_id ||
      !mongoose.Types.ObjectId.isValid(req.params.student_id)
    ) {
      return res
        .status(400)
        .json({ error: "Student ID is either missing or of invalid type" });
    }

    const student = await Student.findById(req.params.student_id).populate(
      "class",
      "name current_sem start_year end_year"
    );
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    return res.status(200).json({ student });
  } catch (err) {
    return next(err);
  }
};

exports.get_student_by_rollno = async (req, res, next) => {
  try {
    if (!req.params.rollno) {
      return res.status(400).json({ error: "Roll number is missing" });
    }

    const student = await Student.findOne({
      rollno: req.params.rollno,
    }).populate("class", "name current_sem");
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    return res.status(200).json({
      id: student.id,
      name: `${student.f_name} ${student.l_name}`,
      class: student.class.name,
      semester: student.class.current_sem,
      rollno: student.rollno,
    });
  } catch (err) {
    return next(err);
  }
};

exports.set_fingerprint_id = async (req, res, next) => {
  try {
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

    if (!req.body.fingerprint_id) {
      return res.status(404).json({ error: "Fingerprint ID missing" });
    }
    const fingerprintID = parseInt(req.body.fingerprint_id);
    id_already_exists = await Student.findOne({ fingerprintID: fingerprintID });
    if (id_already_exists && !id_already_exists._id.equals(student._id)) {
      return res.status(409).json({ error: "Fingerprint ID already exists" });
    }

    student.fingerprintID = fingerprintID;
    await student.save();
    return res
      .status(200)
      .json({ success: "Fingerprint ID saved successfully" });
  } catch (err) {
    return next(err);
  }
};
