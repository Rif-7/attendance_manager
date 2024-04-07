const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const ExamSchema = new Schema({
  name: { type: String, required: true, maxLength: 25 },
  date: { type: Date, required: true },
  time: { type: String, enum: ["FN", "AN"], required: true },
  class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
});

ExamSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.date).setLocale("en-gb").toLocaleString();
});

ExamSchema.set("toJSON", { getters: true });

module.exports = mongoose.model("Exam", ExamSchema);
