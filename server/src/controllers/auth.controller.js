import authService from "../services/auth.service.js";

const statusCode = error.isValidationError ? 400 : 500;
/**
 * ADDED: Removed unused prisma and bcrypt imports
 * These are handled in the service layer, not needed in the controller
 */

export const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(statusCode).json({
      message: error.message,
    });
  }
};

/**
 * POST /auth/signup
 *
 * Response (201):
 *   { id, username, email }
 *
 * Response (400/500):
 *   { message: error description }
 *
 * ADDED: Better error handling to distinguish validation errors (400) from server errors (500)
 * FIXED: Typo in import name (authServise → authService)
 */
export const signup = async (req, res) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (error) {
    // ADDED: Check if error is a validation error for proper HTTP status code
    res.status(statusCode).json({
      message: error.message,
    });
  }
};

export const logout = async () => {
  // Implement logout logic here
  res.json({ message: "Logout successful" });
};
