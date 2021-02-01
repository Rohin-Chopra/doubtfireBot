module.exports = (err, req, res, next) => {
  console.log(err);

  res.status(500).json({
    status: "fail",
    error: {
      name: err.name,
      message: err.message,
    },
  });
};
