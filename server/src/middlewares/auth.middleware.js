import { verifyAccessToken } from "../utils/token.js";

/**
 * Authentication Middleware
 *
 * This middleware verifies the access token provided in the Authorization header
 * of incoming requests. It ensures that only authenticated users can access protected routes.
 *
 * Expected header format: "Authorization: Bearer <access_token>"
 *
 * If the token is valid, it decodes the user information and attaches it to the request object
 * for use in subsequent middleware or route handlers. If invalid or missing, it responds with
 * appropriate error messages.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authMiddleware = async (req, res, next) => {
  // Extract the Authorization header from the request
  const authHeader = req.headers.authorization;

  // ERROR LOGGING: Check for undefined headers
  if (!authHeader) {
    console.error(
      "authMiddleware: req.headers.authorization is undefined or missing",
    );
    return res.status(401).json({ message: "Access token required" });
  }

  // Extract the token from the header (expects "Bearer TOKEN" format)
  // authHeader.split(" ")[1] gets the token part after "Bearer "
  const token = authHeader && authHeader.split(" ")[1];

  // ERROR LOGGING: Check for undefined token after extraction
  if (!token) {
    console.error(
      "authMiddleware: token extraction failed from authHeader:",
      authHeader,
    );
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    // Verify the access token using the utility function
    // This will throw an error if the token is invalid or expired
    const decoded = verifyAccessToken(token);

    // ERROR LOGGING: Check decoded result
    if (!decoded) {
      console.error("authMiddleware: verifyAccessToken returned undefined");
      return res
        .status(403)
        .json({ message: "Invalid Token or Token Expired" });
    }

    // Attach the decoded user information to the request object
    // This makes user data available in subsequent middleware and routes
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If token verification fails, return a 403 Forbidden response
    // This could be due to invalid token, expiration, or tampering
    console.error("Token verification error:", error.message); // Log for debugging (avoid logging the token itself)
    res.status(403).json({
      message: "Invalid Token or Token Expired",
    });
  }
};

export { authMiddleware };
