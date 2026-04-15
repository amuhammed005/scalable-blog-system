import postService from "../../services/post-service/post.service.js";

// Utility function to handle errors consistently across controllers
const handleError = (res, error) => {
  const statusCode = error.isValidationError ? 400 : 500;
  return res.status(statusCode).json({ message: error.message });
};

// Controller for creating a new post
// Extracts userId from authenticated user (via middleware), combines with request body
const createPost = async (req, res) => {
  try {
    const result = await postService.createPost({
      ...req.body,
      userId: req.user.userId,
    });

    if (!result) {
      console.error("Create post controller: return invalid results", result);
      return res.status(500).json({ message: "Failed to create post" });
    }

    return res.status(201).json(result);
  } catch (error) {
    return handleError(res, error);
  }
};

// Controller for retrieving posts with pagination
// Accepts query params: page, limit, userId (optional for filtering)
const getPosts = async (req, res) => {
  try {
    const { page, limit, userId } = req.query;
    const result = await postService.getPosts({ page, limit, userId });
    return res.status(200).json(result);
  } catch (error) {
    return handleError(res, error);
  }
};

// Controller for retrieving a single post by ID
// Post ID comes from route parameters
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await postService.getPostById(id);
    return res.status(200).json(result);
  } catch (error) {
    return handleError(res, error);
  }
};

// Controller for updating a post
// Ensures user can only update their own posts (userId from auth middleware)
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const result = await postService.updatePost(id, userId, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return handleError(res, error);
  }
};

// Controller for deleting a post
// Ensures user can only delete their own posts (userId from auth middleware)
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const result = await postService.deletePost(id, userId);
    return res.status(200).json(result);
  } catch (error) {
    return handleError(res, error);
  }
};

export { createPost, getPosts, getPostById, updatePost, deletePost };
