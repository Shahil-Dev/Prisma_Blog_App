import { Router } from "express";
import { PostController } from "./Post.controller";

const router = Router();

router.post('/', PostController.createPost);

export default router;
