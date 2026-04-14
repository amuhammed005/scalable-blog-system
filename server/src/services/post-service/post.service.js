import { prisma } from "../../lib/prisma.js";
import { createValidationError } from "../../utils/create.validation.error.js";

/**
 * Creates a new post for a user.
 * Validates input data, ensures required fields are present and within limits,
 * and creates the post in the database with user relation included in response.
 * @param {Object} data - The post data
 * @param {string} data.title - Post title (required, 1-100 chars)
 * @param {string} data.content - Post content (required, 1-5000 chars)
 * @param {string} [data.mediaURL] - Optional media URL (must be valid URL if provided)
 * @param {string} data.userId - ID of the user creating the post (required)
 * @returns {Object} The created post with user information
 * @throws {Error} Validation error if input is invalid
 */
const createPost = async (data) => {
  // Validate that data is a non-null object
  if (!data || typeof data !== "object") {
    throw createValidationError("Invalid request body");
  }

  // Extract fields from data
  const { title, content, mediaURL, userId } = data;

  // Check required fields
  if (!title?.trim() || !content?.trim() || !userId) {
    throw createValidationError("Title, content, and userId are required");
  }

  // Validate title length
  if (title.trim().length > 100) {
    throw createValidationError("Title must not exceed 100 characters");
  }

  // Validate content length
  if (content.trim().length > 5000) {
    throw createValidationError("Content must not exceed 5000 characters");
  }

  // Validate mediaURL if provided: basic URL regex check
  if (mediaURL) {
    const urlRegex =
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    if (!urlRegex.test(mediaURL.trim())) {
      throw createValidationError("Invalid media URL format");
    }
  }

  // Create the post in database
  const post = await prisma.post.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      mediaURL: mediaURL?.trim(),
      userId,
    },
    include: {
      user: {
        select: { id: true, username: true, email: true, name: true },
      },
    },
  });

  return post;
};

export default { createPost };
