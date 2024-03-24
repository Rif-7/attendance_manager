const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  f_name: { type: String, required: true, maxLength: 25 },
  l_name: { type: String, required: true, maxLength: 25 },
  class: { type: Schema.Types.ObjectId, required: true, ref: "Class" },
  rollno: { type: String, required: true },
});

StudentSchema.virtual("roll_no_int").get(function () {
  return parseInt(this.rollno.slice(-2));
});

module.exports = mongoose.model("Student", StudentSchema);
