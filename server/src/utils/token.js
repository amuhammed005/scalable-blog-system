import jwt from "jsonwebtoken";

/**
 * Generate JWT access token for authenticated user
 * Expires in 15 minutes for security
 * Contains userId in payload
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

/**
 * Generate JWT refresh token for token renewal
 * Expires in 7 days
 * Contains userId in payload
 */
const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * Verify JWT access token
 * Returns decoded payload or throws error if invalid/expired
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

/**
 * Verify JWT refresh token
 * Returns decoded payload or throws error if invalid/expired
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

/**
 * ADDED: Named exports for better import flexibility
 * Can now import as: import { generateAccessToken } from './token.js'
 * Or as default: import tokenUtils from './token.js'
 */
export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
