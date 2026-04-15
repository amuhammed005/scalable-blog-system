import { prisma } from "../../lib/prisma.js";
import { createValidationError } from "../../utils/Error.handler.js";

const urlRegex =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// Utility function to check if value is a non-array object
const ensureObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value);

// Validates post fields: title, content, and optional mediaURL
const validatePostFields = ({ title, content, mediaURL }) => {
  if (!title?.trim() || !content?.trim()) {
    throw createValidationError("Title and content are required");
  }

  if (title.trim().length > 100) {
    throw createValidationError("Title must not exceed 100 characters");
  }

  if (content.trim().length > 5000) {
    throw createValidationError("Content must not exceed 5000 characters");
  }

  if (mediaURL) {
    if (!urlRegex.test(mediaURL.trim())) {
      throw createValidationError("Invalid media URL format");
    }
  }
};

// Creates a new post for the authenticated user
const createPost = async (data) => {
  if (!ensureObject(data)) {
    throw createValidationError("Invalid request body");
  }

  const { title, content, mediaURL, userId } = data;

  if (!userId) {
    throw createValidationError("userId is required");
  }

  validatePostFields({ title, content, mediaURL });

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

// Retrieves posts with pagination and optional user filtering
// Pagination concepts:
// - skip: Number of records to skip (offset) - calculated as (page-1) * limit
// - take: Number of records to fetch (limit per page)
// - where: Filter conditions - if userId provided, filter posts by that user; otherwise, fetch all posts
// - userId: Optional filter to get posts from a specific user. Allows non-registered users to view all posts
//   (by not passing userId), while registered users can filter their own posts or view all.
const getPosts = async (options = {}) => {
  const { page = 1, limit = 10, userId } = options;
  const pageNumber = Number(page) || 1;
  const pageSize = Number(limit) || 10;

  // Build where clause: filter by userId if provided, else no filter (all posts)
  const where = userId ? { userId } : {};
  const skip = (pageNumber - 1) * pageSize;

  const total = await prisma.post.count({ where });
  const posts = await prisma.post.findMany({
    where,
    include: {
      user: {
        select: { id: true, username: true, email: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: pageSize,
  });

  return {
    posts,
    pagination: {
      page: pageNumber,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize),
    },
  };
};

// Retrieves a single post by ID, including user details
const getPostById = async (postId) => {
  if (!postId || typeof postId !== "string") {
    throw createValidationError("Post ID is required");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: {
        select: { id: true, username: true, email: true, name: true },
      },
    },
  });

  if (!post) {
    throw createValidationError("Post not found");
  }

  return post;
};

// Updates a post, ensuring the user owns it
// Practical example: User wants to update title and content of their post.
// Input: postId = "abc123", userId = "user456", updateData = { title: "New Title", content: "Updated content" }
// Process: Validates fields, builds update payload with only provided fields, updates only if post exists and user owns it.
// Result: Returns the updated post with user details.
const updatePost = async (postId, userId, updateData) => {
  if (!postId || typeof postId !== "string" || !userId) {
    throw createValidationError("Post ID and userId are required");
  }

  if (!ensureObject(updateData)) {
    throw createValidationError("Invalid request body");
  }

  const { title, content, mediaURL } = updateData;

  if (title === undefined && content === undefined && mediaURL === undefined) {
    throw createValidationError(
      "At least one field must be provided for update",
    );
  }

  validatePostFields({
    title: title ?? "",
    content: content ?? "",
    mediaURL,
  });

  const updatePayload = {
    ...(title !== undefined && { title: title.trim() }),
    ...(content !== undefined && { content: content.trim() }),
    ...(mediaURL !== undefined && { mediaURL: mediaURL?.trim() }),
  };

  const result = await prisma.post.updateMany({
    where: { id: postId, userId },
    data: updatePayload,
  });

  if (result.count === 0) {
    throw createValidationError(
      "Post not found or you are not authorized to update it",
    );
  }

  return getPostById(postId);
};

// Deletes a post, ensuring the user owns it
const deletePost = async (postId, userId) => {
  if (!postId || typeof postId !== "string" || !userId) {
    throw createValidationError("Post ID and userId are required");
  }

  const result = await prisma.post.deleteMany({
    where: { id: postId, userId },
  });

  if (result.count === 0) {
    throw createValidationError(
      "Post not found or you are not authorized to delete it",
    );
  }

  return { message: "Post deleted successfully" };
};

export default { createPost, getPosts, getPostById, updatePost, deletePost };
