var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const indexRouter = require("./routes/index");
const classRouter = require("./routes/class");
const examRouter = require("./routes/exam");
const studentRouter = require("./routes/student");
const tutorRouter = require("./routes/tutor");

var app = express();

const mongoDB = `mongodb+srv://${process.env.MONGODB_CRED}@cluster0.wgsleop.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.use("/student", studentRouter);
app.use("/class", classRouter);
app.use("/exam", examRouter);
app.use("/tutor", tutorRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.json({ error: "An Unexpected Error Occured" });
});

module.exports = app;
