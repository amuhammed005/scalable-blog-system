import authService from "../services/auth.service.js";
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

/**
 * POST /auth/login
 * Authenticates a user and returns JWT tokens
 *
 * Request body:
 *   - email: string (required, valid email format)
 *   - password: string (required)
 *
 * Response (200):
 *   {
 *     accessToken: string,
 *     refreshToken: string,
 *     user: { id, username, email }
 *   }
 *
 * Response (400/500):
 *   { message: error description }
 *
 * ADDED: Complete login implementation with JWT token generation
 * ADDED: Proper error handling for validation vs server errors
 */
export const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    // ADDED: Check if error is a validation error for proper HTTP status code
    const statusCode = error.isValidationError ? 400 : 500;
    res.status(statusCode).json({
      message: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
    try {
        
        const result = await authService.refreshToken(req.body)
        res.json(result)
    } catch (error) {
        // user not allowed - invalid session
        res.status(403).json(
            {message: error.message}
        )
    }
}

export const logout = async () => {
  // Implement logout logic here
  res.json({ message: "Logout successful" });
};
