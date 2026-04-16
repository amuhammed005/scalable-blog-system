import { likeService } from "../../services/like-service/like.service.js";
import { handleHttpError } from "../../utils/Error.handler.js";

export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;
    const result = await likeService(postId, userId);
    return res.json(result);
  } catch (error) {
    return handleHttpError(res, error);
  }
};
