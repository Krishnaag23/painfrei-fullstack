import express from "express";
import * as auth from "./auth.controller.js";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

const authRouter = express.Router();
authRouter.use(limiter)

authRouter.post("/signup", auth.signUp);
authRouter.post("/signin", auth.signIn);
authRouter.get("/check", auth.checkAuth);


export default authRouter;
