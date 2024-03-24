const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TutorSchema = new Schema({
  f_name: { type: String, required: true, maxLength: 25 },
  l_name: { type: String, require: true, maxLength: 25 },
  class: { type: Schema.Types.ObjectId, required: true, ref: "Class" },
});

module.exports = mongoose.model("Tutor", TutorSchema);
