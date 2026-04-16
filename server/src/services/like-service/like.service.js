import { prisma } from "../../lib/prisma.js";
import { createValidationError } from "../../utils/Error.handler.js";

const likeService = async (postId, userId) => {
  if (!postId || typeof postId !== "string" || !userId) {
    throw createValidationError("User ID and Post ID are required");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });
  if (!post) {
    throw createValidationError("Post not found");
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });
  let liked = false;
  let message = "";
  if (existingLike) {
    await prisma.like.delete({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });
    message = "Unlike post";
    liked = false;
  } else {
    await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
    message = "Liked post";
    liked = true;
  }
  return {
    message,
    liked,
  };
};

export { likeService };
