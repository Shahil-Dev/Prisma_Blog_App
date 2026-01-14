import { Request, Response } from "express";
import { PostService } from "./Post.service";

const createPost = async (req:Request, res:Response) => {
 
    try{
         const result = await PostService.createPost(req.body);
         res.status(201).json(result);
    }
    catch(error){
        res.status(500).json({message: "Internal Server Error"})
    }
}



export const PostController ={
    createPost
}