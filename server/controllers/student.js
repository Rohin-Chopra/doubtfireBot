const asyncHandler = require("express-async-handler");
const { Student } = require("./../../sequelize").models;

exports.signUp = asyncHandler(async (req, res, next) => {
  const student = await Student.create(req.body);

  res.status(201).json({
    status: "success",
    message: "User created",
    data: {
      student,
    },
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const student = await Student.findByPk(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      student,
    },
  });
});
