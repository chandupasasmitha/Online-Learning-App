// Response utility
exports.successResponse = (
  res,
  data = null,
  message = "Success",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

exports.errorResponse = (res, message = "Error", statusCode = 500) => {
  return res.status(statusCode).json({
    status: "error",
    message,
  });
};
