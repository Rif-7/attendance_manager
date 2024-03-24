const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  name: { type: String, required: true },
  tutor: { type: Schema.Types.Tutor, required: true, ref: "Tutor" },
});

module.exports = mongoose.model("Class", ClassSchema);
