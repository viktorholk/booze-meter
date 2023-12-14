
import { Router, Request, Response } from "express";

import AuthMiddleware from '../middleware/auth';

import AuthRouter from './auth'

const router = Router();

// Use the AuthMiddleware for the index and profile page
router.get("/", AuthMiddleware, function (req: Request, res: Response) {
  res.render("pages/index");
});

router.get("/profile", AuthMiddleware, function (req, res) {
  res.render("pages/profile");
});

router.use('/auth', AuthRouter)

export default router;