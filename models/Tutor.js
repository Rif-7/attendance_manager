const mongoose = require("mongoose");
const Class = require("./Class");
const Schema = mongoose.Schema;

const TutorSchema = new Schema({
  f_name: { type: String, required: true, maxLength: 25 },
  l_name: { type: String, require: true, maxLength: 25 },
});

TutorSchema.virtual("class", {
  ref: "Class",
  localField: "_id",
  foreignField: "tutor",
  justOne: true,
});

module.exports = mongoose.model("Tutor", TutorSchema);
