const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const AttendanceSchema = new Schema({
  exam: { type: Schema.Types.ObjectId, required: true, ref: "Exam" },
  student: { type: Schema.Types.ObjectId, required: true, ref: "Student" },
  time: { type: Date, default: Date.now, required: true },
});

AttendanceSchema.virtual("time_formatted").get(function () {
  return DateTime.fromJSDate(this.time).toLocaleString(DateTime.DATETIME_MED);
});

AttendanceSchema.set("toJSON", { getters: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
