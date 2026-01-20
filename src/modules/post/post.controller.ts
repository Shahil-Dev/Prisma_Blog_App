import type { Request, Response } from "express";
import { PostService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
    // res.send("Create a new post");
    try{
       const result =  await PostService.createPost(req.body)
         res.status(201).json(result)
    }
    catch(error){
        res.status(500).json({message:"Internal Server Error", error})
    }
}


export const PostController = { createPost };