const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  return res.status(200).json({ hello: "hello" });
});

module.exports = router;
