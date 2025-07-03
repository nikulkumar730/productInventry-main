const handleResponse = (
  res,
  statusCode,
  responseType,
  message,
  data = null
) => {
  const response = {
    response: responseType,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

module.exports.handleResponse = handleResponse;
