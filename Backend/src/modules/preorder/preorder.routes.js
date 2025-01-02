import express from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import * as PreOrder from "../preorder/preorder.controller.js";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const preOrderRouter = express.Router();
preOrderRouter.use(limiter);

preOrderRouter
  .route("/:id")
  .post(protectedRoutes, allowedTo("user"), PreOrder.createPreOrder);

export default preOrderRouter;
