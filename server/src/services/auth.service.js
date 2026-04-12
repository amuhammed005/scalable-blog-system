import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token.js";

const createValidationError = (message) => {
  const error = new Error(message);
  error.isValidationError = true;
  return error;
};
/**
 * Business logic for user signup
 * ADDED: Comprehensive input validation and error handling
 * Responsibilities:
 * - Validate all required fields are present and properly formatted
 * - Check for duplicate email in database
 * - Hash password securely with bcrypt
 * - Create user record in database
 * - Return only non-sensitive user data
 */
const signup = async (data) => {
  // ADDED: Validate input is object
  if (!data || typeof data !== "object") {
    throw createValidationError("Invalid request body");
  }

  // Destructure and normalize inputs
  const { username, name, email, password } = data;

  // ADDED: Validate all required fields with trim() for whitespace handling
  if (!username?.trim() || !name?.trim() || !email?.trim() || !password) {
    throw createValidationError("All fields are required");
  }

  // ADDED: Validate username length (minimum 3 characters)
  if (username.trim().length < 3) {
    throw createValidationError("Username must be at least 3 characters");
  }

  // Validate name length
  if (name.trim().length < 2) {
    throw createValidationError("Name must be at least 2 characters");
  }

  // ADDED: Email format validation using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    throw createValidationError("Invalid email format");
  }

  // Validate password strength
  if (password.length < 6) {
    throw createValidationError("Password must be at least 6 characters");
  }

  //   ADDED: Optional - Uncomment if you want stricter password requirements
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    throw createValidationError(
      "Password must contain uppercase, lowercase, and numbers",
    );
  }

  // Check if user with this email already exists
  // ADDED: Normalize email to lowercase for consistency
  const existingUser = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  if (existingUser) {
    throw createValidationError("User with this email already exists");
  }

  // FIXED: Typo - changed hasshedPassword to hashedPassword
  // Hash password with bcrypt (10 salt rounds for good security/performance balance)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user in database
  const user = await prisma.user.create({
    data: {
      username: username.trim(),
      name: name.trim(),
      email: email.trim().toLowerCase(), // ADDED: normalize email to lowercase
      password: hashedPassword,
    },
  });

  // Return only non-sensitive user data (password excluded for security)
  return {
      id: user.id,
      username: user.username,
      email: user.email,
    // REMOVED: createdAt - kept response minimal
  };
};

/**
 * Business logic for user login
 * ADDED: Complete login implementation with JWT tokens
 * Responsibilities:
 * - Validate email and password are provided
 * - Find user by email
 * - Verify password with bcrypt
 * - Generate access and refresh tokens
 * - Store refresh token in database
 * - Return tokens and user data (without password)
 */
const login = async (data) => {
  // ADDED: Validate input
  if (!data || typeof data !== "object") {
    throw createValidationError("Invalid request body");
  }

  const { email, password } = data;

  // ADDED: Validate required fields
  if (!email?.trim() || !password) {
    throw createValidationError("Email and password are required");
  }

  // ADDED: Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    throw createValidationError("Invalid email format");
  }

  // Find user by email (normalized to lowercase)
  const user = await prisma.user.findUnique({
    where: {
      email: email.trim().toLowerCase(),
    },
  });

  if (!user) {
    throw createValidationError("Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw createValidationError("Invalid email or password");
  }

  // Generate JWT tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store refresh token in database for logout/token invalidation
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  // Return tokens and user data (exclude password and sensitive fields)
  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  };
};

const refreshToken = async (data) => {
    if(!data) throw createValidationError("Invalid request body")
     
    const {refreshToken} = data

    if(!refreshToken) {
        throw createValidationError("No refresh token provided");
    }

    let decoded;
    try {
        decoded = verifyRefreshToken(refreshToken)
    } catch (error) {
        throw createValidationError("Invalid refresh token")
    }

    const user = await prisma.user.findUnique({
        where: {id: decoded.userId}
    })

    if(!user || user.refreshToken !== refreshToken){
        throw createValidationError("Invalid session")
    }
    const newAccessToken = generateAccessToken(user)
    return {accessToken: newAccessToken}
}

export default { signup, login, refreshToken };
