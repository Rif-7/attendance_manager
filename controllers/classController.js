const mongoose = require("mongoose");
const Class = require("../models/Class");
const Tutor = require("../models/Tutor");
const { body, validationResult } = require("express-validator");
const Student = require("../models/Student");

exports.create_class = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage("Class name should be between 1-10 characters")
    .isAlphanumeric()
    .withMessage("Class name should only contain alphanumeric characters")
    .escape(),
  body("current_sem")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Current semester is required")
    .escape(),
  body("start_year", "Start year is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("end_year", "End year is required").trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0] });
      }

      if (
        !req.params.tutor_id ||
        !mongoose.Types.ObjectId.isValid(req.params.tutor_id)
      ) {
        return res
          .status(400)
          .json({ error: "Tutor ID is either missing or of invalid type" });
      }

      const tutor = await Tutor.findById(req.params.tutor_id);
      if (!tutor) {
        return res.status(404).json({ error: "Tutor not found" });
      }

      const class_ = new Class({
        name: req.params.name,
        current_sem: req.params.current_sem,
        start_year: req.params.start_year,
        end_year: req.params.end_year,
        tutor: tutor.id,
      });
      await class_.save();
      return res.status(200).json({ success: "Class created successfully" });
    } catch (err) {
      return next(err);
    }
  },
];

exports.get_class_list = async (req, res, next) => {
  try {
    const class_list = await Class.find({}).populate("tutor", "f_name l_name");
    return res.status(200).json({ class_list });
  } catch (err) {
    return next(err);
  }
};

exports.update_class = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage("Class name should be between 1-10 characters")
    .isAlphanumeric()
    .withMessage("Class name should only contain alphanumeric characters")
    .escape(),
  body("current_sem")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Current semester is required")
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

      if (
        !req.params.tutor_id ||
        !mongoose.Types.ObjectId.isValid(req.params.tutor_id)
      ) {
        return res
          .status(400)
          .json({ error: "Tutor ID is either missing or of invalid type" });
      }

      const tutor = await Tutor.findById(req.params.tutor_id);
      if (!tutor) {
        return res.status(404).json({ error: "Tutor not found" });
      }

      class_.name = req.params.name;
      class_.current = req.params.current_sem;
      class_.tutor = tutor.id;
      await class_.save();

      return res.status(200).json({ success: "Class updated successfully" });
    } catch (err) {
      return next(err);
    }
  },
];

exports.get_class_info = async (req, res, next) => {
  try {
    if (
      !req.params.class_id ||
      !mongoose.Types.ObjectId.isValid(req.params.class_id)
    ) {
      return res
        .status(400)
        .json({ error: "Class ID is either missing or of invalid type" });
    }

    const class_ = await Class.findById(req.params.class_id).populate(
      "tutor",
      "f_name l_name"
    );
    if (!class_) {
      return res.status(404).json({ error: "Class not found" });
    }

    const student_list = await Student.find({ class: class_.id });

    return res.status(200).json({ class: class_, student_list });
  } catch (err) {
    return next(err);
  }
};
