const mongoose = require("mongoose");
const Tutor = require("../models/Tutor");
const { body, validationResult } = require("express-validator");

exports.create_tutor = [
  body("f_name")
    .trim()
    .isAlpha()
    .withMessage("Firstname should only contain alphabets")
    .isLength({ min: 1, max: 25 })
    .withMessage("Firstname should be between 1-25 characters"),
  body("l_name")
    .trim()
    .isAlpha()
    .withMessage("Firstname should only contain alphabets")
    .isLength({ min: 1, max: 25 })
    .withMessage("Firstname should be between 1-25 characters"),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0] });
      }

      const tutor = new Tutor({
        f_name: req.params.f_name,
        l_name: req.params.l_name,
      });

      await tutor.save();
      return res.status(200).json({ success: "Tutor created successfully" });
    } catch (err) {
      return next(err);
    }
  },
];

exports.get_tutor_list = async (req, res, next) => {
  try {
    const tutor_list = await Tutor.find().populate(
      "class",
      "name current_sem start_year end_year"
    );
    return res.status(200).json({ tutor_list });
  } catch (err) {
    return next(err);
  }
};

exports.update_tutor = [
  body("f_name")
    .trim()
    .isAlpha()
    .withMessage("Firstname should only contain alphabets")
    .isLength({ min: 1, max: 25 })
    .withMessage("Firstname should be between 1-25 characters"),
  body("l_name")
    .trim()
    .isAlpha()
    .withMessage("Firstname should only contain alphabets")
    .isLength({ min: 1, max: 25 })
    .withMessage("Firstname should be between 1-25 characters"),
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

      tutor.f_name = req.params.f_name;
      tutor.l_name = req.params.l_name;
      await tutor.save();

      return res.status(200).json({ success: "Tutor updated successfully" });
    } catch (err) {
      return next(err);
    }
  },
];

exports.get_tutor_info = async (req, res, next) => {
  try {
    if (
      !req.params.tutor_id ||
      !mongoose.Types.ObjectId.isValid(req.params.tutor_id)
    ) {
      return res
        .status(400)
        .json({ error: "Tutor ID is either missing or of invalid type" });
    }
    const tutor = await Tutor.findById(req.params.tutor_id).populate(
      "class",
      "name current_sem"
    );
    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    return res.status(200).json({ tutor });
  } catch (err) {
    return next(err);
  }
};
