const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TutorSchema = new Schema({
  f_name: { type: String, required: true, maxLength: 25 },
  l_name: { type: String, require: true, maxLength: 25 },
});

module.exports = mongoose.model("Tutor", TutorSchema);
