const express = require("express");

const app = express();
const studentRouter = require("./routes/student");
const errorHandler = require("./middlewares/error");

app.use(express.json());

app.use("/student", studentRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use(errorHandler);

module.exports = app;
