/*
 * Helper function to create a validation error
 * ADDED: Custom error class to distinguish validation errors from other errors
 * This allows the controller to respond with different HTTP status codes (400 vs 500)
 */

const createValidationError = (message) => {
  const error = new Error(message);
  error.isValidationError = true;
  return error;
};

export default { createValidationError };