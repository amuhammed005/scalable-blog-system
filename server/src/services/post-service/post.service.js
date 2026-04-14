import {prisma} from "../../lib/prisma.js"
import { createValidationError } from "../../utils/create.validation.error.js"

const createPost = async (data) => {
    if(!data || typeof data !== Object){
        throw createValidationError("Invalid request body")
    }
    const {title, content, mediaUrl, userId} = data

    if(!title?.trim() || !content?.trim() ){
        throw createValidationError("Title and content are required")
    }

    const post = await prisma.post.create({
        data: {
            title: title.trim(),
            content: content.trim(),
            mediaUrl: mediaUrl.trim(),
            userId
        }
    })

    return post
    
}

export {createPost}