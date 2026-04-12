import authService from "../services/auth.service.js";

/**
 * ADDED: Removed unused prisma and bcrypt imports
 * These are handled in the service layer, not needed in the controller
 */

export const login = async (req, res) => {
  const { email, password } = req.body;
  // Implement login logic here
  res.json({ message: "Login successful" });
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
    const statusCode = error.isValidationError ? 400 : 500;
    res.status(statusCode).json({
      message: error.message,
    });
  }
};

export const logout = async () => {
  // Implement logout logic here
  res.json({ message: "Logout successful" });
};
