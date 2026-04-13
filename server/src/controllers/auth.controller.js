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

    // COOKIE SECURITY IMPLEMENTATION:
    // Sets refreshToken as HTTP-only cookie to prevent XSS attacks
    // - httpOnly: true → JavaScript cannot access this cookie (prevents XSS token theft)
    // - secure: false → allows HTTP (for dev); set to true in production with HTTPS only
    // - sameSite: "strict" → prevents CSRF attacks by not sending cookie with cross-site requests
    // - maxAge: 7 days → cookie expires after 7 days, matching refresh token expiration
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true, // SECURITY: Prevents JavaScript from accessing the token
      secure: false, // TODO: Change to true in production with HTTPS
      sameSite: "strict", // SECURITY: Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // Return accessToken in response body (client uses this for subsequent requests)
    // refreshToken stays in cookie (automatic, secure)
    res.status(200).json({
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    // ADDED: Check if error is a validation error for proper HTTP status code
    const statusCode = error.isValidationError ? 400 : 500;
    res.status(statusCode).json({
      message: error.message,
    });
  }
};

/**
 * POST /auth/refresh
 * Refreshes access token using valid refresh token
 *
 * Request body:
 *   - refreshToken: string (required, valid JWT refresh token)
 *
 * Response (200):
 *   { accessToken: string }
 *
 * Response (403):
 *   { message: error description }
 *
 * ADDED: Token refresh endpoint for JWT renewal
 * Security: Validates refresh token and user session
 */
export const refreshToken = async (req, res) => {
  try {
    // COOKIE RETRIEVAL: Extract refreshToken from HTTP-only cookie
    // req.cookies is populated by cookieParser middleware
    // This is more secure than accepting tokens from request body (prevents token in logs/history)
    const token = req.cookies.refreshToken;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Missing refresh token in cookies" });
    }

    // Call service to validate and refresh the token
    const result = await authService.refreshToken({ refreshToken: token });

    // Return new accessToken in response body
    res.status(200).json(result);
  } catch (error) {
    // ADDED: Use 403 for authentication/authorization failures
    res.status(403).json({
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    // LOGOUT FLOW:
    // 1. Get refreshToken from cookie
    // 2. Invalidate token in database (prevents reuse of old token)
    // 3. Clear cookie on client side

    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No active session to logout" });
    }

    // Call service to invalidate the refresh token in database
    await authService.logout({ refreshToken: token });

    // COOKIE CLEARING: Remove refreshToken cookie from client
    // Must match the original cookie settings (httpOnly, secure, sameSite)
    res.clearCookie("refreshToken", {
      httpOnly: true, // Must match the original cookie settings
      secure: false, // Must match the original cookie settings
      sameSite: "strict", // Must match the original cookie settings
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
