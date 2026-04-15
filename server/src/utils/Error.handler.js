// Create an Error check for validation
const createValidationError = (message) => {
  const error = new Error(message);
  error.isValidationError = true;
  return error;
};

const handleHttpError = (res, error) => {
  const statusCode = error.isValidationError ? 400 : 500
  return res.status(statusCode).json({message: error.message});
}
export { createValidationError, handleHttpError };
