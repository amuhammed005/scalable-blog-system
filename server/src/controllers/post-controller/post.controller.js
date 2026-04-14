import { postService } from "../../services/post-service/post.service.js";

const createPost = async (req, res) => {
  try {
    const result = await postService.createPost({
      ...req.body,
      userId: req.user.userId,
    });

    if (!result) {
      console.error("Create post controller: return invalid resulst", result);
    }

    res.status(201).json(result);
  } catch (error) {
    const statusCode = isValidationError() ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

export { createPost };
