const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  name: { type: String, required: true, maxLength: 10 },
  current_sem: { type: String, required: true },
  tutor: { type: Schema.Types.Tutor, required: true, ref: "Tutor" },
  start_year: { type: String, required: true },
  end_year: { type: String, required: true },
});

module.exports = mongoose.model("Class", ClassSchema);
