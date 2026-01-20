import { prisma } from "../../lib/prisma"
import type { Post } from "../../../generated/prisma/client"

const createPost = async(data:Omit<Post, "id" | "createdAt" | "updatedAt">)=>{
    const newPost = await prisma.post.create({
        data
    })
    return newPost
}


export const PostService = { createPost }