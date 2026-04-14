// Create an Error check for validation
const createValidationError = (message) => {
  const error = new Error(message);
  error.isValidationError = true;
  return error;
};

export {createValidationError}