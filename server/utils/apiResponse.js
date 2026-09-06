export const sendSuccess = (res, data = {}, message = 'Request completed successfully', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, message = 'An error occurred', code = 'BAD_REQUEST', statusCode = 400, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    code,
    message,
    errors,
  });
};

export default {
  sendSuccess,
  sendError,
};
