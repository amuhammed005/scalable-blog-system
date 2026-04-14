import postService from "../../services/post-service/post.service.js";

/**
 * Creates a new post for the authenticated user.
 * Expects JSON body with title, content, and optional mediaURL.
 * Returns the created post with user information.
 */
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

    res.status(201).json(result);
  } catch (error) {
    const statusCode = error.isValidationError ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

export { createPost };
